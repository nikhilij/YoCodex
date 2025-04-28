const { Server } = require("socket.io");

let io;

// Initialize Socket.IO
const initializeSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: "*", // Update this with your frontend's URL in production
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", (socket) => {
    console.log(`User connected: ${socket.id}`);

    // Handle user joining a specific room
    socket.on("joinRoom", (roomId) => {
      socket.join(roomId);
      console.log(`User ${socket.id} joined room: ${roomId}`);
    });

    // Handle user disconnecting
    socket.on("disconnect", () => {
      console.log(`User disconnected: ${socket.id}`);
    });
  });

  return io;
};

// Get the Socket.IO instance
const getSocketInstance = () => {
  if (!io) {
    throw new Error("Socket.IO not initialized. Call initializeSocket first.");
  }
  return io;
};

module.exports = {
  initializeSocket,
  getSocketInstance,
};
