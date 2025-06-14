const mongoose = require("mongoose");

// Comment Schema
const commentSchema = new mongoose.Schema(
   {
      content: {
         type: String,
         required: [true, "Comment content is required"],
         maxlength: [2000, "Comment cannot exceed 2000 characters"],
         trim: true,
      },
      author: {
         type: mongoose.Schema.Types.ObjectId,
         ref: "User",
         required: true,
         index: true,
      },
      post: {
         type: mongoose.Schema.Types.ObjectId,
         ref: "Post",
         required: true,
         index: true,
      },
      parentComment: {
         type: mongoose.Schema.Types.ObjectId,
         ref: "Comment",
         default: null,
         index: true,
      },
      // Thread tracking
      thread: {
         depth: { type: Number, default: 0, max: 5 }, // Limit thread depth
         path: [{ type: mongoose.Schema.Types.ObjectId, ref: "Comment" }],
         rootComment: { type: mongoose.Schema.Types.ObjectId, ref: "Comment" },
      },
      // Engagement
      likes: [
         {
            user: {
               type: mongoose.Schema.Types.ObjectId,
               ref: "User",
               required: true,
            },
            createdAt: {
               type: Date,
               default: Date.now,
            },
         },
      ],
      // Replies count (virtual will be populated)
      repliesCount: { type: Number, default: 0 },
      // Analytics
      analytics: {
         likesCount: { type: Number, default: 0 },
         repliesCount: { type: Number, default: 0 },
         engagementScore: { type: Number, default: 0 },
         averageTimeSpent: { type: Number, default: 0 },
      },
      // Moderation
      moderation: {
         isReported: { type: Boolean, default: false },
         reportCount: { type: Number, default: 0 },
         reports: [
            {
               user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
               reason: String,
               description: String,
               reportedAt: { type: Date, default: Date.now },
            },
         ],
         isHidden: { type: Boolean, default: false },
         hiddenReason: String,
         moderatedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
         moderatedAt: Date,
         moderationNotes: String,
      },
      // Status
      status: {
         type: String,
         enum: ["active", "edited", "deleted", "hidden", "flagged"],
         default: "active",
         index: true,
      },
      // Edit history
      editHistory: [
         {
            content: String,
            editedAt: {
               type: Date,
               default: Date.now,
            },
            reason: String,
         },
      ],
      // Mentions
      mentions: [
         {
            user: {
               type: mongoose.Schema.Types.ObjectId,
               ref: "User",
            },
            username: String,
         },
      ],
      // Metadata
      metadata: {
         ipAddress: String,
         userAgent: String,
         editedAt: Date,
         isEdited: { type: Boolean, default: false },
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

// Indexes for better performance
commentSchema.index({ post: 1, parentComment: 1, createdAt: -1 });
commentSchema.index({ author: 1, createdAt: -1 });
commentSchema.index({ post: 1, status: 1, createdAt: -1 });
commentSchema.index({ "thread.rootComment": 1, "thread.depth": 1 });
commentSchema.index({ "analytics.likesCount": -1 });

// Virtual for replies
commentSchema.virtual("replies", {
   ref: "Comment",
   localField: "_id",
   foreignField: "parentComment",
});

// Virtual for checking if user liked comment
commentSchema.virtual("isLikedBy").get(function () {
   return (userId) => {
      return this.likes.some((like) => like.user.toString() === userId.toString());
   };
});

// Pre-save middleware
commentSchema.pre("save", function (next) {
   // Update analytics
   if (this.isModified("likes")) {
      this.analytics.likesCount = this.likes.length;
   }

   // Handle thread structure
   if (this.parentComment && this.isNew) {
      Comment.findById(this.parentComment)
         .then((parentComment) => {
            if (parentComment) {
               this.thread.depth = parentComment.thread.depth + 1;
               this.thread.path = [...parentComment.thread.path, parentComment._id];
               this.thread.rootComment = parentComment.thread.rootComment || parentComment._id;
            }
            next();
         })
         .catch(next);
   } else if (!this.parentComment) {
      // Root comment
      this.thread.depth = 0;
      this.thread.path = [];
      this.thread.rootComment = this._id;
      next();
   } else {
      next();
   }

   // Track edits
   if (this.isModified("content") && !this.isNew) {
      this.metadata.isEdited = true;
      this.metadata.editedAt = new Date();
      this.status = "edited";
   }

   // Extract mentions
   if (this.isModified("content")) {
      const mentionRegex = /@(\w+)/g;
      const mentions = [];
      let match;

      while ((match = mentionRegex.exec(this.content)) !== null) {
         mentions.push({ username: match[1] });
      }

      this.mentions = mentions;
   }
});

// Post-save middleware to update parent comment replies count
commentSchema.post("save", async function () {
   if (this.parentComment) {
      const Comment = this.constructor;
      const repliesCount = await Comment.countDocuments({
         parentComment: this.parentComment,
         status: { $nin: ["deleted", "hidden"] },
      });

      await Comment.findByIdAndUpdate(this.parentComment, {
         repliesCount,
         "analytics.repliesCount": repliesCount,
      });
   }
});

// Static methods
commentSchema.statics.findByPost = function (postId, options = {}) {
   const { page = 1, limit = 10, sortBy = "createdAt", sortOrder = -1, includeReplies = true } = options;

   const query = {
      post: postId,
      status: { $nin: ["deleted", "hidden"] },
   };

   if (!includeReplies) {
      query.parentComment = null;
   }

   return this.find(query)
      .populate("author", "username avatar")
      .populate("likes.user", "username")
      .sort({ [sortBy]: sortOrder })
      .skip((page - 1) * limit)
      .limit(limit);
};

commentSchema.statics.findReplies = function (commentId, options = {}) {
   const { limit = 5, sortBy = "createdAt", sortOrder = 1 } = options;

   return this.find({
      parentComment: commentId,
      status: { $nin: ["deleted", "hidden"] },
   })
      .populate("author", "username avatar")
      .sort({ [sortBy]: sortOrder })
      .limit(limit);
};

// Instance methods
commentSchema.methods.addLike = function (userId) {
   const existingLike = this.likes.find((like) => like.user.toString() === userId.toString());

   if (!existingLike) {
      this.likes.push({ user: userId });
      this.analytics.likesCount = this.likes.length;
   }

   return this.save();
};

commentSchema.methods.removeLike = function (userId) {
   this.likes = this.likes.filter((like) => like.user.toString() !== userId.toString());
   this.analytics.likesCount = this.likes.length;

   return this.save();
};

commentSchema.methods.addReport = function (userId, reason, description) {
   const existingReport = this.moderation.reports.find((report) => report.user.toString() === userId.toString());

   if (!existingReport) {
      this.moderation.reports.push({ user: userId, reason, description });
      this.moderation.reportCount = this.moderation.reports.length;
      this.moderation.isReported = true;
   }

   return this.save();
};

const Comment = mongoose.model("Comment", commentSchema);
module.exports = Comment;
