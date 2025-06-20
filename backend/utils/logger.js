const winston = require('winston');
const path = require('path');
const fs = require('fs');

// Define log format
const logFormat = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.errors({ stack: true }),
  winston.format.json(),
  winston.format.prettyPrint()
);

// Create logger instance
const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: logFormat,
  defaultMeta: { service: 'yocodex-backend' },
  transports: [
    // Write all logs with importance level of `error` or less to `error.log`
    new winston.transports.File({
      filename: path.join(__dirname, '../logs/error.log'),
      level: 'error',
      maxsize: 5242880, // 5MB
      maxFiles: 5
    }),
    
    // Write all logs with importance level of `info` or less to `combined.log`
    new winston.transports.File({
      filename: path.join(__dirname, '../logs/combined.log'),
      maxsize: 5242880, // 5MB
      maxFiles: 5
    }),
    
    // Write all logs to console in development
    ...(process.env.NODE_ENV !== 'production' ? [
      new winston.transports.Console({
        format: winston.format.combine(
          winston.format.colorize(),
          winston.format.simple()
        )
      })
    ] : [])
  ]
});

// Create logs directory if it doesn't exist
const logsDir = path.join(__dirname, '../logs');
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true });
}

module.exports = logger;
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
