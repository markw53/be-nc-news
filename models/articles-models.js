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

exports.selectArticles = (order = "DESC", sort_by = "created_at", filter) => {
    const queryValues = [];
    const capitalsOrder = order.toUpperCase();
    const articleSorts = [
        "article_id",
        "title",
        "topic",
        "author",
        "body",
        "created_at",
        "votes",
        "article_img_url",
        "comment_count",
    ];

    let queryStr =
        "SELECT articles.*, COUNT(comments.article_id) AS comment_count FROM articles LEFT JOIN comments on comments.article_id = articles.article_id";

    if (!articleSorts.includes(sort_by)) {
        return Promise.reject({
        status: 400,
        msg: `bad request: cannot sort by '${sort_by}'`,
        });
    }
    if (capitalsOrder !== "ASC" && capitalsOrder !== "DESC") {
        return Promise.reject({
        status: 400,
        msg: `bad request: cannot order by '${order}', ASC or DESC only`,
        });
    }

    if (Object.keys(filter).length) {
        const [filterType] = Object.keys(filter);
        queryStr += ` WHERE ${filterType} = $1`;
        queryValues.push(...Object.values(filter));
    }

    queryStr += ` GROUP BY articles.article_id ORDER BY ${sort_by} ${capitalsOrder}`;

    return db.query(queryStr, queryValues).then((result) => {
        if (!result.rows.length) {
        return Promise.reject({
            status: 404,
            msg: `no articles found`,
            });
        }
        return result.rows;
    });
};