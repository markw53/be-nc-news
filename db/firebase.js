import { initializeApp, cert } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import dotenv from "dotenv";
import serviceAccount from "../serviceAccountKey.json";

dotenv.config();

// Initialize Firebase Admin App
const app = initializeApp({
  credential: cert(serviceAccount),
});

const db = getFirestore(app);

export default db;