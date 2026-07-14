const express = require("express");
const cors = require("cors");
require("dotenv").config();
const { connectProducer } = require("./utils/kafkaProducer");
const prisma = require("./config/prisma");
const { withDbRetry } = require("./utils/db");

const app = express()

const authRoutes = require("./routes/authRoutes");
const patientRoutes = require("./routes/patientRoutes");
const doctorRoutes = require("./routes/doctorRoutes");
const adminRoutes = require("./routes/adminRoutes");

app.use((req, res, next) => {
  console.log(">>>", req.method, req.originalUrl);
  next();
});

const appointmentRoutes = require("./routes/appointmentRoutes"); // <-- ADD
const notificationRoutes = require("./routes/notificationRoutes");
const googleCalendarRoutes = require("./routes/googleCalendarRoutes");

const errorHandler = require("./middleware/errorHandler");

;

// Middleware
app.use(cors());
app.use(express.json());

// Health Check
app.get("/", (req, res) => {
    res.json({
        success: true,
        message: "Healthcare Appointment & Follow-Up Manager API is running."
    });
});

app.get("/health", async (req, res) => {
    try {
        await prisma.$queryRaw`SELECT 1`;

        res.json({
            success: true,
            service: "Backend API",
            database: "Connected",
            uptime: process.uptime(),
            timestamp: new Date().toISOString()
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            service: "Backend API",
            database: "Disconnected"
        });
    }
});

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/patients", patientRoutes);
app.use("/api/doctors", doctorRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/appointments", appointmentRoutes); // <-- ADD
app.use("/api/notifications", notificationRoutes);
app.use("/api/doctors/google", googleCalendarRoutes);
app.use("/api/google", googleCalendarRoutes);

// Global Error Handler
app.use(errorHandler);

// Start Server
/* ==========================================
   Start Server
========================================== */

async function startServer() {

    try {

        await withDbRetry(() => prisma.$connect(), "prisma-connect", 5);
        console.log("Database Connected");

        try {
            await connectProducer();
            console.log("Kafka Producer Connected");
        } catch (kafkaError) {
            console.warn("Kafka producer unavailable; continuing without it.", kafkaError.message || kafkaError);
        }

        const PORT = process.env.PORT || 3000;

        app.listen(PORT, () => {
            console.log("==========================================");
            console.log("Healthcare Backend Started");
            console.log(`Port   : ${PORT}`);
            console.log(`Kafka  : ${process.env.KAFKA_BROKER || "not configured"}`);
            console.log("==========================================");
        });

    }

    catch (err) {
        console.error("Failed to start backend");
        console.error(err);
        process.exit(1);
    }

}

startServer();
