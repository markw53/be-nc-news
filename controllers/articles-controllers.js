const { selectArticleById, selectArticles, updateArticle, insertArticle, removeArticleById } = require('../models/articles-models');

exports.getArticleByIdController = (req, res, next) => {
    const { article_id } = req.params;
    selectArticleById(article_id)
        .then((article) => {
            res.status(200).send({ article });
        })
        .catch((err) => {
            next(err);
        });
};

exports.getArticlesController = (req, res, next) => {
    const { sort_by, order, topic, limit = 10, p = 1 } = req.query;

    const validParams = ['sort_by', 'order', 'topic', 'limit', 'p'];
    for (let key in req.query) {
        if (!validParams.includes(key)) {
            return res.status(400).send({ msg: "bad request" });
        }
    }

    selectArticles(sort_by, order, topic, limit, p)
        .then(({ articles, total_count }) => {
            res.status(200).send({ articles, total_count: Number(total_count) });
        })
        .catch((err) => {
            if (err.status) {
                res.status(err.status).send({ msg: err.msg });
            } else {
                next(err);
            }
        });
};

exports.patchArticle = (req, res, next) => {
    const { article_id } = req.params;
    const input = req.body;

    updateArticle(article_id, input)
        .then((article) => {
            res.status(201).send({ article });
        })
        .catch((err) => {
            if (err.status) {
                res.status(err.status).send({ msg: err.msg });
            } else {
                next(err);
            }
        });
};

exports.postArticle = (req, res, next) => {
    const newArticle = req.body;

    insertArticle(newArticle)
        .then((article) => {
            res.status(201).send({ article });
        })
        .catch((err) => {
            next(err);
        });
};

exports.deleteArticleById = (req, res, next) => {
    const { article_id } = req.params;

    removeArticleById(article_id)
        .then(() => {
            res.status(204).send();
        })
        .catch((err) => {
            next(err);
        });
};