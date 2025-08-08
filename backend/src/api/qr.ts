import { Router, Request, Response } from "express";
import { generatePromptPayQR } from "../services/promptpayService";

const router = Router();

router.post("/", async (req: Request, res: Response) => {
  const { amount, reference } = req.body;

  if (typeof amount !== "number" || amount <= 0) {
    return res.status(400).json({ error: "Invalid or missing amount" });
  }

  try {
    const qrSVG = await generatePromptPayQR(amount, reference);
    res.type("image/svg+xml"); // Set Content-Type as SVG
    res.send(qrSVG); // Send raw SVG text
  } catch (error) {
    console.error("QR generation error:", error);
    res.status(500).json({ error: "Failed to generate QR SVG" });
  }
});

export default router;
