const Joi = require('joi');
const { AppError } = require('./errorHandler');

const validate = (schema) => {
  return (req, res, next) => {
    const { error, value } = schema.validate(req.body, {
      abortEarly: false,
      allowUnknown: false,
      stripUnknown: true
    });

    if (error) {
      const errorMessage = error.details
        .map(detail => detail.message.replace(/"/g, ''))
        .join(', ');
      
      return next(new AppError(errorMessage, 400));
    }

    req.body = value;
    next();
  };
};

const validateParams = (schema) => {
  return (req, res, next) => {
    const { error, value } = schema.validate(req.params);

    if (error) {
      const errorMessage = error.details
        .map(detail => detail.message.replace(/"/g, ''))
        .join(', ');
      
      return next(new AppError(errorMessage, 400));
    }

    req.params = value;
    next();
  };
};

const validateQuery = (schema) => {
  return (req, res, next) => {
    const { error, value } = schema.validate(req.query);

    if (error) {
      const errorMessage = error.details
        .map(detail => detail.message.replace(/"/g, ''))
        .join(', ');
      
      return next(new AppError(errorMessage, 400));
    }

    req.query = value;
    next();
  };
};

module.exports = {
  validate,
  validateParams,
  validateQuery
};
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
