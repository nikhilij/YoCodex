const redisClient = require("../config/redis");
const Logger = require("./logger");

class CacheManager {
   constructor() {
      this.memoryCache = new Map();
      this.defaultTTL = 3600; // 1 hour
   }

   // Generate cache key
   generateKey(prefix, identifier) {
      return `${prefix}:${identifier}`;
   }

   // Get from cache (Redis first, then memory)
   async get(key) {
      try {
         // Try Redis first
         const redisValue = await redisClient.get(key);
         if (redisValue) {
            Logger.debug("Cache hit (Redis)", { key });
            return redisValue;
         }

         // Fallback to memory cache
         if (this.memoryCache.has(key)) {
            const item = this.memoryCache.get(key);
            if (item.expiry > Date.now()) {
               Logger.debug("Cache hit (Memory)", { key });
               return item.value;
            } else {
               this.memoryCache.delete(key);
            }
         }

         Logger.debug("Cache miss", { key });
         return null;
      } catch (error) {
         Logger.error("Cache get error", { key, error: error.message });
         return null;
      }
   }

   // Set in cache (both Redis and memory)
   async set(key, value, ttl = this.defaultTTL) {
      try {
         // Set in Redis
         await redisClient.set(key, value, ttl);

         // Set in memory cache as backup
         this.memoryCache.set(key, {
            value,
            expiry: Date.now() + ttl * 1000,
         });

         Logger.debug("Cache set", { key, ttl });
         return true;
      } catch (error) {
         Logger.error("Cache set error", { key, error: error.message });
         return false;
      }
   }

   // Delete from cache
   async del(key) {
      try {
         await redisClient.del(key);
         this.memoryCache.delete(key);
         Logger.debug("Cache delete", { key });
         return true;
      } catch (error) {
         Logger.error("Cache delete error", { key, error: error.message });
         return false;
      }
   }

   // Clear memory cache of expired items
   cleanupMemoryCache() {
      const now = Date.now();
      for (const [key, item] of this.memoryCache.entries()) {
         if (item.expiry <= now) {
            this.memoryCache.delete(key);
         }
      }
   }

   // Cache wrapper for functions
   async cacheFunction(key, fn, ttl = this.defaultTTL) {
      const cached = await this.get(key);
      if (cached) {
         return cached;
      }

      try {
         const result = await fn();
         await this.set(key, result, ttl);
         return result;
      } catch (error) {
         Logger.error("Cache function error", { key, error: error.message });
         throw error;
      }
   }

   // Invalidate cache by pattern
   async invalidatePattern(pattern) {
      try {
         // For Redis, we'd need to implement pattern matching
         // For now, we'll clear memory cache items matching pattern
         const regex = new RegExp(pattern);
         for (const key of this.memoryCache.keys()) {
            if (regex.test(key)) {
               this.memoryCache.delete(key);
            }
         }
         Logger.debug("Cache pattern invalidated", { pattern });
      } catch (error) {
         Logger.error("Cache pattern invalidation error", { pattern, error: error.message });
      }
   }
}

const cacheManager = new CacheManager();

// Cleanup memory cache every 5 minutes
setInterval(
   () => {
      cacheManager.cleanupMemoryCache();
   },
   5 * 60 * 1000
);

module.exports = cacheManager;
