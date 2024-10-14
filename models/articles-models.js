const db = require('../db/connection');

exports.selectArticleById = (article_id) => {
    const queryValues = [article_id];

    if (isNaN(article_id)) {
        return Promise.reject({ status:400, msg: 'bad request' });
    }

    queryStr = "SELECT articles.*, COUNT(comments.article_id) AS comment_count FROM articles LEFT JOIN comments ON comments.article_id = articles.article_id  WHERE articles.article_id = $1 GROUP BY articles.article_id";

    return db.query(queryStr, queryValues).then((result) => {
        if (!result.rows.length) {
            return Promise.reject({
                status: 404,
                msg: `no article found for article_id ${article_id}`,
            });
        }
        return result.rows[0];
    });
};

