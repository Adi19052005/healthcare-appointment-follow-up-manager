const express = require("express");
const router = express.Router();

const appointmentController = require("../controllers/appointmentController");
const authMiddleware = require("../middleware/authMiddleware");
const authorize = require("../middleware/roleMiddleware");

/* ===========================
   Patient Routes
=========================== */

// Book Appointment
router.post(
    "/",
    authMiddleware,
    authorize("PATIENT"),
    appointmentController.bookAppointment
);

// Get My Appointments
router.get(
    "/my",
    authMiddleware,
    authorize("PATIENT"),
    appointmentController.getMyAppointments
);

// Cancel Appointment
router.patch(
    "/:appointmentId/cancel",
    authMiddleware,
    authorize("PATIENT"),
    appointmentController.cancelAppointment
);

// Reschedule Appointment
router.patch(
    "/:appointmentId/reschedule",
    authMiddleware,
    authorize("PATIENT"),
    appointmentController.rescheduleAppointment
);

// Submit Symptoms Before Visit (DEPRECATED - intake captured at booking)
// route removed to prevent duplicate symptom capture. Keep controller for backward compatibility.

/* ===========================
   Doctor Routes
=========================== */

// Get Doctor's Appointments
router.get(
    "/doctor",
    authMiddleware,
    authorize("DOCTOR"),
    appointmentController.getDoctorAppointments
);

// View Appointment Details
router.get(
    "/:appointmentId",
    authMiddleware,
    authorize("DOCTOR", "ADMIN"),
    appointmentController.getAppointmentById
);

// Update Appointment Status
router.patch(
    "/:appointmentId/status",
    authMiddleware,
    authorize("DOCTOR"),
    appointmentController.updateAppointmentStatus
);

// Unified Doctor Consultation Update
// Unified Doctor Consultation Update (safe wrapper)
router.put(
    "/:appointmentId/consultation",
    authMiddleware,
    authorize("DOCTOR"),
    async (req, res, next) => {
        if (typeof appointmentController.addConsultation === 'function') {
            return appointmentController.addConsultation(req, res, next);
        }
        return res.status(501).json({ success: false, message: "Consultation handler not available." });
    }
);

/* ===========================
   Admin Routes
=========================== */

// View All Appointments
router.get(
    "/",
    authMiddleware,
    authorize("ADMIN"),
    appointmentController.getAllAppointments
);

module.exports = router;