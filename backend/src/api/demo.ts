// src/api/demo.ts
import express, { Request, Response, Router } from "express";
import amqp from "amqplib";
import Appointment from "../models/Appointment";
import dotenv from "dotenv";

dotenv.config();

const router: Router = express.Router();
const EMAIL_QUEUE_NAME = "PaymentVerified";

// Use a Promise singleton for the channel
let channelPromise: Promise<amqp.Channel> | null = null;

async function getChannel(): Promise<amqp.Channel> {
  if (channelPromise) {
    return channelPromise;
  }

  channelPromise = new Promise(async (resolve, reject) => {
    try {
      const conn = await amqp.connect(
        process.env.RABBITMQ_URL || "amqp://localhost"
      );
      const ch = await conn.createChannel();
      await ch.assertQueue(EMAIL_QUEUE_NAME, { durable: true });

      // Reconnection logic
      conn.on("close", () => {
        console.warn("RabbitMQ connection closed. Reconnecting...");
        channelPromise = null;
      });
      conn.on("error", (err) => {
        console.error("RabbitMQ connection error:", err);
        channelPromise = null;
      });

      resolve(ch);
    } catch (error) {
      channelPromise = null;
      reject(error);
    }
  });

  return channelPromise;
}

// Helper: queue email job
async function sendEmailJob(bookingID: string) {
  const ch = await getChannel();
  const job = { bookingID };

  const ok = ch.sendToQueue(
    EMAIL_QUEUE_NAME,
    Buffer.from(JSON.stringify(job)),
    {
      persistent: true,
    }
  );

  if (!ok) {
    throw new Error("Unable to queue email job (buffer full).");
  }

  console.log(`📩 Email job queued for bookingID=${bookingID}`);
}

// --- Demo success route ---
router.post("/demo-success", async (req: Request, res: Response) => {
  const { bookingID } = req.body;

  if (!bookingID) {
    return res.status(400).json({
      status: "failed",
      message: "Booking ID is required",
    });
  }

  try {
    // Find appointment and mark verified
    const appointment = await Appointment.findOneAndUpdate(
      { bookingId: bookingID }, // <-- check schema field spelling
      {
        "paymentVerification.status": "verified",
        "paymentVerification.verifiedAt": new Date(),
        "paymentVerification.notes": "Demo verification success.",
      },
      { new: true }
    );

    if (!appointment) {
      return res.status(404).json({
        status: "failed",
        message: "Appointment not found",
      });
    }

    // Queue the email job
    await sendEmailJob(bookingID);

    return res.json({
      status: "verified",
      message: "Successfully demonstrated verification success",
    });
  } catch (error: any) {
    console.error("💥 Demo endpoint error:", error);
    return res.status(500).json({
      status: "error",
      message: "Internal server error",
    });
  }
});

export default router;
