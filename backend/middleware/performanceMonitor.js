const { performance } = require("perf_hooks");
const Logger = require("../utils/logger");
const cacheManager = require("../utils/cache");

class PerformanceMonitor {
   constructor() {
      this.metrics = {
         requests: 0,
         totalResponseTime: 0,
         errors: 0,
         slowQueries: 0,
         cacheHits: 0,
         cacheMisses: 0,
      };

      this.slowQueryThreshold = 1000; // 1 second
      this.memoryUsageInterval = null;

      this.startMonitoring();
   }

   startMonitoring() {
      // Monitor memory usage every 30 seconds
      this.memoryUsageInterval = setInterval(() => {
         const memUsage = process.memoryUsage();
         Logger.performance("Memory usage", 0, {
            rss: `${Math.round(memUsage.rss / 1024 / 1024)} MB`,
            heapUsed: `${Math.round(memUsage.heapUsed / 1024 / 1024)} MB`,
            heapTotal: `${Math.round(memUsage.heapTotal / 1024 / 1024)} MB`,
            external: `${Math.round(memUsage.external / 1024 / 1024)} MB`,
         });
      }, 30000);
   }

   stopMonitoring() {
      if (this.memoryUsageInterval) {
         clearInterval(this.memoryUsageInterval);
      }
   }

   recordRequest(duration, statusCode) {
      this.metrics.requests++;
      this.metrics.totalResponseTime += duration;

      if (statusCode >= 400) {
         this.metrics.errors++;
      }

      if (duration > this.slowQueryThreshold) {
         this.metrics.slowQueries++;
      }
   }

   recordCacheHit() {
      this.metrics.cacheHits++;
   }

   recordCacheMiss() {
      this.metrics.cacheMisses++;
   }

   getMetrics() {
      const avgResponseTime = this.metrics.requests > 0 ? this.metrics.totalResponseTime / this.metrics.requests : 0;

      const errorRate = this.metrics.requests > 0 ? (this.metrics.errors / this.metrics.requests) * 100 : 0;

      const cacheHitRate =
         this.metrics.cacheHits + this.metrics.cacheMisses > 0
            ? (this.metrics.cacheHits / (this.metrics.cacheHits + this.metrics.cacheMisses)) * 100
            : 0;

      return {
         ...this.metrics,
         avgResponseTime: Math.round(avgResponseTime),
         errorRate: Math.round(errorRate * 100) / 100,
         cacheHitRate: Math.round(cacheHitRate * 100) / 100,
      };
   }

   resetMetrics() {
      this.metrics = {
         requests: 0,
         totalResponseTime: 0,
         errors: 0,
         slowQueries: 0,
         cacheHits: 0,
         cacheMisses: 0,
      };
   }
}

const monitor = new PerformanceMonitor();

// Middleware function
const performanceMonitor = (req, res, next) => {
   const startTime = performance.now();

   // Override res.json to capture response time
   const originalJson = res.json;
   res.json = function (data) {
      const endTime = performance.now();
      const duration = Math.round(endTime - startTime);

      // Record metrics
      monitor.recordRequest(duration, res.statusCode);

      // Log slow requests
      if (duration > monitor.slowQueryThreshold) {
         Logger.warn("Slow request detected", {
            method: req.method,
            url: req.originalUrl,
            duration: `${duration}ms`,
            statusCode: res.statusCode,
            userAgent: req.get("User-Agent"),
            ip: req.ip,
         });
      }

      // Log performance metrics
      Logger.performance("Request completed", duration, {
         method: req.method,
         url: req.originalUrl,
         statusCode: res.statusCode,
         responseSize: JSON.stringify(data).length,
      });

      return originalJson.call(this, data);
   };

   next();
};

// Health check endpoint data
const getHealthCheck = () => {
   const metrics = monitor.getMetrics();
   const memUsage = process.memoryUsage();

   return {
      status: "healthy",
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      metrics,
      memory: {
         rss: `${Math.round(memUsage.rss / 1024 / 1024)} MB`,
         heapUsed: `${Math.round(memUsage.heapUsed / 1024 / 1024)} MB`,
         heapTotal: `${Math.round(memUsage.heapTotal / 1024 / 1024)} MB`,
      },
      nodeVersion: process.version,
      environment: process.env.NODE_ENV,
   };
};

module.exports = {
   performanceMonitor,
   monitor,
   getHealthCheck,
};
