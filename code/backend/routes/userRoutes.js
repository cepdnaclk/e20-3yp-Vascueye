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
  getFlapByPatientId,
  getAssignPatients,
  getUnassignedPatients,
  assignPatientToDoctor,
  assignAllPatientsToDoctor,
} = require("../controllers/userController");

const router = express.Router();

router.post("/assign-patient", assignPatientToDoctor);
router.post("/assign-all-patients", assignAllPatientsToDoctor);
router.get("/doctors", getDoctors); // Get all doctors
router.get("/patients", getPatients); // Get all patients
router.get("/patients/unassigned", getUnassignedPatients);
router.get("/doctors/:name/patients", getAssignPatients);

router.get("/patient/search", searchPatients);
router.post("/patient/register", registerPatient);
router.get("/patient/:id", getPatientById); // Get one patient

router.get("/doctor/search", searchDoctors);
router.post("/doctor/register", registerDoctor);
router.delete("/:id", deleteUser); // Delete user

router.get("/flap/search/:id", getFlapByPatientId); //1. Route to get flap data by patientID
module.exports = router;
