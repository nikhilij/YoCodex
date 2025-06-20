const Joi = require("joi");

const userRegistrationSchema = Joi.object({
   email: Joi.string().email().required().messages({
      "string.email": "Please provide a valid email address",
      "any.required": "Email is required",
   }),

   password: Joi.string()
      .min(8)
      .pattern(new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])"))
      .required()
      .messages({
         "string.min": "Password must be at least 8 characters long",
         "string.pattern.base":
            "Password must contain at least one lowercase letter, one uppercase letter, one number, and one special character",
         "any.required": "Password is required",
      }),

   username: Joi.string().alphanum().min(3).max(20).required().messages({
      "string.alphanum": "Username must only contain alphanumeric characters",
      "string.min": "Username must be at least 3 characters long",
      "string.max": "Username cannot exceed 20 characters",
      "any.required": "Username is required",
   }),

   firstName: Joi.string().min(2).max(50).optional(),

   lastName: Joi.string().min(2).max(50).optional(),
});

const userLoginSchema = Joi.object({
   email: Joi.string().email().required(),

   password: Joi.string().required(),
});

const userUpdateSchema = Joi.object({
   firstName: Joi.string().min(2).max(50).optional(),
   lastName: Joi.string().min(2).max(50).optional(),
   bio: Joi.string().max(500).optional(),
   location: Joi.string().max(100).optional(),
   dateOfBirth: Joi.date().max("now").optional(),
   socialLinks: Joi.object({
      twitter: Joi.string().uri().optional().allow(""),
      github: Joi.string().uri().optional().allow(""),
      linkedin: Joi.string().uri().optional().allow(""),
      website: Joi.string().uri().optional().allow(""),
   }).optional(),
   skills: Joi.array().items(Joi.string().max(30)).max(20).optional(),
   interests: Joi.array().items(Joi.string().max(30)).max(20).optional(),
});

const passwordChangeSchema = Joi.object({
   currentPassword: Joi.string().required(),
   newPassword: Joi.string()
      .min(8)
      .pattern(new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])"))
      .required(),
   confirmPassword: Joi.string().valid(Joi.ref("newPassword")).required().messages({
      "any.only": "Passwords do not match",
   }),
});

module.exports = {
   userRegistrationSchema,
   userLoginSchema,
   userUpdateSchema,
   passwordChangeSchema,
};
