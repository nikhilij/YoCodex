const Comment = require('../models/Comment');
const Post = require('../models/Post');
const User = require('../models/User');
const Notification = require('../models/Notification');
const { validateObjectId } = require('../utils/validator');
const { createNotification, generateNotificationMessage } = require('../services/notification');

// Create a new comment
exports.createComment = async (req, res, next) => {
  try {
    const { postId, content, parentComment } = req.body;
    const userId = req.user._id; // From auth middleware

    // Validate inputs
    if (!validateObjectId(postId)) {
      return res.status(400).json({ message: 'Invalid post ID' });
    }
    if (!content) {
      return res.status(400).json({ message: 'Comment content is required' });
    }
    if (parentComment && !validateObjectId(parentComment)) {
      return res.status(400).json({ message: 'Invalid parent comment ID' });
    }

    // Check if post exists
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    // Check if parent comment exists (if provided)
    if (parentComment) {
      const parent = await Comment.findById(parentComment);
      if (!parent || parent.post.toString() !== postId) {
        return res.status(400).json({ message: 'Invalid parent comment' });
      }
    }

    // Create comment
    const comment = new Comment({
      content,
      author: userId,
      post: postId,
      parentComment: parentComment || null,
    });

    await comment.save();

    // Create notification for post author (if not self-commenting)
    const postAuthor = await User.findById(post.author);
    if (postAuthor && post.author.toString() !== userId.toString()) {
      const notification = await createNotification({
        recipient: post.author,
        sender: userId,
        type: 'comment',
        post: postId,
        comment: comment._id,
        message: generateNotificationMessage({
          type: 'comment',
          senderUsername: req.user.username,
          postTitle: post.title,
          commentContent: content,
        }),
      });
      // Emit WebSocket event (assuming Socket.IO is set up)
      // io.to(post.author.toString()).emit('newNotification', notification);
    }

    res.status(201).json({ message: 'Comment created successfully', comment });
  } catch (error) {
    next(error);
  }
};

// Get comments for a post
exports.getPostComments = async (req, res, next) => {
  try {
    const { postId } = req.params;
    const { page = 1, limit = 10 } = req.query;

    // Validate post ID
    if (!validateObjectId(postId)) {
      return res.status(400).json({ message: 'Invalid post ID' });
    }

    // Check if post exists
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    // Fetch comments (top-level only, no parentComment)
    const comments = await Comment.find({ post: postId, parentComment: null })
      .populate('author', 'username avatar')
      .populate({
        path: 'parentComment',
        populate: { path: 'author', select: 'username avatar' },
      })
      .skip((page - 1) * limit)
      .limit(Number(limit))
      .sort({ createdAt: -1 });

    const total = await Comment.countDocuments({ post: postId, parentComment: null });

    res.status(200).json({
      comments,
      total,
      page: Number(page),
      pages: Math.ceil(total / limit),
    });
  } catch (error) {
    next(error);
  }
};

// Get replies for a comment
exports.getCommentReplies = async (req, res, next) => {
  try {
    const { commentId } = req.params;
    const { page = 1, limit = 10 } = req.query;

    // Validate comment ID
    if (!validateObjectId(commentId)) {
      return res.status(400).json({ message: 'Invalid comment ID' });
    }

    // Check if comment exists
    const parentComment = await Comment.findById(commentId);
    if (!parentComment) {
      return res.status(404).json({ message: 'Comment not found' });
    }

    // Fetch replies
    const replies = await Comment.find({ parentComment: commentId })
      .populate('author', 'username avatar')
      .skip((page - 1) * limit)
      .limit(Number(limit))
      .sort({ createdAt: -1 });

    const total = await Comment.countDocuments({ parentComment: commentId });

    res.status(200).json({
      replies,
      total,
      page: Number(page),
      pages: Math.ceil(total / limit),
    });
  } catch (error) {
    next(error);
  }
};

// Update a comment
exports.updateComment = async (req, res, next) => {
  try {
    const { commentId } = req.params;
    const { content } = req.body;
    const userId = req.user._id; // From auth middleware

    // Validate inputs
    if (!validateObjectId(commentId)) {
      return res.status(400).json({ message: 'Invalid comment ID' });
    }
    if (!content) {
      return res.status(400).json({ message: 'Comment content is required' });
    }

    // Find comment
    const comment = await Comment.findById(commentId);
    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' });
    }

    // Check authorization
    if (comment.author.toString() !== userId.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    // Update comment
    comment.content = content;
    await comment.save();

    res.status(200).json({ message: 'Comment updated successfully', comment });
  } catch (error) {
    next(error);
  }
};

// Delete a comment
exports.deleteComment = async (req, res, next) => {
  try {
    const { commentId } = req.params;
    const userId = req.user._id; // From auth middleware

    // Validate comment ID
    if (!validateObjectId(commentId)) {
      return res.status(400).json({ message: 'Invalid comment ID' });
    }

    // Find comment
    const comment = await Comment.findById(commentId);
    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' });
    }

    // Check authorization
    if (comment.author.toString() !== userId.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    // Delete comment and its replies
    await Comment.deleteMany({ $or: [{ _id: commentId }, { parentComment: commentId }] });

    res.status(200).json({ message: 'Comment deleted successfully' });
  } catch (error) {
    next(error);
  }
};

// Like or unlike a comment
exports.likeComment = async (req, res, next) => {
  try {
    const { commentId } = req.params;
    const userId = req.user._id; // From auth middleware

    // Validate comment ID
    if (!validateObjectId(commentId)) {
      return res.status(400).json({ message: 'Invalid comment ID' });
    }

    // Find comment
    const comment = await Comment.findById(commentId);
    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' });
    }

    // Toggle like
    const likeIndex = comment.likes.indexOf(userId);
    let notification;
    if (likeIndex === -1) {
      comment.likes.push(userId);
      // Create notification for comment author (if not self-liking)
      if (comment.author.toString() !== userId.toString()) {
        const post = await Post.findById(comment.post);
        notification = await createNotification({
          recipient: comment.author,
          sender: userId,
          type: 'like',
          post: comment.post,
          comment: comment._id,
          message: generateNotificationMessage({
            type: 'like',
            senderUsername: req.user.username,
            postTitle: post.title,
          }),
        });
      }
    } else {
      comment.likes.splice(likeIndex, 1);
    }

    await comment.save();

    res.status(200).json({
      message: 'Like updated successfully',
      likes: comment.likes,
      notification,
    });
  } catch (error) {
    next(error);
  }
};