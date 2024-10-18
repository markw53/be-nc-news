const { selectCommentsByArticleId, insertComment, checkArticleExists, removeComment, patchCommentVotes } = require('../models/comments-models');

exports.getCommentsByArticleId = (req, res, next) => {
    const { article_id } = req.params;
    const { limit = 10, p = 1 } = req.query;

    selectCommentsByArticleId(article_id, limit, p)
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

exports.deleteComment = (req, res, next) => {
    const { comment_id } = req.params;
    
    if (isNaN(comment_id)) {
        return res.status(400).send({ msg: "bad request" });
    }

    removeComment(comment_id)
        .then(() => {
            res.sendStatus(204);
        })
        .catch((err) => {
            next(err);
        });
};

exports.updateCommentVotes = (req, res, next) => {
    const { comment_id } = req.params;
    const { inc_votes } = req.body;

    patchCommentVotes(comment_id, inc_votes)
        .then((updatedComment) => {
            if (!updatedComment) {
                return res.status(404).send({ msg: 'Comment not found' });
            }
            res.status(200).send({ comment: updatedComment });
        })
        .catch(next);
};