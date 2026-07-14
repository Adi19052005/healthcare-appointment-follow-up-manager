require('dotenv').config({ path: require('path').resolve(__dirname, '../../.env') });
const prisma = require('../config/prisma');
const { publishEvent, connectProducer, disconnectProducer } = require('../utils/kafkaProducer');
const Topics = require('../utils/kafkaTopics');

async function run() {
    try {
        await prisma.$connect();
        console.log('DB connected');

        const patient = await prisma.patient.findFirst({ include: { user: true } });
        const doctor = await prisma.doctor.findFirst({ include: { user: true } });

        if (!patient || !doctor) {
            console.error('No patient or doctor found in DB. Seed data required.');
            process.exit(1);
        }

        const appointment = await prisma.appointment.create({
            data: {
                patientId: patient.id,
                doctorId: doctor.id,
                appointmentDate: new Date(),
                slotStartTime: '09:00',
                symptoms: 'Cough, fever, sore throat',
                status: 'BOOKED'
            }
        });

        console.log('Created appointment', appointment.id);

        await connectProducer();

        const bookingEndTime = new Date();
        bookingEndTime.setMinutes(bookingEndTime.getMinutes() + 30);

        const eventPayload = {
            appointmentId: appointment.id,
            patientId: patient.id,
            patientName: patient.user?.name,
            patientEmail: patient.user?.email,
            doctorId: doctor.id,
            doctorName: doctor.user?.name,
            doctorEmail: doctor.user?.email,
            appointmentDate: appointment.appointmentDate,
            slotStartTime: appointment.slotStartTime,
            slotEndTime: bookingEndTime.toISOString()
        };

        console.log('Publishing appointment.booked', eventPayload);
        await publishEvent(Topics.APPOINTMENT_BOOKED, eventPayload);

        const llmPayload = {
            appointmentId: appointment.id,
            patientName: patient.user?.name,
            age: patient.age || null,
            gender: patient.gender || null,
            symptoms: appointment.symptoms,
            bloodGroup: patient.bloodGroup || null,
            allergies: patient.allergies || null,
            doctorId: doctor.id,
            doctorName: doctor.user?.name,
            specialization: doctor.specialization || null,
            appointmentDate: appointment.appointmentDate,
            slotStartTime: appointment.slotStartTime
        };

        console.log('Publishing symptoms.submitted', llmPayload);
        await publishEvent(Topics.SYMPTOMS_SUBMITTED, llmPayload);

        await disconnectProducer();
        console.log('Done');
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

run();
