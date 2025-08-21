// src/api/verification.ts
import { Router, Request, Response } from "express";
import amqp from "amqplib";
import Appointment from "../models/Appointment";

const router = Router();
const QUEUE_NAME = "verificationQueue";

// Use a Promise to manage the channel singleton, preventing race conditions
let channelPromise: Promise<amqp.Channel> | null = null;

async function getChannel(): Promise<amqp.Channel> {
  if (channelPromise) {
    return channelPromise;
  }

  // Create and store the promise for a single connection attempt
  channelPromise = new Promise(async (resolve, reject) => {
    try {
      const conn = await amqp.connect(
        process.env.RABBITMQ_URL || "amqp://localhost"
      );
      const ch = await conn.createChannel();
      await ch.assertQueue(QUEUE_NAME, { durable: true });

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

// Enqueue verification job
router.post("/", async (req: Request, res: Response) => {
  const { bookingID, refNbr, amount } = req.body;

  if (!bookingID || !refNbr || !amount) {
    return res.status(400).json({
      status: "failed",
      message: "Missing required fields",
    });
  }

  try {
    const appointment = await Appointment.findOne({ bookingId: bookingID });
    if (!appointment) {
      return res.status(404).json({
        status: "failed",
        message: "Appointment not found",
      });
    }

    // ⭐ IMPROVEMENT: Queue the job *before* updating the database status.
    // This makes the operation more robust. If sending the message fails,
    // the database status will not be incorrectly set to 'pending'.
    const ch = await getChannel();
    const job = { bookingID, refNbr, amount };

    // The 'ok' variable indicates if the message was placed on the internal buffer.
    const ok = ch.sendToQueue(QUEUE_NAME, Buffer.from(JSON.stringify(job)), {
      persistent: true,
    });

    if (!ok) {
      // ⭐ IMPROVEMENT: Return a 500 error if the message fails to queue.
      // This correctly informs the client that the request was not processed.
      console.error(
        "Critical: Message could not be sent to queue immediately."
      );
      return res.status(500).json({
        status: "failed",
        message: "Unable to queue verification job. Please try again.",
      });
    }

    // Only if the message is successfully queued, we update the DB status.
    appointment.paymentVerification.status = "pending";
    await appointment.save();

    console.log(`Queued verification job for bookingID=${bookingID}`);

    return res.json({
      status: "queued",
      message: "Verification request queued",
      job,
    });
  } catch (error: any) {
    console.error("Queueing error:", error);
    return res.status(500).json({
      status: "failed",
      message: "An internal error occurred while processing your request.",
    });
  }
});

// Polling endpoint is left unchanged, but a note is made about better alternatives.
router.get("/status/:bookingID", async (req: Request, res: Response) => {
  try {
    const { bookingID } = req.params;
    if (!bookingID) {
      return res.status(400).json({
        status: "failed",
        message: "Missing bookingID",
      });
    }
    const appointment = await Appointment.findOne({ bookingId: bookingID });
    if (!appointment) {
      return res.status(404).json({
        status: "failed",
        message: "Appointment not found",
      });
    }
    const status = appointment.paymentVerification?.status || "pending";
    return res.json({ status });
  } catch (error: any) {
    console.error("Status check error:", error);
    return res.status(500).json({
      status: "failed",
      message: "Unable to fetch status",
    });
  }
});

export default router;
