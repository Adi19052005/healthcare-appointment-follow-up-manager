const { Kafka } = require("kafkajs");
require("dotenv").config();

const kafka = new Kafka({

    clientId: "llm-service",

    brokers: [process.env.KAFKA_BROKER]

});

const consumer = kafka.consumer({

    groupId: "llm-service-group"

});

/* ==========================================
   Connect Consumer
========================================== */

async function connectConsumer() {

    try {

        await consumer.connect();

        console.log("Kafka Consumer Connected");

    }

    catch (err) {

        console.error("Failed to Connect Kafka Consumer");

        throw err;

    }

}

/* ==========================================
   Subscribe Topics
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
   Start Consumer
========================================== */

async function startConsumer(handler) {

    await consumer.run({

        eachMessage: async ({ topic, partition, message }) => {

            try {

                const data = JSON.parse(

                    message.value.toString()

                );

                console.log(`Received Event -> ${topic}`);

                await handler(topic, data);

            }

            catch (err) {

                console.error(`Failed Processing Event -> ${topic}`);

                console.error(err);

            }

        }

    });

    console.log("Kafka Consumer Started");

}

/* ==========================================
   Disconnect Consumer
========================================== */

async function disconnectConsumer() {

    try {

        await consumer.disconnect();

        console.log("Kafka Consumer Disconnected");

    }

    catch (err) {

        console.error("Failed to Disconnect Kafka Consumer");

        console.error(err);

    }

}

module.exports = {

    connectConsumer,

    subscribe,

    startConsumer,

    disconnectConsumer

};