const express = require("express");
const router = express.Router();

const doctorController = require("../controllers/doctorController");
const authMiddleware = require("../middleware/authMiddleware");
const authorize = require("../middleware/roleMiddleware");

// Protect all doctor routes
router.use(authMiddleware);
router.use(authorize("DOCTOR"));

/* ===========================
   Dashboard
=========================== */

router.get(
    "/dashboard",
    doctorController.getDashboard
);

/* ===========================
   Profile
=========================== */

router.get(
    "/profile",
    doctorController.getProfile
);

router.put(
    "/profile",
    doctorController.updateProfile
);

/* ===========================
   Working Hours
=========================== */

router.put(
    "/working-hours",
    doctorController.updateWorkingHours
);

/* ===========================
   Leave Management
=========================== */

router.get(
    "/leaves",
    doctorController.getDoctorLeaves
);

router.post(
    "/leaves",
    doctorController.addDoctorLeave
);

router.delete(
    "/leaves/:leaveId",
    doctorController.deleteDoctorLeave
);

/* ===========================
   Patient History
=========================== */

router.get(
    "/patients/:patientId/history",
    doctorController.getPatientHistory
);

module.exports = router;