const prisma = require("../config/prisma");
const jwt = require("jsonwebtoken");

function getUserIdFromReq(req) {
    try {
        const auth = req.headers.authorization;
        if (auth && auth.startsWith("Bearer ")) {
            const token = auth.split(" ")[1];
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            return decoded.id;
        }
    } catch (err) {
        return null;
    }
    return null;
}

exports.registerToken = async (req, res, next) => {
    try {
        const userId = getUserIdFromReq(req) || req.body.userId;

        if (!userId) return res.status(400).json({ success: false, message: "Missing userId." });

        const { token, platform } = req.body;

        if (!token) return res.status(400).json({ success: false, message: "Missing token." });

        await prisma.pushToken.upsert({
            where: { token },
            create: { userId, token, platform },
            update: { userId, platform }
        });

        res.status(200).json({ success: true, message: "Token registered." });

    } catch (err) {
        next(err);
    }
};

exports.deleteToken = async (req, res, next) => {
    try {
        const { token } = req.params;
        await prisma.pushToken.deleteMany({ where: { token } });
        res.status(200).json({ success: true, message: "Token deleted." });
    } catch (err) {
        next(err);
    }
};

exports.getTokensForUser = async (req, res, next) => {
    try {
        const userId = req.params.userId || getUserIdFromReq(req);
        if (!userId) return res.status(400).json({ success: false, message: "Missing userId." });
        const tokens = await prisma.pushToken.findMany({ where: { userId } });
        res.status(200).json({ success: true, data: tokens });
    } catch (err) {
        next(err);
    }
};
