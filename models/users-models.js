const db = require('../db/connection');

exports.selectUsers = () => {
    const queryValues = [];
    let queryStr = `SELECT * FROM users`;

    return db.query(queryStr, queryValues).then(({ rows }) => {
        return rows;
    });
};

exports.selectUserByUsername = (username) => {
    return db.query(`SELECT * FROM users WHERE username = $1`, [username])
        .then(({ rows }) => {
            return rows[0];
        });
};

