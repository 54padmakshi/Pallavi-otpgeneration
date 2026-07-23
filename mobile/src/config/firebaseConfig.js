// Firebase client SDK configuration
// 1. Go to https://console.firebase.google.com -> your project -> Project settings
// 2. Under "Your apps", add a Web app (yes, Web — the JS SDK is used even for RN/Expo)
// 3. Copy the config values below
// 4. In Firebase Console -> Authentication -> Sign-in method -> enable "Phone"

import { initializeApp, getApps, getApp } from "firebase/app";
import { initializeAuth, getReactNativePersistence, getAuth } from "firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Platform } from "react-native";

const firebaseConfig = {
  apiKey: "YOUR_FIREBASE_API_KEY",
  authDomain: "your-project-id.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project-id.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID",
};

const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

// initializeAuth with AsyncStorage persistence so the user stays logged in
let auth;
try {
  auth = initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage),
  });
} catch (e) {
  // initializeAuth throws if already initialized (e.g. fast-refresh) — fall back
  auth = getAuth(app);
}

export { app, auth, firebaseConfig };
