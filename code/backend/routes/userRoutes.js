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
const requireRole = require("../middleware/accessControl");

const router = express.Router();

router.post("/assign-patient", requireRole("hospital"), assignPatientToDoctor);
router.post(
  "/assign-all-patients",
  requireRole("hospital"),
  assignAllPatientsToDoctor
);
router.get("/doctors", requireRole("hospital"), getDoctors); // Get all doctors
router.get("/patients", requireRole("hospital"), getPatients); // Get all patients
router.get(
  "/patients/unassigned",
  requireRole("hospital"),
  getUnassignedPatients
);
router.post(
  "/doctors/patients",
  requireRole("hospital", "doctor"),
  getAssignPatients
);

router.get(
  "/patient/search",
  requireRole("hospital", "doctor"),
  searchPatients
);
router.post("/patient/register", requireRole("hospital"), registerPatient);
router.get("/patient/:id", requireRole("hospital", "doctor"), getPatientById); // Get one patient

router.get("/doctor/search", requireRole("hospital"), searchDoctors);
router.post("/doctor/register", requireRole("hospital"), registerDoctor);
router.delete("/:id", requireRole("hospital"), deleteUser); // Delete user

router.get(
  "/flap/search/:id",
  requireRole("doctor", "hospital"),
  getFlapByPatientId
); //1. Route to get flap data by patientID
module.exports = router;
