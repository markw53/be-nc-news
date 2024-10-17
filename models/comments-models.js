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

exports.insertComment = (article_id, inputComment) => {
    const { username, body } = inputComment;

    if (!username || typeof username !== 'string' || !body || typeof body !== 'string') {
        return Promise.reject({ status: 400, msg: "bad request" });
    }

    const queryValues = [username, body, article_id];
    const queryStr = `
        INSERT INTO comments (author, body, article_id)
        VALUES ($1, $2, $3)
        RETURNING *`;

    return db.query(queryStr, queryValues).then((result) => {
        return result.rows[0];
    })
    .catch((err) => {
        if (err.code === '23503') { 
            return Promise.reject({ status: 400, msg: "bad request" });
        }
        if (err.code === '23502') { 
            return Promise.reject({ status: 400, msg: "bad request" });
        }
        return Promise.reject(err);
    });
};

exports.checkArticleExists = (article_id) => {
    return db.query('SELECT * FROM articles WHERE article_id = $1', [article_id])
        .then((result) => {
            if (!result.rows.length) {
                return Promise.reject({ status: 404, msg: 'article not found' });
            }
        });
};

exports.removeComment = (comment_id) => {
    return db.query(`
        DELETE FROM comments WHERE comment_id = $1 RETURNING *`, [comment_id])
    .then((result) => {
        if (!result.rows.length) {
            return Promise.reject({
                status: 404, msg: `no comment found for comment_id ${comment_id}`,
            });
        }
    });
};

exports.patchCommentVotes = (comment_id, inc_votes) => {
    return db.query(
        `UPDATE comments
        SET votes = votes + $1
        WHERE comment_id = $2
        RETURNING *;`,
        [inc_votes, comment_id]
    ).then(({ rows }) => {
        return rows[0];
    });
};
