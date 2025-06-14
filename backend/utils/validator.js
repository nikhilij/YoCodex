const mongoose = require("mongoose");

// Validate MongoDB ObjectId
exports.validateObjectId = (id) => {
   return mongoose.Types.ObjectId.isValid(id);
};

// Validate email format
exports.validateEmail = (email) => {
   const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
   return emailRegex.test(email);
};

// Validate password strength
exports.validatePassword = (password) => {
   // At least 8 characters, 1 uppercase, 1 lowercase, 1 number
   const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/;
   return passwordRegex.test(password);
};

// Validate username format
exports.validateUsername = (username) => {
   // 3-20 characters, alphanumeric and underscores only
   const usernameRegex = /^[a-zA-Z0-9_]{3,20}$/;
   return usernameRegex.test(username);
};

// Validate URL format
exports.validateUrl = (url) => {
   try {
      new URL(url);
      return true;
   } catch {
      return false;
   }
};

// Sanitize HTML content
exports.sanitizeHtml = (html) => {
   // Basic HTML sanitization - in production, use a library like DOMPurify
   return html.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "");
};
