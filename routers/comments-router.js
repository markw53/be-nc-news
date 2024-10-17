const express = require('express');
const { updateCommentVotes } = require('../controllers/comments-controllers');
const { deleteComment } = require('../controllers/comments-controllers');

const commentsRouter = express.Router();

commentsRouter.patch('/:comment_id', updateCommentVotes);

commentsRouter.delete('/:comment_id', deleteComment);

module.exports = commentsRouter;
