const User = require("../models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require('dotenv').config()

/**
 * Hash password
 * @param {string} password
 * @returns {string} hashedPassword
 */
const hashPassword = async (password) => {
  const salt = await bcrypt.genSalt(10); // Generate salt
  return bcrypt.hash(password, salt); // Hash the password with salt
};

/**
 * Validate input fields
 */
const validateInput = (fields) => {
  for (const key in fields) {
    if (!fields[key] || fields[key].trim() === "") {
      throw new Error(`${key} is required`);
    }
  }
};

/**
 * User Registration
 */
exports.registerUser = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Validate input
    validateInput({ username, email, password });

    // Check if user already exists
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Create new user with hashed password
    const hashedPassword = await hashPassword(password);
    user = new User({
      username,
      email,
      password: hashedPassword,
    });

    await user.save();

    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    console.error("Registration error:", error.message); // Log error for debugging
    res.status(500).json({ message: error.message || "Server error" });
  }
};

/**
 * User Login
 */
exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate input
    validateInput({ email, password });

    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Generate JWT token
    const accessToken = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "15m", // Short-lived access token
    });

    // Optional: Implement refresh tokens for long-term sessions
    const refreshToken = jwt.sign(
      { userId: user._id },
      process.env.JWT_REFRESH_SECRET,
      {
        expiresIn: "7d", // Long-lived refresh token
      }
    );

    // Send tokens in response
    res.status(200).json({
      message: "Login successful",
      accessToken,
      refreshToken, // Optional
    });
  } catch (error) {
    console.error("Login error:", error.message); // Log error for debugging
    res.status(500).json({ message: error.message || "Server error" });
  }
};

/**
 * Middleware to verify the JWT token
 */
exports.verifyToken = (req, res, next) => {
  const token = req.header("Authorization")?.split(" ")[1]; // Extract token from "Bearer TOKEN"

  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.userId;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};
