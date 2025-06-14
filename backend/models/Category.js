const mongoose = require("mongoose");

// Category Schema
const categorySchema = new mongoose.Schema(
   {
      name: {
         type: String,
         required: [true, "Category name is required"],
         unique: true,
         trim: true,
         maxlength: [100, "Category name cannot exceed 100 characters"],
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
         maxlength: [500, "Description cannot exceed 500 characters"],
         trim: true,
      },
      // Hierarchy support
      parent: {
         type: mongoose.Schema.Types.ObjectId,
         ref: "Category",
         default: null,
         index: true,
      },
      children: [
         {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Category",
         },
      ],
      level: {
         type: Number,
         default: 0,
         min: 0,
         max: 3, // Limit category depth
      },
      path: [
         {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Category",
         },
      ],
      // Visual elements
      icon: {
         type: String,
         validate: {
            validator: function (v) {
               return !v || /^[\w-]+$/.test(v); // Icon class name
            },
            message: "Invalid icon format",
         },
      },
      color: {
         type: String,
         validate: {
            validator: function (v) {
               return !v || /^#[0-9A-F]{6}$/i.test(v);
            },
            message: "Color must be a valid hex color",
         },
      },
      image: {
         type: String,
         validate: {
            validator: function (v) {
               return !v || /^https?:\/\/.+/.test(v);
            },
            message: "Image must be a valid URL",
         },
      },
      // SEO
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
      },
      // Analytics
      statistics: {
         postsCount: { type: Number, default: 0 },
         totalViews: { type: Number, default: 0 },
         totalLikes: { type: Number, default: 0 },
         followersCount: { type: Number, default: 0 },
         averageEngagementRate: { type: Number, default: 0 },
         trendingScore: { type: Number, default: 0 },
      },
      // Followers (users who follow this category)
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
      // Settings
      settings: {
         isActive: { type: Boolean, default: true },
         isFeatured: { type: Boolean, default: false },
         allowPosts: { type: Boolean, default: true },
         requireApproval: { type: Boolean, default: false },
      },
      // Moderation
      moderation: {
         moderators: [
            {
               type: mongoose.Schema.Types.ObjectId,
               ref: "User",
            },
         ],
         rules: [
            {
               title: String,
               description: String,
            },
         ],
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
      // Timestamps
      createdAt: {
         type: Date,
         default: Date.now,
         index: true,
      },
      updatedAt: {
         type: Date,
         default: Date.now,
      },
      // Metadata
      createdBy: {
         type: mongoose.Schema.Types.ObjectId,
         ref: "User",
      },
      lastModifiedBy: {
         type: mongoose.Schema.Types.ObjectId,
         ref: "User",
      },
   },
   {
      timestamps: true,
      toJSON: { virtuals: true },
      toObject: { virtuals: true },
   }
);

// Indexes
categorySchema.index({ name: 1, parent: 1 });
categorySchema.index({ slug: 1, "settings.isActive": 1 });
categorySchema.index({ parent: 1, level: 1 });
categorySchema.index({ "statistics.postsCount": -1 });
categorySchema.index({ "settings.isFeatured": 1, "settings.isActive": 1 });

// Virtual for posts count
categorySchema.virtual("postsCount", {
   ref: "Post",
   localField: "_id",
   foreignField: "categories",
   count: true,
});

// Virtual for full path string
categorySchema.virtual("fullPath").get(function () {
   return (
      this.path.map((cat) => cat.name || cat.toString()).join(" > ") + (this.path.length > 0 ? " > " : "") + this.name
   );
});

// Pre-save middleware
categorySchema.pre("save", async function (next) {
   // Handle hierarchy
   if (this.parent && this.isModified("parent")) {
      try {
         const Category = this.constructor;
         const parent = await Category.findById(this.parent);

         if (parent) {
            this.level = parent.level + 1;
            this.path = [...parent.path, parent._id];

            // Prevent circular references
            if (this.path.includes(this._id)) {
               throw new Error("Circular reference detected in category hierarchy");
            }

            // Add to parent's children if not already there
            if (!parent.children.includes(this._id)) {
               parent.children.push(this._id);
               await parent.save();
            }
         }
      } catch (error) {
         return next(error);
      }
   } else if (!this.parent) {
      this.level = 0;
      this.path = [];
   }

   // Auto-generate SEO fields
   if (this.isModified("name") && !this.seo.metaTitle) {
      this.seo.metaTitle = this.name;
   }

   if (this.isModified("description") && !this.seo.metaDescription) {
      this.seo.metaDescription = this.description;
   }

   next();
});

// Post-remove middleware to clean up references
categorySchema.pre("remove", async function (next) {
   const Category = this.constructor;

   // Remove from parent's children array
   if (this.parent) {
      await Category.findByIdAndUpdate(this.parent, { $pull: { children: this._id } });
   }

   // Update children to have no parent
   await Category.updateMany({ parent: this._id }, { $unset: { parent: 1 }, level: 0, path: [] });

   next();
});

// Static methods
categorySchema.statics.findActive = function () {
   return this.find({ "settings.isActive": true });
};

categorySchema.statics.findFeatured = function () {
   return this.find({
      "settings.isFeatured": true,
      "settings.isActive": true,
   });
};

categorySchema.statics.findRootCategories = function () {
   return this.find({
      parent: null,
      "settings.isActive": true,
   }).sort({ name: 1 });
};

categorySchema.statics.findByLevel = function (level) {
   return this.find({
      level,
      "settings.isActive": true,
   });
};

categorySchema.statics.getHierarchy = async function () {
   const categories = await this.find({ "settings.isActive": true }).populate("children").sort({ level: 1, name: 1 });

   const hierarchy = [];
   const categoryMap = new Map();

   // Create map for quick lookup
   categories.forEach((cat) => categoryMap.set(cat._id.toString(), { ...cat.toObject(), children: [] }));

   // Build hierarchy
   categories.forEach((cat) => {
      if (!cat.parent) {
         hierarchy.push(categoryMap.get(cat._id.toString()));
      } else {
         const parent = categoryMap.get(cat.parent.toString());
         if (parent) {
            parent.children.push(categoryMap.get(cat._id.toString()));
         }
      }
   });

   return hierarchy;
};

// Instance methods
categorySchema.methods.addFollower = function (userId) {
   const existingFollower = this.followers.find((f) => f.user.toString() === userId.toString());

   if (!existingFollower) {
      this.followers.push({ user: userId });
      this.statistics.followersCount = this.followers.length;
   }

   return this.save();
};

categorySchema.methods.removeFollower = function (userId) {
   this.followers = this.followers.filter((f) => f.user.toString() !== userId.toString());
   this.statistics.followersCount = this.followers.length;

   return this.save();
};

categorySchema.methods.getAncestors = async function () {
   const Category = this.constructor;
   const ancestors = [];

   for (const ancestorId of this.path) {
      const ancestor = await Category.findById(ancestorId);
      if (ancestor) ancestors.push(ancestor);
   }

   return ancestors;
};

categorySchema.methods.getDescendants = async function () {
   const Category = this.constructor;

   const findDescendants = async (parentId) => {
      const children = await Category.find({ parent: parentId });
      let descendants = [...children];

      for (const child of children) {
         const childDescendants = await findDescendants(child._id);
         descendants = descendants.concat(childDescendants);
      }

      return descendants;
   };

   return await findDescendants(this._id);
};

// Export model
module.exports = mongoose.model("Category", categorySchema);
