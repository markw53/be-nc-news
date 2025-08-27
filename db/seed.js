// seed.js
import db from "../db/firebase.js"; 
import articles from "./data/test-data/articles.js";
import topics from "./data/test-data/topics.js";
import users from "./data/test-data/users.js";
import comments from "./data/test-data/comments.js";

async function clearAndSeed() {
  try {
    console.log("🌱 Starting Firestore seed...");

    // ---------------- Clear old collections ----------------
    const collections = ["articles", "topics", "users", "comments"];
    for (let col of collections) {
      const snapshot = await db.collection(col).get();
      const batch = db.batch();
      snapshot.docs.forEach((doc) => batch.delete(doc.ref));
      await batch.commit();
      console.log(`Cleared collection: ${col}`);
    }

    // ---------------- Insert Topics ----------------
    for (let topic of topics) {
      await db.collection("topics").doc(topic.slug).set({
        description: topic.description,
      });
    }
    console.log("✅ Topics seeded");

    // ---------------- Insert Users ----------------
    for (let user of users) {
      await db.collection("users").doc(user.username).set(user);
    }
    console.log("✅ Users seeded");

    // ---------------- Insert Articles ----------------
    for (let article of articles) {
      const { article_id, ...data } = article;
      await db.collection("articles").doc(article_id).set({
        ...data,
        votes: data.votes ?? 0,
        created_at: new Date(data.created_at), // Ensure Timestamp type
      });
    }
    console.log("✅ Articles seeded");

    // ---------------- Insert Comments ----------------
    for (let comment of comments) {
      const { comment_id, ...data } = comment;
      await db.collection("comments").doc(comment_id).set({
        ...data,
        votes: data.votes ?? 0,
        created_at: new Date(data.created_at),
      });
    }
    console.log("✅ Comments seeded");

    console.log("🌟 Done seeding Firestore!");
    process.exit(0);
  } catch (err) {
    console.error("❌ Error seeding Firestore:", err);
    process.exit(1);
  }
}

clearAndSeed();