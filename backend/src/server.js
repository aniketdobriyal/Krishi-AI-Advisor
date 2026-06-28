import app from "./app.js";
import dotenv from "dotenv";

dotenv.config();

const PORT = process.env.PORT || 5000;

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
