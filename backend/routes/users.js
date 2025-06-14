const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const auth = require("../middleware/auth");

router.get("/me", auth, userController.getUserProfile);
router.get("/:username", userController.getUserByUsername);
router.put("/me", auth, userController.updateUserProfile);
router.post("/:userId/follow", auth, userController.followUser);
router.post("/:userId/unfollow", auth, userController.unfollowUser);
router.get("/:userId/posts", userController.getUserPosts);

module.exports = router;
