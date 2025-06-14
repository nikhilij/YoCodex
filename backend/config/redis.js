const redis = require("redis");
const Logger = require("../utils/logger");

class RedisClient {
   constructor() {
      this.client = null;
      this.isConnected = false;
   }

   async connect() {
      try {
         this.client = redis.createClient({
            host: process.env.REDIS_HOST || "localhost",
            port: process.env.REDIS_PORT || 6379,
            password: process.env.REDIS_PASSWORD || undefined,
            retry_strategy: (options) => {
               if (options.error && options.error.code === "ECONNREFUSED") {
                  Logger.error("Redis connection refused");
                  return new Error("Redis connection refused");
               }
               if (options.total_retry_time > 1000 * 60 * 60) {
                  Logger.error("Redis retry time exhausted");
                  return new Error("Retry time exhausted");
               }
               if (options.attempt > 10) {
                  return undefined;
               }
               return Math.min(options.attempt * 100, 3000);
            },
         });

         this.client.on("connect", () => {
            Logger.info("Redis client connected");
            this.isConnected = true;
         });

         this.client.on("error", (err) => {
            Logger.error("Redis client error", { error: err.message });
            this.isConnected = false;
         });

         this.client.on("end", () => {
            Logger.info("Redis client disconnected");
            this.isConnected = false;
         });

         await this.client.connect();
      } catch (error) {
         Logger.error("Failed to connect to Redis", { error: error.message });
         // Continue without Redis if connection fails
      }
   }

   async get(key) {
      if (!this.isConnected) return null;
      try {
         const result = await this.client.get(key);
         return result ? JSON.parse(result) : null;
      } catch (error) {
         Logger.error("Redis GET error", { key, error: error.message });
         return null;
      }
   }

   async set(key, value, expireInSeconds = 3600) {
      if (!this.isConnected) return false;
      try {
         await this.client.setEx(key, expireInSeconds, JSON.stringify(value));
         return true;
      } catch (error) {
         Logger.error("Redis SET error", { key, error: error.message });
         return false;
      }
   }

   async del(key) {
      if (!this.isConnected) return false;
      try {
         await this.client.del(key);
         return true;
      } catch (error) {
         Logger.error("Redis DEL error", { key, error: error.message });
         return false;
      }
   }

   async exists(key) {
      if (!this.isConnected) return false;
      try {
         const result = await this.client.exists(key);
         return result === 1;
      } catch (error) {
         Logger.error("Redis EXISTS error", { key, error: error.message });
         return false;
      }
   }

   async flush() {
      if (!this.isConnected) return false;
      try {
         await this.client.flushAll();
         return true;
      } catch (error) {
         Logger.error("Redis FLUSH error", { error: error.message });
         return false;
      }
   }

   async disconnect() {
      if (this.client) {
         await this.client.quit();
      }
   }
}

const redisClient = new RedisClient();
module.exports = redisClient;
