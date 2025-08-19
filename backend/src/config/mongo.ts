import mongoose from "mongoose";
import dotenv from "dotenv";

const mongoURI = process.env.MongoConnectionString;

if (!mongoURI) {
  throw new Error("MongoConnectionString is missing in .env");
}

export const connectDB = async () => {
  try {
    await mongoose.connect(mongoURI);
    console.log("✅ MongoDB connected");
  } catch (error) {
    console.error("❌ MongoDB connection error:", error);
    process.exit(1);
  }
};
