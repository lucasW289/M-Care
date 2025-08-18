///Users/aungphyolinn/Desktop/MCare/backend/src/api/availability.ts
import { Router } from "express";
import Appointment from "../models/Appointment";

const router = Router();

/**
 * GET /appointments/availability?date=YYYY-MM-DD
 * Returns all available and unavailable time slots for the given date
 */
router.get("/", async (req, res) => {
  try {
    const { date } = req.query;

    if (!date) {
      return res.status(400).json({ message: "Date is required (YYYY-MM-DD)" });
    }

    // Fetch all appointments for this date
    const appointments = await Appointment.find({ "timeSlot.date": date });

    // Extract booked times
    const bookedTimes = appointments.map((a) => a.timeSlot.time);

    // Define business hours (same as frontend generator: 11 AM - 5 PM)
    const slots: string[] = [];
    for (let hour = 11; hour <= 17; hour++) {
      const time12 =
        hour > 12
          ? `${hour - 12}:00 PM`
          : hour === 12
          ? `12:00 PM`
          : `${hour}:00 AM`;
      slots.push(time12);
    }

    // Mark availability
    const availability = slots.map((time) => ({
      time,
      available: !bookedTimes.includes(time),
    }));

    res.json({
      date,
      availability,
    });
  } catch (error) {
    console.error("Error fetching availability:", error);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
