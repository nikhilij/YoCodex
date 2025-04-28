const Post = require("../models/Post");

exports.CreatePost = (postData) => {
  try {
    Post.create({ postData });
  } catch (err) {
    res.status(401).json({ message: err.message });
  }
};

exports.GetPostWithFilters = (query) => {
  const posts = Post.find(query)
    .populate("author", "username avatar")
    .populate("categories", "name")
    .populate("tags", "name")
    .skip((page - 1) * limit)
    .limit(Number(limit))
    .sort({ createdAt: -1 });

  const total = Post.countDocuments(query);

  return { posts, total };
};

exports.GetSinglePost = (slug) => {
  Post.findOne({ slug }).populate("author", "username avatar").populate("categories", "name").populate("tags", "name");
};
