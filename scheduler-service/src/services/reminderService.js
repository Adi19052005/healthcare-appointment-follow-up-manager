const prisma = require("../config/prisma");

const { publishEvent } = require("../utils/kafkaProducer");

/* ==========================================
   Appointment Reminder
========================================== */

async function sendAppointmentReminder(appointment) {

    await publishEvent("appointment.reminder", {

        appointmentId: appointment.id,

        patientId: appointment.patient.id,

        patientName: appointment.patient.user.name,

        patientEmail: appointment.patient.user.email,

        doctorName: appointment.doctor.user.name,

        appointmentDate: appointment.appointmentDate,

        slotStartTime: appointment.slotStartTime

    });

}

/* ==========================================
   Medication Reminder
========================================== */

async function sendMedicationReminder(appointment) {

    await publishEvent("medication.reminder", {

        appointmentId: appointment.id,

        patientId: appointment.patient.id,

        patientName: appointment.patient.user.name,

        patientEmail: appointment.patient.user.email,

        prescriptionLog: appointment.prescriptionLog,

        message: "It's time to take your prescribed medication."

    });

}

/* ==========================================
   Follow-up Reminder
========================================== */

async function sendFollowUpReminder(appointment) {

    await publishEvent("followup.reminder", {

        appointmentId: appointment.id,

        patientId: appointment.patient.id,

        patientName: appointment.patient.user.name,

        patientEmail: appointment.patient.user.email,

        doctorName: appointment.doctor.user.name,

        message: "Your doctor recommends scheduling a follow-up appointment."

    });

}

/* ==========================================
   No Show
========================================== */

async function markAppointmentNoShow(appointmentId) {

    await prisma.appointment.update({

        where: {

            id: appointmentId

        },

        data: {

            status: "NO_SHOW"

        }

    });

    await publishEvent("appointment.no_show", {

        appointmentId

    });

}

module.exports = {

    sendAppointmentReminder,

    sendMedicationReminder,

    sendFollowUpReminder,

    markAppointmentNoShow

};