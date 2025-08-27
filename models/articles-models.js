// models/articles-models.js
import db from "../db/firebase";

// ✅ 1. Get article by ID, including comment count
export const selectArticleById = async (article_id) => {
  const articleRef = db.collection("articles").doc(article_id);
  const articleSnap = await articleRef.get();

  if (!articleSnap.exists) {
    throw { status: 404, msg: `no article found for article_id ${article_id}` };
  }

  const article = articleSnap.data();

  // Count comments manually
  const commentsSnap = await db
    .collection("comments")
    .where("article_id", "==", article_id)
    .get();

  article.comment_count = commentsSnap.size;

  return article;
};

// ✅ 2. Get paginated / filtered articles
export const selectArticles = async (
  sort_by = "created_at",
  order = "desc",
  topic,
  limit = 10,
  page = 1
) => {
  const validSortByColumns = [
    "title",
    "topic",
    "author",
    "created_at",
    "votes",
  ];
  if (!validSortByColumns.includes(sort_by)) {
    throw { status: 400, msg: "Invalid sort_by query" };
  }

  const validOrder = ["asc", "desc"];
  if (!validOrder.includes(order)) {
    throw { status: 400, msg: "Invalid order query" };
  }

  let query = db.collection("articles");

  // Filter by topic if given
  if (topic) {
    const topicSnap = await db.collection("topics").doc(topic).get();
    if (!topicSnap.exists) {
      throw { status: 404, msg: "not found" };
    }
    query = query.where("topic", "==", topic);
  }

  // Firestore: orderBy + limit, replace OFFSET with cursor-based pagination
  query = query.orderBy(sort_by, order);

  const snapshot = await query.limit(Number(limit)).get();

  const articles = [];
  for (const doc of snapshot.docs) {
    const article = doc.data();
    // Count comments (may be heavy if large dataset, consider denormalizing later)
    const commentsSnap = await db
      .collection("comments")
      .where("article_id", "==", article.id)
      .get();
    article.comment_count = commentsSnap.size;
    articles.push(article);
  }

  // Total count for pagination
  const totalSnap = topic
    ? await db.collection("articles").where("topic", "==", topic).get()
    : await db.collection("articles").get();

  const total_count = totalSnap.size;

  return { articles, total_count };
};

// ✅ 3. Update article (e.g. patch votes)
export const updateArticle = async (article_id, input) => {
  const { inc_votes } = input;

  if (inc_votes === undefined || typeof inc_votes !== "number") {
    throw { status: 400, msg: "bad request" };
  }

  const ref = db.collection("articles").doc(article_id);
  const snap = await ref.get();

  if (!snap.exists) {
    throw { status: 404, msg: "article not found" };
  }

  const current = snap.data();
  const newVotes = (current.votes || 0) + inc_votes;

  await ref.update({ votes: newVotes });

  const updatedSnap = await ref.get();
  const article = updatedSnap.data();

  // Recount comments
  const commentsSnap = await db
    .collection("comments")
    .where("article_id", "==", article_id)
    .get();
  article.comment_count = commentsSnap.size;

  return article;
};

// ✅ 4. Insert new article
export const insertArticle = async ({
  author,
  title,
  body,
  topic,
  article_img_url = "https://images.pexels.com/photos/97050/pexels-photo-97050.jpeg?w=700&h=700",
}) => {
  const ref = db.collection("articles").doc();

  await ref.set({
    id: ref.id,
    author,
    title,
    body,
    topic,
    article_img_url,
    created_at: new Date(),
    votes: 0,
  });

  const snap = await ref.get();
  return { ...snap.data(), comment_count: 0 };
};

// ✅ 5. Remove article by ID (and cascade delete its comments)
export const removeArticleById = async (article_id) => {
  const ref = db.collection("articles").doc(article_id);
  const snap = await ref.get();

  if (!snap.exists) {
    throw { status: 404, msg: "Article not found" };
  }

  // Delete comments linked to the article
  const commentsSnap = await db
    .collection("comments")
    .where("article_id", "==", article_id)
    .get();

  const batch = db.batch();
  commentsSnap.docs.forEach((doc) => batch.delete(doc.ref));
  await batch.commit();

  // Delete the article itself
  await ref.delete();

  return true;
};