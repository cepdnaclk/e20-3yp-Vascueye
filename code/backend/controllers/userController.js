const User = require("../models/User");

// Get all doctors
exports.getDoctors = async (req, res) => {
  try {
    const doctors = await User.find({ role: "doctor" }).select("-password");
    res.status(200).json(doctors);
  } catch (error) {
    res.status(500).json({ error: "Server error", details: error.message });
  }
};

// Get all patients
exports.getPatients = async (req, res) => {
  try {
    const patients = await User.find({ role: "patient" }).select("-password");
    res.status(200).json(patients);
  } catch (error) {
    res.status(500).json({ error: "Server error", details: error.message });
  }
};

// Get a specific patient by ID
exports.getPatientById = async (req, res) => {
  try {
    const patient = await User.findOne({
      _id: req.params.id,
      role: "patient",
    }).select("-password");
    if (!patient) {
      return res.status(404).json({ error: "Patient not found" });
    }
    res.status(200).json(patient);
  } catch (error) {
    res.status(500).json({ error: "Server error", details: error.message });
  }
};

// Delete a user by ID
exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Server error", details: error.message });
  }
};
