const db = require('../db/connection');

exports.selectUsers = () => {
    const queryValues = [];
    let queryStr = `SELECT * FROM users`;

    return db.query(queryStr, queryValues).then(({ rows }) => {
        return rows;
    });
};

