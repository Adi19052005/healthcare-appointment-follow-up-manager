const admin = require("firebase-admin");
const path = require("path");
const fs = require("fs");

let messaging = null;

try {

    const serviceAccountPath = path.join(
        __dirname,
        "../firebase-service-account.json"
    );

    if (!fs.existsSync(serviceAccountPath)) {

        console.warn("Firebase Service Account not found.");
        console.warn("Push notifications are disabled.");

    } else {

        if (!admin.apps.length) {

            admin.initializeApp({

                credential: admin.credential.cert(
                    require(serviceAccountPath)
                )

            });

        }

        messaging = admin.messaging();

        console.log("Firebase initialized successfully.");

    }

} catch (err) {

    console.error("Firebase Initialization Error");

    console.error(err);

}

module.exports = {

    admin,

    messaging

};