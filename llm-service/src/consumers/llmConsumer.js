const {
    connectConsumer,
    subscribe,
    startConsumer
} = require("../utils/kafkaConsumer");

const TOPICS = require("../constants/kafkaTopics");

const generatePreVisitSummary = require("../services/preVisitSummaryService");

const generatePostVisitSummary = require("../services/postVisitSummaryService");

const prisma = require("../config/prisma");

/* ==========================================
   Start LLM Consumer
========================================== */

async function startLLMConsumer() {

    await connectConsumer();

    await subscribe([

        TOPICS.SYMPTOMS_SUBMITTED,

        TOPICS.CLINICAL_NOTES_ADDED,

        TOPICS.PRESCRIPTION_ADDED

    ]);

    await startConsumer(async (topic, data) => {

        try {

            console.log(`Processing Event -> ${topic}`);

                switch (topic) {

                /* ==========================================
                   Patient Submitted Symptoms
                ========================================== */

                case TOPICS.SYMPTOMS_SUBMITTED:

                    await generatePreVisitSummary(data);

                    console.log(
                        `Pre-Visit Summary Generated for Appointment ${data.appointmentId}`
                    );

                    break;

                /* ==========================================
                   Doctor Added Clinical Notes
                ========================================== */

                case TOPICS.CLINICAL_NOTES_ADDED:

                    await generatePostVisitSummary(data);

                    console.log(
                        `Post-Visit Summary Generated for Appointment ${data.appointmentId}`
                    );

                    break;

                case TOPICS.PRESCRIPTION_ADDED:

                    try {
                        // Ensure we have full context: fetch appointment details
                        const appointment = await prisma.appointment.findUnique({
                            where: { id: data.appointmentId },
                            include: {
                                patient: { include: { user: true } },
                                doctor: { include: { user: true } }
                            }
                        });

                        if (!appointment) {
                            console.warn(`Appointment not found for prescription event: ${data.appointmentId}`);
                            break;
                        }

                        const payload = {
                            appointmentId: appointment.id,
                            patientName: appointment.patient?.user?.name || "Patient",
                            doctorName: appointment.doctor?.user?.name || "Doctor",
                            clinicalNotes: appointment.clinicalNotes || null,
                            prescriptionLog: data.prescriptionLog || appointment.prescriptionLog || null
                        };

                        await generatePostVisitSummary(payload);

                        console.log(`Post-Visit Summary Generated for Appointment ${data.appointmentId} (prescription)`);
                    } catch (err) {
                        console.error(`Failed processing prescription event for appointment ${data.appointmentId}`);
                        console.error(err);
                    }

                    break;

                default:

                    console.warn(`Unhandled Topic: ${topic}`);

            }

        }

        catch (err) {

            console.error(`LLM Processing Failed for ${topic}`);

            console.error(err);

        }

    });

}

module.exports = startLLMConsumer;