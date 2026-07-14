const express = require("express");
const router = express.Router();

const patientController = require("../controllers/patientController");
const authMiddleware = require("../middleware/authMiddleware");
const authorize = require("../middleware/roleMiddleware");

// Protect all patient routes
router.use(authMiddleware);
router.use(authorize("PATIENT"));

/* ===========================
   Dashboard
=========================== */

router.get("/dashboard", patientController.getDashboard);

/* ===========================
   Doctor Directory / Availability
=========================== */

router.get("/doctors", patientController.getDoctors);

router.get("/doctors/:doctorId/availability", patientController.getDoctorAvailability);

/* ===========================
   Profile
=========================== */

router.get("/profile", patientController.getProfile);

router.put("/profile", patientController.updateProfile);

/* ===========================
   Medical Information
=========================== */

router.put("/medical-info", patientController.updateMedicalInfo);

module.exports = router;