const helmet = require("helmet");
const mongoSanitize = require("express-mongo-sanitize");
const xss = require("xss-clean");
const hpp = require("hpp");
const cors = require("cors");
const Logger = require("../utils/logger");

// Security middleware configuration
const securityMiddleware = (app) => {
   // Helmet for security headers
   app.use(
      helmet({
         contentSecurityPolicy: {
            directives: {
               defaultSrc: ["'self'"],
               styleSrc: ["'self'", "'unsafe-inline'"],
               scriptSrc: ["'self'"],
               imgSrc: ["'self'", "data:", "https:"],
               connectSrc: ["'self'"],
               fontSrc: ["'self'"],
               objectSrc: ["'none'"],
               mediaSrc: ["'self'"],
               frameSrc: ["'none'"],
            },
         },
         crossOriginEmbedderPolicy: false,
      })
   );

   // CORS configuration
   app.use(
      cors({
         origin: function (origin, callback) {
            const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(",") || ["http://localhost:3000"];

            // Allow requests with no origin (mobile apps, etc.)
            if (!origin) return callback(null, true);

            if (allowedOrigins.includes(origin)) {
               callback(null, true);
            } else {
               Logger.warn("CORS blocked request", { origin });
               callback(new Error("Not allowed by CORS"));
            }
         },
         credentials: true,
         methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
         allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
      })
   );

   // Sanitize data against NoSQL injection
   app.use(mongoSanitize());

   // Clean user input from malicious HTML
   app.use(xss());

   // Prevent HTTP Parameter Pollution
   app.use(
      hpp({
         whitelist: ["tags", "categories"], // Allow arrays for these parameters
      })
   );

   // Add security headers manually
   app.use((req, res, next) => {
      res.setHeader("X-Content-Type-Options", "nosniff");
      res.setHeader("X-Frame-Options", "DENY");
      res.setHeader("X-XSS-Protection", "1; mode=block");
      res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");
      res.setHeader("Permissions-Policy", "geolocation=(), microphone=(), camera=()");
      next();
   });

   // Log security violations
   app.use((err, req, res, next) => {
      if (err.message === "Not allowed by CORS") {
         Logger.error("CORS violation", {
            origin: req.get("Origin"),
            ip: req.ip,
            userAgent: req.get("User-Agent"),
            url: req.originalUrl,
         });
         return res.status(403).json({ error: "CORS policy violation" });
      }
      next(err);
   });
};

module.exports = securityMiddleware;
