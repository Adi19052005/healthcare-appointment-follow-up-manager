

const { createClient } = require("redis");

const redis = createClient({
    url: process.env.REDIS_URL
});

redis.on("connect", () => {
    console.log("Connected to Redis");
});

redis.on("error", (err) => {
    console.error("Redis Connection Error:", err);
});

(async () => {
    try {
        await redis.connect();
    } catch (err) {
        console.error("Failed to connect to Redis:", err);
    }
})();

module.exports = redis;