const { body, param, query, validationResult } = require("express-validator");
const { validateObjectId, validateEmail, validatePassword, validateUsername } = require("../utils/validator");
const Logger = require("../utils/logger");

// Handle validation errors
const handleValidationErrors = (req, res, next) => {
   const errors = validationResult(req);
   if (!errors.isEmpty()) {
      Logger.warn("Validation failed", {
         requestId: req.requestId,
         errors: errors.array(),
         body: req.body,
         params: req.params,
         query: req.query,
      });

      return res.status(400).json({
         error: "Validation failed",
         details: errors.array().map((error) => ({
            field: error.param,
            message: error.msg,
            value: error.value,
         })),
      });
   }
   next();
};

// Validation rules
const validationRules = {
   // Auth validation
   register: [
      body("username")
         .trim()
         .isLength({ min: 3, max: 20 })
         .withMessage("Username must be between 3 and 20 characters")
         .matches(/^[a-zA-Z0-9_]+$/)
         .withMessage("Username can only contain letters, numbers, and underscores"),
      body("email").trim().isEmail().normalizeEmail().withMessage("Please provide a valid email"),
      body("password")
         .isLength({ min: 8 })
         .withMessage("Password must be at least 8 characters long")
         .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
         .withMessage("Password must contain at least one uppercase letter, one lowercase letter, and one number"),
      handleValidationErrors,
   ],

   login: [
      body("email").trim().isEmail().normalizeEmail().withMessage("Please provide a valid email"),
      body("password").notEmpty().withMessage("Password is required"),
      handleValidationErrors,
   ],

   // Post validation
   createPost: [
      body("title").trim().isLength({ min: 1, max: 100 }).withMessage("Title must be between 1 and 100 characters"),
      body("content")
         .trim()
         .isLength({ min: 1, max: 50000 })
         .withMessage("Content must be between 1 and 50000 characters"),
      body("categories").optional().isArray().withMessage("Categories must be an array"),
      body("categories.*")
         .optional()
         .custom((value) => validateObjectId(value))
         .withMessage("Invalid category ID"),
      body("tags").optional().isArray().withMessage("Tags must be an array"),
      body("tags.*")
         .optional()
         .custom((value) => validateObjectId(value))
         .withMessage("Invalid tag ID"),
      body("status")
         .optional()
         .isIn(["draft", "published", "scheduled"])
         .withMessage("Status must be draft, published, or scheduled"),
      handleValidationErrors,
   ],

   // Comment validation
   createComment: [
      body("content").trim().isLength({ min: 1, max: 500 }).withMessage("Comment must be between 1 and 500 characters"),
      body("postId")
         .custom((value) => validateObjectId(value))
         .withMessage("Invalid post ID"),
      body("parentComment")
         .optional()
         .custom((value) => validateObjectId(value))
         .withMessage("Invalid parent comment ID"),
      handleValidationErrors,
   ],

   // User validation
   updateProfile: [
      body("bio").optional().trim().isLength({ max: 200 }).withMessage("Bio cannot exceed 200 characters"),
      body("socialLinks.twitter").optional().trim().isURL().withMessage("Invalid Twitter URL"),
      body("socialLinks.github").optional().trim().isURL().withMessage("Invalid GitHub URL"),
      body("socialLinks.website").optional().trim().isURL().withMessage("Invalid website URL"),
      handleValidationErrors,
   ],

   // Parameter validation
   objectId: [
      param("id")
         .custom((value) => validateObjectId(value))
         .withMessage("Invalid ID format"),
      handleValidationErrors,
   ],

   // Pagination validation
   pagination: [
      query("page").optional().isInt({ min: 1 }).withMessage("Page must be a positive integer"),
      query("limit").optional().isInt({ min: 1, max: 100 }).withMessage("Limit must be between 1 and 100"),
      handleValidationErrors,
   ],

   // Search validation
   search: [
      query("q").trim().isLength({ min: 2, max: 100 }).withMessage("Search query must be between 2 and 100 characters"),
      query("type")
         .optional()
         .isIn(["posts", "users", "categories"])
         .withMessage("Search type must be posts, users, or categories"),
      handleValidationErrors,
   ],
};

module.exports = validationRules;
