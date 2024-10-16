const express = require('express');
const app = express();
const { getTopicsController } = require('./controllers/topic-controllers');
const { getArticleByIdController,getArticlesController, patchArticle } = require('./controllers/articles-controllers');
const { getCommentsByArticleId, postComment, deleteComment } = require('./controllers/comments-controllers');
const { getUsers } = require('./controllers/users-controllers');

app.use(express.json());

app.get('/api/topics', getTopicsController);

app.get('/api/articles/:article_id', getArticleByIdController);

app.get('/api/articles', getArticlesController);

app.get('/api/articles/:article_id/comments', getCommentsByArticleId);

app.post('/api/articles/:article_id/comments',postComment);

app.patch('/api/articles/:article_id', patchArticle)

app.delete('/api/comments/:comment_id', deleteComment);

app.get('/api/users', getUsers);






app.all('*', (req, res, next) => {
    res.status(404).send({ msg: 'not found'});
});

app.use((err, req, res, next) => {
    if (err.status) {
        res.status(err.status).send({ msg: err.msg});
    } else {
        res.status(500).send ({ msg: 'Internal server error '});
    }
});

module.exports = app;

