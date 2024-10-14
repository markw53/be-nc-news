const db = require('../db/connection');

exports.getTopics = () => {
    const queryValues = [];
    let queryStr = "SELECT * FROM topics";
    return db.query(queryStr, queryValues).then(({ rows }) => {
        return rows;
    });
};


