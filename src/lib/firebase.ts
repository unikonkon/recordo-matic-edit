import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Firebase configuration
const getFirebaseConfig = () => {
  const config = localStorage.getItem('firebaseConfig');
  if (!config) {
    const defaultConfig = {
      apiKey: "AIzaSyDoIJe3C2Csgzfe_dn9GAsvkiMIc5edAuU",
      authDomain: "iapp-record.firebaseapp.com",
      databaseURL: "https://iapp-record-default-rtdb.asia-southeast1.firebasedatabase.app", 
      projectId: "iapp-record",
      storageBucket: "iapp-record.firebasestorage.app",
      messagingSenderId: "926056113596",
      appId: "1:926056113596:web:9943ef50cbb9b7d5b337b9",
      measurementId: "G-P1ZK4MRF7B"
    };
    localStorage.setItem('firebaseConfig', JSON.stringify(defaultConfig));
    return defaultConfig;
  }
  return JSON.parse(config);
};

// Initialize Firebase
let app;
try {
  const firebaseConfig = getFirebaseConfig();
  app = initializeApp(firebaseConfig);
} catch (error) {
  console.error('Error initializing Firebase:', error);
}

export const auth = app ? getAuth(app) : null;
export const db = app ? getFirestore(app) : null;
export { app };