// src/firebase.ts
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: 'AIzaSyAcAYZ1JYGs5yqX3MdOF4qFDataBLwn3yw',
  authDomain: 'tienda-65655.firebaseapp.com',
  projectId: 'tienda-65655',
  storageBucket: 'tienda-65655.firebasestorage.app',
  messagingSenderId: '968578468430',
  appId: '1:968578468430:web:d3487d1139777b1954d11f',
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };
