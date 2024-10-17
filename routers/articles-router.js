const express = require('express');
const { getArticleByIdController, getArticlesController, patchArticle, postArticle, deleteArticleById } = require('../controllers/articles-controllers');
const { getCommentsByArticleId, postComment } = require('../controllers/comments-controllers');

const articlesRouter = express.Router();

articlesRouter.get('/:article_id', getArticleByIdController);

articlesRouter.get('/', getArticlesController);

articlesRouter.patch('/:article_id', patchArticle);

articlesRouter.get('/:article_id/comments', getCommentsByArticleId);

articlesRouter.post('/:article_id/comments', postComment);

articlesRouter.post('/', postArticle);

articlesRouter.delete('/:article_id', deleteArticleById);

module.exports = articlesRouter;
