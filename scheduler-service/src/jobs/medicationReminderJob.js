const cron = require("node-cron");

const prisma = require("../config/prisma");

const {
    sendMedicationReminder
} = require("../services/reminderService");

/* ==========================================
   Medication Reminder Job
========================================== */

function startMedicationReminderJob() {

    // Runs every hour
    // Change to "* * * * *" while testing

    cron.schedule("0 * * * *", async () => {

        try {

            console.log("Running Medication Reminder Job...");

            const appointments = await prisma.appointment.findMany({

                where: {

                    status: "COMPLETED",

                    prescriptionLog: {

                        not: null

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

                await sendMedicationReminder(appointment);

            }

            console.log(

                `${appointments.length} Medication Reminder(s) Published`

            );

        }

        catch (err) {

            console.error("Medication Reminder Job Failed");

            console.error(err);

        }

    });

}

module.exports = startMedicationReminderJob;