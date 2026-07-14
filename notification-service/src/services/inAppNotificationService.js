const prisma = require("../config/prisma");

const NotificationType = require("../constants/notificationTypes");

const { messaging } = require("../config/firebase");

/* ==========================================
   Create Notification
========================================== */

async function createNotification({

    userId,

    title,

    message,

    type = NotificationType.GENERAL,

    metadata = {}

}) {

    if (!userId || !title || !message) {
        console.warn('⚠ Skipping in-app notification; missing required fields', { userId, title, hasMessage: !!message });
        return null;
    }

    try {

        const notification = await prisma.notification.create({

            data: {

                userId,

                title,

                message,

                type,

                metadata

            }

        });

        console.log(`Notification Created -> ${notification.id}`);

        // Send push notification via Firebase if configured
        try {
            if (messaging) {
                const tokens = await prisma.pushToken.findMany({
                    where: { userId }
                });

                const deviceTokens = tokens.map((t) => t.token).filter(Boolean);

                if (deviceTokens.length) {
                    const dataPayload = Object.keys(metadata || {}).reduce((acc, key) => {
                        acc[key] = String(metadata[key]);
                        return acc;
                    }, {});

                    // add deep link if appointmentId present
                    const frontend = process.env.FRONTEND_URL || 'http://localhost:5173';
                    if (metadata && metadata.appointmentId) {
                        dataPayload.url = `${frontend}/patient/appointments/${metadata.appointmentId}`;
                    }

                    const pushPayload = {
                        notification: {
                            title,
                            body: message || "",
                        },
                        data: dataPayload,
                        tokens: deviceTokens,
                    };

                    // Send with handling: retry transient failures and remove permanently invalid tokens
                    async function sendAndHandle(tokensList, payload, attempt = 1) {

    try {

        const resp = await messaging.sendMulticast(payload);

        console.log(
            `FCM sent: ${resp.successCount} success, ${resp.failureCount} failure(s)`
        );

        try {

            const metrics = require("../utils/metrics");

            metrics.inc("fcm.success", resp.successCount);

            metrics.inc("fcm.failure", resp.failureCount);

        } catch (_) {}

        const invalidTokens = [];
        const transientTokens = [];

        resp.responses.forEach((response, index) => {

            if (!response.success) {

                const token = tokensList[index];

                const errorCode =
                    response.error?.code ||
                    response.error?.message ||
                    "";

                if (
                    /registration-token-not-registered|invalid-registration-token|messaging\/registration-token-not-registered|messaging\/invalid-registration-token/i.test(
                        errorCode
                    )
                ) {

                    invalidTokens.push(token);

                } else {

                    transientTokens.push(token);

                }

                console.warn("FCM send failure", {
                    token,
                    error: errorCode
                });

            }

        });

        if (invalidTokens.length) {

            const deleted = await prisma.pushToken.deleteMany({

                where: {

                    token: {

                        in: invalidTokens

                    }

                }

            });

            console.log(
                `Removed ${deleted.count} invalid push token(s)`
            );

            try {

                const metrics = require("../utils/metrics");

                metrics.inc(
                    "fcm.removedTokens",
                    deleted.count
                );

            } catch (_) {}

        }

        if (transientTokens.length && attempt < 2) {

            await new Promise(resolve => setTimeout(resolve, 500));

            return sendAndHandle(

                transientTokens,

                {

                    ...payload,

                    tokens: transientTokens

                },

                attempt + 1

            );

        }

    }

    catch (err) {

        console.error("FCM send error", err);

        if (attempt < 2) {

            await new Promise(resolve => setTimeout(resolve, 500));

            return sendAndHandle(tokensList, payload, attempt + 1);

        }

    }

}

                    await sendAndHandle(deviceTokens, pushPayload);
                }
            }
        } catch (pushErr) {
            console.error("FCM Push Error", pushErr);
        }

        return notification;
}

catch (err) {

    console.error("Create Notification Failed");

    console.error(err);

    throw err;

}

}
                                                    
/* ==========================================
   Get Notifications
========================================== */

async function getNotifications(

    userId,

    page = 1,

    limit = 20

) {

    return prisma.notification.findMany({

        where: {

            userId

        },

        skip: (page - 1) * limit,

        take: limit,

        orderBy: {

            createdAt: "desc"

        }

    });

}

/* ==========================================
   Get Notification Count
========================================== */

async function getNotificationCount(userId) {

    return prisma.notification.count({

        where: {

            userId

        }

    });

}

/* ==========================================
   Get Unread Notifications
========================================== */

async function getUnreadNotifications(userId) {

    return prisma.notification.findMany({

        where: {

            userId,

            isRead: false

        },

        orderBy: {

            createdAt: "desc"

        }

    });

}

/* ==========================================
   Get Unread Count
========================================== */

async function getUnreadCount(userId) {

    return prisma.notification.count({

        where: {

            userId,

            isRead: false

        }

    });

}

/* ==========================================
   Mark As Read
========================================== */

async function markAsRead(notificationId) {

    return prisma.notification.update({

        where: {

            id: notificationId

        },

        data: {

            isRead: true

        }

    });

}

/* ==========================================
   Mark Multiple As Read
========================================== */

async function markManyAsRead(notificationIds) {

    return prisma.notification.updateMany({

        where: {

            id: {

                in: notificationIds

            }

        },

        data: {

            isRead: true

        }

    });

}

/* ==========================================
   Mark All As Read
========================================== */

async function markAllAsRead(userId) {

    return prisma.notification.updateMany({

        where: {

            userId,

            isRead: false

        },

        data: {

            isRead: true

        }

    });

}

/* ==========================================
   Delete Notification
========================================== */

async function deleteNotification(notificationId) {

    return prisma.notification.delete({

        where: {

            id: notificationId

        }

    });

}

/* ==========================================
   Delete All Notifications
========================================== */

async function deleteAllNotifications(userId) {

    return prisma.notification.deleteMany({

        where: {

            userId

        }

    });

}

/* ==========================================
   Cleanup Old Notifications
========================================== */

async function deleteOlderThan(days = 90) {

    const date = new Date();

    date.setDate(date.getDate() - days);

    return prisma.notification.deleteMany({

        where: {

            createdAt: {

                lt: date

            }

        }

    });

}

module.exports = {

    createNotification,

    getNotifications,

    getNotificationCount,

    getUnreadNotifications,

    getUnreadCount,

    markAsRead,

    markManyAsRead,

    markAllAsRead,

    deleteNotification,

    deleteAllNotifications,

    deleteOlderThan

};