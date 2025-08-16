import { Router } from "express";
import { Service } from "../models/Service";

const router = Router();

// GET /services
router.get("/", async (req, res) => {
  try {
    const services = await Service.find(); // get all services from MongoDB
    res.json(services);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch services" });
  }
});

export default router;
