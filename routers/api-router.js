// routers/api-router.js
import express from "express";
import { topicsRouter } from "./topics-router.js";
import { articlesRouter } from "./articles-router.js";
import { usersRouter } from "./users-router.js";
import { commentsRouter } from "./comments-router.js";
import { getEndpoints } from "../controllers/api-controllers.js";

const apiRouter = express.Router();

apiRouter.get("/", getEndpoints);

apiRouter.use("/topics", topicsRouter);
apiRouter.use("/articles", articlesRouter);
apiRouter.use("/users", usersRouter);
apiRouter.use("/comments", commentsRouter);

export default apiRouter;