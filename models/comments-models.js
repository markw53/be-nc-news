const db = require('../db/connection');

exports.selectCommentsByArticleId = (article_id) => {
    const queryValues = [article_id];
    let queryStr = `SELECT * FROM comments WHERE article_id = $1`;
    if (isNaN(article_id)) {
        return Promise.reject({ status: 400, msg: "bad request" });
    }
    return db.query(queryStr, queryValues).then((result) => {
        if (!result.rows.length) {
            return Promise.reject({
                status: 404,
                msg: `no comments found for article_id ${article_id}`,
            });
        }
        return result.rows;
    });
};

