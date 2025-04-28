const {
    getUserNotifications,
    markAsRead,
  } = require('../services/notification');
  const { validateObjectId } = require('../utils/validator');
  
  // Get all notifications for the authenticated user
  exports.getNotifications = async (req, res, next) => {
    try {
      const userId = req.user._id; // From auth middleware
      const { page, limit, unreadOnly } = req.query;
  
      // Fetch notifications using service
      const result = await getUserNotifications(userId, {
        page,
        limit,
        unreadOnly: unreadOnly === 'true',
      });
  
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  };
  
  // Mark a notification as read
  exports.markNotificationAsRead = async (req, res, next) => {
    try {
      const { notificationId } = req.params;
      const userId = req.user._id; // From auth middleware
  
      // Validate notification ID
      if (!validateObjectId(notificationId)) {
        return res.status(400).json({ message: 'Invalid notification ID' });
      }
  
      // Mark as read using service
      const notification = await markAsRead(notificationId, userId);
  
      res.status(200).json({ message: 'Notification marked as read', notification });
    } catch (error) {
      next(error);
    }
  };
  
  // Mark all notifications as read for the authenticated user
  exports.markAllNotificationsAsRead = async (req, res, next) => {
    try {
      const userId = req.user._id; // From auth middleware
  
      // Update all unread notifications for the user
      const result = await Notification.updateMany(
        { recipient: userId, isRead: false },
        { isRead: true }
      );
  
      res.status(200).json({ message: `${result.nModified} notifications marked as read` });
    } catch (error) {
      next(error);
    }
  };
  
  // Delete a notification
  exports.deleteNotification = async (req, res, next) => {
    try {
      const { notificationId } = req.params;
      const userId = req.user._id; // From auth middleware
  
      // Validate notification ID
      if (!validateObjectId(notificationId)) {
        return res.status(400).json({ message: 'Invalid notification ID' });
      }
  
      // Find and delete notification
      const notification = await Notification.findOneAndDelete({
        _id: notificationId,
        recipient: userId,
      });
  
      if (!notification) {
        return res.status(404).json({ message: 'Notification not found or unauthorized' });
      }
  
      res.status(200).json({ message: 'Notification deleted successfully' });
    } catch (error) {
      next(error);
    }
  };