const prisma = require("../db/prisma.js");

// Get all doctors with filters
const getAllDoctors = async (req, res) => {
    const { specialization, location, minRating, search, page = 1, limit = 10 } = req.query;

    try {
        let whereClause = { role: 'doctor' };

        if (specialization) {
            whereClause.specialization = { contains: specialization, mode: 'insensitive' };
        }
        if (location) {
            whereClause.location = { contains: location, mode: 'insensitive' };
        }
        if (minRating) {
            whereClause.rating = { gte: parseFloat(minRating) };
        }
        if (search) {
            whereClause.OR = [
                { name: { contains: search, mode: 'insensitive' } },
                { specialization: { contains: search, mode: 'insensitive' } }
            ];
        }

        // Pagination
        const pageNum = parseInt(page);
        const limitNum = parseInt(limit);
        const skip = (pageNum - 1) * limitNum;

        // Get total count
        const total = await prisma.users.count({ where: whereClause });

        const doctors = await prisma.users.findMany({
            where: whereClause,
            select: {
                id: true,
                name: true,
                email: true,
                phoneNumber: true,
                specialization: true,
                qualification: true,
                experience: true,
                consultationFee: true,
                rating: true,
                bio: true,
                location: true
            },
            orderBy: { rating: 'desc' },
            skip,
            take: limitNum
        });

        return res.status(200).json({
            doctors,
            pagination: {
                total,
                page: pageNum,
                limit: limitNum,
                totalPages: Math.ceil(total / limitNum)
            }
        });
    } catch (err) {
        console.error("Get doctors error:", err);
        return res.status(500).json({ message: "Server Error!", error: err.message });
    }
};

// Get doctor by ID with full details
const getDoctorById = async (req, res) => {
    const { id } = req.params;

    try {
        const doctor = await prisma.users.findUnique({
            where: { id: parseInt(id) },
            select: {
                id: true,
                name: true,
                email: true,
                phoneNumber: true,
                role: true,
                specialization: true,
                qualification: true,
                experience: true,
                consultationFee: true,
                rating: true,
                bio: true,
                location: true,
                availabilitySlots: {
                    where: {
                        isAvailable: true,
                        date: { gte: new Date() }
                    },
                    orderBy: { date: 'asc' },
                    take: 10
                }
            }
        });

        if (!doctor || doctor.role !== 'doctor') {
            return res.status(404).json({ message: "Doctor not found!" });
        }

        return res.status(200).json({ doctor });
    } catch (err) {
        console.error("Get doctor error:", err);
        return res.status(500).json({ message: "Server Error!", error: err.message });
    }
};

// Get doctor's available slots
const getDoctorAvailability = async (req, res) => {
    const { id } = req.params;
    const { date, startDate, endDate } = req.query;

    try {
        let whereClause = {
            doctorId: parseInt(id),
            isAvailable: true
        };

        if (date) {
            whereClause.date = new Date(date);
        } else if (startDate && endDate) {
            whereClause.date = {
                gte: new Date(startDate),
                lte: new Date(endDate)
            };
        } else {
            whereClause.date = { gte: new Date() };
        }

        const slots = await prisma.appointmentSlot.findMany({
            where: whereClause,
            orderBy: [{ date: 'asc' }, { startTime: 'asc' }]
        });

        return res.status(200).json({ slots, count: slots.length });
    } catch (err) {
        console.error("Get availability error:", err);
        return res.status(500).json({ message: "Server Error!", error: err.message });
    }
};

// Update doctor profile (doctor only)
const updateDoctorProfile = async (req, res) => {
    const userId = req.user.userId;
    const { specialization, qualification, experience, consultationFee, bio, location } = req.body;

    try {
        const user = await prisma.users.findUnique({ where: { id: userId } });

        if (user.role !== 'doctor') {
            return res.status(403).json({ message: "Only doctors can update doctor profile!" });
        }

        const updated = await prisma.users.update({
            where: { id: userId },
            data: {
                ...(specialization && { specialization }),
                ...(qualification && { qualification }),
                ...(experience && { experience: parseInt(experience) }),
                ...(consultationFee && { consultationFee: parseInt(consultationFee) }),
                ...(bio && { bio }),
                ...(location && { location })
            },
            select: {
                id: true,
                name: true,
                email: true,
                specialization: true,
                qualification: true,
                experience: true,
                consultationFee: true,
                bio: true,
                location: true
            }
        });

        return res.status(200).json({ message: "Profile updated successfully!", doctor: updated });
    } catch (err) {
        console.error("Update doctor profile error:", err);
        return res.status(500).json({ message: "Server Error!", error: err.message });
    }
};

// Search doctors with advanced filters
const searchDoctors = async (req, res) => {
    const { query, specialization, location, minFee, maxFee, minRating, sortBy, page = 1, limit = 10 } = req.query;

    try {
        let whereClause = { role: 'doctor' };
        let orderBy = {};

        // Build where clause
        if (query) {
            whereClause.OR = [
                { name: { contains: query, mode: 'insensitive' } },
                { specialization: { contains: query, mode: 'insensitive' } },
                { qualification: { contains: query, mode: 'insensitive' } }
            ];
        }
        if (specialization) {
            whereClause.specialization = { contains: specialization, mode: 'insensitive' };
        }
        if (location) {
            whereClause.location = { contains: location, mode: 'insensitive' };
        }
        if (minFee || maxFee) {
            whereClause.consultationFee = {};
            if (minFee) whereClause.consultationFee.gte = parseInt(minFee);
            if (maxFee) whereClause.consultationFee.lte = parseInt(maxFee);
        }
        if (minRating) {
            whereClause.rating = { gte: parseFloat(minRating) };
        }

        // Build order by
        switch (sortBy) {
            case 'rating':
                orderBy = { rating: 'desc' };
                break;
            case 'fee_low':
                orderBy = { consultationFee: 'asc' };
                break;
            case 'fee_high':
                orderBy = { consultationFee: 'desc' };
                break;
            case 'experience':
                orderBy = { experience: 'desc' };
                break;
            default:
                orderBy = { rating: 'desc' };
        }

        // Pagination
        const pageNum = parseInt(page);
        const limitNum = parseInt(limit);
        const skip = (pageNum - 1) * limitNum;

        // Get total count
        const total = await prisma.users.count({ where: whereClause });

        const doctors = await prisma.users.findMany({
            where: whereClause,
            select: {
                id: true,
                name: true,
                specialization: true,
                qualification: true,
                experience: true,
                consultationFee: true,
                rating: true,
                location: true
            },
            orderBy,
            skip,
            take: limitNum
        });

        return res.status(200).json({
            doctors,
            pagination: {
                total,
                page: pageNum,
                limit: limitNum,
                totalPages: Math.ceil(total / limitNum)
            }
        });
    } catch (err) {
        console.error("Search doctors error:", err);
        return res.status(500).json({ message: "Server Error!", error: err.message });
    }
};

module.exports = {
    getAllDoctors,
    getDoctorById,
    getDoctorAvailability,
    updateDoctorProfile,
    searchDoctors
};
