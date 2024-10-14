const express = require('express');
const app = express();
const  { getTopicsController } = require('./controllers/topic-controllers');

app.use(express.json());

app.get('/api/topics', getTopicsController);






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

