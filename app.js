const express = require('express');
const app = express();
const articlesRouter = require('./routers/articles-router');
const commentsRouter = require('./routers/comments-router');
const topicsRouter = require('./routers/topics-router');
const usersRouter = require('./routers/users-router');
const { getEndpoints } = require('./controllers/api-controllers');

app.use(express.json());

// API Endpoints
app.get('/api', getEndpoints);
app.use('/api/articles', articlesRouter);
app.use('/api/comments', commentsRouter);
app.use('/api/topics', topicsRouter);
app.use('/api/users', usersRouter);

// Error handling
app.all('*', (req, res) => {
    res.status(404).send({ msg: 'not found' });
});

app.use((err, req, res, next) => {
    if (err.status) {
        res.status(err.status).send({ msg: err.msg });
    } else {
        res.status(500).send({ msg: 'Internal server error' });
    }
});

module.exports = app;
