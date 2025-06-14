const fs = require("fs");
const path = require("path");
const { createLogger, format, transports } = require("winston");
const DailyRotateFile = require("winston-daily-rotate-file");

// Create logs directory if it doesn't exist
const logsDir = path.join(__dirname, "../logs");
if (!fs.existsSync(logsDir)) {
   fs.mkdirSync(logsDir, { recursive: true });
}

// Custom format for logs
const customFormat = format.combine(
   format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
   format.errors({ stack: true }),
   format.json(),
   format.printf(({ timestamp, level, message, ...meta }) => {
      return JSON.stringify({
         timestamp,
         level,
         message,
         ...meta,
      });
   })
);

// Create Winston logger
const logger = createLogger({
   level: process.env.LOG_LEVEL || "info",
   format: customFormat,
   defaultMeta: { service: "yocodex-backend" },
   transports: [
      // Console transport for development
      new transports.Console({
         format: format.combine(
            format.colorize(),
            format.simple(),
            format.printf(({ timestamp, level, message, ...meta }) => {
               const metaString = Object.keys(meta).length > 0 ? `\n${JSON.stringify(meta, null, 2)}` : "";
               return `[${timestamp}] ${level}: ${message}${metaString}`;
            })
         ),
      }),

      // File transport for errors
      new DailyRotateFile({
         filename: path.join(logsDir, "error-%DATE%.log"),
         datePattern: "YYYY-MM-DD",
         level: "error",
         maxSize: "20m",
         maxFiles: "14d",
         format: customFormat,
      }),

      // File transport for all logs
      new DailyRotateFile({
         filename: path.join(logsDir, "combined-%DATE%.log"),
         datePattern: "YYYY-MM-DD",
         maxSize: "20m",
         maxFiles: "30d",
         format: customFormat,
      }),

      // Separate file for performance logs
      new DailyRotateFile({
         filename: path.join(logsDir, "performance-%DATE%.log"),
         datePattern: "YYYY-MM-DD",
         level: "debug",
         maxSize: "20m",
         maxFiles: "7d",
         format: customFormat,
      }),
   ],
   exceptionHandlers: [
      new transports.File({
         filename: path.join(logsDir, "exceptions.log"),
         format: customFormat,
      }),
   ],
   rejectionHandlers: [
      new transports.File({
         filename: path.join(logsDir, "rejections.log"),
         format: customFormat,
      }),
   ],
});

// Enhanced Logger class with additional methods
class Logger {
   static error(message, meta = {}) {
      logger.error(message, meta);
   }

   static warn(message, meta = {}) {
      logger.warn(message, meta);
   }

   static info(message, meta = {}) {
      logger.info(message, meta);
   }

   static debug(message, meta = {}) {
      logger.debug(message, meta);
   }

   static http(message, meta = {}) {
      logger.http(message, meta);
   }

   // Performance logging
   static performance(message, duration, meta = {}) {
      logger.debug(message, {
         ...meta,
         performance: true,
         duration: `${duration}ms`,
         timestamp: new Date().toISOString(),
      });
   }

   // Database operation logging
   static database(operation, collection, duration, meta = {}) {
      logger.debug(`Database ${operation}`, {
         ...meta,
         database: true,
         operation,
         collection,
         duration: `${duration}ms`,
      });
   }

   // Security event logging
   static security(event, severity = "medium", meta = {}) {
      const logLevel = severity === "high" ? "error" : "warn";
      logger[logLevel](`Security event: ${event}`, {
         ...meta,
         security: true,
         severity,
         timestamp: new Date().toISOString(),
      });
   }

   // Cache operation logging
   static cache(operation, key, hit = null, meta = {}) {
      logger.debug(`Cache ${operation}`, {
         ...meta,
         cache: true,
         operation,
         key,
         hit,
         timestamp: new Date().toISOString(),
      });
   }

   // Business logic logging
   static business(event, meta = {}) {
      logger.info(`Business event: ${event}`, {
         ...meta,
         business: true,
         timestamp: new Date().toISOString(),
      });
   }
}

module.exports = Logger;
