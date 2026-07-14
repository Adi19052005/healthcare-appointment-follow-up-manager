require('dotenv').config({ path: require('path').resolve(__dirname, '../.env') });
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const id = process.argv[2];
if (!id) {
  console.error('Usage: node get_appointment.js <appointmentId>');
  process.exit(1);
}

async function run() {
  try {
    const appt = await prisma.appointment.findUnique({ where: { id } });
    if (!appt) {
      console.log('Appointment not found:', id);
      return;
    }
    console.log('Appointment:', {
      id: appt.id,
      preSummary: appt.preSummary,
      postSummary: appt.postSummary,
      clinicalNotes: appt.clinicalNotes,
      prescriptionLog: appt.prescriptionLog,
      urgencyLevel: appt.urgencyLevel,
      symptoms: appt.symptoms
    });
  } catch (e) {
    console.error('Error fetching appointment:', e.message || e);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

run();
