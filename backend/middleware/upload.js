const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, "../uploads");
if (!fs.existsSync(uploadsDir)) {
   fs.mkdirSync(uploadsDir, { recursive: true });
}

// Configure storage
const storage = multer.diskStorage({
   destination: (req, file, cb) => {
      cb(null, uploadsDir);
   },
   filename: (req, file, cb) => {
      const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
      cb(null, file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname));
   },
});

// File filter
const fileFilter = (req, file, cb) => {
   const allowedTypes = ["image/jpeg", "image/png", "image/gif", "image/webp", "video/mp4", "video/webm"];

   if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
   } else {
      cb(new Error("Invalid file type. Only images and videos are allowed."), false);
   }
};

// Configure multer
const upload = multer({
   storage,
   fileFilter,
   limits: {
      fileSize: 10 * 1024 * 1024, // 10MB limit
   },
});

// Single file upload
exports.uploadSingle = (fieldName) => upload.single(fieldName);

// Multiple files upload
exports.uploadMultiple = (fieldName, maxCount = 5) => upload.array(fieldName, maxCount);

// Upload fields
exports.uploadFields = (fields) => upload.fields(fields);

// Error handler for multer
exports.handleUploadError = (error, req, res, next) => {
   if (error instanceof multer.MulterError) {
      if (error.code === "LIMIT_FILE_SIZE") {
         return res.status(400).json({ message: "File too large. Maximum size is 10MB." });
      }
      if (error.code === "LIMIT_FILE_COUNT") {
         return res.status(400).json({ message: "Too many files. Maximum is 5 files." });
      }
      return res.status(400).json({ message: error.message });
   }

   if (error.message === "Invalid file type. Only images and videos are allowed.") {
      return res.status(400).json({ message: error.message });
   }

   next(error);
};
