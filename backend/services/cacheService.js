const redisClient = require("../config/redis");
const logger = require("../utils/logger");

class CacheService {
   constructor() {
      this.defaultTTL = 3600; // 1 hour in seconds
   }

   async get(key) {
      try {
         if (!redisClient.isHealthy()) {
            return null;
         }

         const data = await redisClient.getClient().get(key);
         return data ? JSON.parse(data) : null;
      } catch (error) {
         logger.error("Cache get error:", error);
         return null;
      }
   }

   async set(key, value, ttl = this.defaultTTL) {
      try {
         if (!redisClient.isHealthy()) {
            return false;
         }

         await redisClient.getClient().setEx(key, ttl, JSON.stringify(value));
         return true;
      } catch (error) {
         logger.error("Cache set error:", error);
         return false;
      }
   }

   async del(key) {
      try {
         if (!redisClient.isHealthy()) {
            return false;
         }

         await redisClient.getClient().del(key);
         return true;
      } catch (error) {
         logger.error("Cache delete error:", error);
         return false;
      }
   }

   async delPattern(pattern) {
      try {
         if (!redisClient.isHealthy()) {
            return false;
         }

         const keys = await redisClient.getClient().keys(pattern);
         if (keys.length > 0) {
            await redisClient.getClient().del(keys);
         }
         return true;
      } catch (error) {
         logger.error("Cache delete pattern error:", error);
         return false;
      }
   }

   generateKey(...parts) {
      return parts.join(":");
   }

   // Cache middleware for Express
   middleware(keyGenerator, ttl = this.defaultTTL) {
      return async (req, res, next) => {
         try {
            const key = typeof keyGenerator === "function" ? keyGenerator(req) : keyGenerator;

            const cachedData = await this.get(key);

            if (cachedData) {
               return res.json(cachedData);
            }

            // Override res.json to cache the response
            const originalJson = res.json;
            res.json = (data) => {
               this.set(key, data, ttl);
               return originalJson.call(res, data);
            };

            next();
         } catch (error) {
            logger.error("Cache middleware error:", error);
            next();
         }
      };
   }
}

module.exports = new CacheService();
