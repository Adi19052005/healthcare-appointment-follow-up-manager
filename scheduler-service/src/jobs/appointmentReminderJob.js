const cron = require("node-cron");

const prisma = require("../config/prisma");

const {
    sendAppointmentReminder
} = require("../services/reminderService");

/* ==========================================
   Appointment Reminder Job
========================================== */

function startAppointmentReminderJob() {

    cron.schedule("* * * * *", async () => {

        try {

            console.log("Running Appointment Reminder Job...");

            const now = new Date();

            const reminderTime = new Date(now);

            reminderTime.setMinutes(
                reminderTime.getMinutes() + 30
            );

            const appointmentDate = new Date(reminderTime);

            appointmentDate.setHours(0, 0, 0, 0);

            const slotStartTime =
                reminderTime.toLocaleTimeString("en-GB", {

                    hour: "2-digit",

                    minute: "2-digit",

                    hour12: false

                });

            const appointments =
                await prisma.appointment.findMany({

                    where: {

                        status: "BOOKED",

                        appointmentDate,

                        slotStartTime

                    },

                    include: {

                        patient: {

                            include: {

                                user: true

                            }

                        },

                        doctor: {

                            include: {

                                user: true

                            }

                        }

                    }

                });

            for (const appointment of appointments) {

                await sendAppointmentReminder(
                    appointment
                );

            }

            console.log(
                `${appointments.length} Appointment Reminder(s) Published`
            );

        }

        catch (err) {

            console.error(
                "Appointment Reminder Job Failed"
            );

            console.error(err);

        }

    });

}

module.exports = startAppointmentReminderJob;