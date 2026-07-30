import app from "./app.js";
import dotenv from "dotenv";
import { connectDB } from "./config/mongoose.js";
import { seedDatabase } from "./config/seed.js";
import path from "path";
import fs from "fs";

import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const envPath = path.resolve(__dirname, "../.env");

if (fs.existsSync(envPath)) {
  dotenv.config({ path: envPath });
} else {
  dotenv.config();
}

// Environment variable validation for production readiness
const requiredEnvVars = ["JWT_SECRET", "CLIENT_URL", "MONGO_URI"];
const missing = requiredEnvVars.filter(v => !process.env[v]);

if (process.env.NODE_ENV === "production") {
  if (missing.length > 0) {
    console.error(`CRITICAL ERROR: Missing required production environment variables: ${missing.join(", ")}`);
    process.exit(1);
  }
} else {
  if (missing.length > 0) {
    console.warn(`WARNING: Missing environment variables for local development: ${missing.join(", ")}`);
  }
}

if (!process.env.GEMINI_API_KEY) {
  console.warn("WARNING: GEMINI_API_KEY is not defined. AI Chat will fall back to offline keyword-matching mode.");
}

if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) {
  console.warn("WARNING: GOOGLE_CLIENT_ID or GOOGLE_CLIENT_SECRET is missing. Google OAuth strategy will not work.");
}

const PORT = process.env.PORT || 5000;

// Initialize database and start server
const startServer = async () => {
  try {
    // Connect to MongoDB
    await connectDB();
    
    // Seed default data if needed
    await seedDatabase();

    const server = app.listen(PORT, () => {
      console.log(`=================================================`);
      console.log(` Krishi AI Advisor Backend Server is now online  `);
      console.log(` Port: ${PORT}                                  `);
      console.log(` Mode: ${process.env.NODE_ENV || "development"} `);
      console.log(`=================================================`);
    });

    // Graceful shutdown handling
    process.on("SIGTERM", () => {
      console.log("SIGTERM signal received: closing HTTP server...");
      server.close(() => {
        console.log("HTTP server closed.");
      });
    });

  } catch (err) {
    console.error(`Failed to start server: ${err.message}`);
    process.exit(1);
  }
};

startServer();

