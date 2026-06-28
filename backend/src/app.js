import express from "express";
import cors from "cors";
import apiRoutes from "./routes/index.js";
import { errorHandler } from "./middleware/errorHandler.js";

const app = express();

// Configure CORS to allow access from the React frontend
app.use(cors({
  origin: "*", // For development flexibility; can be refined in production
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health Check route
app.get("/", (req, res) => {
  res.status(200).json({
    status: "success",
    message: "Krishi AI Advisor API Server is running"
  });
});

// API Routes Mounting
app.use("/api", apiRoutes);

// Catch-all route handler for 404 (Not Found)
app.use((req, res, next) => {
  const error = new Error(`Resource not found: ${req.originalUrl}`);
  error.statusCode = 404;
  next(error);
});

// Centralized Error-Handling Middleware
app.use(errorHandler);

export default app;
