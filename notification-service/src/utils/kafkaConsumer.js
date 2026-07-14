const { Kafka } = require("kafkajs");
require("dotenv").config();

const kafka = new Kafka({
    clientId: "notification-service",
    brokers: [process.env.KAFKA_BROKER]
});

const consumer = kafka.consumer({
    groupId: "notification-service-group"
});

/* ==========================================
   Connect Consumer
========================================== */

async function connectConsumer() {

    try {

        await consumer.connect();

        console.log("Kafka Consumer Connected");

    } catch (err) {

        console.error("Kafka Consumer Connection Failed");
        throw err;

    }

}

/* ==========================================
   Subscribe to Topics
========================================== */

async function subscribe(topics) {

    for (const topic of topics) {

        await consumer.subscribe({
            topic,
            fromBeginning: false
        });

        console.log(`Subscribed to Topic: ${topic}`);

    }

}

/* ==========================================
   Start Listening
========================================== */

async function startConsumer(handler) {

    await consumer.run({

        eachMessage: async ({ topic, partition, message }) => {

            try {

                const data = JSON.parse(
                    message.value.toString()
                );

                console.log(`Received Event from ${topic}`);

                await handler(topic, data);

            } catch (err) {

                console.error("Kafka Message Processing Error");
                console.error(err);

            }

        }

    });

}

/* ==========================================
   Disconnect Consumer
========================================== */

async function disconnectConsumer() {

    await consumer.disconnect();

    console.log("Kafka Consumer Disconnected");

}

module.exports = {

    connectConsumer,

    subscribe,

    startConsumer,

    disconnectConsumer

};