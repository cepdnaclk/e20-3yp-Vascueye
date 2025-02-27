const User = require("../models/User");
const Patient = require("../models/Patient.js");
const Doctor = require("../models/Doctor.js");

// Get all doctors
exports.getDoctors = async (req, res) => {
  try {
    const doctors = await Doctor.find(); // Fetch from Doctor model
    res.status(200).json(doctors);
  } catch (error) {
    res.status(500).json({ error: "Server error", details: error.message });
  }
};

// Get all patients
exports.getPatients = async (req, res) => {
  try {
    const patients = await Patient.find(); // Fetch from Patient model
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

//Register patient
exports.registerPatient = async (req, res) => {
  try {
    const { name, age, address, contact, medicalHistory } = req.body;

    // Validate contact number (must be 10 digits)
    if (!/^\d{10}$/.test(contact)) {
      return res
        .status(400)
        .json({ message: "Contact number must be exactly 10 digits" });
    }

    // Create new patient
    const newPatient = new Patient({
      name,
      age,
      address,
      contact,
      medicalHistory,
    });

    // Save to database
    await newPatient.save();

    res.status(201).json({
      message: "Patient registered successfully",
      patient: newPatient,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error registering patient", error: error.message });
  }
};

exports.registerDoctor = async (req, res) => {
  try {
    const { name, email, specialty, contact } = req.body;

    // Validate all required fields
    if (!name || !email || !specialty || !contact) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Validate contact number (must be 10 digits)
    if (!/^\d{10}$/.test(contact)) {
      return res.status(400).json({ message: "Contact number must be exactly 10 digits" });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: "Invalid email format" });
    }

    // Check if doctor with the same email already exists
    const existingDoctor = await Doctor.findOne({ email });
    if (existingDoctor) {
      return res.status(400).json({ message: "Doctor with this email already exists" });
    }

    // Create new doctor
    const newDoctor = new Doctor({ name, email, specialty, contact });

    // Save to database
    await newDoctor.save();

    res.status(201).json({ message: "Doctor registered successfully", doctor: newDoctor });
  } catch (error) {
    console.error("Error registering doctor:", error);
    res.status(500).json({ message: "Error registering doctor", error: error.message });
  }
};


exports.assignPatientToDoctor = async (req, res) => {
  try {
    const { patientId, doctorId } = req.body;

    // Find Patient & Doctor
    const patient = await Patient.findById(patientId);
    const doctor = await Doctor.findById(doctorId);

    if (!patient || !doctor) {
      return res.status(404).json({ error: "Patient or Doctor not found" });
    }

    // Update Patient's assignedDoctor field
    patient.assignedDoctor = doctorId;

    // Add Patient to Doctor's assignedPatients array (if not already assigned)
    if (!doctor.assignedPatients.includes(patientId)) {
      doctor.assignedPatients.push(patientId);
    }

    await patient.save();
    await doctor.save();

    res
      .status(200)
      .json({ message: "Patient assigned to doctor successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.searchPatients = async (req, res) => {
  try {
    const { query } = req.query;
    if (!query) {
      return res.status(400).json({ message: "Search query is required" });
    }
    // Search patients by name or contact
    const patients = await Patient.find({
      $or: [
        { name: { $regex: query, $options: "i" } }, // Case-insensitive name search
        { contact: { $regex: query, $options: "i" } }, // Case-insensitive contact search
      ],
    });

    res.status(200).json(patients);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error searching patients", error: error.message });
  }
};

exports.searchDoctors = async (req, res) => {
  try {
    const { query } = req.query;
    if (!query) {
      return res.status(400).json({ message: "Search query is required" });
    }
    // Search doctors by name or contact or email
    const doctors = await Doctor.find({
      $or: [
        { name: { $regex: query, $options: "i" } }, // Case-insensitive name search
        { contact: { $regex: query, $options: "i" } }, // Case-insensitive contact search
        { email: { $regex: query, $options: "i" } }, // Case-insensitive email search
      ],
    });

    res.status(200).json(doctors);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error searching doctors", error: error.message });
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
