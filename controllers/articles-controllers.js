const { selectArticleById, selectArticles, updateArticle } = require('../models/articles-models');

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
    const { sort_by, order } = req.query;
    let filter = {};

    const validFilters = ['topic', 'author'];

    for (let key in req.query) {
        if (key !== "sort_by" && key !== "order") {
            
            if (!validFilters.includes(key)) {
                return res.status(400).send({ msg: 'bad request' }); 
            }
            filter[key] = req.query[key];
        }
    }

    selectArticles(order, sort_by, filter)
        .then((articles) => {
            res.status(200).send({ articles });
        })
        .catch((err) => {
            
            if (err.status) {
                next(err); 
            } else {
                next({ status: 500, msg: 'Internal server error' });
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
