const express = require("express");
const router = express.Router();
const searchController = require("../controllers/searchController");

router.get("/global", searchController.globalSearch);
router.get("/posts", searchController.searchPosts);
router.get("/users", searchController.searchUsers);
router.get("/suggestions", searchController.getSearchSuggestions);
router.get("/trending", searchController.getTrendingSearches);

module.exports = router;
