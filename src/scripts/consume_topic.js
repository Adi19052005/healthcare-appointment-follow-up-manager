const { Kafka } = require('kafkajs');
require('dotenv').config({ path: require('path').resolve(__dirname, '../.env') });

async function run() {
  const kafka = new Kafka({ brokers: [process.env.KAFKA_BROKER || 'localhost:9092'] });
  const consumer = kafka.consumer({ groupId: 'debug-consumer-' + Date.now() });
  const topic = process.argv[2];
  if (!topic) { console.error('Usage: node consume_topic.js <topic>'); process.exit(1); }
  await consumer.connect();
  await consumer.subscribe({ topic, fromBeginning: false });
  console.log('Subscribed to', topic);
  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      console.log('Message received:', { topic, partition, value: message.value.toString() });
      // exit after first message
      await consumer.disconnect();
      process.exit(0);
    }
  });
}
run().catch(err => { console.error(err); process.exit(1); });
