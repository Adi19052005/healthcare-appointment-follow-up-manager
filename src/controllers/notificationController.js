const prisma = require("../config/prisma");
const { withDbRetry } = require("../utils/db");

exports.getNotifications = async (req, res, next) => {
    try {
        const page = parseInt(req.query.page || '1', 10);
        const limit = parseInt(req.query.limit || '20', 10);

        const notifications = await withDbRetry(() => prisma.notification.findMany({
            where: { userId: req.user.id },
            orderBy: { createdAt: 'desc' },
            skip: (page - 1) * limit,
            take: limit,
        }));

        res.status(200).json({ success: true, data: notifications });
    } catch (err) {
        next(err);
    }
};

exports.getUnreadCount = async (req, res, next) => {
    try {
        const count = await withDbRetry(() => prisma.notification.count({ where: { userId: req.user.id, isRead: false } }));
        res.status(200).json({ success: true, data: { count } });
    } catch (err) {
        next(err);
    }
};

exports.markAllRead = async (req, res, next) => {
    try {
        await withDbRetry(() => prisma.notification.updateMany({ where: { userId: req.user.id, isRead: false }, data: { isRead: true } }));
        res.status(200).json({ success: true, message: 'All notifications marked as read.' });
    } catch (err) {
        next(err);
    }
};

exports.markAsRead = async (req, res, next) => {
    try {
        const { id } = req.params;

        const notification = await prisma.notification.findUnique({ where: { id } });
        if (!notification || notification.userId !== req.user.id) {
            return res.status(404).json({ success: false, message: 'Notification not found.' });
        }

        await withDbRetry(() => prisma.notification.update({ where: { id }, data: { isRead: true } }));

        res.status(200).json({ success: true, message: 'Marked as read.' });
    } catch (err) {
        next(err);
    }
};

exports.deleteNotification = async (req, res, next) => {
    try {
        const { id } = req.params;

        const notification = await prisma.notification.findUnique({ where: { id } });
        if (!notification || notification.userId !== req.user.id) {
            return res.status(404).json({ success: false, message: 'Notification not found.' });
        }

        await withDbRetry(() => prisma.notification.delete({ where: { id } }));

        res.status(200).json({ success: true, message: 'Notification deleted.' });
    } catch (err) {
        next(err);
    }
};
