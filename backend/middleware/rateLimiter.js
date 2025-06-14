const rateLimit = require("express-rate-limit");
const RedisStore = require("rate-limit-redis");
const redisClient = require("../config/redis");
const Logger = require("../utils/logger");

// Create rate limiter with Redis store
const createRateLimiter = (options = {}) => {
   const defaultOptions = {
      windowMs: 15 * 60 * 1000, // 15 minutes
      max: 100, // limit each IP to 100 requests per windowMs
      message: {
         error: "Too many requests from this IP, please try again later.",
         retryAfter: Math.ceil(options.windowMs / 1000) || 900,
      },
      standardHeaders: true,
      legacyHeaders: false,
      handler: (req, res) => {
         Logger.warn("Rate limit exceeded", {
            ip: req.ip,
            userAgent: req.get("User-Agent"),
            endpoint: req.originalUrl,
         });
         res.status(429).json({
            error: "Too many requests",
            message: "Rate limit exceeded. Please try again later.",
            retryAfter: Math.ceil(options.windowMs / 1000) || 900,
         });
      },
      ...options,
   };

   // Use Redis store if available
   if (redisClient.isConnected) {
      defaultOptions.store = new RedisStore({
         sendCommand: (...args) => redisClient.client.sendCommand(args),
      });
   }

   return rateLimit(defaultOptions);
};

// Different rate limiters for different endpoints
const rateLimiters = {
   // General API rate limiter
   general: createRateLimiter({
      windowMs: 15 * 60 * 1000, // 15 minutes
      max: 100, // 100 requests per 15 minutes
   }),

   // Strict rate limiter for auth endpoints
   auth: createRateLimiter({
      windowMs: 15 * 60 * 1000, // 15 minutes
      max: 5, // 5 attempts per 15 minutes
      skipSuccessfulRequests: true,
      keyGenerator: (req) => {
         return req.ip + ":" + (req.body.email || req.body.username || "");
      },
   }),

   // Rate limiter for file uploads
   upload: createRateLimiter({
      windowMs: 60 * 60 * 1000, // 1 hour
      max: 10, // 10 uploads per hour
   }),

   // Rate limiter for search endpoints
   search: createRateLimiter({
      windowMs: 1 * 60 * 1000, // 1 minute
      max: 30, // 30 searches per minute
   }),

   // Rate limiter for posting content
   posting: createRateLimiter({
      windowMs: 60 * 60 * 1000, // 1 hour
      max: 20, // 20 posts per hour
   }),
};

module.exports = rateLimiters;
