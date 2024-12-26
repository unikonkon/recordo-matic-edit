import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Firebase configuration
const getFirebaseConfig = () => {
  const config = localStorage.getItem('firebaseConfig');
  if (!config) {
    throw new Error('Firebase configuration not found. Please configure Firebase first.');
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