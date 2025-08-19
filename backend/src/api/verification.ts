// src/api/verification.ts
import { Router, Request, Response } from "express";
import amqp from "amqplib";
import Appointment from "../models/Appointment"; // <-- Import the Appointment model
// Remove: import { jobStatuses } from "../services/verificationJobStatuses";

const router = Router();
const QUEUE_NAME = "verificationQueue";

// Use in-memory Map for job statuses (replace with Redis/DB in production)
// This is no longer needed, as we'll use the DB.
// const jobStatuses = new Map<string, "pending" | "verified" | "failed">();

// Reusable RabbitMQ connection
let channel: amqp.Channel | null = null;
async function getChannel() {
  if (channel) return channel;
  const conn = await amqp.connect(
    process.env.RABBITMQ_URL || "amqp://localhost"
  );
  channel = await conn.createChannel();
  await channel.assertQueue(QUEUE_NAME, { durable: true });
  return channel;
}

// Enqueue verification job
router.post("/", async (req: Request, res: Response) => {
  try {
    const { bookingID, refNbr, amount } = req.body;

    if (!bookingID || !refNbr || !amount) {
      return res.status(400).json({
        status: "failed",
        message: "Missing required fields",
      });
    }

    const ch = await getChannel();
    const job = { bookingID, refNbr, amount };

    // Update the Appointment status to pending in the DB
    await Appointment.findOneAndUpdate(
      { bookingId: bookingID },
      { "paymentVerification.status": "pending" },
      { new: true }
    );

    // Publish message to queue
    ch.sendToQueue(QUEUE_NAME, Buffer.from(JSON.stringify(job)), {
      persistent: true,
    });

    return res.json({
      status: "queued",
      message: "Verification request queued",
      job,
    });
  } catch (error: any) {
    console.error("Queue error:", error.message);
    return res.status(500).json({
      status: "failed",
      message: "Unable to queue verification job",
    });
  }
});

// Polling endpoint to check status
router.get("/status/:bookingID", async (req: Request, res: Response) => {
  const { bookingID } = req.params;

  if (!bookingID) {
    return res
      .status(400)
      .json({ status: "failed", message: "Missing bookingID" });
  }

  // Get the status from the database
  const appointment = await Appointment.findOne({ bookingId: bookingID });
  const status = appointment?.paymentVerification?.status || "pending";

  return res.json({ status });
});

// Remove this export, as it's no longer needed
// export { jobStatuses };
export default router;
