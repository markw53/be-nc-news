// models/users-models.js
import db from "../db/firestoreUtils.js";

/**
 * Get all users
 */
export const selectUsers = async () => {
  const snapshot = await db.collection("users").get();

  const users = snapshot.docs.map((doc) => doc.data());
  return users;
};

/**
 * Get a single user by username
 */
export const selectUserByUsername = async (username) => {
  if (!username || typeof username !== "string") {
    throw { status: 400, msg: "bad request" };
  }

  const ref = db.collection("users").doc(username);
  const snap = await ref.get();

  if (!snap.exists) {
    throw { status: 404, msg: `no user found for username ${username}` };
  }

  return snap.data();
};