const { getTopics, insertTopic } = require('../models/topic-models');

exports.getTopicsController = (req, res, next) => {
    getTopics()
    .then((topics) => {
        res.status(200).send({ topics });
    })
    .catch((err) => {
        next(err);
    });
};

exports.addTopic = (req, res, next) => {
    const { slug, description } = req.body;

    insertTopic(slug, description)
        .then((topic) => {
            res.status(201).send({ topic });
        })
        .catch(next); 
};