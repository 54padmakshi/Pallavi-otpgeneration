// Initializes the Firebase Admin SDK so the backend can:
//  - verify ID tokens issued to signed-in mobile clients
//  - read/write user profiles in Firestore

const admin = require("firebase-admin");
const path = require("path");
require("dotenv").config();

let serviceAccount;

if (process.env.FIREBASE_SERVICE_ACCOUNT_JSON) {
  serviceAccount = JSON.parse(
    process.env.FIREBASE_SERVICE_ACCOUNT_JSON
  );

  // Convert escaped newlines into actual newlines
  serviceAccount.private_key = serviceAccount.private_key.replace(
    /\\n/g,
    "\n"
  );
} else {
  // Local development
  serviceAccount = require(path.join(__dirname, "serviceAccountKey.json"));
}

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

const db = admin.firestore();
const auth = admin.auth();

module.exports = { admin, db, auth };
