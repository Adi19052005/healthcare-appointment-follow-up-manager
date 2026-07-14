const path = require("path");
const OpenAI = require("openai");
require("dotenv").config({ path: path.resolve(__dirname, "..", ".env") });

let client = null;

function getClient() {
    if (!client) {
        if (!process.env.GROQ_API_KEY) {
            throw new Error("Missing GROQ_API_KEY environment variable.");
        }

        client = new OpenAI({
            apiKey: process.env.GROQ_API_KEY,
            baseURL: process.env.GROQ_BASE_URL || "https://api.groq.com/openai/v1",
            timeout: 30000,
            maxRetries: 0
        });
    }

    return client;
}

module.exports = getClient;
