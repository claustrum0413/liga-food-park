import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: 'AIzaSyDrVRJjYZMA8ozKYIEPJDghflbdGHgaAN4',
  authDomain: 'food-parktrue.firebaseapp.com',
  projectId: 'food-parktrue',
  storageBucket: 'food-parktrue.firebasestorage.app',
  messagingSenderId: '143000205009',
  appId: '1:143000205009:web:2d1ede890492068d9eb7f0',
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);