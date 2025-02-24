const express = require("express");
const {
  getDoctors,
  getPatientById,
  getPatients,
  deleteUser,
} = require("../controllers/userController");

const router = express.Router();

router.get("/doctors", getDoctors); // Get all doctors
router.get("/patients", getPatients); // Get all patients
router.get("/patients/:id", getPatientById); // Get one patient
router.delete("/:id", deleteUser); // Delete user

module.exports = router;
