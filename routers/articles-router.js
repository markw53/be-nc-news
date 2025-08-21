// routers/articles-router.js
import express from "express";
import {
  getArticleByIdController,
  getArticlesController,
  patchArticle,
  postArticle,
  deleteArticleById,
} from "../controllers/articles-controllers.js";

import {
  getCommentsByArticleId,
  postComment,
} from "../controllers/comments-controllers.js";

const articlesRouter = express.Router();

articlesRouter.get("/:article_id", getArticleByIdController);

articlesRouter.get("/", getArticlesController);

articlesRouter.patch("/:article_id", patchArticle);

articlesRouter.get("/:article_id/comments", getCommentsByArticleId);

articlesRouter.post("/:article_id/comments", postComment);

articlesRouter.post("/", postArticle);

articlesRouter.delete("/:article_id", deleteArticleById);

export default articlesRouter;