const { Kafka } = require("kafkajs");

const kafka = new Kafka({
    clientId: "healthcare-backend",
    brokers: [process.env.KAFKA_BROKER]
});

const producer = kafka.producer();

/* ==========================================
   Connect Producer
========================================== */

async function connectProducer() {

    try {

        await producer.connect();

        console.log("Kafka Producer Connected");

    }

    catch (err) {

        console.error("Failed to Connect Kafka Producer");

        throw err;

    }

}

/* ==========================================
   Publish Event
========================================== */

async function publishEvent(topic, data) {

    try {

        await producer.send({

            topic,

            messages: [

                {

                    value: JSON.stringify(data)

                }

            ]

        });

        console.log(`Event Published -> ${topic}`);

    }

    catch (err) {

        console.error(`Failed to Publish Event -> ${topic}`);

        console.error(err);

        throw err;

    }

}

/* ==========================================
   Disconnect Producer
========================================== */

async function disconnectProducer() {

    await producer.disconnect();

    console.log("Kafka Producer Disconnected");

}

module.exports = {

    connectProducer,

    publishEvent,

    disconnectProducer

};