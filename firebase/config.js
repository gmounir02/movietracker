// Firebase configuration and initialization.
// Remplacez les valeurs ci-dessous par celles de votre projet Firebase.
// Si vous n'avez pas encore configuré Firebase, créez un projet sur
// https://console.firebase.google.com/ puis récupérez les clés de configuration.

import { initializeApp } from "firebase/app";
import { initializeAuth, getReactNativePersistence } from "firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// TODO: Remplacez ces valeurs par votre configuration Firebase
const firebaseConfig = {
  apiKey: "AIzaSyAwo7PEeqRUF9EC6sNAaSAHBtz8Zqv896M",
  authDomain: "movietracker-61b61.firebaseapp.com",
  projectId: "movietracker-61b61",
  storageBucket: "movietracker-61b61.firebasestorage.app",
  messagingSenderId: "801638570800",
  appId: "1:801638570800:web:adb7dacbb8b2d8e931c6f5",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Auth with React Native persistence (AsyncStorage)
export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});

// Firestore export
export const db = getFirestore(app);
// Storage export
export const storage = getStorage(app);

// Note pédagogique:
// - `auth` est utilisé pour l'authentification (email/password)
// - `db` est l'instance Firestore où nous stockerons les films utilisateur
