const endpoints = require('../endpoints.json');

exports.getEndpoints = (req, res, next) => {
    res.status(200).send(endpoints);
};

exports.getApiDescription = (req, res, next) => {
    res.status(200).send({
        endpoints: {
            'GET /api/users/:username': {
                description: 'Returns a user by username with properties username, name, and avatar_url.',
            },
        },
    });
};



