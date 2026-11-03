import mongoose from "mongoose";
import dns from 'dns';
dns.setServers(['8.8.8.8','1.1.1.1'])
export const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("MongoDB Database connected Successfully...");
  } catch (error) {
    console.error("MongoDB connection failed:", error.message);
    process.exit(1);
  }
};
