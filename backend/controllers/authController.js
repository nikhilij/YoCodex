const User = require("../models/User");
const tokenGen = require("../utils/tokenGen");

exports.Register = async (req, res) => {
  const { name, email, password, phoneNumber, address } = req.body;
  try {
    const exisitingUser = await User.findOne({ email });
    if (exisitingUser) {
      return res.status(400).json({ message: "User already exists" });
    }
    const user = await User.create({
      name,
      email,
      password,
      phoneNumber,
      address,
    });
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
    const user = await User.findOne({ email });
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
