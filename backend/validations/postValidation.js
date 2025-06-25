const Joi = require("joi");

const createPostSchema = Joi.object({
   title: Joi.string().min(5).max(200).required().messages({
      "string.min": "Title must be at least 5 characters long",
      "string.max": "Title cannot exceed 200 characters",
      "any.required": "Title is required",
   }),

   content: Joi.string().min(50).max(100000).required().messages({
      "string.min": "Content must be at least 50 characters long",
      "string.max": "Content cannot exceed 100,000 characters",
      "any.required": "Content is required",
   }),

   excerpt: Joi.string().max(500).optional(),

   categories: Joi.array()
      .items(Joi.string().regex(/^[0-9a-fA-F]{24}$/))
      .min(1)
      .max(5)
      .required()
      .messages({
         "array.min": "At least one category is required",
         "array.max": "Maximum 5 categories allowed",
      }),

   tags: Joi.array()
      .items(Joi.string().regex(/^[0-9a-fA-F]{24}$/))
      .max(10)
      .optional(),

   status: Joi.string().valid("draft", "published", "scheduled").default("draft"),

   visibility: Joi.string().valid("public", "private", "unlisted", "followers-only").default("public"),

   scheduledDate: Joi.date().min("now").when("status", {
      is: "scheduled",
      then: Joi.required(),
      otherwise: Joi.optional(),
   }),

   featuredImage: Joi.object({
      url: Joi.string().uri().required(),
      alt: Joi.string().max(200).optional(),
      caption: Joi.string().max(300).optional(),
   }).optional(),

   seo: Joi.object({
      metaTitle: Joi.string().max(60).optional(),
      metaDescription: Joi.string().max(160).optional(),
      keywords: Joi.array().items(Joi.string().max(50)).max(10).optional(),
   }).optional(),
});

const updatePostSchema = Joi.object({
   title: Joi.string().min(5).max(200).optional(),
   content: Joi.string().min(50).max(100000).optional(),
   excerpt: Joi.string().max(500).optional(),
   categories: Joi.array()
      .items(Joi.string().regex(/^[0-9a-fA-F]{24}$/))
      .min(1)
      .max(5)
      .optional(),
   tags: Joi.array()
      .items(Joi.string().regex(/^[0-9a-fA-F]{24}$/))
      .max(10)
      .optional(),
   status: Joi.string().valid("draft", "published", "scheduled", "archived").optional(),
   visibility: Joi.string().valid("public", "private", "unlisted", "followers-only").optional(),
   featuredImage: Joi.object({
      url: Joi.string().uri().required(),
      alt: Joi.string().max(200).optional(),
      caption: Joi.string().max(300).optional(),
   }).optional(),
   seo: Joi.object({
      metaTitle: Joi.string().max(60).optional(),
      metaDescription: Joi.string().max(160).optional(),
      keywords: Joi.array().items(Joi.string().max(50)).max(10).optional(),
   }).optional(),
});

const postParamsSchema = Joi.object({
   id: Joi.string()
      .regex(/^[0-9a-fA-F]{24}$/)
      .required()
      .messages({
         "string.pattern.base": "Invalid post ID format",
      }),
});

const postQuerySchema = Joi.object({
   page: Joi.number().integer().min(1).default(1),
   limit: Joi.number().integer().min(1).max(100).default(10),
   sort: Joi.string().valid("createdAt", "-createdAt", "title", "-title", "likes", "-likes").default("-createdAt"),
   status: Joi.string().valid("draft", "published", "scheduled", "archived").optional(),
   category: Joi.string()
      .regex(/^[0-9a-fA-F]{24}$/)
      .optional(),
   tag: Joi.string()
      .regex(/^[0-9a-fA-F]{24}$/)
      .optional(),
   author: Joi.string()
      .regex(/^[0-9a-fA-F]{24}$/)
      .optional(),
   search: Joi.string().max(100).optional(),
});

module.exports = {
   createPostSchema,
   updatePostSchema,
   postParamsSchema,
   postQuerySchema,
};
