// Initializes the Firebase Admin SDK so the backend can:
//  - verify ID tokens issued to signed-in mobile clients
//  - read/write user profiles in Firestore
//
// Setup:
// 1. Firebase Console -> Project settings -> Service accounts -> Generate new private key
// 2. Save the downloaded JSON as backend/config/serviceAccountKey.json (NEVER commit this file)
//    OR set GOOGLE_APPLICATION_CREDENTIALS / the env vars below for cloud deployment.

const admin = require("firebase-admin");
const path = require("path");
require("dotenv").config();

let credential;

if (process.env.FIREBASE_SERVICE_ACCOUNT_JSON) {
  const serviceAccount = JSON.parse(
    process.env.FIREBASE_SERVICE_ACCOUNT_JSON
  );

  // Convert escaped newlines into actual newlines
  serviceAccount.private_key = serviceAccount.private_key.replace(
    /\\n/g,
    "\n"
  );

  credential = admin.credential.cert(serviceAccount);
} else {
  const keyPath = path.join(__dirname, "serviceAccountKey.json");
  credential = admin.credential.cert(require(keyPath));
}
} else {
  // Local development: load the downloaded service account file
  const keyPath = path.join(__dirname, "serviceAccountKey.json");
  credential = admin.credential.cert(require(keyPath));
}

admin.initializeApp({
  credential,
});

const db = admin.firestore();
const auth = admin.auth();

module.exports = { admin, db, auth };
