//=========================================================
// Firebase Configuration
// MagnopVS
//=========================================================

import { initializeApp } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-app.js";

import { getAuth } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";

import { getFirestore } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

import { getStorage } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-storage.js";

const firebaseConfig = {

    apiKey: "AIzaSyCAvQ8nzBZhNw5sX4Xa6iN1vMShkTMNq5k",

    authDomain: "magnopvs.firebaseapp.com",

    projectId: "magnopvs",

    storageBucket: "magnopvs.firebasestorage.app",

    messagingSenderId: "645372506505",

    appId: "1:645372506505:web:ebfc53e489ff4f40cf3158"

};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);

export const db = getFirestore(app);

export const storage = getStorage(app);