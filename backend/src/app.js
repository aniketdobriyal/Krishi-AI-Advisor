import express from "express";
import cors from "cors";
import helmet from "helmet";
import passport from "passport";
import apiRoutes from "./routes/index.js";
import { errorHandler } from "./middleware/errorHandler.js";

const app = express();

// Enable helmet for security headers
app.use(helmet());

// Hide unnecessary Express headers
app.disable("x-powered-by");

// Configure CORS to allow access only from the React frontend origin
const corsOrigin = process.env.CLIENT_URL || "http://localhost:5173";
app.use(cors({
  origin: corsOrigin,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true
}));

// Initialize Passport for Google OAuth
app.use(passport.initialize());

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
