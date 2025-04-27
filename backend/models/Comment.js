const mongoose = require("mongoose");

// Comment Schema
const commentSchema = new mongoose.Schema({
  content: {
    type: String,
    required: [true, "Comment content is required"],
    maxlength: [500, "Comment cannot exceed 500 characters"],
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  post: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Post",
    required: true,
  },
  parentComment: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Comment",
    default: null, // For nested comments
  },
  likes: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Export model
module.exports = mongoose.model("Comment", commentSchema);
