const prisma = require("../db/prisma.js");

// Send notification
const sendNotification = async (req, res) => {
    const { userId, type, title, message } = req.body;

    if (!userId || !type || !title || !message) {
        return res.status(400).json({ message: "All fields are required!" });
    }

    try {
        const notification = await prisma.notification.create({
            data: {
                userId: parseInt(userId),
                type,
                title,
                message,
                status: "pending"
            }
        });

        // TODO: Implement actual email/SMS sending logic here
        // For now, just mark as sent
        await prisma.notification.update({
            where: { id: notification.id },
            data: { status: "sent", sentAt: new Date() }
        });

        return res.status(201).json({ message: "Notification sent successfully!", notification });
    } catch (err) {
        console.error("Send notification error:", err);
        return res.status(500).json({ message: "Server Error!", error: err.message });
    }
};

// Get user's notifications
const getNotifications = async (req, res) => {
    const userId = req.user.userId;
    const { type, status } = req.query;

    try {
        let whereClause = { userId };

        if (type) whereClause.type = type;
        if (status) whereClause.status = status;

        const notifications = await prisma.notification.findMany({
            where: whereClause,
            orderBy: { createdAt: 'desc' }
        });

        return res.status(200).json({ notifications, count: notifications.length });
    } catch (err) {
        console.error("Get notifications error:", err);
        return res.status(500).json({ message: "Server Error!", error: err.message });
    }
};

// Get notification history
const getNotificationHistory = async (req, res) => {
    const userId = req.user.userId;

    try {
        const notifications = await prisma.notification.findMany({
            where: { userId },
            orderBy: { createdAt: 'desc' },
            take: 50
        });

        return res.status(200).json({ notifications, count: notifications.length });
    } catch (err) {
        console.error("Get notification history error:", err);
        return res.status(500).json({ message: "Server Error!", error: err.message });
    }
};

module.exports = {
    sendNotification,
    getNotifications,
    getNotificationHistory
};
