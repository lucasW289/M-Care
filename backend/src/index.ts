// src/index.ts
import express from "express";
import cors from "cors";
import qrRouter from "./api/qr";

const app = express();

// Enable CORS BEFORE defining routes
app.use(
  cors({
    origin: "http://localhost:3000", // frontend base origin
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    credentials: true, // optional; use if you handle cookies/auth
  })
);

// Parse JSON body
app.use(express.json());

// Routes
app.use("/qr", qrRouter);

// Start server
const PORT = process.env.PORT || 3007;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
