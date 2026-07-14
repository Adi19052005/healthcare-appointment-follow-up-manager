require("dotenv").config();

const express = require("express");

const prisma = require("./config/prisma");

const { verifyEmailConnection } = require("./config/email");

const startNotificationConsumer = require("./consumer/notificationConsumer");

const {
    disconnectConsumer
} = require("./utils/kafkaConsumer");

const app = express();

app.use(express.json());

/* Token Routes */
const tokenRoutes = require("./routes/tokenRoutes");
app.use("/tokens", tokenRoutes);

/* Metrics endpoint */
const { getAll } = require('./utils/metrics');
app.get('/metrics', (req, res) => res.json({ success: true, data: getAll() }));

/* Token cleanup job (scheduled after DB connect) */
const { scheduleCleanup } = require('./jobs/cleanupPushTokens');

/* ==========================================
   Health Endpoints
========================================== */

app.get("/", (req, res) => {

    res.json({

        success: true,

        service: "Notification Service",

        status: "Running"

    });

});

app.get("/health", (req, res) => {

    res.json({

        success: true,

        uptime: process.uptime(),

        timestamp: new Date().toISOString()

    });

});

app.get("/ready", async (req, res) => {

    try {

        await prisma.$queryRaw`SELECT 1`;

        res.json({

            success: true,

            status: "Ready"

        });

    }

    catch (err) {

        res.status(500).json({

            success: false,

            status: "Database Not Ready"

        });

    }

});

/* ==========================================
   Start Service
========================================== */

async function startServer() {

    try {

        console.log("==========================================");
        console.log("Notification Service");
        console.log("==========================================");

        /* Database */

        await prisma.$connect();

        console.log("Database Connected");

        // start scheduled cleanup only after DB connected
        try {
            scheduleCleanup();
            console.log('Scheduled push token cleanup started');
        } catch (e) {
            console.warn('⚠ Failed to start cleanup job', e && (e.message || e));
        }

        /* Gmail */

        await verifyEmailConnection();

        /* Kafka */

        await startNotificationConsumer();

        console.log("✓ Kafka Connected");

        /* Express */

        const PORT = process.env.PORT || 4001;

        app.listen(PORT, () => {

            console.log("==========================================");

            console.log(`Service : Notification`);

            console.log(`Port    : ${PORT}`);

            console.log(`Kafka   : ${process.env.KAFKA_BROKER}`);

            console.log(`Email   : ${process.env.GMAIL_USER}`);

            console.log("Listening for Kafka Events...");

            console.log("==========================================");

        });

    }


    catch (err) {
        console.error('Service Startup Failed', err && (err.message || err));
        process.exit(1);
    }

}

startServer();

/* ==========================================
   Graceful Shutdown
========================================== */

async function shutdown(signal) {

    console.log(`Received ${signal}`);

    try {

        await disconnectConsumer();

    }

    catch (err) {

        console.error(err);

    }

    try {

        await prisma.$disconnect();

    }

    catch (err) {

        console.error(err);

    }

    console.log("Notification Service Stopped");

    process.exit(0);

}

process.on("SIGINT", () => shutdown("SIGINT"));

process.on("SIGTERM", () => shutdown("SIGTERM"));