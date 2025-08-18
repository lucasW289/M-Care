// src/api/verification.ts
import { Router, Request, Response } from "express";
import axios from "axios";
import Appointment from "../models/Appointment";

const router = Router();

// Helper to normalize names
const normalizeName = (name: string): string => {
  return name
    .replace(/^(mr|mrs|ms|dr)\.?/i, "") // remove prefixes like Mr., Ms., Dr.
    .replace(/[^a-zA-Z0-9]/g, "") // remove spaces, dots, hyphens, etc.
    .toUpperCase()
    .trim();
};

// POST /verify-slip
router.post("/", async (req: Request, res: Response) => {
  try {
    const { bookingID, refNbr, amount } = req.body;
    const token = process.env.OPEN_SLIP_VERIFY_TOKEN; // from .env
    const expectedReceiverName = process.env.PROMPTPAY_RECEIVER_NAME;

    // ===== Validation =====
    if (!bookingID || !refNbr || !amount) {
      return res.status(400).json({
        status: "failed",
        message: "Missing required fields",
      });
    }

    if (!token || !expectedReceiverName) {
      return res.status(500).json({
        status: "failed",
        message: "Server misconfiguration: missing required env variables",
      });
    }

    // ===== Check if refNbr / decodedString already exists =====
    const existingAppointment = await Appointment.findOne({
      "paymentVerification.decodedString": refNbr,
    });

    if (existingAppointment) {
      return res.status(409).json({
        status: "failed",
        message: "This reference number has already been used for verification",
      });
    }

    // ===== Call OpenSlipVerify API =====
    const response = await axios.post(
      "https://api.openslipverify.com/v1/verify",
      { refNbr, amount, token },
      {
        headers: { "Content-Type": "application/json" },
      }
    );

    // ===== Check if verification was successful =====
    if (response.data?.success === true) {
      const receiver = response.data?.data?.receiver;
      console.log(receiver);
      // ===== Validate receiver against our account (with regex cleaning) =====
      const normalizedExpectedName = normalizeName(expectedReceiverName);
      const normalizedReturnedName = normalizeName(receiver?.name || "");

      if (normalizedExpectedName !== normalizedReturnedName) {
        return res.status(400).json({
          status: "failed",
          message:
            "Receiver account mismatch. Slip not valid for this business.",
          debug: {
            expected: normalizedExpectedName,
            got: normalizedReturnedName,
          },
        });
      }

      // ===== Find appointment by bookingID =====
      const appointmentToUpdate = await Appointment.findOne({
        bookingId: bookingID,
      });

      if (!appointmentToUpdate) {
        return res.status(404).json({
          status: "failed",
          message: "Appointment not found for this bookingID",
        });
      }

      // ===== Update appointment with verification details =====
      appointmentToUpdate.paymentVerification = {
        status: "verified",
        verifiedAt: new Date(),
        decodedString: refNbr,
        notes: response.data.statusMessage || null,
      };

      await appointmentToUpdate.save();

      return res.json({
        status: "success",
        message: "Slip verified and appointment updated",
        data: appointmentToUpdate,
      });
    }

    // ===== If verification failed =====
    return res.status(400).json({
      status: "failed",
      message: response.data?.statusMessage || "Verification unsuccessful",
    });
  } catch (error: any) {
    console.error("Verification error:", error.response?.data || error.message);
    return res.status(500).json({
      status: "failed",
      message: "Server error or verification failed",
    });
  }
});

export default router;
