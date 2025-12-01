const express = require("express");
const router = express.Router();
const { authenticateUser } = require("../middleware/authMiddleware.js");
const {
    sendNotification,
    getNotifications,
    getNotificationHistory
} = require("../controllers/notificationController.js");

// All routes require authentication
router.post("/send", authenticateUser, sendNotification);
router.get("/", authenticateUser, getNotifications);
router.get("/history", authenticateUser, getNotificationHistory);

module.exports = router;
