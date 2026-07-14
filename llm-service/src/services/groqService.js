const getClient = require("../config/groq");
const llmLogger = require("../utils/llmLogger");

const SYSTEM_PROMPT = "You are a medical AI assistant.\nGenerate concise, clinically useful summaries.\nAlways return valid JSON only.";
const RETRYABLE_STATUS_CODES = [429, 500, 502, 503, 504];

async function delay(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

function extractText(response) {
    const content = response?.choices?.[0]?.message?.content;

    if (typeof content === "string") {
        return content.trim();
    }

    if (Array.isArray(content)) {
        return content
            .map((item) => (typeof item === "string" ? item : item?.text || ""))
            .join("")
            .trim();
    }

    return "";
}

async function generateContent(prompt) {
    const client = getClient();
    const model = process.env.GROQ_MODEL || "llama-3.3-70b-versatile";

    const requestPayload = {
        model,
        messages: [
            { role: "system", content: SYSTEM_PROMPT },
            { role: "user", content: prompt }
        ],
        temperature: 0.2,
        response_format: { type: "json_object" }
    };

    let lastError;

    for (let attempt = 0; attempt < 3; attempt += 1) {
        try {
            const response = await client.chat.completions.create(requestPayload);
            const text = extractText(response);

            if (!text) {
                throw new Error("Groq returned an empty response.");
            }

            try {
                llmLogger.saveRaw({ prompt: prompt.slice(0, 2000), response: text });
            } catch (loggerError) {
                console.warn("Failed to save raw LLM response", loggerError);
            }

            return text;
        } catch (err) {
            lastError = err;
            const statusCode = err?.status || err?.response?.status;
            const shouldRetry = RETRYABLE_STATUS_CODES.includes(statusCode);

            if (!shouldRetry || attempt === 2) {
                throw err;
            }

            const waitMs = 1000 * (2 ** attempt);
            console.warn(`Groq request failed with status ${statusCode}. Retrying in ${waitMs}ms...`);
            await delay(waitMs);
        }
    }

    throw lastError;
}

module.exports = generateContent;
