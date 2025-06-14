const mongoose = require("mongoose");

// Notification Schema
const notificationSchema = new mongoose.Schema(
  {
    recipient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Recipient is required"],
      index: true,
    },
    type: {
      type: String,
      enum: [
        "like", 
        "comment", 
        "reply", 
        "follow", 
        "unfollow", 
        "mention", 
        "post_published", 
        "post_featured", 
        "comment_liked", 
        "welcome", 
        "newsletter", 
        "system_alert",
        "moderation",
        "achievement",
        "reminder"
      ],
      required: [true, "Notification type is required"],
      index: true,
    },
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: function() {
        return !['system_alert', 'newsletter', 'welcome', 'reminder'].includes(this.type);
      },
      index: true,
    },
    post: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Post",
      default: null,
      index: true,
    },
    comment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Comment",
      default: null,
      index: true,
    },
    message: {
      type: String,
      required: [true, "Notification message is required"],
      maxlength: [500, "Message cannot exceed 500 characters"],
      trim: true,
    },
    title: {
      type: String,
      maxlength: [100, "Title cannot exceed 100 characters"],
      trim: true,
    },
    priority: {
      type: String,
      enum: ["low", "normal", "high", "urgent"],
      default: "normal",
      index: true,
    },
    category: {
      type: String,
      enum: ["social", "content", "system", "marketing", "moderation"],
      default: "social",
      index: true,
    },
    status: {
      type: String,
      enum: ["pending", "delivered", "read", "archived", "failed"],
      default: "pending",
      index: true,
    },
    isRead: {
      type: Boolean,
      default: false,
      index: true,
    },
    channels: {
      inApp: { 
        enabled: { type: Boolean, default: true },
        delivered: { type: Boolean, default: false },
        deliveredAt: Date,
      },
      email: { 
        enabled: { type: Boolean, default: false },
        delivered: { type: Boolean, default: false },
        deliveredAt: Date,
        emailId: String,
      },
      push: { 
        enabled: { type: Boolean, default: false },
        delivered: { type: Boolean, default: false },
        deliveredAt: Date,
      },
    },
    analytics: {
      clickCount: { type: Number, default: 0 },
      lastClickedAt: Date,
      timeToRead: Number, // in seconds
      engagementScore: { type: Number, default: 0 },
    },
    actionData: {
      actionType: {
        type: String,
        enum: ["view_post", "view_profile", "view_comment", "none"],
        default: "none",
      },
      actionUrl: String,
      buttonText: String,
      hasAction: { type: Boolean, default: false },
    },
    batchInfo: {
      batchId: String,
      batchType: String,
      totalInBatch: Number,
      batchCreatedAt: Date,
    },
    aggregation: {
      isAggregated: { type: Boolean, default: false },
      aggregatedCount: { type: Number, default: 1 },
      lastAggregatedAt: Date,
      relatedNotifications: [{ type: mongoose.Schema.Types.ObjectId, ref: "Notification" }],
    },
    scheduling: {
      scheduledFor: Date,
      isScheduled: { type: Boolean, default: false },
      timezone: String,
      recurring: {
        isRecurring: { type: Boolean, default: false },
        frequency: {
          type: String,
          enum: ["daily", "weekly", "monthly", "custom"],
        },
        interval: Number,
        endDate: Date,
      },
    },
    metadata: {
      ipAddress: String,
      userAgent: String,
      deviceType: String,
      platform: String,
      appVersion: String,
      deliveredAt: Date,
      readAt: Date,
      archivedAt: Date,
      expiresAt: Date,
      source: String,
      campaign: String,
      tags: [String],
      customData: mongoose.Schema.Types.Mixed,
    },
    tracking: {
      isDelivered: { type: Boolean, default: false },
      deliveryAttempts: { type: Number, default: 0 },
      maxRetryAttempts: { type: Number, default: 3 },
      lastAttemptAt: Date,
      failureReason: String,
      deliveryLatency: Number, // in milliseconds
    },
    preferences: {
      canBatch: { type: Boolean, default: true },
      canAggregate: { type: Boolean, default: true },
      respectQuietHours: { type: Boolean, default: true },
      ttl: { type: Number, default: 2592000 }, // 30 days in seconds
    },
    localization: {
      language: { type: String, default: "en" },
      region: String,
      translatedMessage: mongoose.Schema.Types.Mixed,
    },
    createdAt: {
      type: Date,
      default: Date.now,
      index: true,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Compound indexes for performance
notificationSchema.index({ recipient: 1, createdAt: -1 });
notificationSchema.index({ recipient: 1, isRead: 1, createdAt: -1 });
notificationSchema.index({ recipient: 1, type: 1, status: 1 });
notificationSchema.index({ type: 1, priority: 1, createdAt: -1 });
notificationSchema.index({ "scheduling.scheduledFor": 1, "scheduling.isScheduled": 1 });
notificationSchema.index({ "metadata.expiresAt": 1 }, { expireAfterSeconds: 0 });

// Virtual for time since creation
notificationSchema.virtual('timeAgo').get(function() {
  const now = new Date();
  const diff = now - this.createdAt;
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  
  if (days > 0) return `${days}d ago`;
  if (hours > 0) return `${hours}h ago`;
  if (minutes > 0) return `${minutes}m ago`;
  return 'Just now';
});

// Methods
notificationSchema.methods.markAsRead = function() {
  this.isRead = true;
  this.status = 'read';
  this.metadata.readAt = new Date();
  this.analytics.timeToRead = Math.floor((this.metadata.readAt - this.createdAt) / 1000);
  return this.save();
};

notificationSchema.methods.markAsDelivered = function(channel = 'inApp') {
  this.tracking.isDelivered = true;
  this.status = 'delivered';
  this.metadata.deliveredAt = new Date();
  
  if (this.channels[channel]) {
    this.channels[channel].delivered = true;
    this.channels[channel].deliveredAt = new Date();
  }
  
  return this.save();
};

notificationSchema.methods.incrementClick = function() {
  this.analytics.clickCount += 1;
  this.analytics.lastClickedAt = new Date();
  this.analytics.engagementScore = this.analytics.clickCount * 10;
  return this.save();
};

notificationSchema.methods.archive = function() {
  this.status = 'archived';
  this.metadata.archivedAt = new Date();
  return this.save();
};

// Static methods
notificationSchema.statics.getUnreadCount = function(userId) {
  return this.countDocuments({ 
    recipient: userId, 
    isRead: false, 
    status: { $ne: 'archived' } 
  });
};

notificationSchema.statics.markAllAsRead = function(userId) {
  return this.updateMany(
    { recipient: userId, isRead: false },
    { 
      $set: { 
        isRead: true, 
        status: 'read',
        'metadata.readAt': new Date() 
      } 
    }
  );
};

// Pre-save middleware
notificationSchema.pre('save', function(next) {
  if (this.isModified('isRead') && this.isRead && !this.metadata.readAt) {
    this.metadata.readAt = new Date();
    this.status = 'read';
  }
  next();
});

// Export model
module.exports = mongoose.model("Notification", notificationSchema);
