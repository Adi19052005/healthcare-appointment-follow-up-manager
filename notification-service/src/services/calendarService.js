const prisma = require("../config/prisma");

const {
    createCalendarClient
} = require("../config/googleCalendar");

const CALENDAR_TIMEZONE = process.env.GOOGLE_CALENDAR_TIMEZONE || "Asia/Kolkata";

function buildDateTimeValue(dateValue, slotStartTime, durationMinutes = 30) {
    if (!dateValue || !slotStartTime) return null;

    if (typeof slotStartTime === "string" && slotStartTime.includes("T")) {
        const parsedStart = new Date(slotStartTime);
        if (Number.isNaN(parsedStart.getTime())) return null;
        const endDate = new Date(parsedStart.getTime() + (durationMinutes * 60 * 1000));
        return { startTime: parsedStart.toISOString(), endTime: endDate.toISOString() };
    }

    const datePart = dateValue instanceof Date
        ? dateValue.toISOString().split("T")[0]
        : String(dateValue).split("T")[0];

    const normalizedSlot = String(slotStartTime).trim();
    const [hours = 0, minutes = 0] = normalizedSlot.split(":").map(Number);

    const startDate = new Date(`${datePart}T${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:00`);

    if (Number.isNaN(startDate.getTime())) return null;

    if (durationMinutes > 0) {
        const endDate = new Date(startDate.getTime() + (durationMinutes * 60 * 1000));
        return { startTime: startDate.toISOString(), endTime: endDate.toISOString() };
    }

    return { startTime: startDate.toISOString(), endTime: startDate.toISOString() };
}

async function resolveAppointmentContext(appointment) {
    const appointmentId = appointment?.id || appointment?.appointmentId;
    const basePayload = { ...appointment };

    if (!appointmentId) {
        return basePayload;
    }

    try {
        const record = await prisma.appointment.findUnique({
            where: { id: appointmentId },
            include: {
                patient: { include: { user: true } },
                doctor: { include: { user: true } }
            }
        });

        if (!record) {
            return basePayload;
        }

        const slotStartTime = basePayload.slotStartTime || record.slotStartTime;
        const slotEndTime = basePayload.slotEndTime || record.slotStartTime;
        const dateValue = basePayload.appointmentDate || record.appointmentDate;
        const timings = buildDateTimeValue(dateValue, slotStartTime, slotEndTime && slotEndTime !== slotStartTime ? 30 : 30);

        return {
            ...basePayload,
            id: record.id,
            appointmentId: record.id,
            patientId: basePayload.patientId || record.patientId,
            doctorId: basePayload.doctorId || record.doctorId,
            patientName: basePayload.patientName || record.patient?.user?.name,
            patientEmail: basePayload.patientEmail || record.patient?.user?.email,
            doctorName: basePayload.doctorName || record.doctor?.user?.name,
            doctorEmail: basePayload.doctorEmail || record.doctor?.user?.email,
            appointmentDate: basePayload.appointmentDate || record.appointmentDate,
            slotStartTime,
            slotEndTime,
            googleEventId: basePayload.googleEventId || record.googleEventId,
            startTime: basePayload.startTime || timings?.startTime,
            endTime: basePayload.endTime || timings?.endTime
        };
    } catch (err) {
        console.warn(`⚠ Failed to resolve appointment context for appointmentId=${appointmentId}: ${err.message || err}`);
        return basePayload;
    }
}

// Helper: attempt to get doctor and calendar client. If calendar not connected,
// return null and do not throw (calendar integration is optional).
async function getDoctorCalendarOptional(doctorId) {
    if (!doctorId) return null;
    try {
        const doctor = await prisma.doctor.findUnique({ where: { id: doctorId } });
        if (!doctor) {
            console.warn(`⚠ Doctor not found: ${doctorId}`);
            return null;
        }
        if (!doctor.googleCalendarConnected) {
            console.warn(`⚠ Doctor ${doctorId} has not connected Google Calendar.`);
            return null;
        }
        return { doctor, calendar: createCalendarClient(doctor) };
    } catch (err) {
        console.warn(`⚠ Failed to load doctor/calendar for doctorId=${doctorId}: ${err.message || err}`);
        return null;
    }
}

/* ==========================================
   Get Doctor Calendar Client
========================================== */

async function getDoctorCalendar(doctorId) {

    const doctor = await prisma.doctor.findUnique({

        where: {
            id: doctorId
        }

    });

    if (!doctor) {

        throw new Error("Doctor not found.");

    }

    if (!doctor.googleCalendarConnected) {

        throw new Error("Doctor has not connected Google Calendar.");

    }

    return {

        doctor,

        calendar: createCalendarClient(doctor)

    };

}

/* ==========================================
   Create Calendar Event
========================================== */

async function createCalendarEvent(appointment) {

    try {
        const payload = await resolveAppointmentContext(appointment);
        const res = await getDoctorCalendarOptional(payload.doctorId);
        if (!res) {
            console.log(`⚠ Skipping calendar creation for appointment ${payload.id || payload.appointmentId}`);
            return null;
        }
        const { doctor, calendar } = res;

        if (!payload.startTime || !payload.endTime) {
            console.warn('⚠ Missing appointment start/end time; skipping calendar event creation', { appointmentId: payload.id || payload.appointmentId });
            return null;
        }

        const event = {

            summary: `Appointment with Dr. ${payload.doctorName || "Doctor"}`,

            description:
                payload.description ||
                "Healthcare Appointment",

            start: {

                dateTime: payload.startTime,

                timeZone: CALENDAR_TIMEZONE

            },

            end: {

                dateTime: payload.endTime,

                timeZone: CALENDAR_TIMEZONE

            },

            attendees: [ { email: payload.patientEmail } ]

        };

        const response = await calendar.events.insert({ calendarId: doctor.googleCalendarId || 'primary', requestBody: event });

        // Update appointment record if appointment.id is present
        try {
            if (payload.id || payload.appointmentId) {
                await prisma.appointment.update({ where: { id: payload.id || payload.appointmentId }, data: { googleEventId: response.data.id } });
            }
        } catch (updErr) {
            console.warn('⚠ Failed to update appointment with googleEventId', updErr);
        }

        console.log("Calendar Event Created");

        return response.data;

    }

    catch (err) {
        console.warn('⚠ Calendar create failed', err.message || err);
        return null;
    }

}

/* ==========================================
   Update Calendar Event
========================================== */

async function updateCalendarEvent(appointment) {

    try {
        const payload = await resolveAppointmentContext(appointment);
        const res = await getDoctorCalendarOptional(payload.doctorId);
        if (!res) {
            console.log(`⚠ Skipping calendar update for appointment ${payload.id || payload.appointmentId}`);
            return null;
        }
        const { doctor, calendar } = res;

        const event = {

            summary: `Appointment with Dr. ${payload.doctorName || "Doctor"}`,

            description:
                payload.description ||
                "Healthcare Appointment",

            start: {

                dateTime: payload.startTime,

                timeZone: CALENDAR_TIMEZONE

            },

            end: {

                dateTime: payload.endTime,

                timeZone: CALENDAR_TIMEZONE

            },

            attendees: [

                {

                    email:
                        payload.patientEmail

                }

            ]

        };

        if (!payload.googleEventId) {
            console.warn('⚠ Missing googleEventId; skipping calendar update', { appointmentId: payload.id || payload.appointmentId });
            return null;
        }

        const response = await calendar.events.update({ calendarId: doctor.googleCalendarId || 'primary', eventId: payload.googleEventId, requestBody: event });
        console.log('Calendar Event Updated');
        return response.data;
    } catch (err) {
        console.warn('⚠ Calendar update failed', err.message || err);
        return null;
    }

}

/* ==========================================
   Delete Calendar Event
========================================== */

async function deleteCalendarEvent(
    appointment
) {

    try {
        const payload = await resolveAppointmentContext(appointment);
        const res = await getDoctorCalendarOptional(payload.doctorId);
        if (!res) {
            console.log(`⚠ Skipping calendar delete for appointment ${payload.id || payload.appointmentId}`);
            return null;
        }
        const { doctor, calendar } = res;
        if (!payload.googleEventId) {
            console.warn('⚠ Missing googleEventId; skipping calendar delete', { appointmentId: payload.id || payload.appointmentId });
            return null;
        }
        await calendar.events.delete({ calendarId: doctor.googleCalendarId || 'primary', eventId: payload.googleEventId });
        console.log('Calendar Event Deleted');
    } catch (err) {
        console.warn('⚠ Calendar delete failed', err.message || err);
        return null;
    }

}

module.exports = {

    createCalendarEvent,

    updateCalendarEvent,

    deleteCalendarEvent,

    resolveAppointmentContext

};