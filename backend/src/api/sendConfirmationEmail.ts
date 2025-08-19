// // /Users/aungphyolinn/Desktop/MCare/backend/src/api/sendConfirmationEmail.ts
// import express, { Request, Response } from "express";
// import Appointment from "../models/Appointment"; // ✅ your schema file
// import { sendEmail } from "../services/emailService"; // ✅ we'll build this service separately

// const router = express.Router();

// router.post("/", async (req: Request, res: Response) => {
//   try {
//     const { bookingId } = req.body;

//     if (!bookingId) {
//       return res.status(400).json({ message: "Booking ID is required" });
//     }

//     // ✅ Retrieve appointment from DB
//     const appointment = await Appointment.findOne({ bookingId });
//     if (!appointment) {
//       return res.status(404).json({ message: "Appointment not found" });
//     }

//     // ✅ Extract data for the email
//     const { userDetails, timeSlot, amount } = appointment;

//     const subject = `Booking Confirmation - ${appointment.bookingId}`;
//     const text = `
//       Dear ${userDetails.name},

//       Your appointment has been confirmed!

//       📌 Booking ID: ${appointment.bookingId}
//       📅 Date: ${timeSlot.date}
//       ⏰ Time: ${timeSlot.time}
//       💵 Amount Paid: ${amount} THB

//       Thank you for booking with us.

//       Regards,
//       M-Care Team.
//     `;

//     // ✅ Send email
//     await sendEmail(userDetails.email, subject, text);

//     return res
//       .status(200)
//       .json({ message: "Confirmation email sent successfully" });
//   } catch (error) {
//     console.error("Error sending confirmation email:", error);
//     return res
//       .status(500)
//       .json({ message: "Failed to send confirmation email" });
//   }
// });

// export default router;
