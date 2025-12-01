const express = require("express");
const router = express.Router();
const { authenticateUser } = require("../middleware/authMiddleware.js");
const {
    createSlots,
    getSlotsByDoctor,
    getAvailableSlots,
    updateSlot,
    deleteSlot
} = require("../controllers/slotController.js");

// Public routes (anyone can view available slots)
router.get("/available", getAvailableSlots);
router.get("/doctor/:doctorId", getSlotsByDoctor);

// Protected routes (doctor only)
router.post("/", authenticateUser, createSlots);
router.put("/:id", authenticateUser, updateSlot);
router.delete("/:id", authenticateUser, deleteSlot);

module.exports = router;
