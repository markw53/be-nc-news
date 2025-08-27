// models/topics-models.js
import db from "../db/firestoreUtils.js";

/**
 * Get all topics
 */
export const getTopics = async () => {
  const snapshot = await db.collection("topics").get();

  const topics = snapshot.docs.map((doc) => doc.data());
  return topics;
};

/**
 * Insert a new topic into Firestore (slug used as doc ID)
 */
export const insertTopic = async (slug, description) => {
  if (!slug || typeof slug !== "string" || !description || typeof description !== "string") {
    throw { status: 400, msg: "bad request" };
  }

  const ref = db.collection("topics").doc(slug);

  const topicDoc = {
    slug,
    description,
  };

  await ref.set(topicDoc);

  const snap = await ref.get();
  return snap.data();
};