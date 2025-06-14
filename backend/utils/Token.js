// this util will be used to generate and verify JWT tokens

const JWT = require("jsonwebtoken");
const dotenv = require("dotenv").config();

exports.generateToken = (userId) => {
   return JWT.sign({ id: userId }, process.env.JWT_SECRET, {
      expiresIn: "7d", // Changed from '1hr' to '7d' for better UX
   });
};

exports.verifyToken = (token) => {
   try {
      return JWT.verify(token, process.env.JWT_SECRET);
   } catch (error) {
      throw new Error("Invalid or expired token");
   }
};

exports.generateRefreshToken = (userId) => {
   return JWT.sign({ id: userId, type: "refresh" }, process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET, {
      expiresIn: "30d",
   });
};
