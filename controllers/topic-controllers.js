const { getTopics } = require('../models/topic-models');

exports.getTopicsController = (req, res, next) => {
    getTopics()
    .then((topics) => {
        res.status(200).send({ topics });
    })
    .catch((err) => {
        next(err);
    });
};