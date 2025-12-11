const prisma = require("../db/prisma.js");

// Create availability slots (doctor only)
const createSlots = async (req, res) => {
    const userId = req.user.userId;
    const { date, slots } = req.body; // slots = [{ startTime, endTime }, ...]

    if (!date || !slots || !Array.isArray(slots)) {
        return res.status(400).json({ message: "Date and slots array are required!" });
    }

    try {
        const user = await prisma.users.findUnique({ where: { id: userId } });

        if (user.role !== 'doctor') {
            return res.status(403).json({ message: "Only doctors can create slots!" });
        }

        const createdSlots = [];
        for (const slot of slots) {
            // Check if slot already exists
            const existing = await prisma.appointmentSlot.findUnique({
                where: {
                    doctorId_date_startTime: {
                        doctorId: userId,
                        date: new Date(date),
                        startTime: slot.startTime
                    }
                }
            });

            if (!existing) {
                const newSlot = await prisma.appointmentSlot.create({
                    data: {
                        doctorId: userId,
                        date: new Date(date),
                        startTime: slot.startTime,
                        endTime: slot.endTime,
                        isAvailable: true
                    }
                });
                createdSlots.push(newSlot);
            }
        }

        return res.status(201).json({ 
            message: `${createdSlots.length} slots created successfully!`, 
            slots: createdSlots,
            skipped: slots.length - createdSlots.length
        });
    } catch (err) {
        console.error("Create slots error:", err);
        return res.status(500).json({ message: "Server Error!", error: err.message });
    }
};

// Get slots by doctor
const getSlotsByDoctor = async (req, res) => {
    const { doctorId } = req.params;
    const { date, startDate, endDate, available } = req.query;

    try {
        let whereClause = { doctorId: parseInt(doctorId) };

        if (date) {
            whereClause.date = new Date(date);
        } else if (startDate && endDate) {
            whereClause.date = {
                gte: new Date(startDate),
                lte: new Date(endDate)
            };
        }

        if (available === 'true') {
            whereClause.isAvailable = true;
        }

        const slots = await prisma.appointmentSlot.findMany({
            where: whereClause,
            orderBy: [{ date: 'asc' }, { startTime: 'asc' }]
        });

        return res.status(200).json({ slots, count: slots.length });
    } catch (err) {
        console.error("Get slots error:", err);
        return res.status(500).json({ message: "Server Error!", error: err.message });
    }
};

// Get available slots
const getAvailableSlots = async (req, res) => {
    const { doctorId, date } = req.query;

    if (!doctorId) {
        return res.status(400).json({ message: "Doctor ID is required!" });
    }

    try {
        let whereClause = {
            doctorId: parseInt(doctorId),
            isAvailable: true,
            date: date ? new Date(date) : { gte: new Date() }
        };

        const slots = await prisma.appointmentSlot.findMany({
            where: whereClause,
            orderBy: [{ date: 'asc' }, { startTime: 'asc' }]
        });

        return res.status(200).json({ slots, count: slots.length });
    } catch (err) {
        console.error("Get available slots error:", err);
        return res.status(500).json({ message: "Server Error!", error: err.message });
    }
};

// Update slot (doctor only)
const updateSlot = async (req, res) => {
    const { id } = req.params;
    const { isAvailable, date, startTime, endTime } = req.body;
    const userId = req.user.userId;

    try {
        const slot = await prisma.appointmentSlot.findUnique({ where: { id: parseInt(id) } });

        if (!slot) {
            return res.status(404).json({ message: "Slot not found!" });
        }

        if (slot.doctorId !== userId) {
            return res.status(403).json({ message: "Access denied!" });
        }

        // Prepare update data
        const updateData = {};
        if (isAvailable !== undefined) updateData.isAvailable = isAvailable;
        if (date) updateData.date = new Date(date);
        if (startTime) updateData.startTime = startTime;
        if (endTime) updateData.endTime = endTime;

        // If updating time/date, ensure slot is currently available (not booked)
        if ((date || startTime || endTime) && !slot.isAvailable) {
            return res.status(400).json({ message: "Cannot update details of a booked slot!" });
        }

        const updated = await prisma.appointmentSlot.update({
            where: { id: parseInt(id) },
            data: updateData
        });

        return res.status(200).json({ message: "Slot updated successfully!", slot: updated });
    } catch (err) {
        console.error("Update slot error:", err);
        return res.status(500).json({ message: "Server Error!", error: err.message });
    }
};

// Delete slot (doctor only)
const deleteSlot = async (req, res) => {
    const { id } = req.params;
    const userId = req.user.userId;

    try {
        const slot = await prisma.appointmentSlot.findUnique({ where: { id: parseInt(id) } });

        if (!slot) {
            return res.status(404).json({ message: "Slot not found!" });
        }

        if (slot.doctorId !== userId) {
            return res.status(403).json({ message: "Access denied!" });
        }

        await prisma.appointmentSlot.delete({ where: { id: parseInt(id) } });

        return res.status(200).json({ message: "Slot deleted successfully!" });
    } catch (err) {
        console.error("Delete slot error:", err);
        return res.status(500).json({ message: "Server Error!", error: err.message });
    }
};

module.exports = {
    createSlots,
    getSlotsByDoctor,
    getAvailableSlots,
    updateSlot,
    deleteSlot
};
