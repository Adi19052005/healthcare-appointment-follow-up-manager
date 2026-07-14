const { Kafka } = require("kafkajs");

const kafka = new Kafka({
  clientId: process.env.KAFKA_CLIENT_ID || "healthcare-backend",
  brokers: [process.env.KAFKA_BROKER],
});

const producer = kafka.producer();

let isConnected = false;

/* ==========================================
   Connect Producer
========================================== */

async function connectProducer() {
  if (isConnected) return;

  try {
    await producer.connect();

    isConnected = true;

    console.log("✓ Kafka Producer Connected");
  } catch (err) {
    isConnected = false;

    console.error("Failed to Connect Kafka Producer");
    throw err;
  }
}

/* ==========================================
   Publish Event
========================================== */

async function publishEvent(topic, data) {
  try {
    // reconnect automatically if needed
    if (!isConnected) {
      console.log("Kafka Producer not connected. Reconnecting...");
      await connectProducer();
    }

    await producer.send({
      topic,
      messages: [
        {
          value: JSON.stringify(data),
        },
      ],
    });

    console.log(`✓ Event Published -> ${topic}`);
  } catch (err) {
    console.error(`Failed to Publish Event -> ${topic}`);

    // producer probably disconnected
    isConnected = false;

    try {
      console.log("Retrying Kafka connection...");

      await connectProducer();

      await producer.send({
        topic,
        messages: [
          {
            value: JSON.stringify(data),
          },
        ],
      });

      console.log(`✓ Event Published After Retry -> ${topic}`);
    } catch (retryErr) {
      console.error("Retry Failed");
      console.error(retryErr);

      throw retryErr;
    }
  }
}

/* ==========================================
   Disconnect Producer
========================================== */

async function disconnectProducer() {
  try {
    await producer.disconnect();
  } finally {
    isConnected = false;
    console.log("Kafka Producer Disconnected");
  }
}

module.exports = {
  connectProducer,
  publishEvent,
  disconnectProducer,
};
