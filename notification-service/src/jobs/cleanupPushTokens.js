const prisma = require('../config/prisma');
const { inc } = require('../utils/metrics');

async function cleanupPushTokens(days = 90) {
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - days);
    try {
        // Defensive: if PushToken model is not present in Prisma client, skip cleanup
        if (!prisma?._dmmf || !prisma._dmmf.modelMap || !prisma._dmmf.modelMap.PushToken) {
            console.log('PushToken model not present in Prisma client; skipping cleanupPushTokens');
            return;
        }
        const res = await prisma.pushToken.deleteMany({
            where: {
                updatedAt: {
                    lt: cutoff
                }
            }
        });
        if (res.count) {
            inc('fcm.removedTokens', res.count);
            console.log(`cleanupPushTokens: removed ${res.count} token(s) last used before ${cutoff.toISOString()}`);
        } else {
            console.log('cleanupPushTokens: no old tokens');
        }
    } catch (err) {
        console.error('cleanupPushTokens failed', err);
    }
}

function scheduleCleanup() {
    const intervalHours = parseInt(process.env.PUSH_TOKEN_CLEANUP_HOURS || '24', 10);
    const days = parseInt(process.env.PUSH_TOKEN_TTL_DAYS || '90', 10);
    // Run once at startup
    cleanupPushTokens(days).catch(() => {});
    // Schedule repeated runs
    setInterval(() => cleanupPushTokens(days).catch(() => {}), intervalHours * 60 * 60 * 1000);
}

module.exports = { cleanupPushTokens, scheduleCleanup };
