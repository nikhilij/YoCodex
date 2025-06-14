const mongoose = require("mongoose");

// Post Schema
const postSchema = new mongoose.Schema(
   {
      title: {
         type: String,
         required: [true, "Title is required"],
         trim: true,
         maxlength: [200, "Title cannot exceed 200 characters"],
         index: "text",
      },
      slug: {
         type: String,
         required: true,
         unique: true,
         lowercase: true,
         trim: true,
         index: true,
      },
      content: {
         type: String,
         required: [true, "Content is required"],
         maxlength: [100000, "Content cannot exceed 100000 characters"],
      },
      excerpt: {
         type: String,
         maxlength: [500, "Excerpt cannot exceed 500 characters"],
         trim: true,
      },
      author: {
         type: mongoose.Schema.Types.ObjectId,
         ref: "User",
         required: true,
         index: true,
      },
      categories: [
         {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Category",
            index: true,
         },
      ],
      tags: [
         {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Tag",
            index: true,
         },
      ],
      status: {
         type: String,
         enum: ["draft", "published", "scheduled", "archived", "deleted"],
         default: "draft",
         index: true,
      },
      visibility: {
         type: String,
         enum: ["public", "private", "unlisted", "followers-only"],
         default: "public",
         index: true,
      },
      publishDate: {
         type: Date,
         default: null,
         index: true,
      },
      scheduledDate: {
         type: Date,
         default: null,
      },
      featuredImage: {
         url: String,
         alt: String,
         caption: String,
      },
      media: [
         {
            url: {
               type: String,
               required: true,
               validate: {
                  validator: function (v) {
                     return /^https?:\/\/.+/.test(v);
                  },
                  message: "Media URL must be valid",
               },
            },
            type: {
               type: String,
               enum: ["image", "video", "audio", "document"],
               required: true,
            },
            size: Number,
            duration: Number, // for video/audio
            alt: String,
            caption: String,
         },
      ],
      seo: {
         metaTitle: {
            type: String,
            maxlength: [60, "Meta title cannot exceed 60 characters"],
         },
         metaDescription: {
            type: String,
            maxlength: [160, "Meta description cannot exceed 160 characters"],
         },
         keywords: [String],
         canonicalUrl: String,
      },
      readingTime: {
         type: Number,
         default: 0,
      },
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
      bookmarks: [
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
      views: [
         {
            user: {
               type: mongoose.Schema.Types.ObjectId,
               ref: "User",
            },
            ipAddress: String,
            userAgent: String,
            viewedAt: {
               type: Date,
               default: Date.now,
            },
         },
      ],
      shares: [
         {
            platform: {
               type: String,
               enum: ["twitter", "facebook", "linkedin", "reddit", "email", "copy-link"],
            },
            sharedAt: {
               type: Date,
               default: Date.now,
            },
         },
      ],
      analytics: {
         viewsCount: { type: Number, default: 0 },
         uniqueViewsCount: { type: Number, default: 0 },
         likesCount: { type: Number, default: 0 },
         commentsCount: { type: Number, default: 0 },
         sharesCount: { type: Number, default: 0 },
         bookmarksCount: { type: Number, default: 0 },
         avgReadingTime: { type: Number, default: 0 },
         engagementRate: { type: Number, default: 0 },
         bounceRate: { type: Number, default: 0 },
         timeSpent: { type: Number, default: 0 }, // Total time spent by users
         lastViewedAt: Date,
      },
      engagement: {
         engagementRate: { type: Number, default: 0 },
         bounceRate: { type: Number, default: 0 },
         lastEngagementAt: Date,
         reactions: [
            {
               type: { type: String, enum: ["like", "love", "clap", "insightful"] },
               user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
               createdAt: { type: Date, default: Date.now },
            },
         ],
      },
      moderation: {
         isReported: { type: Boolean, default: false },
         reportCount: { type: Number, default: 0 },
         reports: [
            {
               user: {
                  type: mongoose.Schema.Types.ObjectId,
                  ref: "User",
               },
               reason: {
                  type: String,
                  enum: ["spam", "harassment", "hate-speech", "inappropriate", "copyright", "other"],
               },
               description: String,
               reportedAt: {
                  type: Date,
                  default: Date.now,
               },
            },
         ],
         moderatedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
         },
         moderatedAt: Date,
         moderationNotes: String,
      },
      settings: {
         allowComments: { type: Boolean, default: true },
         allowSharing: { type: Boolean, default: true },
         notifyOnComment: { type: Boolean, default: true },
         notifyOnLike: { type: Boolean, default: false },
      },
      series: {
         name: String,
         part: Number,
         totalParts: Number,
         previousPost: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Post",
         },
         nextPost: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Post",
         },
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
      publishedAt: Date,
      archivedAt: Date,
   },
   {
      timestamps: true,
      toJSON: { virtuals: true },
      toObject: { virtuals: true },
   }
);

// Compound indexes for better query performance
postSchema.index({ status: 1, publishDate: -1 });
postSchema.index({ author: 1, status: 1, createdAt: -1 });
postSchema.index({ categories: 1, status: 1, publishDate: -1 });
postSchema.index({ tags: 1, status: 1, publishDate: -1 });
postSchema.index({ "analytics.viewsCount": -1, status: 1 });
postSchema.index({ "analytics.likesCount": -1, status: 1 });
postSchema.index({ createdAt: -1, status: 1 });

// Text index for search
postSchema.index({
   title: "text",
   content: "text",
   excerpt: "text",
   "seo.keywords": "text",
});

// Virtual for like count
postSchema.virtual("likesCount").get(function () {
   return this.likes ? this.likes.length : 0;
});

// Virtual for comment count (will be populated from Comment model)
postSchema.virtual("commentsCount", {
   ref: "Comment",
   localField: "_id",
   foreignField: "post",
   count: true,
});

// Virtual for reading time calculation
postSchema.virtual("estimatedReadingTime").get(function () {
   if (this.readingTime) return this.readingTime;

   const wordsPerMinute = 200;
   const words = this.content ? this.content.trim().split(/\s+/).length : 0;
   return Math.ceil(words / wordsPerMinute) || 1;
});

// Virtual for engagement score
postSchema.virtual("engagementScore").get(function () {
   const views = this.analytics.viewsCount || 0;
   const likes = this.analytics.likesCount || 0;
   const comments = this.analytics.commentsCount || 0;
   const shares = this.analytics.sharesCount || 0;

   if (views === 0) return 0;

   return (((likes * 2 + comments * 3 + shares * 4) / views) * 100).toFixed(2);
});

// Pre-save middleware
postSchema.pre("save", function (next) {
   // Calculate reading time
   if (this.isModified("content")) {
      const wordsPerMinute = 200;
      const words = this.content.trim().split(/\s+/).length;
      this.readingTime = Math.ceil(words / wordsPerMinute) || 1;
   }

   // Generate excerpt if not provided
   if (this.isModified("content") && !this.excerpt) {
      const plainText = this.content.replace(/<[^>]*>/g, "");
      this.excerpt = plainText.substring(0, 200) + (plainText.length > 200 ? "..." : "");
   }

   // Update analytics counts
   if (this.isModified("likes")) {
      this.analytics.likesCount = this.likes.length;
   }

   // Set published date
   if (this.isModified("status") && this.status === "published" && !this.publishedAt) {
      this.publishedAt = new Date();
      this.publishDate = this.publishDate || new Date();
   }

   // Update SEO fields
   if (this.isModified("title") && !this.seo.metaTitle) {
      this.seo.metaTitle = this.title.substring(0, 60);
   }

   if (this.isModified("excerpt") && !this.seo.metaDescription) {
      this.seo.metaDescription = this.excerpt.substring(0, 160);
   }

   next();
});

// Static methods
postSchema.statics.findPublished = function () {
   return this.find({
      status: "published",
      publishDate: { $lte: new Date() },
   });
};

postSchema.statics.findByTag = function (tagId) {
   return this.find({
      tags: tagId,
      status: "published",
      publishDate: { $lte: new Date() },
   });
};

postSchema.statics.findByCategory = function (categoryId) {
   return this.find({
      categories: categoryId,
      status: "published",
      publishDate: { $lte: new Date() },
   });
};

// Instance methods
postSchema.methods.incrementView = function (userId, ipAddress, userAgent) {
   // Check if user or IP already viewed recently (within last hour)
   const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
   const existingView = this.views.find(
      (view) =>
         (userId && view.user && view.user.toString() === userId.toString()) ||
         (view.ipAddress === ipAddress && view.viewedAt > oneHourAgo)
   );

   if (!existingView) {
      this.views.push({ user: userId, ipAddress, userAgent });
      this.analytics.viewsCount = this.views.length;

      // Calculate unique views
      const uniqueViews = new Set();
      this.views.forEach((view) => {
         if (view.user) {
            uniqueViews.add(view.user.toString());
         } else {
            uniqueViews.add(view.ipAddress);
         }
      });
      this.analytics.uniqueViewsCount = uniqueViews.size;
   }

   return this.save();
};

module.exports = mongoose.model("Post", postSchema);
