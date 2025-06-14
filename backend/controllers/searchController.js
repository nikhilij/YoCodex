const Post = require('../models/Post');
const User = require('../models/User');
const Category = require('../models/Category');
const Tag = require('../models/Tag');
const { validateObjectId } = require('../utils/validator');

// Global search across posts, users, and categories
exports.globalSearch = async (req, res, next) => {
    try {
        const { q: query, type, page = 1, limit = 10 } = req.query;

        if (!query || query.trim().length < 2) {
            return res.status(400).json({ message: 'Search query must be at least 2 characters long' });
        }

        const pageNum = parseInt(page);
        const limitNum = parseInt(limit);
        const skip = (pageNum - 1) * limitNum;

        const searchRegex = new RegExp(query.trim(), 'i');
        const results = {};

        // Search posts if no type specified or type is 'posts'
        if (!type || type === 'posts') {
            const postQuery = {
                $or: [
                    { title: searchRegex },
                    { content: searchRegex },
                    { excerpt: searchRegex }
                ],
                status: 'published'
            };

            const posts = await Post.find(postQuery)
                .populate('author', 'username profileImage')
                .populate('category', 'name slug')
                .populate('tags', 'name')
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limitNum);

            const totalPosts = await Post.countDocuments(postQuery);
            
            results.posts = {
                data: posts,
                total: totalPosts,
                page: pageNum,
                pages: Math.ceil(totalPosts / limitNum)
            };
        }

        // Search users if no type specified or type is 'users'
        if (!type || type === 'users') {
            const userQuery = {
                $or: [
                    { username: searchRegex },
                    { firstName: searchRegex },
                    { lastName: searchRegex },
                    { bio: searchRegex }
                ]
            };

            const users = await User.find(userQuery)
                .select('username firstName lastName profileImage bio createdAt')
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limitNum);

            const totalUsers = await User.countDocuments(userQuery);
            
            results.users = {
                data: users,
                total: totalUsers,
                page: pageNum,
                pages: Math.ceil(totalUsers / limitNum)
            };
        }

        // Search categories if no type specified or type is 'categories'
        if (!type || type === 'categories') {
            const categoryQuery = {
                $or: [
                    { name: searchRegex },
                    { description: searchRegex }
                ]
            };

            const categories = await Category.find(categoryQuery)
                .sort({ name: 1 })
                .skip(skip)
                .limit(limitNum);

            const totalCategories = await Category.countDocuments(categoryQuery);
            
            results.categories = {
                data: categories,
                total: totalCategories,
                page: pageNum,
                pages: Math.ceil(totalCategories / limitNum)
            };
        }

        res.status(200).json({
            query,
            results,
            totalResults: Object.values(results).reduce((sum, category) => sum + category.total, 0)
        });
    } catch (error) {
        next(error);
    }
};

// Search posts only
exports.searchPosts = async (req, res, next) => {
    try {
        const { q: query, category, tags, author, page = 1, limit = 10, sortBy = 'createdAt' } = req.query;

        if (!query || query.trim().length < 2) {
            return res.status(400).json({ message: 'Search query must be at least 2 characters long' });
        }

        const pageNum = parseInt(page);
        const limitNum = parseInt(limit);
        const skip = (pageNum - 1) * limitNum;

        const searchRegex = new RegExp(query.trim(), 'i');
        const searchQuery = {
            $or: [
                { title: searchRegex },
                { content: searchRegex },
                { excerpt: searchRegex }
            ],
            status: 'published'
        };

        // Add filters
        if (category && validateObjectId(category)) {
            searchQuery.category = category;
        }

        if (tags) {
            const tagArray = Array.isArray(tags) ? tags : [tags];
            const validTags = tagArray.filter(tag => validateObjectId(tag));
            if (validTags.length > 0) {
                searchQuery.tags = { $in: validTags };
            }
        }

        if (author && validateObjectId(author)) {
            searchQuery.author = author;
        }

        // Sort options
        const sortOptions = {};
        switch (sortBy) {
            case 'views':
                sortOptions.views = -1;
                break;
            case 'likes':
                sortOptions.likesCount = -1;
                break;
            case 'comments':
                sortOptions.commentsCount = -1;
                break;
            default:
                sortOptions.createdAt = -1;
        }

        const posts = await Post.find(searchQuery)
            .populate('author', 'username profileImage')
            .populate('category', 'name slug')
            .populate('tags', 'name')
            .sort(sortOptions)
            .skip(skip)
            .limit(limitNum);

        const total = await Post.countDocuments(searchQuery);

        res.status(200).json({
            query,
            posts,
            total,
            page: pageNum,
            pages: Math.ceil(total / limitNum)
        });
    } catch (error) {
        next(error);
    }
};

// Search users
exports.searchUsers = async (req, res, next) => {
    try {
        const { q: query, page = 1, limit = 10 } = req.query;

        if (!query || query.trim().length < 2) {
            return res.status(400).json({ message: 'Search query must be at least 2 characters long' });
        }

        const pageNum = parseInt(page);
        const limitNum = parseInt(limit);
        const skip = (pageNum - 1) * limitNum;

        const searchRegex = new RegExp(query.trim(), 'i');
        const searchQuery = {
            $or: [
                { username: searchRegex },
                { firstName: searchRegex },
                { lastName: searchRegex },
                { bio: searchRegex }
            ]
        };

        const users = await User.find(searchQuery)
            .select('username firstName lastName profileImage bio createdAt followersCount followingCount')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limitNum);

        const total = await User.countDocuments(searchQuery);

        res.status(200).json({
            query,
            users,
            total,
            page: pageNum,
            pages: Math.ceil(total / limitNum)
        });
    } catch (error) {
        next(error);
    }
};

// Get search suggestions
exports.getSearchSuggestions = async (req, res, next) => {
    try {
        const { q: query } = req.query;

        if (!query || query.trim().length < 2) {
            return res.status(200).json({ suggestions: [] });
        }

        const searchRegex = new RegExp(query.trim(), 'i');

        // Get post title suggestions
        const postSuggestions = await Post.find(
            { title: searchRegex, status: 'published' },
            'title'
        ).limit(5);

        // Get user suggestions
        const userSuggestions = await User.find(
            { username: searchRegex },
            'username'
        ).limit(5);

        // Get category suggestions
        const categorySuggestions = await Category.find(
            { name: searchRegex },
            'name'
        ).limit(3);

        // Get tag suggestions
        const tagSuggestions = await Tag.find(
            { name: searchRegex },
            'name'
        ).limit(5);

        const suggestions = [
            ...postSuggestions.map(post => ({ type: 'post', text: post.title, id: post._id })),
            ...userSuggestions.map(user => ({ type: 'user', text: user.username, id: user._id })),
            ...categorySuggestions.map(cat => ({ type: 'category', text: cat.name, id: cat._id })),
            ...tagSuggestions.map(tag => ({ type: 'tag', text: tag.name, id: tag._id }))
        ];

        res.status(200).json({ suggestions: suggestions.slice(0, 10) });
    } catch (error) {
        next(error);
    }
};

// Get trending searches (you might want to implement search analytics)
exports.getTrendingSearches = async (req, res, next) => {
    try {
        // This would typically come from a search analytics collection
        // For now, return popular categories and tags
        const popularCategories = await Category.find({})
            .sort({ postsCount: -1 })
            .limit(5)
            .select('name slug');

        const popularTags = await Tag.find({})
            .sort({ postsCount: -1 })
            .limit(10)
            .select('name');

        res.status(200).json({
            categories: popularCategories,
            tags: popularTags
        });
    } catch (error) {
        next(error);
    }
};