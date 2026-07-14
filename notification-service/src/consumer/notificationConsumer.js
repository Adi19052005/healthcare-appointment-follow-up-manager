const {
    connectConsumer,
    subscribe,
    startConsumer
} = require("../utils/kafkaConsumer");

const emailService = require("../services/emailService");
const calendarService = require("../services/calendarService");
const inAppNotificationService = require("../services/inAppNotificationService");

const NotificationType = require("../constants/notificationTypes");

/* ==========================================
   Kafka Topics
========================================== */

const TOPICS = {

    APPOINTMENT_BOOKED: "appointment.booked",

    APPOINTMENT_CANCELLED: "appointment.cancelled",

    APPOINTMENT_RESCHEDULED: "appointment.rescheduled",

    APPOINTMENT_REMINDER: "appointment.reminder",

    APPOINTMENT_NO_SHOW: "appointment.no_show",

    FOLLOWUP_REMINDER: "followup.reminder",

    PRESCRIPTION_ADDED: "prescription.added",

    MEDICATION_REMINDER: "medication.reminder"

};

/* ==========================================
   Start Notification Consumer
========================================== */

async function startNotificationConsumer() {

    await connectConsumer();

    await subscribe(Object.values(TOPICS));

    await startConsumer(async (topic, data) => {

        try {

            console.log(`Received Event: ${topic}`);
            console.log("Received Event Payload:", data);

            switch (topic) {

                /* =====================================
                   Appointment Booked
                ===================================== */

                case TOPICS.APPOINTMENT_BOOKED: {
                    const payload = await calendarService.resolveAppointmentContext(data);
                    const tasks = [
                        emailService.sendAppointmentBookedEmail(payload),
                        calendarService.createCalendarEvent(payload),
                        inAppNotificationService.createNotification({
                            userId: payload.patientId,
                            title: 'Appointment Confirmed',
                            message: `Your appointment with Dr. ${payload.doctorName || 'your doctor'} has been booked successfully.`,
                            type: NotificationType.APPOINTMENT_BOOKED,
                            metadata: { appointmentId: payload.appointmentId, doctorId: payload.doctorId }
                        })
                    ];

                    const results = await Promise.allSettled(tasks);
                    results.forEach((r, idx) => {
                        if (r.status === 'rejected') console.warn(`⚠ Task ${idx} failed:`, r.reason);
                    });
                }
                    break;

                /* =====================================
                   Appointment Cancelled
                ===================================== */

                case TOPICS.APPOINTMENT_CANCELLED: {
                    const payload = await calendarService.resolveAppointmentContext(data);
                    const tasks = [
                        emailService.sendAppointmentCancelledEmail(payload),
                        calendarService.deleteCalendarEvent(payload),
                        inAppNotificationService.createNotification({ userId: payload.patientId, title: 'Appointment Cancelled', message: 'Your appointment has been cancelled.', type: NotificationType.APPOINTMENT_CANCELLED, metadata: { appointmentId: payload.appointmentId, doctorId: payload.doctorId } })
                    ];
                    const results = await Promise.allSettled(tasks);
                    results.forEach((r, idx) => { if (r.status === 'rejected') console.warn(`⚠ Task ${idx} failed:`, r.reason); });
                }
                    break;

                /* =====================================
                   Appointment Rescheduled
                ===================================== */

                case TOPICS.APPOINTMENT_RESCHEDULED: {
                    const payload = await calendarService.resolveAppointmentContext(data);
                    const tasks = [
                        emailService.sendAppointmentRescheduledEmail(payload),
                        calendarService.updateCalendarEvent(payload),
                        inAppNotificationService.createNotification({ userId: payload.patientId, title: 'Appointment Rescheduled', message: 'Your appointment has been rescheduled.', type: NotificationType.APPOINTMENT_RESCHEDULED, metadata: { appointmentId: payload.appointmentId, doctorId: payload.doctorId } })
                    ];
                    const results = await Promise.allSettled(tasks);
                    results.forEach((r, idx) => { if (r.status === 'rejected') console.warn(`⚠ Task ${idx} failed:`, r.reason); });
                }
                    break;

                /* =====================================
                   Appointment Reminder
                ===================================== */

                case TOPICS.APPOINTMENT_REMINDER: {
                    const payload = await calendarService.resolveAppointmentContext(data);
                    const tasks = [
                        emailService.sendAppointmentReminderEmail(payload),
                        inAppNotificationService.createNotification({
                            userId: payload.patientId,
                            title: 'Appointment Reminder',
                            message: `Reminder: You have an appointment with Dr. ${payload.doctorName || 'your doctor'} on ${payload.appointmentDate ? new Date(payload.appointmentDate).toLocaleDateString() : 'today'} at ${payload.slotStartTime || 'your scheduled time'}.`,
                            type: NotificationType.APPOINTMENT_REMINDER,
                            metadata: { appointmentId: payload.appointmentId }
                        })
                    ];
                    const results = await Promise.allSettled(tasks);
                    results.forEach((r, idx) => { if (r.status === 'rejected') console.warn(`⚠ Task ${idx} failed:`, r.reason); });
                }
                    break;

                /* =====================================
                   Prescription Uploaded
                ===================================== */

                case TOPICS.PRESCRIPTION_ADDED: {
                    const tasks = [ emailService.sendPrescriptionEmail(data), inAppNotificationService.createNotification({ userId: data.patientId, title: 'Prescription Available', message: 'Your doctor has uploaded a new prescription.', type: NotificationType.PRESCRIPTION_AVAILABLE, metadata: { appointmentId: data.appointmentId } }) ];
                    const results = await Promise.allSettled(tasks);
                    results.forEach((r, idx) => { if (r.status === 'rejected') console.warn(`⚠ Task ${idx} failed:`, r.reason); });
                }
                    break;

                /* =====================================
                   Medication Reminder
                ===================================== */

                case TOPICS.MEDICATION_REMINDER: {
                    const tasks = [ emailService.sendMedicationReminderEmail(data), inAppNotificationService.createNotification({ userId: data.patientId, title: 'Medication Reminder', message: data.message, type: NotificationType.MEDICATION_REMINDER, metadata: { appointmentId: data.appointmentId } }) ];
                    const results = await Promise.allSettled(tasks);
                    results.forEach((r, idx) => { if (r.status === 'rejected') console.warn(`⚠ Task ${idx} failed:`, r.reason); });
                }
                    break;

                /* =====================================
                   Follow-up Reminder
                ===================================== */

                case TOPICS.FOLLOWUP_REMINDER: {
                    const payload = await calendarService.resolveAppointmentContext(data);
                    const tasks = [
                        emailService.sendFollowUpReminderEmail(payload),
                        inAppNotificationService.createNotification({
                            userId: payload.patientId,
                            title: 'Follow-up Reminder',
                            message: data.message || 'A follow-up reminder is ready for you.',
                            type: NotificationType.FOLLOWUP_REMINDER,
                            metadata: { appointmentId: payload.appointmentId }
                        })
                    ];
                    const results = await Promise.allSettled(tasks);
                    results.forEach((r, idx) => { if (r.status === 'rejected') console.warn(`⚠ Task ${idx} failed:`, r.reason); });
                }
                    break;

                /* =====================================
                   No Show
                ===================================== */

                case TOPICS.APPOINTMENT_NO_SHOW: {
                    const tasks = [ emailService.sendNoShowEmail(data), inAppNotificationService.createNotification({ userId: data.patientId, title: 'Appointment Missed', message: 'You missed your scheduled appointment. Please book another appointment if required.', type: NotificationType.APPOINTMENT_NO_SHOW, metadata: { appointmentId: data.appointmentId } }) ];
                    const results = await Promise.allSettled(tasks);
                    results.forEach((r, idx) => { if (r.status === 'rejected') console.warn(`⚠ Task ${idx} failed:`, r.reason); });
                }
                    break;

                default:

                    console.warn(`Unhandled Kafka Topic: ${topic}`);

            }

        }

        catch (err) {

            console.error(`Failed to process topic: ${topic}`);

            console.error(err);

        }

    });

}

module.exports = startNotificationConsumer;