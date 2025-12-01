const express = require("express");
const router = express.Router();
const { authenticateUser } = require("../middleware/authMiddleware.js");
const {
    createAppointment,
    getAppointments,
    getAppointmentById,
    updateAppointment,
    cancelAppointment,
    updateAppointmentStatus
} = require("../controllers/appointmentController.js");

// All routes require authentication
router.post("/", authenticateUser, createAppointment);
router.get("/", authenticateUser, getAppointments);
router.get("/:id", authenticateUser, getAppointmentById);
router.put("/:id", authenticateUser, updateAppointment);
router.delete("/:id", authenticateUser, cancelAppointment);
router.patch("/:id/status", authenticateUser, updateAppointmentStatus);

module.exports = router;
