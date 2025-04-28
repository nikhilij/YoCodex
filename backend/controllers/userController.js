const User = require('../models/User');
const Notification = require('../models/Notification');
const cloudinary = require('cloudinary').v2;
const { validateObjectId } = require('../utils/validator');
const { generateNotificationMessage } = require('../services/notification');

// Get authenticated user's profile
exports.getUserProfile = async (req, res, next) => {
  try {
    const userId = req.user._id; // From auth middleware

    const user = await User.findById(userId)
      .select('-password') // Exclude password
      .populate('followers', 'username avatar')
      .populate('following', 'username avatar');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json(user);
  } catch (error) {
    next(error);
  }
};

// Get another user's profile by username
exports.getUserByUsername = async (req, res, next) => {
  try {
    const { username } = req.params;

    const user = await User.findOne({ username })
      .select('-password')
      .populate('followers', 'username avatar')
      .populate('following', 'username avatar');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json(user);
  } catch (error) {
    next(error);
  }
};

// Update user profile
exports.updateUserProfile = async (req, res, next) => {
  try {
    const userId = req.user._id; // From auth middleware
    const { bio, socialLinks } = req.body;

    // Find user
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Update fields
    if (bio) user.bio = bio;
    if (socialLinks) {
      user.socialLinks = {
        twitter: socialLinks.twitter || user.socialLinks.twitter,
        github: socialLinks.github || user.socialLinks.github,
        website: socialLinks.website || user.socialLinks.website,
      };
    }

    // Handle avatar upload
    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: 'yocodex/avatars',
      });
      user.avatar = result.secure_url;
    }

    await user.save();
    res.status(200).json({
      message: 'Profile updated successfully',
      user: await User.findById(userId).select('-password'),
    });
  } catch (error) {
    next(error);
  }
};

// Follow a user
exports.followUser = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const currentUserId = req.user._id; // From auth middleware

    // Validate user ID
    if (!validateObjectId(userId)) {
      return res.status(400).json({ message: 'Invalid user ID' });
    }

    // Prevent self-follow
    if (userId === currentUserId.toString()) {
      return res.status(400).json({ message: 'Cannot follow yourself' });
    }

    // Find users
    const targetUser = await User.findById(userId);
    const currentUser = await User.findById(currentUserId);

    if (!targetUser || !currentUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if already following
    if (currentUser.following.includes(userId)) {
      return res.status(400).json({ message: 'Already following this user' });
    }

    // Update followers and following
    currentUser.following.push(userId);
    targetUser.followers.push(currentUserId);

    await currentUser.save();
    await targetUser.save();

    // Create follow notification
    const notification = new Notification({
      recipient: userId,
      sender: currentUserId,
      type: 'follow',
      message: generateNotificationMessage({
        type: 'follow',
        senderUsername: currentUser.username,
      }),
    });
    await notification.save();

    res.status(200).json({ message: 'Successfully followed user' });
  } catch (error) {
    next(error);
  }
};

// Unfollow a user
exports.unfollowUser = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const currentUserId = req.user._id; // From auth middleware

    // Validate user ID
    if (!validateObjectId(userId)) {
      return res.status(400).json({ message: 'Invalid user ID' });
    }

    // Prevent self-unfollow
    if (userId === currentUserId.toString()) {
      return res.status(400).json({ message: 'Cannot unfollow yourself' });
    }

    // Find users
    const targetUser = await User.findById(userId);
    const currentUser = await User.findById(currentUserId);

    if (!targetUser || !currentUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if following
    if (!currentUser.following.includes(userId)) {
      return res.status(400).json({ message: 'Not following this user' });
    }

    // Remove from followers and following
    currentUser.following = currentUser.following.filter(
      (id) => id.toString() !== userId
    );
    targetUser.followers = targetUser.followers.filter(
      (id) => id.toString() !== currentUserId
    );

    await currentUser.save();
    await targetUser.save();

    res.status(200).json({ message: 'Successfully unfollowed user' });
  } catch (error) {
    next(error);
  }
};

// Get user's posts
exports.getUserPosts = async (req, res, next) => {
  try {
    const { username } = req.params;
    const { page = 1, limit = 10 } = req.query;

    // Find user
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Fetch user's posts
    const posts = await Post.find({ author: user._id, status: 'published' })
      .populate('categories', 'name')
      .populate('tags', 'name')
      .skip((page - 1) * limit)
      .limit(Number(limit))
      .sort({ createdAt: -1 });

    const total = await Post.countDocuments({ author: user._id, status: 'published' });

    res.status(200).json({
      posts,
      total,
      page: Number(page),
      pages: Math.ceil(total / limit),
    });
  } catch (error) {
    next(error);
  }
};