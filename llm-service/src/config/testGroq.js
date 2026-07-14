const path = require("path");

require("dotenv").config({
    path: path.join(__dirname, "..", ".env"),
});

const OpenAI = require("openai");

const client = new OpenAI({
    apiKey: process.env.GROQ_API_KEY,
    baseURL: process.env.GROQ_BASE_URL || "https://api.groq.com/openai/v1",
});

async function main() {

    try {

        console.log("========================================");
        console.log("Testing Groq Connection...");
        console.log("========================================");

        console.log("Model :", process.env.GROQ_MODEL);

        const response = await client.chat.completions.create({

            model: process.env.GROQ_MODEL || "llama-3.3-70b-versatile",

            temperature: 0.2,

            messages: [

                {
                    role: "system",
                    content:
                        "You are a helpful assistant. Reply only with the requested answer."
                },

                {
                    role: "user",
                    content: "Reply with only the word OK."
                }

            ]

        });

        console.log("\n✅ Groq Connected Successfully\n");

        console.log("Response:");

        console.log(response.choices[0].message.content);

        console.log("\n========================================");

    }

    catch (err) {

        console.log("\n❌ Groq Connection Failed\n");

        console.error("Status :", err.status);

        console.error("Message:", err.message);

        if (err.response?.data) {

            console.error(err.response.data);

        }

        console.error(err);

    }

}

main();