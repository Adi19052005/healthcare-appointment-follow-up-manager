const redis = require("../config/redis");

/**
 * Acquire a distributed lock
 * Returns true if lock acquired, false otherwise
 */
exports.acquireLock = async (key, ttl = 300) => {

    const result = await redis.set(
        key,
        "LOCKED",
        {
            NX: true,   // Only set if key doesn't exist
            EX: ttl     // Expire after ttl seconds
        }
    );

    return result === "OK";

};

/**
 * Release a distributed lock
 */
exports.releaseLock = async (key) => {

    await redis.del(key);

};