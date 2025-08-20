///Users/aungphyolinn/Desktop/MCare/backend/src/services/verificationWorker.ts
import dotenv from "dotenv";
import { connectDB } from "../config/mongo";
import amqp from "amqplib";
import axios from "axios";
import Appointment from "../models/Appointment";
dotenv.config();
const QUEUE_NAME = "verificationQueue";
const EMAIL_QUEUE_NAME = "PaymentVerified"; // Added for clarity

const normalizeName = (name: string): string =>
  name
    .replace(/^(mr|mrs|ms|dr)\.?/i, "")
    .replace(/[^a-zA-Z0-9]/g, "")
    .toUpperCase()
    .trim();

connectDB();

async function startWorker() {
  try {
    const conn = await amqp.connect(process.env.RABBITMQ_URL!);
    const channel = await conn.createChannel();
    await channel.assertQueue(QUEUE_NAME, { durable: true });
    await channel.assertQueue(EMAIL_QUEUE_NAME, { durable: true }); // Assert email queue exists

    console.log("✅ Verification Worker running...");

    channel.consume(
      QUEUE_NAME,
      async (msg) => {
        if (!msg) return;
        const job = JSON.parse(msg.content.toString());
        const { bookingID, refNbr, amount } = job;
        const token = process.env.OPEN_SLIP_VERIFY_TOKEN;
        const expectedReceiverName = process.env.PROMPTPAY_RECEIVER_NAME;

        try {
          if (!token || !expectedReceiverName) {
            throw new Error("Missing env vars");
          }
          console.log("I am here");
          // Prevent duplicate refNbr
          const existingAppointment = await Appointment.findOne({
            "paymentVerification.decodedString": refNbr,
          });
          if (existingAppointment) {
            console.warn("⚠️ Duplicate refNbr:", refNbr);
            await Appointment.findOneAndUpdate(
              { bookingId: bookingID },
              { "paymentVerification.status": "failed" }
            );
            channel!.ack(msg);
            return;
          }

          const response = await axios.post(
            "https://api.openslipverify.com/v1/verify",
            { refNbr, amount, token },
            { headers: { "Content-Type": "application/json" } }
          );

          if (response.data?.success === true) {
            const receiver = response.data?.data?.receiver;
            const normalizedExpected = normalizeName(expectedReceiverName);
            const normalizedReturned = normalizeName(receiver?.name || "");

            if (normalizedExpected !== normalizedReturned) {
              console.error("❌ Receiver mismatch:", {
                expected: normalizedExpected,
                got: normalizedReturned,
              });
              await Appointment.findOneAndUpdate(
                { bookingId: bookingID },
                { "paymentVerification.status": "failed" }
              );
              channel!.ack(msg);
              return;
            }

            const appointment = await Appointment.findOne({
              bookingId: bookingID,
            });
            if (!appointment) {
              console.error("❌ Appointment not found:", bookingID);
              await Appointment.findOneAndUpdate(
                { bookingId: bookingID },
                { "paymentVerification.status": "failed" }
              );
              channel!.ack(msg);
              return;
            }

            appointment.paymentVerification = {
              status: "verified",
              verifiedAt: new Date(),
              decodedString: refNbr,
              notes: response.data.statusMessage || null,
            };
            await appointment.save();

            console.log("✅ Appointment verified:", bookingID);

            // Publish a new message to the email queue
            channel!.sendToQueue(
              EMAIL_QUEUE_NAME,
              Buffer.from(JSON.stringify({ bookingID })),
              { persistent: true }
            );
            console.log("📨 Email confirmation job queued for:", bookingID);

            channel!.ack(msg); // Acknowledge successful processing
          } else {
            console.error(
              "❌ Verification failed:",
              response.data?.statusMessage
            );
            await Appointment.findOneAndUpdate(
              { bookingId: bookingID },
              { "paymentVerification.status": "failed" }
            );
            channel!.ack(msg); // Acknowledge failed message to remove it from the queue
          }
        } catch (err: any) {
          console.error("Worker error:", err.message);
          // If the job object is available, update status in DB
          if (job?.bookingID) {
            await Appointment.findOneAndUpdate(
              { bookingId: job.bookingID },
              { "paymentVerification.status": "failed" }
            );
          }
          channel!.ack(msg); // Acknowledge the message to prevent an infinite retry loop
        }
      },
      { noAck: false }
    );
  } catch (err) {
    console.error("❌ Worker crashed:", (err as any).message);
    process.exit(1);
  }
}

startWorker();
