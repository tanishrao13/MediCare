const express = require("express");
const router = express.Router();
const { authenticateUser } = require("../middleware/authMiddleware.js");
const {
    getAllDoctors,
    getDoctorById,
    getDoctorAvailability,
    updateDoctorProfile,
    searchDoctors
} = require("../controllers/doctorController.js");

// Public routes (anyone can view doctors)
router.get("/", getAllDoctors);
router.get("/search", searchDoctors);
router.get("/:id", getDoctorById);
router.get("/:id/availability", getDoctorAvailability);

// Protected routes (doctor only)
router.put("/profile", authenticateUser, updateDoctorProfile);

module.exports = router;
