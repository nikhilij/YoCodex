const Notification = require("../models/Notification");
const { io } = require("../utils/socket"); // Import Socket.IO instance

// Service to create a notification
exports.createNotification = async ({ recipient, sender, type, post, comment, message }) => {
  try {
    // Validate inputs
    if (!recipient || !sender || !type || !message) {
      throw new Error("Recipient, sender, type, and message are required");
    }
    if (!["like", "comment", "follow", "mention"].includes(type)) {
      throw new Error("Invalid notification type");
    }

    // Create notification
    const notification = new Notification({
      recipient,
      sender,
      type,
      post: post || null,
      comment: comment || null,
      message,
      isRead: false,
    });

    await notification.save();

    // Emit real-time notification event
    io.to(recipient.toString()).emit("notification", notification);

    return notification;
  } catch (error) {
    throw new Error(`Failed to create notification: ${error.message}`);
  }
};

// Generate notification message based on type
exports.generateNotificationMessage = ({ type, senderUsername, postTitle, commentContent }) => {
  switch (type) {
    case "like":
      return `${senderUsername} liked your post "${postTitle || "Untitled"}"`;
    case "comment":
      return `${senderUsername} commented on your post "${postTitle || "Untitled"}": "${commentContent?.substring(0, 50) || ""}"`;
    case "follow":
      return `${senderUsername} started following you`;
    case "mention":
      return `${senderUsername} mentioned you in a comment`;
    default:
      return "You received a new notification";
  }
};

// Mark notification as read
exports.markAsRead = async (notificationId, userId) => {
  try {
    // Validate inputs
    if (!notificationId || !userId) {
      throw new Error("Notification ID and user ID are required");
    }

    // Find and update notification
    const notification = await Notification.findOneAndUpdate(
      { _id: notificationId, recipient: userId },
      { isRead: true },
      { new: true }
    );

    if (!notification) {
      throw new Error("Notification not found or unauthorized");
    }

    return notification;
  } catch (error) {
    throw new Error(`Failed to mark notification as read: ${error.message}`);
  }
};

// Get notifications for a user
exports.getUserNotifications = async (userId, { page = 1, limit = 10, unreadOnly = false }) => {
  try {
    // Build query
    const query = { recipient: userId };
    if (unreadOnly) query.isRead = false;

    // Fetch notifications
    const notifications = await Notification.find(query)
      .populate("sender", "username avatar")
      .populate("post", "title slug")
      .populate("comment", "content")
      .skip((page - 1) * limit)
      .limit(Number(limit))
      .sort({ createdAt: -1 });

    const total = await Notification.countDocuments(query);

    return {
      notifications,
      total,
      page: Number(page),
      pages: Math.ceil(total / limit),
    };
  } catch (error) {
    throw new Error(`Failed to fetch notifications: ${error.message}`);
  }
};
