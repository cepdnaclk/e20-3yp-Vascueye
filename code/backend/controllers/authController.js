// const User = require("../models/User");
// const bcrypt = require("bcrypt");

// const signup = async (req, res) => {
//   try {
//     const { name, email, password, role, contact } = req.body;
//     const existingUser = await User.findOne({ email });

//     if (existingUser) {
//       return res
//         .status(400)
//         .json({ success: false, message: "User already exists" });
//     }
//     if (!["doctor", "admin", "patient"].includes(role)) {
//       return res.status(400).json({ error: "Invalid role" });
//     }

//     const hashedPassword = await bcrypt.hash(password, 10);

//     const newUser = new User({
//       name,
//       email,
//       password: hashedPassword,
//       role,
//       contact,
//     });
//     await newUser.save();
//     res.json({ success: true, message: "Signup successful" });
//   } catch (error) {
//     console.error("Signup Error:", error);
//     res.status(500).json({ success: false, message: "Server error" });
//   }
// };

// const signin = async (req, res) => {
//   try {
//     const { email, password } = req.body;
//     const user = await User.findOne({ email });

//     if (!user) {
//       return res
//         .status(401)
//         .json({ success: false, message: "Invalid credentials" });
//     }

//     const isPasswordValid = await bcrypt.compare(password, user.password);

//     if (!isPasswordValid) {
//       return res
//         .status(401)
//         .json({ success: false, message: "Invalid credentials" });
//     }

//     res.json({ success: true, message: "Login successful" });
//   } catch (error) {
//     console.error("Signin Error:", error);
//     res.status(500).json({ success: false, message: "Server error" });
//   }
// };

// module.exports = { signup, signin };
