const { transporter } = require("../config/email");
const prisma = require("../config/prisma");

// Helper: resolve recipient email. If `to` is provided return it.
// Otherwise, try to fetch using patientId from DB. If not found, return null.
async function resolveRecipientEmail(data) {
    if (data && data.patientEmail) return data.patientEmail;
    if (data && data.patientId) {
        try {
            const patient = await prisma.patient.findUnique({
                where: { id: data.patientId },
                include: { user: true }
            });
            if (patient && patient.user && patient.user.email) {
                return patient.user.email;
            }
            console.warn(`⚠ Patient email unavailable for patientId=${data.patientId}`);
            return null;
        } catch (err) {
            console.warn(`⚠ Failed to fetch patient email for patientId=${data.patientId}`);
            return null;
        }
    }
    console.warn('⚠ No recipient email or patientId provided');
    return null;
}

/* ==========================================
   Generic Email Sender
========================================== */

async function sendEmail({ to, subject, html, data = {} }) {
    // Defensive: ensure recipient
    if (!to) {
        // try resolve from data
        to = await resolveRecipientEmail(data);
    }

    if (!to) {
        console.warn(`⚠ Skipping email (no recipient). Subject="${subject}"`);
        return { ok: false, reason: 'no-recipient' };
    }

    try {
        await transporter.sendMail({
            from: `"Healthcare Appointment Manager" <${process.env.GMAIL_USER}>`,
            to,
            subject,
            html
        });
        console.log(`Email Sent -> ${to}`);
        return { ok: true };
    } catch (err) {
        console.warn(`⚠ Failed to send email to ${to}: ${err.message || err}`);
        // Do not throw - email failures should not stop notification processing
        return { ok: false, reason: 'send-failed', error: String(err) };
    }

}

/* ==========================================
   Appointment Booked
========================================== */

async function sendAppointmentBookedEmail(data) {

    if (!data?.patientEmail || !data?.patientName || !data?.doctorName) {
        console.warn('⚠ Missing patient or doctor details for appointment booked email', {
            patientEmail: data?.patientEmail,
            patientName: data?.patientName,
            doctorName: data?.doctorName
        });
        // fall through to sendEmail which will skip if recipient missing
    }

    const html = `

        <h2>Appointment Confirmed</h2>

        <p>Hello <b>${data.patientName}</b>,</p>

        <p>Your appointment has been booked successfully.</p>

        <ul>
            <li><b>Doctor:</b> Dr. ${data.doctorName}</li>
            <li><b>Date:</b> ${data.appointmentDate || data.date}</li>
            <li><b>Time:</b> ${data.slotStartTime || data.time}</li>
        </ul>

        <p>Thank you for choosing us.</p>

    `;

    console.log("Sending appointment booked email", {
        to: data.patientEmail,
        patientName: data.patientName,
        doctorName: data.doctorName,
        appointmentDate: data.appointmentDate,
        slotStartTime: data.slotStartTime
    });

    return sendEmail({ to: data.patientEmail, subject: "Appointment Confirmation", html, data });

}

/* ==========================================
   Appointment Cancelled
========================================== */

async function sendAppointmentCancelledEmail(data) {

    const html = `

        <h2>Appointment Cancelled</h2>

        <p>Hello <b>${data.patientName}</b>,</p>

        <p>Your appointment with Dr. ${data.doctorName} has been cancelled.</p>

    `;

    return sendEmail({ to: data.patientEmail, subject: "Appointment Cancelled", html, data });

}

/* ==========================================
   Appointment Rescheduled
========================================== */

async function sendAppointmentRescheduledEmail(data) {

    const html = `

        <h2>Appointment Rescheduled</h2>

        <p>Hello <b>${data.patientName}</b>,</p>

        <p>Your appointment has been rescheduled.</p>

        <ul>
            <li><b>Doctor:</b> Dr. ${data.doctorName}</li>
            <li><b>Date:</b> ${data.appointmentDate || data.date}</li>
<li><b>Time:</b> ${data.slotStartTime || data.time}</li>
        </ul>

    `;

    return sendEmail({ to: data.patientEmail, subject: "Appointment Rescheduled", html, data });

}

/* ==========================================
   Prescription Uploaded
========================================== */

async function sendPrescriptionEmail(data) {

    const html = `

        <h2>Prescription Available</h2>

        <p>Hello <b>${data.patientName}</b>,</p>

        <p>Your doctor has uploaded a new prescription.</p>

        <p>Please login to your Healthcare Portal to view it.</p>

    `;

    return sendEmail({ to: data.patientEmail, subject: "New Prescription", html, data });

}

/* ==========================================
   Medication Reminder
========================================== */

async function sendMedicationReminderEmail(data) {

    const html = `

        <h2>Medication Reminder</h2>

        <p>Hello <b>${data.patientName}</b>,</p>

        <p>${data.message}</p>

        <p>Please take your medication as prescribed.</p>

    `;

    return sendEmail({ to: data.patientEmail, subject: "Medication Reminder", html, data });

}

/* ==========================================
   Appointment Reminder
========================================== */

async function sendAppointmentReminderEmail(data) {

    const html = `

        <h2>Appointment Reminder</h2>

        <p>Hello <b>${data.patientName}</b>,</p>

        <p>This is a reminder that you have an upcoming appointment.</p>

        <ul>
            <li><b>Doctor:</b> Dr. ${data.doctorName}</li>
           <li><b>Date:</b> ${data.appointmentDate || data.date}</li>
<li><b>Time:</b> ${data.slotStartTime || data.time}</li>
        </ul>

        <p>Please arrive 10 minutes before your scheduled time.</p>

    `;

    return sendEmail({ to: data.patientEmail, subject: "Appointment Reminder", html, data });

}

/* ==========================================
   Follow-up Reminder
========================================== */

async function sendFollowUpReminderEmail(data) {

    const html = `

        <h2>Follow-up Reminder</h2>

        <p>Hello <b>${data.patientName}</b>,</p>

        <p>${data.message}</p>

        <p>Please log in to the Healthcare Portal to book your follow-up appointment if required.</p>

    `;

    return sendEmail({ to: data.patientEmail, subject: "Follow-up Reminder", html, data });

}

/* ==========================================
   Appointment No Show
========================================== */

async function sendNoShowEmail(data) {

    const html = `

        <h2>Missed Appointment</h2>

        <p>Hello <b>${data.patientName}</b>,</p>

        <p>Our records show that you missed your scheduled appointment.</p>

        <p>If you still require medical consultation, please book a new appointment.</p>

    `;

    return sendEmail({ to: data.patientEmail, subject: "Missed Appointment", html, data });

}

module.exports = {

    sendEmail,

    sendAppointmentBookedEmail,

    sendAppointmentCancelledEmail,

    sendAppointmentRescheduledEmail,

    sendAppointmentReminderEmail,

    sendPrescriptionEmail,

    sendMedicationReminderEmail,

    sendFollowUpReminderEmail,

    sendNoShowEmail

};