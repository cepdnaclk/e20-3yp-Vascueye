require("dotenv").config();  // Load environment variables

const User = require("../models/User");
const bcrypt = require("bcryptjs");  // For password hashing
const jwt = require("jsonwebtoken"); // For JWT authentication

const JWT_SECRET = process.env.JWT_SECRET;  // Get JWT secret from environment variables

const create = async (req, res) => {
    try {
        const { full_name, email, password, role } = req.body;

        // Check if the user already exists
        const userExist = await User.findOne({ email });
        if (userExist) {
            return res.status(400).json({ message: "User already exists." });
        }

        // Hash password before saving
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create and save new user with hashed password
        const user = new User({ full_name, email, password: hashedPassword, role });
        const saveData = await user.save();

        res.status(201).json({ message: "User registered successfully", user: saveData });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check if user exists
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "User not found" });
        }

        // Validate password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        // Generate JWT token with secret from .env file
        const token = jwt.sign(
            { userId: user._id, role: user.role },
            JWT_SECRET,  // Use JWT secret from .env
            { expiresIn: "1h" }
        );

        res.status(200).json({
            message: "Login successful",
            token,
            user: { id: user._id, full_name: user.full_name, email: user.email, role: user.role }
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Export using CommonJS
module.exports = { create, login };
