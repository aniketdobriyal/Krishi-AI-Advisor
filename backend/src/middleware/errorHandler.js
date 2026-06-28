// Centralized Error-Handling Middleware for Express
export const errorHandler = (err, req, res, next) => {
  console.error("Error encountered:", err.message || err);
  if (err.stack) {
    console.error(err.stack);
  }

  const statusCode = err.statusCode || err.status || 500;
  const message = err.message || "Internal Server Error";

  res.status(statusCode).json({
    success: false,
    error: {
      status: statusCode,
      message: message
    }
  });
};
