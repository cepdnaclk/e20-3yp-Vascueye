const User = require("../models/User");

const signup = async (req, res) => {
  try {
    const { username, password } = req.body;
    const existingUser = await User.findOne({ username });

    if (existingUser) {
      return res
        .status(400)
        .json({ success: false, message: "User already exists" });
    }

    const newUser = new User({ username, password });
    await newUser.save();
    res.json({ success: true, message: "Signup successful" });
  } catch (error) {
    console.error("Signup Error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

const signin = async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username, password });

    if (!user) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid credentials" });
    }

    res.json({ success: true, message: "Login successful" });
  } catch (error) {
    console.error("Signin Error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

module.exports = { signup, signin };
