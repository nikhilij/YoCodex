const Logger = require("../utils/logger");
const { performance } = require("perf_hooks");

const requestLogger = (req, res, next) => {
   const startTime = performance.now();
   const startDate = new Date();

   // Generate unique request ID
   const requestId = Math.random().toString(36).substring(2, 15);
   req.requestId = requestId;

   // Log incoming request
   const requestInfo = {
      requestId,
      method: req.method,
      url: req.originalUrl,
      ip: req.ip,
      userAgent: req.get("User-Agent"),
      timestamp: startDate.toISOString(),
      body: req.method === "POST" || req.method === "PUT" ? sanitizeBody(req.body) : undefined,
      params: req.params,
      query: req.query,
      headers: {
         "content-type": req.get("Content-Type"),
         authorization: req.get("Authorization") ? "[REDACTED]" : undefined,
         origin: req.get("Origin"),
         referer: req.get("Referer"),
      },
   };

   Logger.info("Incoming request", requestInfo);

   // Override res.json to log response
   const originalJson = res.json;
   res.json = function (data) {
      const endTime = performance.now();
      const duration = Math.round(endTime - startTime);

      const responseInfo = {
         requestId,
         statusCode: res.statusCode,
         duration: `${duration}ms`,
         timestamp: new Date().toISOString(),
         responseSize: JSON.stringify(data).length,
         success: res.statusCode < 400,
      };

      // Log response
      if (res.statusCode >= 400) {
         Logger.error("Request failed", {
            ...requestInfo,
            ...responseInfo,
            error: data,
         });
      } else {
         Logger.info("Request completed", responseInfo);
      }

      return originalJson.call(this, data);
   };

   next();
};

// Sanitize request body to remove sensitive information
const sanitizeBody = (body) => {
   if (!body) return body;

   const sanitized = { ...body };
   const sensitiveFields = ["password", "token", "secret", "apiKey"];

   sensitiveFields.forEach((field) => {
      if (sanitized[field]) {
         sanitized[field] = "[REDACTED]";
      }
   });

   return sanitized;
};

module.exports = requestLogger;
