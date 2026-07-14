const express = require("express");
const router = express.Router();

const authController = require("../controllers/authController");
const authMiddleware = require("../middleware/authMiddleware");

// Register
router.post("/register", authController.register);

// Login
router.post("/login", authController.login);

// Logout
router.post("/logout", authMiddleware, authController.logout);

// Get currently logged in user
router.get("/me", authMiddleware, authController.getCurrentUser);

// Change password
router.put("/change-password", authMiddleware, authController.changePassword);

// Forgot password
router.post("/forgot-password", authController.forgotPassword);

// Reset password
router.post("/reset-password", authController.resetPassword);

module.exports = router;