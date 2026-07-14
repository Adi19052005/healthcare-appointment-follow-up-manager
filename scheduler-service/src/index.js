require("dotenv").config();

const express = require("express");

const prisma = require("./config/prisma");

const {
    connectProducer,
    disconnectProducer
} = require("./utils/kafkaProducer");

const startAppointmentReminderJob = require("./jobs/appointmentReminderJob");

const startMedicationReminderJob = require("./jobs/medicationReminderJob");

const startFollowUpReminderJob = require("./jobs/followUpReminderJob");

const startMissedAppointmentJob = require("./jobs/missedAppointmentJob");

const app = express();

app.use(express.json());

/* ==========================================
   Health Endpoints
========================================== */

app.get("/", (req, res) => {

    res.json({

        success: true,

        service: "Scheduler Service",

        status: "Running"

    });

});

app.get("/health", (req, res) => {

    res.json({

        success: true,

        service: "Scheduler Service",

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

        console.log("Scheduler Service");

        console.log("==========================================");

        /* Database */

        await prisma.$connect();

        console.log("Database Connected");

        /* Kafka */

        await connectProducer();

        console.log("Kafka Producer Connected");

        /* Cron Jobs */

        startAppointmentReminderJob();

        console.log("Appointment Reminder Job Started");

        startMedicationReminderJob();

        console.log("Medication Reminder Job Started");

        startFollowUpReminderJob();

        console.log("Follow-up Reminder Job Started");

        startMissedAppointmentJob();

        console.log("Missed Appointment Job Started");

        /* Express */

        const PORT = process.env.PORT || 4003;

        app.listen(PORT, () => {

            console.log("==========================================");

            console.log("Scheduler Service Started");

            console.log(`Port    : ${PORT}`);

            console.log(`Kafka   : ${process.env.KAFKA_BROKER}`);

            console.log("Cron Jobs Running...");

            console.log("==========================================");

        });

    }

    catch (err) {

        console.error("==========================================");

        console.error("Failed to Start Scheduler Service");

        console.error(err);

        console.error("==========================================");

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

        await disconnectProducer();

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

    console.log("Scheduler Service Stopped");

    process.exit(0);

}

process.on("SIGINT", () => shutdown("SIGINT"));

process.on("SIGTERM", () => shutdown("SIGTERM"));