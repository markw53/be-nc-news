const db = require('../db/connection');

exports.selectArticleById = (article_id) => {
    const queryValues = [article_id];

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

exports.selectArticles = (sort_by = "created_at", order = "desc", topic) => {
    const validSortByColumns = ["article_id", "title", "topic", "author", "created_at", "votes", "comment_count"];
    const validOrder = ["asc", "desc"];

    if (!validSortByColumns.includes(sort_by)) {
        return Promise.reject({ status: 400, msg: "Invalid sort_by query" });
    }
    if (!validOrder.includes(order)) {
        return Promise.reject({ status: 400, msg: "Invalid order query" });
    }

    let queryStr = `
        SELECT articles.*, COUNT(comments.article_id) AS comment_count
        FROM articles
        LEFT JOIN comments ON comments.article_id = articles.article_id
    `;

    const queryValues = [];
    
    if (topic) {
        return db.query(`SELECT * FROM topics WHERE slug = $1`, [topic])
            .then(({ rows }) => {
                if (rows.length === 0) {
                    return Promise.reject({ status: 404, msg: "not found" });
                }
                
                queryStr += ` WHERE articles.topic = $1`;
                queryValues.push(topic);
                
                queryStr += ` GROUP BY articles.article_id ORDER BY ${sort_by} ${order}`;
                
                return db.query(queryStr, queryValues).then(({ rows }) => {
                    return rows;
                });
            });
    }

    queryStr += ` GROUP BY articles.article_id ORDER BY ${sort_by} ${order}`;

    return db.query(queryStr, queryValues).then(({ rows }) => {
        return rows;
    });
};

exports.updateArticle = (article_id, input) => {
    const { inc_votes } = input;

    if (inc_votes === undefined || typeof inc_votes !== 'number') {
        return Promise.reject({ status: 400, msg: 'bad request' });
    }

    const queryValues = [inc_votes, article_id];
    const queryStr = `
        UPDATE articles 
        SET votes = votes + $1
        WHERE article_id = $2
        RETURNING *`;

    return db.query(queryStr, queryValues).then(({ rows }) => {
        if (!rows.length) {
            return Promise.reject({ status: 404, msg: 'article not found' });
        }
        return rows[0];
    });
};

exports.insertArticle = ({ author, title, body, topic, article_img_url = 'default_image_url' }) => {
    const queryStr = `
        INSERT INTO articles (author, title, body, topic, article_img_url)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING *,
            (SELECT COUNT(*) FROM comments WHERE comments.article_id = articles.article_id) AS comment_count;
            `;
    const queryValues = [author, title, body, topic, article_img_url];

    return db.query(queryStr, queryValues).then(({ rows }) => {
        return rows[0];
    });
};
