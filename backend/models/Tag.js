const mongoose = require("mongoose");

// Tag Schema
const tagSchema = new mongoose.Schema(
   {
      name: {
         type: String,
         required: [true, "Tag name is required"],
         unique: true,
         trim: true,
         lowercase: true,
         maxlength: [50, "Tag name cannot exceed 50 characters"],
         minlength: [2, "Tag name must be at least 2 characters"],
         index: true,
      },
      slug: {
         type: String,
         required: true,
         unique: true,
         lowercase: true,
         trim: true,
         index: true,
      },
      description: {
         type: String,
         maxlength: [200, "Description cannot exceed 200 characters"],
         trim: true,
      },
      // Visual
      color: {
         type: String,
         validate: {
            validator: function (v) {
               return !v || /^#[0-9A-F]{6}$/i.test(v);
            },
            message: "Color must be a valid hex color",
         },
         default: "#3B82F6",
      },
      // Analytics
      statistics: {
         postsCount: { type: Number, default: 0 },
         totalViews: { type: Number, default: 0 },
         totalLikes: { type: Number, default: 0 },
         followersCount: { type: Number, default: 0 },
         usageCount: { type: Number, default: 0 },
         trending: { type: Boolean, default: false },
         averageEngagementRate: { type: Number, default: 0 },
      },
      // Followers
      followers: [
         {
            user: {
               type: mongoose.Schema.Types.ObjectId,
               ref: "User",
            },
            followedAt: {
               type: Date,
               default: Date.now,
            },
         },
      ],
      // Related tags
      relatedTags: [
         {
            tag: {
               type: mongoose.Schema.Types.ObjectId,
               ref: "Tag",
            },
            strength: {
               type: Number,
               min: 0,
               max: 1,
               default: 0,
            },
         },
      ],
      // Synonyms and aliases
      synonyms: [
         {
            type: String,
            trim: true,
            lowercase: true,
         },
      ],
      // Category association
      category: {
         type: mongoose.Schema.Types.ObjectId,
         ref: "Category",
      },
      // Settings
      settings: {
         isActive: { type: Boolean, default: true },
         isFeatured: { type: Boolean, default: false },
         isApproved: { type: Boolean, default: true },
         requiresModeration: { type: Boolean, default: false },
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
         moderatedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
         moderatedAt: Date,
         moderationNotes: String,
      },
      // Metadata
      createdBy: {
         type: mongoose.Schema.Types.ObjectId,
         ref: "User",
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
      lastUsedAt: {
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

// Indexes
tagSchema.index({ name: 1, "settings.isActive": 1 });
tagSchema.index({ "statistics.postsCount": -1 });
tagSchema.index({ "statistics.usageCount": -1 });
tagSchema.index({ "statistics.trending": 1, "settings.isActive": 1 });
tagSchema.index({ category: 1, "settings.isActive": 1 });
tagSchema.index({ createdAt: -1 });

// Virtual for posts count
tagSchema.virtual("postsCount", {
   ref: "Post",
   localField: "_id",
   foreignField: "tags",
   count: true,
});

// Virtual for popularity score
tagSchema.virtual("popularityScore").get(function () {
   const posts = this.statistics.postsCount || 0;
   const views = this.statistics.totalViews || 0;
   const followers = this.statistics.followersCount || 0;
   const usage = this.statistics.usageCount || 0;

   // Calculate weighted popularity score
   return posts * 2 + views * 0.01 + followers * 5 + usage * 1.5;
});

// Pre-save middleware
tagSchema.pre("save", function (next) {
   // Update last used timestamp when usage count changes
   if (this.isModified("statistics.usageCount")) {
      this.lastUsedAt = new Date();
   }

   // Check trending status based on recent activity
   const now = new Date();
   const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

   if (this.lastUsedAt > sevenDaysAgo && this.statistics.usageCount > 10) {
      this.statistics.trending = true;
   } else if (this.lastUsedAt < sevenDaysAgo) {
      this.statistics.trending = false;
   }

   next();
});

// Static methods
tagSchema.statics.findActive = function () {
   return this.find({ "settings.isActive": true });
};

tagSchema.statics.findTrending = function (limit = 10) {
   return this.find({
      "statistics.trending": true,
      "settings.isActive": true,
   })
      .sort({ "statistics.usageCount": -1 })
      .limit(limit);
};

tagSchema.statics.findPopular = function (limit = 20) {
   return this.find({ "settings.isActive": true })
      .sort({ "statistics.postsCount": -1, "statistics.usageCount": -1 })
      .limit(limit);
};

tagSchema.statics.findByCategory = function (categoryId) {
   return this.find({
      category: categoryId,
      "settings.isActive": true,
   }).sort({ name: 1 });
};

tagSchema.statics.searchTags = function (query, limit = 10) {
   const regex = new RegExp(query, "i");
   return this.find({
      $or: [{ name: regex }, { synonyms: regex }, { description: regex }],
      "settings.isActive": true,
   })
      .sort({ "statistics.postsCount": -1 })
      .limit(limit);
};

tagSchema.statics.getTagCloud = async function (limit = 50) {
   const tags = await this.find({ "settings.isActive": true })
      .sort({ "statistics.postsCount": -1 })
      .limit(limit)
      .select("name statistics.postsCount color");

   // Calculate relative sizes for tag cloud
   const maxCount = Math.max(...tags.map((tag) => tag.statistics.postsCount));
   const minCount = Math.min(...tags.map((tag) => tag.statistics.postsCount));
   const range = maxCount - minCount || 1;

   return tags.map((tag) => ({
      ...tag.toObject(),
      size: Math.round(((tag.statistics.postsCount - minCount) / range) * 4) + 1, // Size 1-5
   }));
};

// Instance methods
tagSchema.methods.addFollower = function (userId) {
   const existingFollower = this.followers.find((f) => f.user.toString() === userId.toString());

   if (!existingFollower) {
      this.followers.push({ user: userId });
      this.statistics.followersCount = this.followers.length;
   }

   return this.save();
};

tagSchema.methods.removeFollower = function (userId) {
   this.followers = this.followers.filter((f) => f.user.toString() !== userId.toString());
   this.statistics.followersCount = this.followers.length;

   return this.save();
};

tagSchema.methods.incrementUsage = function () {
   this.statistics.usageCount += 1;
   this.lastUsedAt = new Date();
   return this.save();
};

tagSchema.methods.addRelatedTag = function (tagId, strength = 0.5) {
   const existing = this.relatedTags.find((rt) => rt.tag.toString() === tagId.toString());

   if (existing) {
      existing.strength = Math.min(existing.strength + 0.1, 1);
   } else {
      this.relatedTags.push({ tag: tagId, strength });
   }

   return this.save();
};

tagSchema.methods.getRelatedTags = function (limit = 5) {
   return this.constructor
      .find({
         _id: { $in: this.relatedTags.map((rt) => rt.tag) },
         "settings.isActive": true,
      })
      .sort({ "statistics.postsCount": -1 })
      .limit(limit);
};

module.exports = mongoose.model("Tag", tagSchema);
