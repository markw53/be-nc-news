const db = require('../db/connection');

exports.getTopics = () => {
    const queryValues = [];
    let queryStr = "SELECT * FROM topics";
    return db.query(queryStr, queryValues).then(({ rows }) => {
        return rows;
    });
};

exports.insertTopic = (slug, description) => {
    const queryStr = `
        INSERT INTO topics (slug, description)
        VALUES ($1, $2)
        RETURNING *;
    `;
    const queryValues = [slug, description];

    return db.query(queryStr, queryValues)
        .then(({ rows }) => {
            return rows[0];
        });
};

