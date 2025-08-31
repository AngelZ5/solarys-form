// Importa os SDKs
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Configuração do seu projeto Firebase
const firebaseConfig = {
  apiKey: "AIzaSyAoWVhq7QkjMionf2A-DMdRptKF67Z9Rbw",
  authDomain: "solarys-form.firebaseapp.com",
  projectId: "solarys-form",
  storageBucket: "solarys-form.firebasestorage.app",
  messagingSenderId: "198531340598",
  appId: "1:198531340598:web:8e9594cb054cdbdb457b97",
  measurementId: "G-Y2172VWT68",
};

// Inicializa Firebase
const app = initializeApp(firebaseConfig);

// Exporta instâncias para usar em outras partes do código
export const auth = getAuth(app);
export const db = getFirestore(app);
