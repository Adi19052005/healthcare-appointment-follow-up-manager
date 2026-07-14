require('dotenv').config({ path: require('path').resolve(__dirname, '../.env') });
const prisma = require('../config/prisma');
const { publishEvent, connectProducer, disconnectProducer } = require('../utils/kafkaProducer');
const Topics = require('../utils/kafkaTopics');

async function run() {
  try {
    await prisma.$connect();
    console.log('DB connected');

    const appointment = await prisma.appointment.findFirst({ include: { patient: { include: { user: true } }, doctor: { include: { user: true } } } });
    if (!appointment) {
      console.error('No appointment found to use for prescription test');
      process.exit(1);
    }

    const prescription = {
      appointmentId: appointment.id,
      patientId: appointment.patientId,
      patientName: appointment.patient?.user?.name,
      patientEmail: appointment.patient?.user?.email,
      doctorId: appointment.doctorId,
      doctorName: appointment.doctor?.user?.name,
      doctorEmail: appointment.doctor?.user?.email,
      issuedAt: new Date().toISOString(),
      prescriptionLog: [
        { medicine: 'Paracetamol', dose: '500mg', frequency: 'Twice a day', duration: '5 days' }
      ]
    };

    await connectProducer();
    console.log('Publishing prescription.added', prescription);
    await publishEvent(Topics.PRESCRIPTION_ADDED, prescription);
    await disconnectProducer();
    console.log('Done');
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

run();
