/* ==========================================
   Appointment Booked
========================================== */

function appointmentBookedTemplate(data) {

    return `
        <h2>Appointment Confirmed</h2>

        <p>Hello ${data.patientName},</p>

        <p>Your appointment has been booked successfully.</p>

        <p><strong>Doctor:</strong> Dr. ${data.doctorName}</p>

        <p><strong>Date:</strong> ${data.date}</p>

        <p><strong>Time:</strong> ${data.time}</p>

        <br>

        <p>Thank you for choosing our Healthcare Appointment Manager.</p>
    `;

}

/* ==========================================
   Appointment Cancelled
========================================== */

function appointmentCancelledTemplate(data) {

    return `
        <h2>Appointment Cancelled</h2>

        <p>Hello ${data.patientName},</p>

        <p>Your appointment with <strong>Dr. ${data.doctorName}</strong> has been cancelled.</p>

        <p>Please login to the portal to schedule another appointment.</p>
    `;

}

/* ==========================================
   Appointment Rescheduled
========================================== */

function appointmentRescheduledTemplate(data) {

    return `
        <h2>Appointment Rescheduled</h2>

        <p>Hello ${data.patientName},</p>

        <p>Your appointment has been rescheduled.</p>

        <p><strong>Doctor:</strong> Dr. ${data.doctorName}</p>

        <p><strong>Date:</strong> ${data.date}</p>

        <p><strong>Time:</strong> ${data.time}</p>
    `;

}

/* ==========================================
   Prescription Uploaded
========================================== */

function prescriptionTemplate(data) {

    return `
        <h2>Prescription Available</h2>

        <p>Hello ${data.patientName},</p>

        <p>Your doctor has uploaded a new prescription.</p>

        <p>Please login to the Healthcare Portal to view it.</p>
    `;

}

/* ==========================================
   Medication Reminder
========================================== */

function medicationReminderTemplate(data) {

    return `
        <h2>Medication Reminder</h2>

        <p>Hello ${data.patientName},</p>

        <p>${data.message}</p>

        <p>Please take your medication as prescribed.</p>
    `;

}

/* ==========================================
   Pre Visit Summary Ready
========================================== */

function preVisitSummaryTemplate(data) {

    return `
        <h2>Pre-Visit Summary Ready</h2>

        <p>Hello ${data.patientName},</p>

        <p>Your AI-generated pre-visit summary is ready.</p>

        <p>Please review it before your appointment.</p>
    `;

}

/* ==========================================
   Post Visit Summary Ready
========================================== */

function postVisitSummaryTemplate(data) {

    return `
        <h2>Visit Summary Available</h2>

        <p>Hello ${data.patientName},</p>

        <p>Your consultation summary is now available.</p>

        <p>Please login to view your doctor's notes and recommendations.</p>
    `;

}

module.exports = {

    appointmentBookedTemplate,

    appointmentCancelledTemplate,

    appointmentRescheduledTemplate,

    prescriptionTemplate,

    medicationReminderTemplate,

    preVisitSummaryTemplate,

    postVisitSummaryTemplate

};