import { Router } from "express";
import mongoose from "mongoose";
import Appointment from "../models/Appointment";

const router = Router();

// POST /appointments
router.post("/", async (req, res) => {
  try {
    const {
      bookingId,
      refNumber,
      timeSlot, // frontend + model naming
      selectedServices,
      userDetails,
      amount,
      paymentVerification, // ✅ allow frontend to send decodedString or notes if needed
    } = req.body;

    // ===== Validation =====
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

    // ===== Check if booking already exists =====
    const existing = await Appointment.findOne({ bookingId });

    if (existing) {
      if (existing.paymentVerification.status !== "verified") {
        // Already exists but not verified -> just return existing
        return res.status(200).json({
          message: "Appointment already exists and is pending verification",
          appointment: existing,
        });
      } else {
        // Verified already -> block re-creation
        return res.status(409).json({
          message: "Appointment already verified and cannot be changed",
        });
      }
    }

    // ===== Map services and cast serviceId to ObjectId =====
    const services = selectedServices.map((s: any) => ({
      serviceId: new mongoose.Types.ObjectId(s.serviceId),
      name: s.name,
      price: s.price,
      quantity: s.quantity || 1,
    }));

    // ===== Prepare paymentVerification object =====
    const paymentVerificationData = {
      status: "pending",
      notes: paymentVerification?.notes || undefined,
      decodedString: paymentVerification?.decodedString || null, // ✅ include decodedString if provided
    };

    // ===== Create new appointment =====
    const newAppointment = new Appointment({
      bookingId,
      refNumber: refNumber || null,
      timeSlot,
      selectedServices: services,
      amount,
      userDetails,
      paymentVerification: paymentVerificationData,
    });

    await newAppointment.save();

    res.status(201).json({
      message: "Appointment created successfully",
      appointment: newAppointment,
    });
  } catch (error: any) {
    console.error("Appointment creation error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
