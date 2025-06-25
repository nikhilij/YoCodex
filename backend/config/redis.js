const redis = require("redis");
const logger = require("../utils/logger");

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
            db: process.env.REDIS_DB || 0,
            retryDelayOnFailover: 100,
            maxRetriesPerRequest: 3,
         });

         this.client.on("error", (err) => {
            logger.error("Redis Client Error:", err);
            this.isConnected = false;
         });

         this.client.on("connect", () => {
            logger.info("Redis connected successfully");
            this.isConnected = true;
         });

         this.client.on("reconnecting", () => {
            logger.info("Redis reconnecting...");
         });

         this.client.on("end", () => {
            logger.warn("Redis connection ended");
            this.isConnected = false;
         });

         await this.client.connect();
         return this.client;
      } catch (error) {
         logger.error("Redis connection failed:", error);
         return null;
      }
   }

   getClient() {
      return this.client;
   }

   isHealthy() {
      return this.isConnected && this.client && this.client.isOpen;
   }

   async disconnect() {
      if (this.client) {
         await this.client.quit();
         logger.info("Redis disconnected successfully");
      }
   }
}

module.exports = new RedisClient();
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
