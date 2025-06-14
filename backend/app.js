const express = require("express");
const cors = require("cors");
const app = express();
const dotenv = require("dotenv").config();
const { connectDB } = require("./config/database");
const redisClient = require("./config/redis");
const errorHandler = require("./middleware/error");
const requestLogger = require("./middleware/requestLogger");
const securityMiddleware = require("./middleware/security");
const rateLimiters = require("./middleware/rateLimiter");
const { performanceMonitor, getHealthCheck } = require("./middleware/performanceMonitor");
const validationRules = require("./middleware/validation");
const Logger = require("./utils/logger");

// Initialize database and cache
connectDB();
redisClient.connect();

// Security middleware
securityMiddleware(app);

// Body parsing middleware
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// General rate limiting
app.use("/api/", rateLimiters.general);

// Request logging
app.use(requestLogger);

// Performance monitoring
app.use(performanceMonitor);

// Health check endpoint
app.get("/health", (req, res) => {
   res.json(getHealthCheck());
});

// API status endpoint
app.get("/api/status", (req, res) => {
   res.json({
      status: "running",
      version: process.env.npm_package_version || "1.0.0",
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || "development",
   });
});

// Routes with specific rate limiting
app.use("/api/auth", rateLimiters.auth, require("./routes/auth"));
app.use("/api/users", require("./routes/users"));
app.use("/api/posts", rateLimiters.posting, require("./routes/posts"));
app.use("/api/comments", require("./routes/comments"));
app.use("/api/search", rateLimiters.search, require("./routes/search"));
app.use("/api/admin", require("./routes/admin"));
app.use("/api/notifications", require("./routes/notifications"));

// 404 handler
app.use("*", (req, res) => {
   Logger.warn("Route not found", {
      method: req.method,
      url: req.originalUrl,
      ip: req.ip,
      userAgent: req.get("User-Agent"),
   });

   res.status(404).json({
      error: "Route not found",
      message: `Cannot ${req.method} ${req.originalUrl}`,
      timestamp: new Date().toISOString(),
   });
});

// Error handler (must be last)
app.use(errorHandler);

// Graceful shutdown
process.on("SIGTERM", async () => {
   Logger.info("SIGTERM received, shutting down gracefully");
   await redisClient.disconnect();
   process.exit(0);
});

process.on("SIGINT", async () => {
   Logger.info("SIGINT received, shutting down gracefully");
   await redisClient.disconnect();
   process.exit(0);
});

// Unhandled promise rejections
process.on("unhandledRejection", (err) => {
   Logger.error("Unhandled Promise Rejection", { error: err.message, stack: err.stack });
   process.exit(1);
});

// Uncaught exceptions
process.on("uncaughtException", (err) => {
   Logger.error("Uncaught Exception", { error: err.message, stack: err.stack });
   process.exit(1);
});

module.exports = app;
