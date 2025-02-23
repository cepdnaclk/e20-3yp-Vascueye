const mongoose = require("mongoose");

const PatientSchema = new mongoose.Schema({
  patient_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  }, // Link to User
  age: { type: Number, required: true },
  doctor_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    validate: {
      validator: async function (doctorId) {
        const doctor = await mongoose.model("User").findById(doctorId);
        return doctor && doctor.role === "doctor";
      },
      message: "Invalid doctor ID.",
    },
  },
  createdAt: { type: Date, default: Date.now },
});

const Patient = mongoose.model("Patient", PatientSchema);
module.exports = Patient;
