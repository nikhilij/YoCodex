const User = require("../models/User");
const Post = require("../models/Post");
const Comment = require("../models/Comment");
const Category = require("../models/Category");
const Tag = require("../models/Tag");
const Notification = require("../models/Notification");
const { validateObjectId } = require("../utils/validator");
const Logger = require("../utils/logger");

// Get all users with pagination
exports.getAllUsers = async (req, res, next) => {
   try {
      const { page = 1, limit = 20, search, role } = req.query;
      const pageNum = parseInt(page);
      const limitNum = parseInt(limit);
      const skip = (pageNum - 1) * limitNum;

      const query = {};
      if (search) {
         query.$or = [{ username: new RegExp(search, "i") }, { email: new RegExp(search, "i") }];
      }
      if (role) {
         query.role = role;
      }

      const users = await User.find(query)
         .select("-password")
         .populate("followers", "username")
         .populate("following", "username")
         .sort({ createdAt: -1 })
         .skip(skip)
         .limit(limitNum);

      const total = await User.countDocuments(query);

      res.status(200).json({
         users,
         total,
         page: pageNum,
         pages: Math.ceil(total / limitNum),
      });
   } catch (error) {
      next(error);
   }
};

// Delete a user
exports.deleteUser = async (req, res, next) => {
   try {
      const { userId } = req.params;

      if (!validateObjectId(userId)) {
         return res.status(400).json({ message: "Invalid user ID" });
      }

      const user = await User.findById(userId);
      if (!user) {
         return res.status(404).json({ message: "User not found" });
      }

      // Prevent self-deletion
      if (userId === req.user._id.toString()) {
         return res.status(400).json({ message: "Cannot delete your own account" });
      }

      // Delete user's posts, comments, and notifications
      await Post.deleteMany({ author: userId });
      await Comment.deleteMany({ author: userId });
      await Notification.deleteMany({ $or: [{ sender: userId }, { recipient: userId }] });

      // Remove user from followers/following lists
      await User.updateMany({ followers: userId }, { $pull: { followers: userId } });
      await User.updateMany({ following: userId }, { $pull: { following: userId } });

      await User.findByIdAndDelete(userId);

      Logger.info(`User deleted by admin`, {
         deletedUserId: userId,
         adminId: req.user._id,
      });

      res.status(200).json({ message: "User deleted successfully" });
   } catch (error) {
      next(error);
   }
};

// Get all posts with pagination
exports.getAllPosts = async (req, res, next) => {
   try {
      const { page = 1, limit = 20, status, search } = req.query;
      const pageNum = parseInt(page);
      const limitNum = parseInt(limit);
      const skip = (pageNum - 1) * limitNum;

      const query = {};
      if (status) {
         query.status = status;
      }
      if (search) {
         query.$or = [{ title: new RegExp(search, "i") }, { content: new RegExp(search, "i") }];
      }

      const posts = await Post.find(query)
         .populate("author", "username email")
         .populate("categories", "name")
         .populate("tags", "name")
         .sort({ createdAt: -1 })
         .skip(skip)
         .limit(limitNum);

      const total = await Post.countDocuments(query);

      res.status(200).json({
         posts,
         total,
         page: pageNum,
         pages: Math.ceil(total / limitNum),
      });
   } catch (error) {
      next(error);
   }
};

// Delete a post
exports.deletePost = async (req, res, next) => {
   try {
      const { postId } = req.params;

      if (!validateObjectId(postId)) {
         return res.status(400).json({ message: "Invalid post ID" });
      }

      const post = await Post.findById(postId);
      if (!post) {
         return res.status(404).json({ message: "Post not found" });
      }

      // Delete related comments and notifications
      await Comment.deleteMany({ post: postId });
      await Notification.deleteMany({ post: postId });

      await Post.findByIdAndDelete(postId);

      Logger.info(`Post deleted by admin`, {
         deletedPostId: postId,
         adminId: req.user._id,
      });

      res.status(200).json({ message: "Post deleted successfully" });
   } catch (error) {
      next(error);
   }
};

// Get dashboard statistics
exports.getDashboardStats = async (req, res, next) => {
   try {
      const totalUsers = await User.countDocuments();
      const totalPosts = await Post.countDocuments();
      const totalComments = await Comment.countDocuments();
      const publishedPosts = await Post.countDocuments({ status: "published" });
      const draftPosts = await Post.countDocuments({ status: "draft" });

      // Recent activity
      const recentUsers = await User.find({}).select("username createdAt").sort({ createdAt: -1 }).limit(5);

      const recentPosts = await Post.find({})
         .populate("author", "username")
         .select("title author createdAt status")
         .sort({ createdAt: -1 })
         .limit(5);

      res.status(200).json({
         stats: {
            totalUsers,
            totalPosts,
            totalComments,
            publishedPosts,
            draftPosts,
         },
         recentActivity: {
            recentUsers,
            recentPosts,
         },
      });
   } catch (error) {
      next(error);
   }
};

// Update user role
exports.updateUserRole = async (req, res, next) => {
   try {
      const { userId } = req.params;
      const { role } = req.body;

      if (!validateObjectId(userId)) {
         return res.status(400).json({ message: "Invalid user ID" });
      }

      const validRoles = ["user", "admin", "moderator"];
      if (!validRoles.includes(role)) {
         return res.status(400).json({ message: "Invalid role" });
      }

      const user = await User.findById(userId);
      if (!user) {
         return res.status(404).json({ message: "User not found" });
      }

      // Prevent changing own role
      if (userId === req.user._id.toString()) {
         return res.status(400).json({ message: "Cannot change your own role" });
      }

      user.role = role;
      await user.save();

      Logger.info(`User role updated by admin`, {
         userId,
         newRole: role,
         adminId: req.user._id,
      });

      res.status(200).json({
         message: "User role updated successfully",
         user: { _id: user._id, username: user.username, role: user.role },
      });
   } catch (error) {
      next(error);
   }
};

// Get system logs (simplified version)
exports.getSystemLogs = async (req, res, next) => {
   try {
      const { page = 1, limit = 50, level } = req.query;

      // In a real application, you'd query your logging system
      // For now, return a placeholder response
      res.status(200).json({
         logs: [],
         message: "Logging system integration needed",
         total: 0,
         page: parseInt(page),
         pages: 0,
      });
   } catch (error) {
      next(error);
   }
};
