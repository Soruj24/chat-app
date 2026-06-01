import mongoose from "mongoose";
import { mongoUri } from "../secret";
import dns from "dns";
dns.setServers(["1.1.1.1", "8.8.8.8"]);
export const connectDatabase = async (): Promise<void> => {
  try {
    console.log(
      "Connecting to MongoDB:",
      mongoUri.split("@")[1]?.split("/")[0] || mongoUri,
    );
    await mongoose.connect(mongoUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 30000,
    });

    console.log(`✅ MongoDB Connected `);
  } catch (error) {
    console.error("❌ Database connection failed:", error);
    process.exit(1);
  }
};
