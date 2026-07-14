const { google } = require("googleapis");
const prisma = require("../config/prisma");

function createOAuthClient() {
    const clientId = process.env.GOOGLE_CLIENT_ID;
    const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
    const redirectUri = process.env.GOOGLE_OAUTH_REDIRECT || `${process.env.BASE_URL || 'http://localhost:3000'}/api/doctors/google/callback`;
    return new google.auth.OAuth2(clientId, clientSecret, redirectUri);
}

exports.connect = async (req, res, next) => {
    try {
        const auth = createOAuthClient();
        const scopes = [
            'https://www.googleapis.com/auth/calendar.events'
        ];

        const url = auth.generateAuthUrl({
            access_type: 'offline',
            scope: scopes,
            prompt: 'consent',
            state: req.user.id
        });

        res.json({ success: true, url });
    } catch (err) {
        next(err);
    }
};

exports.callback = async (req, res, next) => {
    try {
        const { code, state } = req.query;
        if (!code) return res.status(400).json({ success: false, message: 'Missing code' });

        const auth = createOAuthClient();
        const { tokens } = await auth.getToken(code);

        // state contains userId
        const userId = state || req.user.id;

        // find doctor by userId
        const doctor = await prisma.doctor.findUnique({ where: { userId } });
        if (!doctor) return res.status(404).json({ success: false, message: 'Doctor not found' });

        await prisma.doctor.update({
            where: { id: doctor.id },
            data: {
                googleCalendarConnected: true,
                googleAccessToken: tokens.access_token,
                googleRefreshToken: tokens.refresh_token,
                googleTokenExpiry: tokens.expiry_date ? new Date(tokens.expiry_date) : null
            }
        });

        // Redirect back to frontend profile page with success flag
        const frontend = process.env.FRONTEND_URL || 'http://localhost:5173';
        return res.redirect(`${frontend}/doctor/profile?google=connected`);
    } catch (err) {
        next(err);
    }
};

exports.disconnect = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const doctor = await prisma.doctor.findUnique({ where: { userId } });
        if (!doctor) return res.status(404).json({ success: false, message: 'Doctor not found' });

        await prisma.doctor.update({
            where: { id: doctor.id },
            data: {
                googleCalendarConnected: false,
                googleAccessToken: null,
                googleRefreshToken: null,
                googleTokenExpiry: null
            }
        });

        res.json({ success: true, message: 'Google Calendar disconnected' });
    } catch (err) {
        next(err);
    }
};
