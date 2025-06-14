const Notification = require("../models/Notification");
const { io } = require("../utils/socket"); // Import Socket.IO instance

// Service to create a notification
exports.createNotification = async ({ recipient, sender, type, post, comment, message }) => {
  try {
    // Validate inputs
    if (!recipient || !sender || !type || !message) {
      throw new Error("Recipient, sender, type, and message are required");
    }
    if (!["like", "comment", "follow", "mention", "post"].includes(type)) {
      throw new Error("Invalid notification type");
    }

    // Don't create notification if sender is same as recipient
    if (recipient.toString() === sender.toString()) {
      return null;
    }

    // Check for duplicate notifications (optional - prevents spam)
    const existingNotification = await Notification.findOne({
      recipient,
      sender,
      type,
      post: post || null,
      comment: comment || null,
      createdAt: { $gte: new Date(Date.now() - 24 * 60 * 60 * 1000) } // Last 24 hours
    });

    if (existingNotification && ["like", "follow"].includes(type)) {
      return existingNotification; // Don't create duplicate like/follow notifications
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

    // Populate sender info for real-time emission
    await notification.populate("sender", "username avatar");
    await notification.populate("post", "title slug");
    await notification.populate("comment", "content");

    // Emit real-time notification event
    io.to(recipient.toString()).emit("notification", {
      ...notification.toObject(),
      timestamp: notification.createdAt
    });

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
      return `${senderUsername} commented on your post "${postTitle || "Untitled"}": "${commentContent?.substring(0, 50) || ""}${commentContent?.length > 50 ? "..." : ""}"`;
    case "follow":
      return `${senderUsername} started following you`;
    case "mention":
      return `${senderUsername} mentioned you in a comment`;
    case "post":
      return `${senderUsername} shared a new post`;
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
      { isRead: true, readAt: new Date() },
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

// Mark all notifications as read for a user
exports.markAllAsRead = async (userId) => {
  try {
    if (!userId) {
      throw new Error("User ID is required");
    }

    const result = await Notification.updateMany(
      { recipient: userId, isRead: false },
      { isRead: true, readAt: new Date() }
    );

    return { modifiedCount: result.modifiedCount };
  } catch (error) {
    throw new Error(`Failed to mark all notifications as read: ${error.message}`);
  }
};

// Get notifications for a user
exports.getUserNotifications = async (userId, { page = 1, limit = 10, unreadOnly = false } = {}) => {
  try {
    if (!userId) {
      throw new Error("User ID is required");
    }

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
    const unreadCount = await Notification.countDocuments({ recipient: userId, isRead: false });

    return {
      notifications,
      total,
      unreadCount,
      page: Number(page),
      pages: Math.ceil(total / limit),
      hasNextPage: page < Math.ceil(total / limit),
      hasPrevPage: page > 1
    };
  } catch (error) {
    throw new Error(`Failed to fetch notifications: ${error.message}`);
  }
};

// Get unread notification count
exports.getUnreadCount = async (userId) => {
  try {
    if (!userId) {
      throw new Error("User ID is required");
    }

    const count = await Notification.countDocuments({
      recipient: userId,
      isRead: false
    });

    return count;
  } catch (error) {
    throw new Error(`Failed to get unread count: ${error.message}`);
  }
};

// Delete notification
exports.deleteNotification = async (notificationId, userId) => {
  try {
    if (!notificationId || !userId) {
      throw new Error("Notification ID and user ID are required");
    }

    const notification = await Notification.findOneAndDelete({
      _id: notificationId,
      recipient: userId
    });

    if (!notification) {
      throw new Error("Notification not found or unauthorized");
    }

    return { message: "Notification deleted successfully" };
  } catch (error) {
    throw new Error(`Failed to delete notification: ${error.message}`);
  }
};

// Delete all notifications for a user
exports.deleteAllNotifications = async (userId) => {
  try {
    if (!userId) {
      throw new Error("User ID is required");
    }

    const result = await Notification.deleteMany({
      recipient: userId
    });

    return { deletedCount: result.deletedCount };
  } catch (error) {
    throw new Error(`Failed to delete all notifications: ${error.message}`);
  }
};

// Clean up old notifications (can be used in a cron job)
exports.cleanupOldNotifications = async (daysOld = 30) => {
  try {
    const cutoffDate = new Date(Date.now() - daysOld * 24 * 60 * 60 * 1000);
    
    const result = await Notification.deleteMany({
      createdAt: { $lt: cutoffDate },
      isRead: true
    });

    return { deletedCount: result.deletedCount };
  } catch (error) {
    throw new Error(`Failed to cleanup old notifications: ${error.message}`);
  }
};

// Helper function to create notification with auto-generated message
exports.createNotificationWithMessage = async ({ recipient, sender, type, post, comment, senderUsername, postTitle, commentContent }) => {
  try {
    const message = this.generateNotificationMessage({
      type,
      senderUsername,
      postTitle,
      commentContent
    });

    return await this.createNotification({
      recipient,
      sender,
      type,
      post,
      comment,
      message
    });
  } catch (error) {
    throw new Error(`Failed to create notification with message: ${error.message}`);
  }
};

// Batch create notifications (useful for mentions or mass notifications)
exports.createBatchNotifications = async (notifications) => {
  try {
    if (!Array.isArray(notifications) || notifications.length === 0) {
      throw new Error("Notifications array is required and cannot be empty");
    }

    const validatedNotifications = notifications.map(notif => {
      if (!notif.recipient || !notif.sender || !notif.type || !notif.message) {
        throw new Error("Each notification must have recipient, sender, type, and message");
      }
      return {
        ...notif,
        isRead: false,
        createdAt: new Date()
      };
    });

    const createdNotifications = await Notification.insertMany(validatedNotifications);

    // Emit real-time notifications
    for (const notification of createdNotifications) {
      await notification.populate("sender", "username avatar");
      io.to(notification.recipient.toString()).emit("notification", {
        ...notification.toObject(),
        timestamp: notification.createdAt
      });
    }

    return createdNotifications;
  } catch (error) {
    throw new Error(`Failed to create batch notifications: ${error.message}`);
  }
};
