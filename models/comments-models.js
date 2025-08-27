// models/comments-models.js
import db from "../db/firebase";
import { FieldValue } from "firebase-admin/firestore";

/**
 * Get comments for a given article_id
 * Supports pagination
 */
export const selectCommentsByArticleId = async (article_id, limit = 10, p = 1) => {
  if (!article_id || typeof article_id !== "string") {
    throw { status: 400, msg: "bad request" };
  }

  if (isNaN(limit) || isNaN(p)) {
    throw { status: 400, msg: "invalid limit or page number" };
  }

  const offset = (p - 1) * limit;

  let query = db.collection("comments").where("article_id", "==", article_id);
  query = query.orderBy("created_at", "desc"); // Firestore requires orderBy before limit

  // Firestore does not support OFFSET directly, so in production you'd use cursor-based pagination
  // For dev we simulate offset with array slice
  const snapshot = await query.limit(limit + offset).get();

  if (snapshot.empty) {
    throw { status: 404, msg: `no comments found for article_id ${article_id}` };
  }

  const all = snapshot.docs.map((doc) => doc.data());

  // Fake offset via slice since Firestore doesn't support OFFSET
  const comments = all.slice(offset, offset + Number(limit));

  return comments;
};

/**
 * Insert a new comment into Firestore
 */
export const insertComment = async (article_id, inputComment) => {
  const { username, body } = inputComment;

  if (!username || typeof username !== "string" || !body || typeof body !== "string") {
    throw { status: 400, msg: "bad request" };
  }

  // Check if article exists (to mimic foreign key constraint)
  const articleRef = db.collection("articles").doc(article_id);
  const articleSnap = await articleRef.get();

  if (!articleSnap.exists) {
    throw { status: 400, msg: "bad request" }; // invalid article_id
  }

  // Check if user exists (mimic foreign key)
  const userRef = db.collection("users").doc(username);
  const userSnap = await userRef.get();

  if (!userSnap.exists) {
    throw { status: 400, msg: "bad request" }; // invalid user
  }

  // Create new comment
  const ref = db.collection("comments").doc();
  const newComment = {
    id: ref.id,
    author: username,
    body,
    article_id,
    created_at: new Date(),
    votes: 0,
  };

  await ref.set(newComment);

  return newComment;
};

/**
 * Check whether an article exists
 */
export const checkArticleExists = async (article_id) => {
  const articleRef = db.collection("articles").doc(article_id);
  const articleSnap = await articleRef.get();

  if (!articleSnap.exists) {
    throw { status: 404, msg: "article not found" };
  }
};

/**
 * Delete a comment by its id
 */
export const removeComment = async (comment_id) => {
  const ref = db.collection("comments").doc(comment_id);
  const snap = await ref.get();

  if (!snap.exists) {
    throw { status: 404, msg: `no comment found for comment_id ${comment_id}` };
  }

  await ref.delete();
  return true;
};

/**
 * PATCH - Update votes on a comment (increment/decrement)
 */
export const patchCommentVotes = async (comment_id, inc_votes) => {
  try {
    if (typeof inc_votes !== "number") {
      const err = new Error("Invalid vote increment");
      err.status = 400;
      throw err;
    }

    const commentRef = db.collection("comments").doc(comment_id);
    const commentDoc = await commentRef.get();

    if (!commentDoc.exists) {
      return null; // controller will turn this into 404
    }

    await commentRef.update({
      votes: FieldValue.increment(inc_votes),
    });

    // fetch updated doc
    const updatedDoc = await commentRef.get();
    return { id: updatedDoc.id, ...updatedDoc.data() };
  } catch (err) {
    throw err;
  }
};