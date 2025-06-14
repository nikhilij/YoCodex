require("dotenv").config();

module.exports = {
   port: process.env.PORT || 3000,
   mongoUri: process.env.MONGO_URI,
   jwtSecret: process.env.JWT_SECRET,
   cloudinary: {
      cloudName: process.env.CLOUDINARY_CLOUD_NAME,
      apiKey: process.env.CLOUDINARY_API_KEY,
      apiSecret: process.env.CLOUDINARY_API_SECRET,
   },
   sendgridApiKey: process.env.SENDGRID_API_KEY,
};
