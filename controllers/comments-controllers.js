const { selectCommentsByArticleId, insertComment, checkArticleExists } = require('../models/comments-models');

exports.getCommentsByArticleId = (req, res, next) => {
    const { article_id } = req.params;

    selectCommentsByArticleId(article_id)
        .then((comments) => {
            res.status(200).send({ comments });
        })
        .catch((err) => {
            next(err);
        });
};

exports.postComment = (req, res, next) => {
    const { article_id } = req.params;
    const commentInput = req.body;

    checkArticleExists(article_id)  
        .then(() => {
            return insertComment(article_id, commentInput);
        })
        .then((comment) => {
            res.status(201).send({ comment });
        })
        .catch((err) => {        
            if (err.status) {
                return res.status(err.status).send({ msg: err.msg });
            }
            next(err);  
        });
};