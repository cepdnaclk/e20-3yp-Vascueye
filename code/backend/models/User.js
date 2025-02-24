const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ["hospital", "doctor", "patient"], required: true },
  username: { type: String, unique: true, sparse: true }

});


// 🔥 Prevent double hashing
UserSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next(); // Don't rehash if unchanged
  
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  });

const User = mongoose.model("User", UserSchema);
module.exports = User;
