const express = require("express");
const router = express.Router();
const commentController = require("../controllers/commentController");
const auth = require("../middleware/auth");

router.post("/", auth, commentController.createComment);
router.get("/:postId", commentController.getPostComments);
router.delete("/:commentId", auth, commentController.deleteComment);
router.put("/:commentId", auth, commentController.updateComment);

module.exports = router;
