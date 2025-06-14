const jwt = require("jsonwebtoken");
const User = require("../models/User");

module.exports = async (req, res, next) => {
   const token = req.headers.authorization?.split(" ")[1];
   if (!token) {
      return res.status(401).json({ message: "Not authorized, no token" });
   }
   try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.id).select("-password");
      if (!user) {
         return res.status(401).json({ message: "User not found" });
      }
      req.user = user;
      req.userId = decoded.id;
      next();
   } catch (err) {
      res.status(401).json({ message: "Not authorized, token failed" });
   }
};
