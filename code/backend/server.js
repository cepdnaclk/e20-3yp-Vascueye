const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const userRoutes = require("./routes/userRoutes");

require("dotenv").config();
require("./mqttClient"); // Ensure MQTT client starts on server load

// const authRoutes = require("./routes/authRoutes");
const iotRoutes = require("./routes/iotRoutes");

const app = express();
const PORT = process.env.PORT || 5000;

// Enable CORS
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Middleware to parse JSON
app.use(express.json());

// Routes
// app.use("/api/auth", authRoutes);
app.use("/api/iot", iotRoutes);
app.use("/api/users", userRoutes);

const authRoutes = require("./routes/auth");
app.use("/api/auth", authRoutes);

app.get("/", (req, res) => {
  res.send("Vascueye Backend is Running");
});

// Connect to MongoDB and start server
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("Connected to MongoDB");
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch((err) => console.error("MongoDB Connection Error:", err));

  app._router.stack.forEach((middleware) => {
    if (middleware.route) {
      console.log(`Available route: ${middleware.route.path}`);
    } else if (middleware.name === "router") {
      middleware.handle.stack.forEach((nested) => {
        if (nested.route) {
          console.log(`Available nested route: ${nested.route.path}`);
        }
      });
    }
  });
