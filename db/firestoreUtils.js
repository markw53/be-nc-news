import admin from "firebase-admin";
import serviceAccount from "../serviceAccountKey.json" assert { type: "json" };

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

const db = admin.firestore();

export const clearFirestore = async () => {
  const collections = ["articles", "comments", "users", "topics"];
  for (let col of collections) {
    const snapshot = await db.collection(col).get();
    const batch = db.batch();
    snapshot.forEach((doc) => batch.delete(doc.ref));
    await batch.commit();
  }
};

export const seedFirestore = async (testData) => {
  // Example: loop over test data and insert into collections
  for (const topic of testData.topics) {
    await db.collection("topics").doc(topic.slug).set(topic);
  }
  for (const user of testData.users) {
    await db.collection("users").doc(user.username).set(user);
  }
  for (const article of testData.articles) {
    await db.collection("articles").doc(article.article_id).set(article);
  }
  for (const comment of testData.comments) {
    await db.collection("comments").doc(comment.comment_id).set(comment);
  }
};

export { db };