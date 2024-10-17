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
            'GET /api': {
            description: "Serves up a json representation of all available API endpoints"
            },
            'PATCH /api/comments/:comment_id': {
            description: 'Updates the votes for a comment by comment_id',
            requestBody: {
            inc_votes: 'number (required)'
            },
                exampleResponse: {
                    comment: {
                    comment_id: 1,
                    body: 'This is a comment',
                    votes: 17,
                    author: 'butter_bridge',
                    article_id: 1,
                    created_at: "2020-11-03T21:00:00.000Z"
                    }
                }
            }
        }
    })
}   

