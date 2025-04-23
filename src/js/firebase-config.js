// Importa las funciones que necesitas de los SDKs
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getStorage, ref, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-storage.js";

// Tu configuración de Firebase
const firebaseConfig = {
    apiKey: "AIzaSyALQrTdHfU2An7wW1_42iJ7iqilrWYG92E",
    authDomain: "swapping-9bb7a.firebaseapp.com",
    projectId: "swapping-9bb7a",
    storageBucket: "swapping-9bb7a.firebasestorage.app",
    messagingSenderId: "284549257225",
    appId: "1:284549257225:web:9711093f86b85599e6c0d8",
};

// Inicializa Firebase
const app = initializeApp(firebaseConfig);
const storage = getStorage(app);

export { storage, ref, uploadBytes, getDownloadURL };