import { Router } from "express";
import mongoose from "mongoose";
import Appointment from "../models/Appointment";

const router = Router();

// POST /appointments
// POST /appointments
router.post("/", async (req, res) => {
  try {
    const {
      bookingId,
      refNumber,
      timeSlot, // Changed from selectedSlot to timeSlot to match frontend and model
      selectedServices,
      userDetails,
      amount,
    } = req.body;

    // Strict validation - using timeSlot
    if (
      !bookingId ||
      !timeSlot?.date ||
      !timeSlot?.time ||
      !Array.isArray(selectedServices) ||
      selectedServices.length === 0 ||
      !userDetails?.name ||
      !userDetails?.passportNumber ||
      !userDetails?.phoneNumber ||
      !userDetails?.email ||
      !amount
    ) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // Map services and cast serviceId to ObjectId
    const services = selectedServices.map((s: any) => ({
      // Cast the string ID to a Mongoose ObjectId
      serviceId: new mongoose.Types.ObjectId(s.serviceId),
      name: s.name,
      price: s.price,
      // The quantity property is not in the frontend data, but is in the model.
      // This correctly handles the case where it's not provided.
      quantity: s.quantity || 1,
    }));

    const newAppointment = new Appointment({
      bookingId,
      refNumber: refNumber || null,
      timeSlot, // Using the correctly named variable
      selectedServices: services,
      amount,
      userDetails,
      paymentVerification: { status: "pending" },
    });

    await newAppointment.save();

    res.status(201).json({
      message: "Appointment created successfully",
      appointment: newAppointment,
    });
  } catch (error: any) {
    console.error("Appointment creation error:", error);

    // Handle duplicate bookingId gracefully
    if (error.code === 11000 && error.keyPattern?.bookingId) {
      return res
        .status(409)
        .json({ message: "Booking ID already exists, try again." });
    }

    res.status(500).json({ message: "Server error" });
  }
});

export default router;
