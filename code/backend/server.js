const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT ;

// ✅ Enable CORS for frontend requests
app.use(cors({
  origin: '*', // ⚠️ Change '*' to your frontend URL for better security (e.g., 'http://your-frontend.com')
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// ✅ Middleware to parse JSON requests
app.use(express.json());

// ✅ Connect to MongoDB Atlas
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ Connected to MongoDB'))
  .catch(err => console.error('❌ MongoDB Connection Error:', err));


// ✅ User Schema & Model
const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true }
});
const User = mongoose.model('User', userSchema);

// ✅ Signup Route
app.post('/signup', async (req, res) => {
  try {
    const { username, password } = req.body;
    
    // Check if user already exists
    const existingUser = await User.findOne({ username });
    if (existingUser) return res.status(400).json({ success: false, message: 'User already exists' });

    // Save new user
    const newUser = new User({ username, password });
    await newUser.save();
    res.json({ success: true, message: 'Signup successful' });
  } catch (error) {
    console.error('Signup Error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// ✅ Signin Route
app.post('/signin', async (req, res) => {
  try {
    const { username, password } = req.body;
    
    // Check user credentials
    const user = await User.findOne({ username, password });
    if (!user) return res.status(401).json({ success: false, message: 'Invalid credentials' });

    res.json({ success: true, message: 'Login successful' });
  } catch (error) {
    console.error('Signin Error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// ✅ Test Route
app.get('/', (req, res) => {
  res.send('Vescueye Backend is Running 🚀');
});

// ✅ Start Server
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
