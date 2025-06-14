const express = require("express");
const router = express.Router();
const adminController = require("../controllers/adminController");
const admin = require("../middleware/admin");
const auth = require("../middleware/auth");

// Example admin routes (customize as needed)
router.get("/users", auth, admin, adminController.getAllUsers);
router.delete("/user/:userId", auth, admin, adminController.deleteUser);
router.get("/posts", auth, admin, adminController.getAllPosts);
router.delete("/post/:postId", auth, admin, adminController.deletePost);

module.exports = router;
