const { google } = require("googleapis");

function createCalendarClient(doctor) {
    const clientId = process.env.GOOGLE_CLIENT_ID;
    const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
    const redirectUri = process.env.GOOGLE_OAUTH_REDIRECT || "http://localhost:3000/api/doctors/google/callback";

    if (!clientId || !clientSecret) {
        throw new Error("Google OAuth client not configured.");
    }

    const oAuth2Client = new google.auth.OAuth2(clientId, clientSecret, redirectUri);

    // doctor may contain tokens
    if (doctor.googleAccessToken || doctor.googleRefreshToken) {
        const creds = {};
        if (doctor.googleAccessToken) creds.access_token = doctor.googleAccessToken;
        if (doctor.googleRefreshToken) creds.refresh_token = doctor.googleRefreshToken;
        if (doctor.googleTokenExpiry) creds.expiry_date = new Date(doctor.googleTokenExpiry).getTime();
        oAuth2Client.setCredentials(creds);
    }

    const calendar = google.calendar({ version: "v3", auth: oAuth2Client });

    return calendar;
}

module.exports = {
    createCalendarClient,
};
