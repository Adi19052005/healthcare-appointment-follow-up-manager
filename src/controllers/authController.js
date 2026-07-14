const prisma = require("../config/prisma");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// Register (Patient only)
exports.register = async (req, res) => {
    try {
        const { name, email, password, phone } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({
                success: false,
                message: "All required fields must be provided."
            });
        }

        const existingUser = await prisma.user.findUnique({
            where: { email }
        });

        if (existingUser) {
            return res.status(409).json({
                success: false,
                message: "User already exists."
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
                phone,
                role: "PATIENT",
                patient: {
                    create: {}
                }
            }
        });

        res.status(201).json({
            success: true,
            message: "Registration successful.",
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });

    } catch (err) {
        console.error(err);

        res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
};

// Login
exports.login = async (req, res) => {
    try {

        const { email, password } = req.body;

        const user = await prisma.user.findUnique({
            where: { email }
        });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found."
            });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: "Invalid credentials."
            });
        }

        const token = jwt.sign(
            {
                id: user.id,
                role: user.role
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "1d"
            }
        );

        res.status(200).json({
            success: true,
            token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });

    } catch (err) {

        console.error(err);

        res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });

    }
};

// Current logged in user
exports.getCurrentUser = async (req, res) => {

    try {

        const user = await prisma.user.findUnique({

            where: {
                id: req.user.id
            },

            select: {
                id: true,
                name: true,
                email: true,
                phone: true,
                role: true
            }

        });

        res.status(200).json({
            success: true,
            user
        });

    } catch (err) {

        res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });

    }

};

// Logout
exports.logout = async (req, res) => {

    res.status(200).json({
        success: true,
        message: "Logged out successfully."
    });

};

// Change Password
exports.changePassword = async (req, res) => {

    try {

        const { currentPassword, newPassword } = req.body;

        const user = await prisma.user.findUnique({
            where: {
                id: req.user.id
            }
        });

        const match = await bcrypt.compare(currentPassword, user.password);

        if (!match) {

            return res.status(401).json({
                success: false,
                message: "Current password is incorrect."
            });

        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);

        await prisma.user.update({

            where: {
                id: req.user.id
            },

            data: {
                password: hashedPassword
            }

        });

        res.status(200).json({

            success: true,
            message: "Password changed successfully."

        });

    } catch (err) {

        res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });

    }

};

// Forgot Password
exports.forgotPassword = async (req, res) => {

    res.status(501).json({
        success: false,
        message: "Forgot Password API not implemented yet."
    });

};

// Reset Password
exports.resetPassword = async (req, res) => {

    res.status(501).json({
        success: false,
        message: "Reset Password API not implemented yet."
    });

};