const Post = require("../models/Post");

exports.CreatePost = async (postData) => {
   try {
      return await Post.create(postData);
   } catch (err) {
      throw new Error(err.message);
   }
};

exports.GetPostWithFilters = async (query, page = 1, limit = 10) => {
   try {
      const posts = await Post.find(query)
         .populate("author", "username avatar")
         .populate("categories", "name")
         .populate("tags", "name")
         .skip((page - 1) * limit)
         .limit(Number(limit))
         .sort({ createdAt: -1 });

      const total = await Post.countDocuments(query);

      return { posts, total };
   } catch (err) {
      throw new Error(err.message);
   }
};

exports.GetSinglePost = async (slug) => {
   try {
      return await Post.findOne({ slug })
         .populate("author", "username avatar")
         .populate("categories", "name")
         .populate("tags", "name");
   } catch (err) {
      throw new Error(err.message);
   }
};
