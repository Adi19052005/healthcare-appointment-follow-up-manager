const cron = require("node-cron");

const prisma = require("../config/prisma");

const {
    markAppointmentNoShow
} = require("../services/reminderService");

/* ==========================================
   Missed Appointment Job
========================================== */

function startMissedAppointmentJob() {

    // Runs every hour
    // Change to "* * * * *" while testing

    cron.schedule("0 * * * *", async () => {

        try {

            console.log("Running Missed Appointment Job...");

            const now = new Date();

            const today = new Date(now);

            today.setHours(0, 0, 0, 0);

            const currentTime = now.toLocaleTimeString("en-GB", {

                hour: "2-digit",

                minute: "2-digit",

                hour12: false

            });

            const appointments = await prisma.appointment.findMany({

                where: {

                    status: "BOOKED",

                    appointmentDate: {

                        lte: today

                    }

                }

            });

            let noShowCount = 0;

            for (const appointment of appointments) {

                const isPastAppointment =

                    appointment.appointmentDate < today ||

                    (
                        appointment.appointmentDate.getTime() === today.getTime() &&
                        appointment.slotStartTime < currentTime
                    );

                if (isPastAppointment) {

                    await markAppointmentNoShow(
                        appointment.id
                    );

                    noShowCount++;

                }

            }

            console.log(

                `${noShowCount} Appointment(s) Marked as NO_SHOW`

            );

        }

        catch (err) {

            console.error("Missed Appointment Job Failed");

            console.error(err);

        }

    });

}

module.exports = startMissedAppointmentJob;