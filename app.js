// app.js
import express from "express";
import cors from "cors";
import fs from "fs";
import { errorHandler } from "./middleware/errorHandler.js";

const endpoints = JSON.parse(
  fs.readFileSync(new URL("./endpoints.json", import.meta.url))
);

// Import controllers
import {
  getTopics,
  postTopic,
} from "./controllers/topics.controller.js";

import {
  getArticles,
  getArticleById,
  postArticle,
  patchArticleVotes,
  deleteArticleById,
  getArticleComments,
  postComment,
} from "./controllers/articles.controller.js";

import {
  patchCommentVotes,
  deleteComment,
} from "./controllers/comments.controller.js";

import {
  getUsers,
  getUserByUsername,
} from "./controllers/users.controller.js";

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Root -> API endpoints list
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
app.patch("/api/articles/:article_id", patchArticleVotes);
app.delete("/api/articles/:article_id", deleteArticleById);

// Comments nested under articles
app.get("/api/articles/:article_id/comments", getArticleComments);
app.post("/api/articles/:article_id/comments", postComment);

// ------------------- COMMENTS -------------------
app.patch("/api/comments/:comment_id", patchCommentVotes);
app.delete("/api/comments/:comment_id", deleteComment);

// ------------------- USERS -------------------
app.get("/api/users", getUsers);
app.get("/api/users/:username", getUserByUsername);

// ------------------- 404 Handler for Wrong Paths -------------------
app.all("/*", (req, res) => {
  res.status(404).send({ msg: "Not Found" });
});

// ------------------- Error Handling -------------------
app.use(errorHandler);

export default app;