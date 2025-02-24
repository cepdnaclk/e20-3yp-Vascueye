// auth.js
const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { body, validationResult } = require("express-validator");
const User = require("../models/User");

const router = express.Router();

const generateToken = (user) => {
  return jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET || "default_secret",
    { expiresIn: process.env.JWT_EXPIRES_IN || "24h" }
  );
};

// ========================== SIGNUP ==========================
router.post(
  "/signup",
  [
    body("name").notEmpty().withMessage("Name is required"),
    body("email").isEmail().withMessage("Enter a valid email").normalizeEmail(),
    body("password").isLength({ min: 6 }).withMessage("Password must be at least 6 characters"),
    body("role").isIn(["doctor", "patient", "hospital"]).withMessage("Invalid role"),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    let { name, email, password, role } = req.body;
    email = email.toLowerCase();

    try {
      let userExists = await User.findOne({ email });
      if (userExists) {
        return res.status(400).json({ success: false, message: "User already exists" });
      }

      // Create user with plain password - let Mongoose middleware handle hashing
      const user = new User({ name, email, password, role });
      await user.save();

      const token = generateToken(user);

      res.status(201).json({
        success: true,
        message: "User registered successfully",
        token,
        user: { id: user._id, name: user.name, email: user.email, role: user.role },
      });
    } catch (err) {
      res.status(500).json({ success: false, message: "Server Error" });
    }
  }
);

// ========================== SIGNIN ==========================
router.post(
  "/signin",
  [
    body("email").isEmail().withMessage("Enter a valid email").normalizeEmail(),
    body("password").notEmpty().withMessage("Password is required"),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    let { email, password } = req.body;
    email = email.toLowerCase();

    try {
      let user = await User.findOne({ email });

      if (!user) {
        return res.status(401).json({ success: false, message: "Invalid credentials" });
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(401).json({ success: false, message: "Invalid credentials" });
      }

      const token = generateToken(user);

      res.json({
        success: true,
        message: "Login successful",
        token,
        user: { id: user._id, name: user.name, email: user.email, role: user.role },
      });
    } catch (err) {
      res.status(500).json({ success: false, message: "Server Error" });
    }
  }
);

module.exports = router;