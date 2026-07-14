const prisma = require("../config/prisma");

const buildPostVisitPrompt = require("../prompts/postVisitPrompt");

const generateContent = require("./groqService");

/* ==========================================
   Generate Post-Visit Summary
========================================== */

async function generatePostVisitSummary(data) {

    try {

        const prompt = buildPostVisitPrompt({

            patientName: data.patientName,

            doctorName: data.doctorName,

            clinicalNotes: data.clinicalNotes,

            prescriptionLog: data.prescriptionLog

        });

        const response = await generateContent(prompt);

        let result;

        try {
            result = JSON.parse(response);
        } catch (err) {
            // attempt to extract JSON substring
            try {
                const first = response.indexOf('{');
                const last = response.lastIndexOf('}');
                if (first !== -1 && last !== -1 && last > first) {
                    const sub = response.substring(first, last + 1);
                    result = JSON.parse(sub);
                } else {
                    console.error('Invalid JSON Returned by Groq');
                    throw err;
                }
            } catch (err2) {
                console.error('Failed to parse JSON from Groq response');
                console.error('Response:', response);
                throw err2;
            }
        }

        await prisma.appointment.update({

            where: {

                id: data.appointmentId

            },

            data: {

                postSummary: result.postSummary

            }

        });

        console.log(
            `Post-Visit Summary Generated for Appointment ${data.appointmentId}`
        );

        return result;

    }

    catch (err) {

        console.error("Failed to Generate Post-Visit Summary");

        console.error(err);

        throw err;

    }

}

module.exports = generatePostVisitSummary;