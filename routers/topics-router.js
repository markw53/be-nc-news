const express = require('express');
const { getTopicsController } = require('../controllers/topic-controllers');

const topicsRouter = express.Router();

topicsRouter.get('/', getTopicsController);

module.exports = topicsRouter;
