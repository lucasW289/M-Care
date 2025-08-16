// src/api/verification.ts
import { Router, Request, Response } from "express";
import axios from "axios";

const router = Router();

// POST /verify-slip
router.post("/", async (req: Request, res: Response) => {
  try {
    const { refNbr, amount } = req.body;
    const token = process.env.OPEN_SLIP_VERIFY_TOKEN; // from .env

    if (!refNbr || !amount) {
      return res.status(400).json({
        status: "failed",
        message: "Missing required fields",
      });
    }

    if (!token) {
      return res.status(500).json({
        status: "failed",
        message: "Server misconfiguration: token missing",
      });
    }

    // Call OpenSlipVerify API with token in the body
    const response = await axios.post(
      "https://api.openslipverify.com/v1/verify",
      { refNbr, amount, token }, // token sent in body
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    return res.json(response.data);
  } catch (error: any) {
    console.error("Verification error:", error.response?.data || error.message);
    return res.status(500).json({
      status: "failed",
      message: "Server error or verification failed",
    });
  }
});

export default router;
