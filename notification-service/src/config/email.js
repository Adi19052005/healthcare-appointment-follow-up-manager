const nodemailer = require("nodemailer");
require("dotenv").config();

/* ==========================================
   Validate Environment Variables
========================================== */

if (!process.env.GMAIL_USER || !process.env.GMAIL_APP_PASSWORD) {
    console.warn('⚠ GMAIL_USER or GMAIL_APP_PASSWORD not set; email will be disabled');
}

/* ==========================================
   Nodemailer Transporter
========================================== */

const transporter = nodemailer.createTransport({

    service: "gmail",

    pool: true,

    maxConnections: 5,

    maxMessages: 100,

    auth: {

        user: process.env.GMAIL_USER,

        pass: process.env.GMAIL_APP_PASSWORD

    },

    connectionTimeout: 10000,

    greetingTimeout: 10000,

    socketTimeout: 15000

});

/* ==========================================
   Verify SMTP Connection
========================================== */

async function verifyEmailConnection() {

    try {

        await transporter.verify();

        console.log("Gmail SMTP Connected");

        return true;

    } catch (err) {

        console.warn("Gmail SMTP not available; email sending will be skipped");
        console.warn(err && (err.message || err));
        return false;

    }

}

/* ==========================================
   Close SMTP Connection
========================================== */

async function closeEmailConnection() {

    transporter.close();

    console.log("Gmail SMTP Connection Closed");

}

module.exports = {

    transporter,

    verifyEmailConnection,

    closeEmailConnection

};