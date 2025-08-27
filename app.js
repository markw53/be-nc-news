// app.js
import express from "express";
import cors from "cors";
import fs from "fs";
import { errorHandler } from "./middleware/errorHandler.js";

const endpoints = JSON.parse(
  fs.readFileSync(new URL("./endpoints.json", import.meta.url))
);

// ------------------- IMPORT CONTROLLERS -------------------

// Topics
import { getTopics, postTopic } from "./controllers/topics.controller.js";

// Articles
import {
  getArticles,
  getArticleById,
  postArticle,
  patchArticle,
  patchArticleVotes,
  deleteArticleById,
} from "./controllers/articles.controller.js";

// Comments
import {
  getCommentsByArticleId,
  postComment,
  patchCommentVotes,
  deleteComment,
} from "./controllers/comments.controller.js";

// Users
import { getUsers, getUserByUsername } from "./controllers/users.controller.js";

const app = express();

// ------------------- MIDDLEWARE -------------------
app.use(cors());
app.use(express.json());

// ------------------- ROOT ENDPOINT -------------------
app.get("/api", (req, res) => {
  res.status(200).send({ endpoints });
});

// ------------------- TOPICS -------------------
app.get("/api/topics", getTopics);
app.post("/api/topics", postTopic);

// ------------------- ARTICLES -------------------
app.get("/api/articles", getArticles);
app.get("/api/articles/:article_id", getArticleById);
app.post("/api/articles", postArticle);
app.patch("/api/articles/:article_id", patchArticle);
app.patch("/api/articles/:article_id/votes", patchArticleVotes);
app.delete("/api/articles/:article_id", deleteArticleById);

// ------------------- COMMENTS -------------------
app.get("/api/articles/:article_id/comments", getCommentsByArticleId);
app.post("/api/articles/:article_id/comments", postComment);
app.patch("/api/comments/:comment_id/votes", patchCommentVotes);
app.delete("/api/comments/:comment_id", deleteComment);

// ------------------- USERS -------------------
app.get("/api/users", getUsers);
app.get("/api/users/:username", getUserByUsername);

// ------------------- 404 Handler -------------------
app.all("/*", (req, res) => {
  res.status(404).send({ msg: "Not Found" });
});

// ------------------- ERROR HANDLING -------------------
app.use(errorHandler);

export default app;