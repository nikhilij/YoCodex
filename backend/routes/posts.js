const express = require("express");
const router = express.Router();
const postController = require("../controllers/postController");
const auth = require("../middleware/auth");

router.post("/", auth, postController.createPost);
router.get("/", postController.getPosts);
router.get("/:slug", postController.getPostBySlug);
router.put("/:slug", auth, postController.updatePost);
router.delete("/:slug", auth, postController.deletePost);
router.post("/:slug/like", auth, postController.likePost);

module.exports = router;
