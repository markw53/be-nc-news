exports.handlesPSQLErrors = (err, req, res, next) => {
    const psqlErrorCodes = {
        '22P02': 'Invalid input syntax', 
        '23502': 'Null value not allowed', 
        '23503': 'Foreign key violation',
        '23505': 'Duplicate key value violates unique constraint' 
    };

    if (psqlErrorCodes[err.code]) {
        res.status(400).send({ msg: psqlErrorCodes[err.code] });
    } else {
        next(err); 
    }
};

exports.handlesCustomErrors = (err, req, res, next) => {
    if (err.status && err.msg) {
        res.status(err.status).send({ msg: err.msg });
    } else {
        next(err); 
    }
};

exports.handlesTopicPostErrors = (req, res, next) => {
    const { slug, description } = req.body;

    if (!slug || !description) {
        return next({
            status: 400,
            msg: 'Bad Request: Missing required fields "slug" and/or "description"'
        });
    }

    next(); 
};

exports.handlesInternalServerErrors = (err, req, res, next) => {
    console.error(err);
    res.status(500).send({ msg: 'Internal Server Error' });
};

exports.handlesNotFoundErrors = (req, res, next) => {
    res.status(404).send({ msg: 'Not Found' });
};
