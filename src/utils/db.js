const RETRYABLE_ERROR_CODES = new Set(["P1001", "P1017", "P2024", "P2028"]);

async function withDbRetry(operation, context = "db-operation", attempts = 3) {
    let lastError;

    for (let attempt = 0; attempt < attempts; attempt += 1) {
        try {
            return await operation();
        } catch (error) {
            lastError = error;

            const code = error?.code || error?.meta?.code;
            const shouldRetry = RETRYABLE_ERROR_CODES.has(code);

            if (!shouldRetry || attempt === attempts - 1) {
                throw error;
            }

            const delayMs = 300 * (attempt + 1);
            await new Promise((resolve) => setTimeout(resolve, delayMs));
        }
    }

    throw lastError;
}

function getFriendlyDatabaseMessage(error) {
    const code = error?.code || error?.meta?.code;

    if (code === "P1001") {
        return "The database is temporarily unavailable. Please try again shortly.";
    }

    if (error?.message?.includes("ECONNREFUSED") || error?.message?.includes("timeout")) {
        return "The database connection timed out. Please retry in a moment.";
    }

    return "We could not complete the request because the database is unavailable.";
}

module.exports = {
    withDbRetry,
    getFriendlyDatabaseMessage,
    RETRYABLE_ERROR_CODES
};
