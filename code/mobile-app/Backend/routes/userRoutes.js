const express = require("express");
const router = express.Router();  // Correct the typo here
const verifyToken=require("../middlewares/authMiddleware")
const authorizeRoles = require("../middlewares/roleMiddleware")
// only admin can access this router
router.get("/admin", verifyToken,authorizeRoles("admin") ,(req, res) => {
    res.json({ message: "Welcome Admin" });
});

// both admin and doctor can access this router
router.get("/doctor", verifyToken,authorizeRoles("admin","doctor"),(req, res) => {
    res.json({ message: "Welcome Doctor" });
});

// All can access this router
router.get("/patient",verifyToken,authorizeRoles("admin","doctor","patient"), (req, res) => {
    res.json({ message: "Welcome Patient" });
});

module.exports = router;
