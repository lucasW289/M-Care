// src/index.ts
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();
import qrRouter from "./api/qr";
import verificationRouter from "./api/verification";
import { sendVerifySlip } from "./services/kafkaProducer";
import { startSlipVerifiedConsumer } from "./services/kafkaConsumer";
import { connectDB } from "./config/mongo";
import servicesRouter from "./api/services";
import appointmentsRoute from "./api/appointments";

const app = express();

// Enable CORS
app.use(
  cors({
    origin: "http://localhost:3000", // frontend base origin
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    credentials: true,
  })
);

// Parse JSON body
app.use(express.json());

// Routes
app.use("/qr", qrRouter);
app.use("/verify-slip", verificationRouter);
app.use("/services", servicesRouter);
app.use("/appointments", appointmentsRoute);

// Connect to MongoDB, then start server and Kafka services
(async () => {
  try {
    await connectDB();

    // Start Kafka consumer
    //  await startSlipVerifiedConsumer();
    //   console.log("✅ Kafka consumer started");

    // Optional: send a test message on startup
    //   await sendVerifySlip("Backend startup test message");
    //   console.log("✅ Test message sent to Kafka topic 'verify-slip'");

    const PORT = process.env.PORT || 3007;
    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error("❌ Server startup failed:", err);
    process.exit(1);
  }
})();
