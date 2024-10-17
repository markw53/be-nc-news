const apiRouter = require("express").Router();
const {
    topicsRouter,
    articlesRouter,
    usersRouter,
    commentsRouter,
} = require("./index.js");

const { getEndpoints } = require("../controllers/api-controllers.js");

apiRouter.route("/").get(getEndpoints);

apiRouter.use("/topics", topicsRouter);
apiRouter.use("/articles", articlesRouter);
apiRouter.use("/users", usersRouter);
apiRouter.use("/comments", commentsRouter);
apiRouter.use("/articles", articlesRouter);

module.exports = apiRouter;