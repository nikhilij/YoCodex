const Post = require('../models/Post');
const Category = require('../models/Category');
const Tag = require('../models/Tag');
const cloudinary = require('cloudinary').v2;
const slugify = require('slugify');
const { validateObjectId } = require('../utils/validator');

// Create a new post
exports.createPost = async (req, res, next) => {
  try {
    const { title, content, categories, tags, status, publishDate } = req.body;
    const author = req.user._id; // From auth middleware

    // Validate input
    if (!title || !content) {
      return res.status(400).json({ message: 'Title and content are required' });
    }

    // Generate slug
    const slug = slugify(title, { lower: true, strict: true });

    // Handle media uploads
    let media = [];
    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        const result = await cloudinary.uploader.upload(file.path, {
          folder: 'yocodex/posts',
        });
        media.push({ url: result.secure_url, type: file.mimetype.startsWith('image') ? 'image' : 'video' });
      }
    }

    // Validate categories and tags
    if (categories) {
      for (const catId of categories) {
        if (!validateObjectId(catId) || !(await Category.findById(catId))) {
          return res.status(400).json({ message: 'Invalid category' });
        }
      }
    }
    if (tags) {
      for (const tagId of tags) {
        if (!validateObjectId(tagId) || !(await Tag.findById(tagId))) {
          return res.status(400).json({ message: 'Invalid tag' });
        }
      }
    }

    // Create post
    const post = new Post({
      title,
      content,
      author,
      slug,
      categories,
      tags,
      status,
      publishDate: status === 'scheduled' ? publishDate : null,
      media,
    });

    await post.save();
    res.status(201).json({ message: 'Post created successfully', post });
  } catch (error) {
    next(error);
  }
};

// Get all posts (with filters)
exports.getPosts = async (req, res, next) => {
  try {
    const { category, tag, status, page = 1, limit = 10 } = req.query;
    const query = {};

    if (category) query.categories = category;
    if (tag) query.tags = tag;
    if (status) query.status = status;

    const posts = await Post.find(query)
      .populate('author', 'username avatar')
      .populate('categories', 'name')
      .populate('tags', 'name')
      .skip((page - 1) * limit)
      .limit(Number(limit))
      .sort({ createdAt: -1 });

    const total = await Post.countDocuments(query);

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

// Get a single post by slug
exports.getPostBySlug = async (req, res, next) => {
  try {
    const { slug } = req.params;

    const post = await Post.findOne({ slug })
      .populate('author', 'username avatar')
      .populate('categories', 'name')
      .populate('tags', 'name');

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    res.status(200).json(post);
  } catch (error) {
    next(error);
  }
};

// Update a post
exports.updatePost = async (req, res, next) => {
  try {
    const { postId } = req.params;
    const { title, content, categories, tags, status, publishDate } = req.body;
    const userId = req.user._id;

    // Validate post ID
    if (!validateObjectId(postId)) {
      return res.status(400).json({ message: 'Invalid post ID' });
    }

    // Find post
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    // Check authorization
    if (post.author.toString() !== userId.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    // Update fields
    if (title) {
      post.title = title;
      post.slug = slugify(title, { lower: true, strict: true });
    }
    if (content) post.content = content;
    if (categories) {
      for (const catId of categories) {
        if (!validateObjectId(catId) || !(await Category.findById(catId))) {
          return res.status(400).json({ message: 'Invalid category' });
        }
      }
      post.categories = categories;
    }
    if (tags) {
      for (const tagId of tags) {
        if (!validateObjectId(tagId) || !(await Tag.findById(tagId))) {
          return res.status(400).json({ message: 'Invalid tag' });
        }
      }
      post.tags = tags;
    }
    if (status) post.status = status;
    if (publishDate && status === 'scheduled') post.publishDate = publishDate;

    // Handle media updates
    if (req.files && req.files.length > 0) {
      const media = [];
      for (const file of req.files) {
        const result = await cloudinary.uploader.upload(file.path, {
          folder: 'yocodex/posts',
        });
        media.push({ url: result.secure_url, type: file.mimetype.startsWith('image') ? 'image' : 'video' });
      }
      post.media = media;
    }

    await post.save();
    res.status(200).json({ message: 'Post updated successfully', post });
  } catch (error) {
    next(error);
  }
};

// Delete a post
exports.deletePost = async (req, res, next) => {
  try {
    const { postId } = req.params;
    const userId = req.user._id;

    // Validate post ID
    if (!validateObjectId(postId)) {
      return res.status(400).json({ message: 'Invalid post ID' });
    }

    // Find post
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    // Check authorization
    if (post.author.toString() !== userId.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    // Delete media from Cloudinary
    for (const media of post.media) {
      const publicId = media.url.split('/').pop().split('.')[0];
      await cloudinary.uploader.destroy(`yocodex/posts/${publicId}`);
    }

    await post.remove();
    res.status(200).json({ message: 'Post deleted successfully' });
  } catch (error) {
    next(error);
  }
};

// Like or unlike a post
exports.likePost = async (req, res, next) => {
  try {
    const { postId } = req.params;
    const userId = req.user._id;

    // Validate post ID
    if (!validateObjectId(postId)) {
      return res.status(400).json({ message: 'Invalid post ID' });
    }

    // Find post
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    // Toggle like
    const likeIndex = post.likes.indexOf(userId);
    if (likeIndex === -1) {
      post.likes.push(userId);
    } else {
      post.likes.splice(likeIndex, 1);
    }

    await post.save();
    res.status(200).json({ message: 'Like updated successfully', likes: post.likes });
  } catch (error) {
    next(error);
  }
};