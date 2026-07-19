import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "path";
import fs from "fs";

import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const envPath = path.resolve(__dirname, "../../.env");

if (fs.existsSync(envPath)) {
  dotenv.config({ path: envPath });
} else {
  dotenv.config();
}

const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
  console.error("CRITICAL: MONGO_URI environment variable is missing in .env!");
  process.exit(1);
}

export const connectDB = async () => {
  try {
    const conn = await mongoose.connect(MONGO_URI);
    console.log(`=================================================`);
    console.log(` MongoDB Atlas Connected successfully            `);
    console.log(` Host: ${conn.connection.host}                   `);
    console.log(` Database: ${conn.connection.name}               `);
    console.log(`=================================================`);
    return conn;
  } catch (error) {
    console.error(`MongoDB connection error: ${error.message}`);
    // Wait 5 seconds before retrying
    console.log("Retrying connection in 5 seconds...");
    setTimeout(connectDB, 5000);
  }
};

export default mongoose;
