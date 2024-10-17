const express = require('express');
const { getTopicsController, addTopic } = require('../controllers/topic-controllers');
const { handlesTopicPostErrors } = require('../controllers/errors-controllers');

const topicsRouter = express.Router();

topicsRouter.get('/', getTopicsController);

topicsRouter.post('/', handlesTopicPostErrors, addTopic);

module.exports = topicsRouter;
