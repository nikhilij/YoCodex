const mongoose = require('mongoose');

// Notification Schema
const notificationSchema = new mongoose.Schema({
  recipient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Recipient is required'],
  },
  type: {
    type: String,
    enum: ['like', 'comment', 'follow', 'mention'],
    required: [true, 'Notification type is required'],
  },
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Sender is required'],
  },
  post: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Post',
    default: null,
  },
  comment: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Comment',
    default: null,
  },
  message: {
    type: String,
    required: [true, 'Notification message is required'],
    maxlength: [200, 'Message cannot exceed 200 characters'],
  },
  isRead: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Index for faster queries
notificationSchema.index({ recipient: 1, createdAt: -1 });

// Export model
module.exports = mongoose.model('Notification', notificationSchema);