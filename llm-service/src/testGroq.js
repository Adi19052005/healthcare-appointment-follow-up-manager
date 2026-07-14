const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, ".env") });

const OpenAI = require("openai");

async function main() {
    try {
        const client = new OpenAI({
            apiKey: process.env.GROQ_API_KEY,
            baseURL: process.env.GROQ_BASE_URL || "https://api.groq.com/openai/v1"
        });

        const response = await client.chat.completions.create({
            model: process.env.GROQ_MODEL || "llama-3.3-70b-versatile",
            messages: [{ role: "user", content: "Reply with only OK." }],
            temperature: 0.2
        });

        const text = response?.choices?.[0]?.message?.content;
        console.log("Response:", text);
    } catch (error) {
        console.error("Groq test failed");
        console.error(error);
    }
}

main();
