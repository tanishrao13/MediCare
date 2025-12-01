const prisma = require("../db/prisma.js");
const { hashPassword } = require("../Utils/bcryptPassword.js");

const getProfile = async (req, res) => {
    const userId = req.user.userId;

    try {
        const user = await prisma.users.findUnique({
            where: { id: userId },
            select: {
                id: true,
                name: true,
                email: true,
                phoneNumber: true,
                role: true,
                dateOfBirth: true,
                address: true,
                specialization: true,
                qualification: true,
                experience: true,
                consultationFee: true,
                bio: true,
                location: true,
                createdAt: true,
                updatedAt: true
            }
        });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json(user);
    } catch (error) {
        console.error("Error fetching profile:", error);
        res.status(500).json({ message: "Server error" });
    }
};

const updateProfile = async (req, res) => {
    const userId = req.user.userId;
    const { name, phoneNumber, specialization, qualification, experience, consultationFee, bio, location, dateOfBirth, address } = req.body;

    try {
        // Get current user to check role
        const currentUser = await prisma.users.findUnique({
            where: { id: userId },
            select: { role: true }
        });

        const updateData = {};
        if (name) updateData.name = name;
        if (phoneNumber) updateData.phoneNumber = phoneNumber;

        // Doctor-specific fields
        if (currentUser.role === 'doctor') {
            if (specialization !== undefined) updateData.specialization = specialization;
            if (qualification !== undefined) updateData.qualification = qualification;
            if (experience !== undefined) updateData.experience = parseInt(experience);
            if (consultationFee !== undefined) updateData.consultationFee = parseInt(consultationFee);
            if (bio !== undefined) updateData.bio = bio;
            if (location !== undefined) updateData.location = location;
        }

        // Patient-specific fields
        if (currentUser.role === 'patient') {
            if (dateOfBirth !== undefined) updateData.dateOfBirth = new Date(dateOfBirth);
            if (address !== undefined) updateData.address = address;
        }

        const user = await prisma.users.update({
            where: { id: userId },
            data: updateData,
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
                bio: true,
                location: true,
                dateOfBirth: true,
                address: true,
                createdAt: true,
                updatedAt: true
            }
        });

        res.status(200).json(user);
    } catch (error) {
        console.error("Error updating profile:", error);
        if (error.code === 'P2002') {
            return res.status(400).json({ message: "Phone number already in use" });
        }
        res.status(500).json({ message: "Server error" });
    }
};

const changePassword = async (req, res) => {
    const userId = req.user.userId;
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
        return res.status(400).json({ message: "Current and new password required" });
    }

    try {
        const user = await prisma.users.findUnique({
            where: { id: userId }
        });

        const { verifyPassword } = require("../Utils/bcryptPassword.js");
        const isValid = await verifyPassword(currentPassword, user.password);

        if (!isValid) {
            return res.status(401).json({ message: "Current password is incorrect" });
        }

        const hashedPassword = await hashPassword(newPassword);
        await prisma.users.update({
            where: { id: userId },
            data: { password: hashedPassword }
        });

        res.status(200).json({ message: "Password updated successfully" });
    } catch (error) {
        console.error("Error changing password:", error);
        res.status(500).json({ message: "Server error" });
    }
};

const deleteAccount = async (req, res) => {
    const userId = req.user.userId;

    try {
        await prisma.users.delete({
            where: { id: userId }
        });

        res.status(200).json({ message: "Account deleted successfully" });
    } catch (error) {
        console.error("Error deleting account:", error);
        res.status(500).json({ message: "Server error" });
    }
};

const getProfileById = async (req, res) => {
    const { id } = req.params;
    const requestingUserId = req.user.userId;

    try {
        // Get requesting user to check their role
        const requestingUser = await prisma.users.findUnique({
            where: { id: requestingUserId },
            select: { role: true }
        });

        // Only allow doctors and admins to view other users' profiles
        if (requestingUser.role !== 'doctor' && requestingUser.role !== 'admin') {
            return res.status(403).json({ message: "Access denied. Only doctors can view patient profiles." });
        }

        const user = await prisma.users.findUnique({
            where: { id: parseInt(id) },
            select: {
                id: true,
                name: true,
                email: true,
                phoneNumber: true,
                role: true,
                dateOfBirth: true,
                address: true,
                specialization: true,
                qualification: true,
                experience: true,
                consultationFee: true,
                bio: true,
                location: true,
                createdAt: true,
                updatedAt: true
            }
        });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json(user);
    } catch (error) {
        console.error("Error fetching profile by ID:", error);
        res.status(500).json({ message: "Server error" });
    }
};

module.exports = { getProfile, updateProfile, changePassword, deleteAccount, getProfileById };
