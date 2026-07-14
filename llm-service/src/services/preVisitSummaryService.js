const prisma = require("../config/prisma");

const buildPreVisitPrompt = require("../prompts/preVisitPrompt");

const generateContent = require("./groqService");

/* ==========================================
   Generate Pre-Visit Summary
========================================== */

async function generatePreVisitSummary(data) {

    try {

        const prompt = buildPreVisitPrompt({
            patientName: data.patientName,
            age: data.age,
            gender: data.gender,
            symptoms: data.symptoms,
            allergies: data.allergies,
            bloodGroup: data.bloodGroup,
            specialization: data.specialization
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

                urgencyLevel: result.urgencyLevel,

                preSummary: result.preSummary

            }

        });

        console.log(
            `Pre-Visit Summary Generated for Appointment ${data.appointmentId}`
        );

        return result;

    }

    catch (err) {

        console.error("Failed to Generate Pre-Visit Summary");

        console.error(err);

        throw err;

    }

}

module.exports = generatePreVisitSummary;