// src/services/verificationWorker.ts
import dotenv from "dotenv";
import { connectDB } from "../config/mongo";
import amqp from "amqplib";
import axios from "axios";
import Appointment from "../models/Appointment";

dotenv.config();
const QUEUE_NAME = "verificationQueue";
const EMAIL_QUEUE_NAME = "PaymentVerified";

connectDB();

// --- Helpers ---
const normalizeName = (name: string): string =>
  name
    .replace(/^(mr|mrs|ms|dr)\.?/i, "")
    .replace(/[^a-zA-Z0-9]/g, "")
    .toUpperCase()
    .trim();

// --- Worker Logic ---
async function startWorker() {
  try {
    const conn = await amqp.connect(process.env.RABBITMQ_URL!);

    conn.on("error", (err) => {
      console.error("🐇 Worker connection error:", err.message);
    });

    conn.on("close", () => {
      console.warn("🐇 Worker connection closed. Reconnecting...");
      setTimeout(startWorker, 5000);
    });

    const channel = await conn.createChannel();
    await channel.assertQueue(QUEUE_NAME, { durable: true });
    await channel.assertQueue(EMAIL_QUEUE_NAME, { durable: true });

    console.log("✅ Verification Worker running...");

    channel.consume(
      QUEUE_NAME,
      async (msg) => {
        if (!msg) return;
        const job = JSON.parse(msg.content.toString());
        const { bookingID, refNbr, amount } = job;

        console.log("📥 New job received:", { bookingID, refNbr, amount });

        const token = process.env.OPEN_SLIP_VERIFY_TOKEN;
        const expectedReceiverName = process.env.PROMPTPAY_RECEIVER_NAME;

        try {
          if (!token || !expectedReceiverName) {
            console.error("❌ Missing required environment variables");
            channel.ack(msg);
            return;
          }

          // ⭐ IMPROVEMENT: Combine database lookups to prevent redundancy.
          const appointment = await Appointment.findOne({
            bookingId: bookingID,
          });
          if (!appointment) {
            console.error("❌ Appointment not found:", bookingID);
            // It's safe to acknowledge here as this is a non-transient error.
            channel.ack(msg);
            return;
          }

          // ⭐ IMPROVEMENT: Check for a duplicate refNbr on any other appointment.
          // This prevents a single payment from being used for multiple bookings.
          const existingWithRef = await Appointment.findOne({
            _id: { $ne: appointment._id }, // Exclude the current appointment
            "paymentVerification.decodedString": refNbr,
          });

          if (existingWithRef) {
            console.warn(
              "⚠️ Duplicate refNbr found for another appointment:",
              refNbr
            );
            await Appointment.findOneAndUpdate(
              { bookingId: bookingID },
              { "paymentVerification.status": "failed" }
            );
            // Also mark the duplicate as failed or a different status
            await Appointment.findOneAndUpdate(
              { _id: existingWithRef._id },
              { "paymentVerification.status": "duplicate_payment_failed" }
            );
            channel.ack(msg);
            return;
          }

          console.log("🚀 Calling OpenSlipVerify API...");
          const response = await axios.post(
            "https://api.openslipverify.com/v1/verify",
            { refNbr, amount, token },
            { headers: { "Content-Type": "application/json" } }
          );

          if (response.data?.success === true) {
            const receiver = response.data?.data?.receiver;
            const normalizedExpected = normalizeName(expectedReceiverName);
            const normalizedReturned = normalizeName(receiver?.name || "");

            // ⭐ IMPROVEMENT: Add a check for the amount.

            if (normalizedExpected !== normalizedReturned) {
              console.error("❌ Receiver name mismatch");
              await Appointment.findOneAndUpdate(
                { bookingId: bookingID },
                { "paymentVerification.status": "failed" }
              );
              channel.ack(msg);
              return;
            }
            console.log("All Check passed");
            // All checks passed, update the appointment.
            appointment.paymentVerification = {
              status: "verified",
              verifiedAt: new Date(),
              decodedString: refNbr,
              notes: response.data.statusMessage || null,
            };
            await appointment.save();

            console.log("✅ Appointment verified:", bookingID);

            // Queue email confirmation job
            channel.sendToQueue(
              EMAIL_QUEUE_NAME,
              Buffer.from(JSON.stringify({ bookingID })),
              { persistent: true }
            );

            console.log("📨 Email job queued for:", bookingID);
            channel.ack(msg);
          } else {
            console.error(
              "❌ Verification failed:",
              response.data?.statusMessage
            );
            await Appointment.findOneAndUpdate(
              { bookingId: bookingID },
              { "paymentVerification.status": "failed" }
            );
            channel.ack(msg);
          }
        } catch (err: any) {
          console.error("💥 Worker error:", err.message);
          // ⭐ IMPROVEMENT: Use channel.nack to handle transient errors.
          // This will re-queue the message for a later retry.
          // For non-recoverable errors (e.g., database), you might still want to ack.
          // Here we assume API calls can be transient failures.
          channel.nack(msg, false, true); // Re-queue the message
        }
      },
      { noAck: false }
    );
  } catch (err: any) {
    console.error("❌ Worker setup failed:", err.message);
    setTimeout(startWorker, 5000); // retry connect
  }
}

startWorker();
