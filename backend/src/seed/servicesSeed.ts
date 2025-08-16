// src/seed/servicesSeed.ts
import dotenv from "dotenv";
dotenv.config();
import mongoose from "mongoose";
import { Service } from "../models/Service";
import { services } from "../data/services"; // your array

const MONGO_URI = process.env.MongoConnectionString;

if (!MONGO_URI) {
  throw new Error("MongoConnectionString is missing in .env");
}

async function seedServices() {
  try {
    await mongoose.connect(MONGO_URI || "");
    console.log("✅ Connected to MongoDB");

    // Clear existing services
    await Service.deleteMany({});
    console.log("🗑️ Cleared existing services");

    // Insert new services
    const inserted = await Service.insertMany(services);
    console.log(`✅ Inserted ${inserted.length} services`);

    await mongoose.disconnect();
    console.log("✅ Disconnected from MongoDB");
  } catch (err) {
    console.error("❌ Error seeding services:", err);
    process.exit(1);
  }
}

seedServices();
