const express = require("express");
const router = express.Router();

const adminController = require("../controllers/adminController");
const authMiddleware = require("../middleware/authMiddleware");
const authorize = require("../middleware/roleMiddleware");

// Protect all admin routes
router.use(authMiddleware);
router.use(authorize("ADMIN"));

/* ===========================
   Dashboard
=========================== */

router.get("/dashboard", adminController.getDashboard);

/* ===========================
   Doctor Management
=========================== */

router.post("/doctors", adminController.createDoctor);

router.get("/doctors", adminController.getAllDoctors);

router.put("/doctors/:doctorId", adminController.updateDoctor);

router.delete("/doctors/:doctorId", adminController.deleteDoctor);

/* ===========================
   Patient Management
=========================== */

router.get("/patients", adminController.getAllPatients);

router.get("/patients/:patientId", adminController.getPatientById);

router.delete("/patients/:patientId", adminController.deletePatient);

/* ===========================
   Appointment Management
=========================== */

router.get("/appointments", adminController.getAllAppointments);

router.get(
    "/appointments/:appointmentId",
    adminController.getAppointmentById
);

module.exports = router;