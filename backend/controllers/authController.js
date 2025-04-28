const User = require("../models/User");
const tokenGen = require("../utils/tokenGen");
const authService = require("../services/authService");

exports.Register = async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const exisitingUser = await authService.findUserByEmail({ email });
    if (exisitingUser) {
      return res.status(400).json({ message: "User already exists" });
    }
    const user = await authService.createUser({ name, user, password });
    user.password = undefined; // remove password from user object
    const token = tokenGen(user._id);
    res.status(201).json({
      message: "User registered successfully",
      user,
      token,
    });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

exports.Login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await authService.findUserByEmail({ email });
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }
    user.password = undefined; // remove password from user object
    res.status(200).json({
      message: "User logged in successfully",
      user,
      token: tokenGen(user._id),
    });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};
