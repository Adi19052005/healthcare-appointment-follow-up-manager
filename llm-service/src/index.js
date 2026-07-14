const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, ".env") });

const express = require("express");

const prisma = require("./config/prisma");

const startLLMConsumer = require("./consumers/llmConsumer");

const {
    disconnectConsumer
} = require("./utils/kafkaConsumer");

const app = express();

app.use(express.json());

/* ==========================================
   Health Endpoints
========================================== */

app.get("/", (req, res) => {

    res.status(200).json({

        success: true,

        service: "LLM Service",

        status: "Running"

    });

});

app.get("/health", async (req, res) => {

    try {

        await prisma.$queryRaw`SELECT 1`;

        res.status(200).json({

            success: true,

            service: "LLM Service",

            database: "Connected",

            uptime: process.uptime(),

            timestamp: new Date().toISOString()

        });

    }

    catch (err) {

        res.status(500).json({

            success: false,

            database: "Disconnected"

        });

    }

});

// Expose recent raw LLM responses for debugging (non-production, local use)
app.get('/llm-recent', (req, res) => {
    try {
        const llmLogger = require('./utils/llmLogger');
        const recent = llmLogger.readRecent(50);
        res.status(200).json({ success: true, recent });
    } catch (err) {
        res.status(500).json({ success: false, error: String(err) });
    }
});

/* ==========================================
   Start Service
========================================== */

async function startServer() {

    try {

        console.log("==========================================");
        console.log("LLM Service");
        console.log("==========================================");

        /* Database */

        await prisma.$connect();

        console.log("Database Connected");

        /* Kafka */

        await startLLMConsumer();

        const PORT = process.env.PORT || 4002;

        app.listen(PORT, () => {

            console.log("==========================================");

            console.log("LLM Service Started");

            console.log(`Port           : ${PORT}`);

            console.log(`Kafka Broker   : ${process.env.KAFKA_BROKER}`);

            console.log(`Groq Model     : ${process.env.GROQ_MODEL || "llama-3.3-70b-versatile"}`);

            console.log("Listening for Kafka Events...");

            console.log("==========================================");

        });

    }

    catch (err) {

        console.error("==========================================");

        console.error("Failed to Start LLM Service");

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

    console.log("LLM Service Stopped");

    process.exit(0);

}

process.on("SIGINT", () => shutdown("SIGINT"));

process.on("SIGTERM", () => shutdown("SIGTERM"));