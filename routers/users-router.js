const express = require('express');
const { getUsers, getUsersByUsername } = require('../controllers/users-controllers');

const usersRouter = express.Router();

usersRouter.get('/', getUsers);

usersRouter.get('/:username', getUsersByUsername);

module.exports = usersRouter;
