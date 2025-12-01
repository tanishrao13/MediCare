const prisma = require("../db/prisma.js");

// Create new appointment
const createAppointment = async (req, res) => {
    const { doctorId, appointmentDate, appointmentTime, duration, reason } = req.body;
    const patientId = req.user.userId; // From auth middleware

    if (!doctorId || !appointmentDate || !appointmentTime) {
        return res.status(400).json({ message: "Doctor, date, and time are required!" });
    }

    try {
        // Check if doctor exists and is actually a doctor
        const doctor = await prisma.users.findUnique({ where: { id: parseInt(doctorId) } });
        if (!doctor || doctor.role !== 'doctor') {
            return res.status(404).json({ message: "Doctor not found!" });
        }

        // Create appointment
        const appointment = await prisma.appointment.create({
            data: {
                patientId,
                doctorId: parseInt(doctorId),
                appointmentDate: new Date(appointmentDate),
                appointmentTime,
                duration: duration || 30,
                reason,
                status: "pending"
            },
            include: {
                patient: { select: { id: true, name: true, email: true, phoneNumber: true } },
                doctor: { select: { id: true, name: true, specialization: true } }
            }
        });

        return res.status(201).json({ message: "Appointment booked successfully!", appointment });
    } catch (err) {
        console.error("Create appointment error:", err);
        return res.status(500).json({ message: "Server Error!", error: err.message });
    }
};

// Get appointments (filtered by user role)
const getAppointments = async (req, res) => {
    const userId = req.user.userId;
    const { status, date } = req.query;

    try {
        const user = await prisma.users.findUnique({ where: { id: userId } });

        let whereClause = {};
        if (user.role === 'patient') {
            whereClause.patientId = userId;
        } else if (user.role === 'doctor') {
            whereClause.doctorId = userId;
        }

        if (status) whereClause.status = status;
        if (date) whereClause.appointmentDate = new Date(date);

        const appointments = await prisma.appointment.findMany({
            where: whereClause,
            include: {
                patient: { select: { id: true, name: true, email: true, phoneNumber: true } },
                doctor: { select: { id: true, name: true, specialization: true, consultationFee: true } }
            },
            orderBy: { appointmentDate: 'desc' }
        });

        return res.status(200).json({ appointments });
    } catch (err) {
        console.error("Get appointments error:", err);
        return res.status(500).json({ message: "Server Error!", error: err.message });
    }
};

// Get appointment by ID
const getAppointmentById = async (req, res) => {
    const { id } = req.params;
    const userId = req.user.userId;

    try {
        const appointment = await prisma.appointment.findUnique({
            where: { id: parseInt(id) },
            include: {
                patient: { select: { id: true, name: true, email: true, phoneNumber: true, dateOfBirth: true, address: true } },
                doctor: { select: { id: true, name: true, specialization: true, qualification: true, consultationFee: true } }
            }
        });

        if (!appointment) {
            return res.status(404).json({ message: "Appointment not found!" });
        }

        // Check if user has access to this appointment
        if (appointment.patientId !== userId && appointment.doctorId !== userId) {
            return res.status(403).json({ message: "Access denied!" });
        }

        return res.status(200).json({ appointment });
    } catch (err) {
        console.error("Get appointment error:", err);
        return res.status(500).json({ message: "Server Error!", error: err.message });
    }
};

// Update/reschedule appointment
const updateAppointment = async (req, res) => {
    const { id } = req.params;
    const { appointmentDate, appointmentTime, reason } = req.body;
    const userId = req.user.userId;

    try {
        const appointment = await prisma.appointment.findUnique({ where: { id: parseInt(id) } });

        if (!appointment) {
            return res.status(404).json({ message: "Appointment not found!" });
        }

        // Only patient can reschedule
        if (appointment.patientId !== userId) {
            return res.status(403).json({ message: "Only the patient can reschedule!" });
        }

        const updated = await prisma.appointment.update({
            where: { id: parseInt(id) },
            data: {
                ...(appointmentDate && { appointmentDate: new Date(appointmentDate) }),
                ...(appointmentTime && { appointmentTime }),
                ...(reason && { reason })
            },
            include: {
                patient: { select: { id: true, name: true } },
                doctor: { select: { id: true, name: true, specialization: true } }
            }
        });

        return res.status(200).json({ message: "Appointment updated successfully!", appointment: updated });
    } catch (err) {
        console.error("Update appointment error:", err);
        return res.status(500).json({ message: "Server Error!", error: err.message });
    }
};

// Cancel appointment
const cancelAppointment = async (req, res) => {
    const { id } = req.params;
    const userId = req.user.userId;

    try {
        const appointment = await prisma.appointment.findUnique({ where: { id: parseInt(id) } });

        if (!appointment) {
            return res.status(404).json({ message: "Appointment not found!" });
        }

        // Patient or doctor can cancel
        if (appointment.patientId !== userId && appointment.doctorId !== userId) {
            return res.status(403).json({ message: "Access denied!" });
        }

        const cancelled = await prisma.appointment.update({
            where: { id: parseInt(id) },
            data: { status: "cancelled" }
        });

        return res.status(200).json({ message: "Appointment cancelled successfully!", appointment: cancelled });
    } catch (err) {
        console.error("Cancel appointment error:", err);
        return res.status(500).json({ message: "Server Error!", error: err.message });
    }
};

// Update appointment status (doctor/admin only)
const updateAppointmentStatus = async (req, res) => {
    const { id } = req.params;
    const { status, notes } = req.body;
    const userId = req.user.userId;

    try {
        const user = await prisma.users.findUnique({ where: { id: userId } });
        const appointment = await prisma.appointment.findUnique({ where: { id: parseInt(id) } });

        if (!appointment) {
            return res.status(404).json({ message: "Appointment not found!" });
        }

        // Only doctor or admin can update status
        if (user.role !== 'doctor' && user.role !== 'admin') {
            return res.status(403).json({ message: "Access denied!" });
        }

        // If doctor, must be their appointment
        if (user.role === 'doctor' && appointment.doctorId !== userId) {
            return res.status(403).json({ message: "Access denied!" });
        }

        const updated = await prisma.appointment.update({
            where: { id: parseInt(id) },
            data: {
                status,
                ...(notes && { notes })
            }
        });

        return res.status(200).json({ message: "Appointment status updated!", appointment: updated });
    } catch (err) {
        console.error("Update status error:", err);
        return res.status(500).json({ message: "Server Error!", error: err.message });
    }
};

module.exports = {
    createAppointment,
    getAppointments,
    getAppointmentById,
    updateAppointment,
    cancelAppointment,
    updateAppointmentStatus
};
