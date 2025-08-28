// smoketest.js
import db from "./db/firebase.js";  // ✅ This imports your Firestore connection

try {
  const snapshot = await db.collection("test").get();
  console.log("✅ Connected to Firestore!");
  console.log("📦 Docs in test collection:", snapshot.size);
  process.exit(0);
} catch (err) {
  console.error("❌ Firestore connection failed:", err);
  process.exit(1);
}