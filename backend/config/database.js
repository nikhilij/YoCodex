const mongoose = require("mongoose");
const Logger = require("../utils/logger");

// Database connection configuration
const dbConfig = {
   maxPoolSize: 10, // Maintain up to 10 socket connections
   serverSelectionTimeoutMS: 5000, // Keep trying to send operations for 5 seconds
   socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
   bufferMaxEntries: 0, // Disable mongoose buffering
   bufferCommands: false, // Disable mongoose buffering
   maxIdleTimeMS: 30000, // Close connections after 30 seconds of inactivity
   family: 4, // Use IPv4, skip trying IPv6
};

// Connection state tracking
let isConnected = false;
let connectionAttempts = 0;
const maxRetries = 5;

async function connectDB() {
   if (isConnected) {
      Logger.info("Database already connected");
      return;
   }

   try {
      connectionAttempts++;
      Logger.info(`Database connection attempt: ${connectionAttempts}/${maxRetries}`);

      // Connect to MongoDB
      const conn = await mongoose.connect(process.env.MONGO_URI, dbConfig);

      isConnected = true;
      connectionAttempts = 0;

      Logger.info("MongoDB connected successfully", {
         host: conn.connection.host,
         database: conn.connection.name,
         port: conn.connection.port,
      });

      // Connection event listeners
      mongoose.connection.on("connected", () => {
         Logger.info("MongoDB connected");
         isConnected = true;
      });

      mongoose.connection.on("error", (err) => {
         Logger.error("MongoDB connection error", { error: err.message });
         isConnected = false;
      });

      mongoose.connection.on("disconnected", () => {
         Logger.warn("MongoDB disconnected");
         isConnected = false;

         // Attempt to reconnect
         if (connectionAttempts < maxRetries) {
            setTimeout(() => {
               Logger.info("Attempting to reconnect to MongoDB...");
               connectDB();
            }, 5000);
         }
      });

      // Monitor connection performance
      mongoose.connection.on("open", () => {
         Logger.info("MongoDB connection opened");
      });

      mongoose.connection.on("close", () => {
         Logger.info("MongoDB connection closed");
      });

      // Log slow queries in development
      if (process.env.NODE_ENV === "development") {
         mongoose.set("debug", (collectionName, method, query, doc) => {
            Logger.debug("MongoDB Query", {
               collection: collectionName,
               method,
               query: JSON.stringify(query),
               doc: doc ? JSON.stringify(doc) : undefined,
            });
         });
      }
   } catch (error) {
      Logger.error("MongoDB connection failed", {
         error: error.message,
         attempt: connectionAttempts,
         maxRetries,
      });

      if (connectionAttempts < maxRetries) {
         Logger.info(`Retrying connection in 5 seconds... (${connectionAttempts}/${maxRetries})`);
         setTimeout(() => connectDB(), 5000);
      } else {
         Logger.error("Max connection attempts reached. Exiting...");
         process.exit(1);
      }
   }
}

// Graceful shutdown
process.on("SIGINT", async () => {
   Logger.info("Received SIGINT. Graceful shutdown...");
   await mongoose.connection.close();
   process.exit(0);
});

process.on("SIGTERM", async () => {
   Logger.info("Received SIGTERM. Graceful shutdown...");
   await mongoose.connection.close();
   process.exit(0);
});

// Export connection status checker
const getConnectionStatus = () => ({
   isConnected,
   readyState: mongoose.connection.readyState,
   host: mongoose.connection.host,
   name: mongoose.connection.name,
});

module.exports = { connectDB, getConnectionStatus };
