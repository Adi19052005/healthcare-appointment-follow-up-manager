const cron = require("node-cron");

const prisma = require("../config/prisma");

const {
    sendFollowUpReminder
} = require("../services/reminderService");

/* ==========================================
   Follow-up Reminder Job
========================================== */

function startFollowUpReminderJob() {

    // Runs every day at 9 AM

    cron.schedule("0 9 * * *", async () => {

        try {

            console.log("Running Follow-up Reminder Job...");

            const targetDate = new Date();

            // Remind patients 7 days after appointment

            targetDate.setDate(targetDate.getDate() - 7);

            targetDate.setHours(0, 0, 0, 0);

            const nextDate = new Date(targetDate);

            nextDate.setDate(nextDate.getDate() + 1);

            const appointments = await prisma.appointment.findMany({

                where: {

                    status: "COMPLETED",

                    appointmentDate: {

                        gte: targetDate,

                        lt: nextDate

                    }

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

                const existingAppointment = await prisma.appointment.findFirst({

                    where: {

                        patientId: appointment.patientId,

                        createdAt: {

                            gt: appointment.createdAt

                        }

                    }

                });

                if (!existingAppointment) {

                    await sendFollowUpReminder(appointment);

                }

            }

            console.log(

                `${appointments.length} Follow-up Reminder(s) Checked`

            );

        }

        catch (err) {

            console.error("Follow-up Reminder Job Failed");

            console.error(err);

        }

    });

}

module.exports = startFollowUpReminderJob;