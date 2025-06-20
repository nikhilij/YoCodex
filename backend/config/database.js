const mongoose = require("mongoose");
const logger = require("../utils/logger");

class Database {
   constructor() {
      this.mongoUrl = process.env.MONGO_URI || "mongodb://localhost:27017/yocodex";
      this.options = {
         useNewUrlParser: true,
         useUnifiedTopology: true,
         maxPoolSize: 10, // Maintain up to 10 socket connections
         serverSelectionTimeoutMS: 5000, // Keep trying to send operations for 5 seconds
         socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
         bufferMaxEntries: 0, // Disable mongoose buffering
         bufferCommands: false, // Disable mongoose buffering
      };
   }

   async connect() {
      try {
         await mongoose.connect(this.mongoUrl, this.options);
         logger.info("Database connected successfully");

         // Handle connection events
         mongoose.connection.on("error", (err) => {
            logger.error("Database connection error:", err);
         });

         mongoose.connection.on("disconnected", () => {
            logger.warn("Database disconnected");
         });

         mongoose.connection.on("reconnected", () => {
            logger.info("Database reconnected");
         });
      } catch (error) {
         logger.error("Database connection failed:", error);
         process.exit(1);
      }
   }

   async disconnect() {
      try {
         await mongoose.disconnect();
         logger.info("Database disconnected successfully");
      } catch (error) {
         logger.error("Error disconnecting from database:", error);
      }
   }
}

module.exports = new Database();
