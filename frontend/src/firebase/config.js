import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyC_3e9OIcOSkkCXVk6FfHpXXk4GT1UCsqc",
  authDomain: "alto-word-ai.firebaseapp.com",
  projectId: "alto-word-ai",
  storageBucket: "alto-word-ai.firebasestorage.app",
  messagingSenderId: "732606999699",
  appId: "1:732606999699:web:215cb15c7dc6e9959a7166"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export { auth };
export default app; 