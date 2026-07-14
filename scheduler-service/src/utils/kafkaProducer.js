const { Kafka } = require("kafkajs");
require("dotenv").config();

const kafka = new Kafka({

    clientId: "scheduler-service",

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

        console.error("Kafka Producer Connection Failed");

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

        console.log(`Published Event -> ${topic}`);

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