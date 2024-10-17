exports.handlesPSQLErrors = (err, req, res, next) => {
    const psqlErrorCodes = ['22P02', '23502', '23503'];
    if (psqlErrorCodes.includes(err.code)) {
        res.status(400).send({ msg: 'Bad request' });
    } else {
        next(err); 
    }
};

exports.handlesCustomErrors = (err, req, res, next) => {
    if (err.status) {
        res.status(err.status).send({ msg: err.msg });
    } else {
        next(err); 
    }
};

exports.handlesNotFoundErrors = (req, res, next) => {
    res.status(404).send({ msg: 'User not found' });
};

exports.handlesInternalServerErrors = (err, req, res, next) => {
    console.error(err); 
    res.status(500).send({ msg: 'Internal server error' });
};
