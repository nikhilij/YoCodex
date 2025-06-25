const rateLimit = require("express-rate-limit");
const RedisStore = require("rate-limit-redis");
const redis = require("../config/redis");

// Basic rate limiter
const basicLimiter = rateLimit({
   store: new RedisStore({
      client: redis,
      prefix: "rl:basic:",
   }),
   windowMs: 15 * 60 * 1000, // 15 minutes
   max: 100, // limit each IP to 100 requests per windowMs
   message: {
      status: "error",
      message: "Too many requests from this IP, please try again later.",
      retryAfter: "15 minutes",
   },
   standardHeaders: true,
   legacyHeaders: false,
});

// Strict limiter for auth endpoints
const authLimiter = rateLimit({
   store: new RedisStore({
      client: redis,
      prefix: "rl:auth:",
   }),
   windowMs: 15 * 60 * 1000, // 15 minutes
   max: 5, // limit each IP to 5 requests per windowMs
   message: {
      status: "error",
      message: "Too many authentication attempts, please try again later.",
      retryAfter: "15 minutes",
   },
   skipSuccessfulRequests: true,
});

// Create post limiter
const createPostLimiter = rateLimit({
   store: new RedisStore({
      client: redis,
      prefix: "rl:post:",
   }),
   windowMs: 60 * 60 * 1000, // 1 hour
   max: 10, // limit to 10 posts per hour
   message: {
      status: "error",
      message: "Too many posts created, please try again later.",
      retryAfter: "1 hour",
   },
});

// Comment limiter
const commentLimiter = rateLimit({
   store: new RedisStore({
      client: redis,
      prefix: "rl:comment:",
   }),
   windowMs: 10 * 60 * 1000, // 10 minutes
   max: 20, // limit to 20 comments per 10 minutes
   message: {
      status: "error",
      message: "Too many comments, please slow down.",
      retryAfter: "10 minutes",
   },
});

module.exports = {
   basicLimiter,
   authLimiter,
   createPostLimiter,
   commentLimiter,
};
      windowMs: 60 * 60 * 1000, // 1 hour
      max: 20, // 20 posts per hour
   }),
};

module.exports = rateLimiters;
