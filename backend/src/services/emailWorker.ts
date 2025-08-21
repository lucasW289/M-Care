// /Users/aungphyolinn/Desktop/MCare/backend/src/services/emailWorker.ts
import amqp from "amqplib";
import dotenv from "dotenv";
dotenv.config();

import Appointment from "../models/Appointment";
import { sendEmail } from "./emailService";
import { connectDB } from "../config/mongo";
connectDB();

async function consumePaymentVerified() {
  const connection = await amqp.connect(process.env.RABBITMQ_URL!); // <- use env
  const channel = await connection.createChannel();
  const queue = "PaymentVerified";

  await channel.assertQueue(queue, { durable: true });
  console.log("Waiting for PaymentVerified events...");

  channel.consume(queue, async (msg) => {
    if (msg !== null) {
      const { bookingID } = JSON.parse(msg.content.toString());
      console.log("Sending confirmation email for booking", bookingID);

      try {
        const appointment = await Appointment.findOne({ bookingId: bookingID });
        if (!appointment) {
          console.log(`Appointment not found: ${bookingID}`);
          channel.ack(msg);
          return;
        }

        const { userDetails, timeSlot, amount } = appointment;

        const subject = `Booking Confirmation - ${appointment.bookingId}`;
        const text = `
Dear ${userDetails.name},

Your appointment has been confirmed!

📌 Booking ID: ${appointment.bookingId}
📅 Date: ${timeSlot.date}
⏰ Time: ${timeSlot.time}
💵 Amount Paid: ${amount} THB

Thank you for choosing our clinic. 

Regards,
M-Care Team.
        `;

        await sendEmail(userDetails.email, subject, text);
        console.log(`Confirmation email sent for booking ${bookingID}`);
      } catch (error) {
        console.error(`Failed to send email for booking ${bookingID}:`, error);
      }

      channel.ack(msg);
    }
  });
}

consumePaymentVerified();
