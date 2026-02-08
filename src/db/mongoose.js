import mongoose from "mongoose";
import "dotenv/config";

const URL = process.env.MONGO_URL;

if (!URL) {
  throw new Error("MONGO_URL environment variable is not defined");
}

export async function connectDB() {
  try {
    await mongoose.connect(URL);
    console.log("Successfully connected to MongoDB!");
  } catch (err) {
    console.error("MongoDB connection failed:", err);
    throw err;
  }
}
