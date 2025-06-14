const crypto = require("crypto");

// Generate random string
exports.generateRandomString = (length = 32) => {
   return crypto.randomBytes(length).toString("hex");
};

// Generate slug from text
exports.generateSlug = (text) => {
   return text
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, "")
      .replace(/[\s_-]+/g, "-")
      .replace(/^-+|-+$/g, "");
};

// Paginate results
exports.getPaginationData = (page, limit, total) => {
   const currentPage = parseInt(page) || 1;
   const itemsPerPage = parseInt(limit) || 10;
   const totalPages = Math.ceil(total / itemsPerPage);
   const hasNextPage = currentPage < totalPages;
   const hasPrevPage = currentPage > 1;

   return {
      page: currentPage,
      limit: itemsPerPage,
      total,
      totalPages,
      hasNextPage,
      hasPrevPage,
      nextPage: hasNextPage ? currentPage + 1 : null,
      prevPage: hasPrevPage ? currentPage - 1 : null,
   };
};

// Calculate reading time
exports.calculateReadingTime = (content) => {
   const wordsPerMinute = 200;
   const words = content.trim().split(/\s+/).length;
   const readingTime = Math.ceil(words / wordsPerMinute);
   return readingTime;
};

// Format file size
exports.formatFileSize = (bytes) => {
   if (bytes === 0) return "0 Bytes";
   const k = 1024;
   const sizes = ["Bytes", "KB", "MB", "GB"];
   const i = Math.floor(Math.log(bytes) / Math.log(k));
   return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
};

// Debounce function
exports.debounce = (func, wait) => {
   let timeout;
   return function executedFunction(...args) {
      const later = () => {
         clearTimeout(timeout);
         func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
   };
};
