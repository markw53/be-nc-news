const { selectUsers, selectUserByUsername } = require('../models/users-models');

exports.getUsers = (req, res, next) => {
    selectUsers()
    .then((users) => {
        res.status(200).send({ users });
    })
    .catch((err) => {
        next(err);
    });
};

exports.getUsersByUsername = (req, res, next) => {
    const { username } = req.params;

    selectUserByUsername(username)
        .then((user) => {
            if (!user) {
                return res.status(404).send({ msg: 'User not found' });
            }
            res.status(200).send({ user });
        })
        .catch((err) => {
            next(err);
        });
};



