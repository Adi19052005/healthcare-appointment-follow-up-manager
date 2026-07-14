const { Kafka } = require('kafkajs');
const TOPICS = require('../src/constants/kafkaTopics');
require('dotenv').config();

async function publishSymptoms() {
    const kafka = new Kafka({ clientId: 'llm-test-publisher', brokers: [process.env.KAFKA_BROKER || 'localhost:9092'] });
    const producer = kafka.producer();
    await producer.connect();

    const payload = {
        appointmentId: 'test-appointment-1',
        patientName: 'Test Patient',
        age: 42,
        gender: 'female',
        symptoms: 'Fever for 3 days, mild cough, no breathing difficulty.'
    };

    await producer.send({
        topic: TOPICS.SYMPTOMS_SUBMITTED,
        messages: [
            { value: JSON.stringify(payload) }
        ]
    });

    console.log('Published test symptoms event to', TOPICS.SYMPTOMS_SUBMITTED);
    await producer.disconnect();
}

async function publishClinicalNotes() {
    const kafka = new Kafka({ clientId: 'llm-test-publisher', brokers: [process.env.KAFKA_BROKER || 'localhost:9092'] });
    const producer = kafka.producer();
    await producer.connect();

    const payload = {
        appointmentId: 'test-appointment-1',
        patientName: 'Test Patient',
        doctorName: 'Dr. Example',
        clinicalNotes: 'Patient presented with productive cough; prescribed antibiotics; follow-up in 7 days.',
        prescriptionLog: [{ name: 'Amoxicillin', dose: '500mg', frequency: '3x/day', duration: '7 days' }]
    };

    await producer.send({
        topic: TOPICS.CLINICAL_NOTES_ADDED,
        messages: [
            { value: JSON.stringify(payload) }
        ]
    });

    console.log('Published test clinical notes event to', TOPICS.CLINICAL_NOTES_ADDED);
    await producer.disconnect();
}

// CLI
const arg = process.argv[2] || 'symptoms';
if (arg === 'symptoms') publishSymptoms().catch(console.error);
else if (arg === 'clinical') publishClinicalNotes().catch(console.error);
else console.error('Unknown arg. Use `symptoms` or `clinical`.');
