// app.js
import express from "express";
import cors from "cors";
import endpoints from "./endpoints.json" assert { type: "json" };
import { errorHandler } from "./middleware/errorHandler.js";

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
  deleteArticle,
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
app.delete("/api/articles/:article_id", deleteArticle);

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