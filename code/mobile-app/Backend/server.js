// Import necessary modules
require('dotenv').config();  // Load environment variables from .env file
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');

// Initialize Express app
const app = express();

// MongoDB URI and Port (from .env file)
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/vescueye'; // Use value from .env or default to localhost
const PORT = process.env.PORT || 5000;  // Use value from .env or default to 5000

// Middleware
app.use(express.json()); // Allows parsing of JSON requests
app.use(cors()); // Enable Cross-Origin Resource Sharing
app.use('/api/auth', authRoutes); // Use authentication routes
app.use('/api/users', userRoutes); // Use user routes

// MongoDB connection setup
console.log('MongoDB URI:', MONGO_URI); // Debugging: Log the connection URI

mongoose.connect(MONGO_URI, {
  useNewUrlParser: true, // Avoid deprecation warnings
  useUnifiedTopology: true, // Avoid deprecation warnings
}).then(() => {
  console.log('MongoDB connected');
}).catch(err => {
  console.error('MongoDB connection error:', err);
});

// Start the Express server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
