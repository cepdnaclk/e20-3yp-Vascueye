const express = require("express");
const {
  getDoctors,
  getPatientById,
  getPatients,
  deleteUser,
  registerPatient,
  registerDoctor,
  searchPatients,
  searchDoctors,
  getFlapByPatientId
} = require("../controllers/userController");

const router = express.Router();

router.get("/doctors", getDoctors); // Get all doctors
router.get("/patients", getPatients); // Get all patients

router.get("/patient/search", searchPatients);
router.post("/patient/register", registerPatient);
router.get("/patient/:id", getPatientById); // Get one patient

router.get("/doctor/search", searchDoctors);
router.post("/doctor/register", registerDoctor);
router.delete("/:id", deleteUser); // Delete user

router.get("/flap/search/:id",getFlapByPatientId)//1. Route to get flap data by patientID
module.exports = router;
