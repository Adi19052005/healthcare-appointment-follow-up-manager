const { getFriendlyDatabaseMessage } = require("../utils/db");

const errorHandler = (err, req, res, next) => {
    const statusCode = err?.statusCode || err?.status || 500;
    const code = err?.code || err?.meta?.code;

    if (code === "P1001" || code === "P1017" || code === "P2024" || code === "P2028") {
        console.error("Database error:", { code, message: err.message, path: req.originalUrl });
        return res.status(503).json({
            success: false,
            message: getFriendlyDatabaseMessage(err)
        });
    }

    console.error("Request failed:", {
        method: req.method,
        path: req.originalUrl,
        statusCode,
        message: err?.message || "Internal Server Error"
    });

    res.status(statusCode).json({
        success: false,
        message: statusCode >= 500 ? "We could not complete your request right now." : (err?.message || "Request failed")
    });
};

module.exports = errorHandler;