// Renaming model import to avoid clash
import { getTopics as selectTopics, insertTopic } from '../models/topic-models.js';

export const getTopics = (req, res, next) => {
    selectTopics()
        .then((topics) => {
            res.status(200).send({ topics });
        })
        .catch(next);
};

export const postTopic = (req, res, next) => {
    const { slug, description } = req.body;

    insertTopic(slug, description)
        .then((topic) => {
            res.status(201).send({ topic });
        })
        .catch(next);
};