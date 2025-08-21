// seed.js
import db from "../firebase.js";
import { convertTimestampToDate, createRef, formatComments } from "./utils.js";

const seed = async ({ topicData, userData, articleData, commentData }) => {
  // Optional: clear old data (Firestore has no `DROP TABLE`,
  // you'd just delete collections manually or via Admin SDK).
  // For dev, you might want to wipe collections:
  const collectionsToClear = ["topics", "users", "articles", "comments"];
  for (const coll of collectionsToClear) {
    const snapshot = await db.collection(coll).get();
    const batch = db.batch();
    snapshot.docs.forEach((doc) => batch.delete(doc.ref));
    await batch.commit();
  }

  // Insert Topics
  for (const { slug, description } of topicData) {
    await db.collection("topics").doc(slug).set({ slug, description });
  }

  // Insert Users
  for (const { username, name, avatar_url } of userData) {
    await db.collection("users").doc(username).set({ username, name, avatar_url });
  }

  // Insert Articles
  const formattedArticleData = articleData.map(convertTimestampToDate);
  const articleRefs = [];

  for (const {
    title,
    topic,
    author,
    body,
    created_at,
    votes = 0,
    article_img_url = "https://images.pexels.com/photos/97050/pexels-photo-97050.jpeg?w=700&h=700",
  } of formattedArticleData) {
    const ref = db.collection("articles").doc(); // Auto ID instead of SERIAL
    await ref.set({
      id: ref.id, // mimic PK
      title,
      topic,
      author,
      body,
      created_at,
      votes,
      article_img_url,
    });
    articleRefs.push({ title, id: ref.id });
  }

  // Build lookup (title → Firestore-generated ID)
  const articleIdLookup = createRef(articleRefs, "title", "id");

  // Insert Comments
  const formattedCommentData = formatComments(commentData, articleIdLookup);

  for (const {
    body,
    author,
    article_id,
    votes = 0,
    created_at,
  } of formattedCommentData) {
    const ref = db.collection("comments").doc();
    await ref.set({
      id: ref.id,
      body,
      author,
      article_id,
      votes,
      created_at,
    });
  }

  console.log("🔥 Firestore seeding complete!");
};

export default seed;