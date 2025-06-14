const { Server } = require("socket.io");

let io;

// Initialize Socket.IO
const initializeSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: process.env.CLIENT_URL || "*", // Use environment variable for production
      methods: ["GET", "POST"],
      credentials: true,
    },
  });

  io.on("connection", (socket) => {
    console.log(`User connected: ${socket.id}`);

    // Handle user authentication and join their personal room
    socket.on("authenticate", (userId) => {
      if (userId) {
        socket.userId = userId;
        socket.join(`user_${userId}`);
        console.log(`User ${userId} authenticated and joined personal room`);
      }
    });

    // Handle user joining a specific room (for posts, comments, etc.)
    socket.on("joinRoom", (roomId) => {
      socket.join(roomId);
      console.log(`User ${socket.id} joined room: ${roomId}`);
    });

    // Handle leaving a room
    socket.on("leaveRoom", (roomId) => {
      socket.leave(roomId);
      console.log(`User ${socket.id} left room: ${roomId}`);
    });

    // Handle real-time messaging
    socket.on("sendMessage", (data) => {
      const { roomId, message, userId } = data;
      io.to(roomId).emit("newMessage", {
        userId,
        message,
        timestamp: new Date(),
      });
    });

    // Handle typing indicators
    socket.on("typing", (data) => {
      const { roomId, userId, isTyping } = data;
      socket.to(roomId).emit("userTyping", { userId, isTyping });
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

// Emit notification to specific user
const emitNotificationToUser = (userId, notification) => {
  if (!io) return;
  io.to(`user_${userId}`).emit("newNotification", notification);
};

// Emit notification to multiple users
const emitNotificationToUsers = (userIds, notification) => {
  if (!io) return;
  userIds.forEach(userId => {
    io.to(`user_${userId}`).emit("newNotification", notification);
  });
};

// Emit to a specific room
const emitToRoom = (roomId, event, data) => {
  if (!io) return;
  io.to(roomId).emit(event, data);
};

// Broadcast to all connected users
const broadcast = (event, data) => {
  if (!io) return;
  io.emit(event, data);
};

// Get connected users count
const getConnectedUsersCount = () => {
  if (!io) return 0;
  return io.engine.clientsCount;
};

// Get users in a specific room
const getUsersInRoom = (roomId) => {
  if (!io) return [];
  const room = io.sockets.adapter.rooms.get(roomId);
  return room ? Array.from(room) : [];
};

module.exports = {
  initializeSocket,
  getSocketInstance,
  emitNotificationToUser,
  emitNotificationToUsers,
  emitToRoom,
  broadcast,
  getConnectedUsersCount,
  getUsersInRoom,
};
