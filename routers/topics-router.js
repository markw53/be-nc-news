// routers/topics-router.js
import express from "express";
import {
  getTopicsController,
  addTopic,
} from "../controllers/topic-controllers.js";
import { handlesTopicPostErrors } from "../controllers/errors-controllers.js";

const topicsRouter = express.Router();

topicsRouter.get("/", getTopicsController);

topicsRouter.post("/", handlesTopicPostErrors, addTopic);

export default topicsRouter;