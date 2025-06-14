const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

// User Schema
const userSchema = new mongoose.Schema(
   {
      email: {
         type: String,
         required: [true, "Email is required"],
         unique: true,
         lowercase: true,
         trim: true,
         match: [/^\S+@\S+\.\S+$/, "Please enter a valid email"],
         index: true,
      },
      password: {
         type: String,
         required: [true, "Password is required"],
         minlength: [6, "Password must be at least 6 characters"],
         select: false, // Don't include password in queries by default
      },
      username: {
         type: String,
         required: [true, "Username is required"],
         unique: true,
         trim: true,
         minlength: [3, "Username must be at least 3 characters"],
         maxlength: [20, "Username cannot exceed 20 characters"],
         match: [/^[a-zA-Z0-9_]+$/, "Username can only contain letters, numbers, and underscores"],
         index: true,
      },
      firstName: {
         type: String,
         trim: true,
         maxlength: [50, "First name cannot exceed 50 characters"],
      },
      lastName: {
         type: String,
         trim: true,
         maxlength: [50, "Last name cannot exceed 50 characters"],
      },
      bio: {
         type: String,
         maxlength: [500, "Bio cannot exceed 500 characters"],
         default: "",
         trim: true,
      },
      avatar: {
         type: String,
         default: "https://via.placeholder.com/150",
         validate: {
            validator: function (v) {
               return /^https?:\/\/.+/.test(v);
            },
            message: "Avatar must be a valid URL",
         },
      },
      coverImage: {
         type: String,
         validate: {
            validator: function (v) {
               return !v || /^https?:\/\/.+/.test(v);
            },
            message: "Cover image must be a valid URL",
         },
      },
      location: {
         type: String,
         trim: true,
         maxlength: [100, "Location cannot exceed 100 characters"],
      },
      dateOfBirth: {
         type: Date,
         validate: {
            validator: function (v) {
               return !v || v < new Date();
            },
            message: "Date of birth must be in the past",
         },
      },
      socialLinks: {
         twitter: {
            type: String,
            default: "",
            validate: {
               validator: function (v) {
                  return !v || /^https?:\/\/(www\.)?twitter\.com\//.test(v);
               },
               message: "Invalid Twitter URL",
            },
         },
         github: {
            type: String,
            default: "",
            validate: {
               validator: function (v) {
                  return !v || /^https?:\/\/(www\.)?github\.com\//.test(v);
               },
               message: "Invalid GitHub URL",
            },
         },
         linkedin: {
            type: String,
            default: "",
            validate: {
               validator: function (v) {
                  return !v || /^https?:\/\/(www\.)?linkedin\.com\//.test(v);
               },
               message: "Invalid LinkedIn URL",
            },
         },
         website: {
            type: String,
            default: "",
            validate: {
               validator: function (v) {
                  return !v || /^https?:\/\/.+/.test(v);
               },
               message: "Invalid website URL",
            },
         },
      },
      skills: [
         {
            type: String,
            trim: true,
            maxlength: [30, "Skill name cannot exceed 30 characters"],
         },
      ],
      interests: [
         {
            type: String,
            trim: true,
            maxlength: [30, "Interest cannot exceed 30 characters"],
         },
      ],
      followers: [
         {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
         },
      ],
      following: [
         {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
         },
      ],
      blockedUsers: [
         {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
         },
      ],
      preferences: {
         theme: {
            type: String,
            enum: ["light", "dark", "auto"],
            default: "auto",
         },
         language: {
            type: String,
            default: "en",
            maxlength: [5, "Language code cannot exceed 5 characters"],
         },
         emailNotifications: {
            newFollower: { type: Boolean, default: true },
            newComment: { type: Boolean, default: true },
            newLike: { type: Boolean, default: false },
            newsletter: { type: Boolean, default: false },
         },
         pushNotifications: {
            enabled: { type: Boolean, default: true },
            newFollower: { type: Boolean, default: true },
            newComment: { type: Boolean, default: true },
            newLike: { type: Boolean, default: false },
         },
         privacy: {
            profileVisibility: {
               type: String,
               enum: ["public", "followers", "private"],
               default: "public",
            },
            showEmail: { type: Boolean, default: false },
            showLocation: { type: Boolean, default: true },
         },
      },
      role: {
         type: String,
         enum: ["user", "admin", "moderator", "premium"],
         default: "user",
         index: true,
      },
      subscription: {
         type: {
            type: String,
            enum: ["free", "premium", "pro"],
            default: "free",
         },
         startDate: Date,
         endDate: Date,
         autoRenew: { type: Boolean, default: false },
      },
      verification: {
         isVerified: { type: Boolean, default: false },
         verificationToken: String,
         verificationExpires: Date,
         verifiedAt: Date,
      },
      activity: {
         lastLogin: Date,
         lastActive: Date,
         loginCount: { type: Number, default: 0 },
         ipAddress: String,
         userAgent: String,
         sessionHistory: [
            {
               sessionId: String,
               ipAddress: String,
               userAgent: String,
               loginAt: Date,
               logoutAt: Date,
            },
         ],
      },
      security: {
         passwordResetToken: String,
         passwordResetExpires: Date,
         passwordChangedAt: Date,
         loginAttempts: { type: Number, default: 0 },
         lockUntil: Date,
         twoFactorEnabled: { type: Boolean, default: false },
         twoFactorSecret: String,
         securityQuestions: [
            {
               question: String,
               answerHash: String,
            },
         ],
      },
      metadata: {
         accountCreatedFrom: {
            ipAddress: String,
            userAgent: String,
         },
         lastUpdatedBy: {
            userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
            updatedAt: Date,
         },
      },
      statistics: {
         postsCount: { type: Number, default: 0 },
         commentsCount: { type: Number, default: 0 },
         likesReceived: { type: Number, default: 0 },
         viewsReceived: { type: Number, default: 0 },
         followersCount: { type: Number, default: 0 },
         followingCount: { type: Number, default: 0 },
      },
      status: {
         type: String,
         enum: ["active", "inactive", "suspended", "banned"],
         default: "active",
         index: true,
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
userSchema.index({ email: 1, status: 1 });
userSchema.index({ username: 1, status: 1 });
userSchema.index({ role: 1, status: 1 });
userSchema.index({ createdAt: -1 });
userSchema.index({ "activity.lastActive": -1 });
userSchema.index({ "statistics.followersCount": -1 });

// Virtual for full name
userSchema.virtual("fullName").get(function () {
   if (this.firstName && this.lastName) {
      return `${this.firstName} ${this.lastName}`;
   }
   return this.username;
});

// Virtual for account lock status
userSchema.virtual("isLocked").get(function () {
   return !!(this.security.lockUntil && this.security.lockUntil > Date.now());
});

// Virtual for profile completeness percentage
userSchema.virtual("profileCompleteness").get(function () {
   let completeness = 0;
   const fields = [
      "firstName",
      "lastName",
      "bio",
      "location",
      "avatar",
      "socialLinks.twitter",
      "socialLinks.github",
      "socialLinks.website",
   ];

   fields.forEach((field) => {
      const value = field.includes(".") ? field.split(".").reduce((obj, key) => obj?.[key], this) : this[field];
      if (value && value.trim()) completeness += 100 / fields.length;
   });

   return Math.round(completeness);
});

// Hash password before saving
userSchema.pre("save", async function (next) {
   if (!this.isModified("password")) return next();

   const salt = await bcrypt.genSalt(12);
   this.password = await bcrypt.hash(this.password, salt);

   // Update password changed timestamp
   if (!this.isNew) {
      this.security.passwordChangedAt = new Date();
   }

   next();
});

// Update statistics before saving
userSchema.pre("save", function (next) {
   if (this.isModified("followers")) {
      this.statistics.followersCount = this.followers.length;
   }
   if (this.isModified("following")) {
      this.statistics.followingCount = this.following.length;
   }
   next();
});

// Method to compare password
userSchema.methods.matchPassword = async function (enteredPassword) {
   return await bcrypt.compare(enteredPassword, this.password);
};

// Method to check if password was changed after JWT was issued
userSchema.methods.changedPasswordAfter = function (JWTTimestamp) {
   if (this.security.passwordChangedAt) {
      const changedTimestamp = parseInt(this.security.passwordChangedAt.getTime() / 1000, 10);
      return JWTTimestamp < changedTimestamp;
   }
   return false;
};

module.exports = mongoose.model("User", userSchema);
