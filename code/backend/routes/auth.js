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
    body("email").isEmail().withMessage("Enter a valid email").normalizeEmail(),
    body("password")
      .isLength({ min: 8 })
      .withMessage("Password must be at least 8 characters")
      .matches(/[A-Z]/)
      .withMessage("Password must contain at least one uppercase letter")
      .matches(/[a-z]/)
      .withMessage("Password must contain at least one lowercase letter")
      .matches(/\d/)
      .withMessage("Password must contain at least one number")
      .matches(/[@$!%*?&]/)
      .withMessage("Password must contain at least one special character"),
    body("role")
      .isIn(["doctor", "patient", "hospital"])
      .withMessage("Invalid role"),
    body("telephone")
      .matches(/^\d{10}$/)
      .withMessage("Telephone must be 10 digits"),
    body("nic")
      .optional({ checkFalsy: true })
      .notEmpty()
      .withMessage("National Identity Number is required"),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    let {
      name,
      email,
      password,
      role,
      firstName,
      lastName,
      dateOfBirth,
      telephone,
      nic,
      title,
      speciality,
      address,
      registrationNumber,
    } = req.body;

    email = email.toLowerCase();

    try {
      let userExists = await User.findOne({ email });
      if (userExists) {
        return res
          .status(400)
          .json({ success: false, message: "User already exists" });
      }

      if ((role === "doctor" || role === "patient") && !nic) {
        return res
          .status(400)
          .json({ success: false, message: "NIC is required for this role" });
      }

      // Assign `name` dynamically for patients and doctors
      if (!name && (role === "doctor" || role === "patient")) {
        name = `${firstName} ${lastName}`;
      }

      // Hash password before storing it in userData
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      // Create user object based on role
      const userData = {
        name,
        email,
        password: hashedPassword,
        role,
        telephone,
      };

      if (nic) userData.nic = nic;

      if (role === "patient") {
        userData.firstName = firstName;
        userData.lastName = lastName;
        userData.dateOfBirth = dateOfBirth;
      } else if (role === "doctor") {
        userData.firstName = firstName;
        userData.lastName = lastName;
        userData.title = title;
        userData.speciality = speciality;
      } else if (role === "hospital") {
        userData.address = address;
        userData.registrationNumber = registrationNumber;
      }

      console.log("User Data before saving:", userData);

      const user = new User(userData);
      await user.save();

      const token = generateToken(user);

      res.status(201).json({
        success: true,
        message: "User registered successfully",
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
      });
    } catch (err) {
      console.error("Signup Error:", err);
      res
        .status(500)
        .json({ success: false, message: "Server Error", error: err.message });
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
        return res
          .status(401)
          .json({ success: false, message: "Invalid credentials" });
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res
          .status(401)
          .json({ success: false, message: "Invalid credentials" });
      }

      const token = generateToken(user);

      res.json({
        success: true,
        message: "Login successful",
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
      });
    } catch (err) {
      console.error("Signin Error:", err);
      res.status(500).json({
        success: false,
        message: "Server Error",
        error: err.message,
      });
    }
  }
);

module.exports = router;
