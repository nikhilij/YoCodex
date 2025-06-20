const helmet = require("helmet");
const cors = require("cors");
const mongoSanitize = require("express-mongo-sanitize");
const xss = require("xss-clean");
const hpp = require("hpp");
const Logger = require("../utils/logger");

// Security middleware configuration
const securityMiddleware = (app) => {
   // Helmet for security headers
   app.use(
      helmet({
         contentSecurityPolicy: {
            directives: {
               defaultSrc: ["'self'"],
               styleSrc: ["'self'", "'unsafe-inline'", "https:"],
               scriptSrc: ["'self'"],
               imgSrc: ["'self'", "data:", "https:"],
               connectSrc: ["'self'"],
               fontSrc: ["'self'", "https:"],
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
         origin: process.env.ALLOWED_ORIGINS ? process.env.ALLOWED_ORIGINS.split(",") : ["http://localhost:3000"],
         credentials: true,
         methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
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
         whitelist: ["sort", "fields", "page", "limit", "category", "tag"], // Allow arrays for these parameters
      })
   );
};

module.exports = securityMiddleware;
