const express = require("express");
const apiRouter = require("./routers/api-router");
const cors = require("cors");
const app = express();
app.use(cors());
app.use(express.json());

const {
    handlesPSQLErrors,
    handlesCustomErrors,
    handlesInternalServerErrors,
    handlesNotFoundErrors,
} = require("./controllers/errors-controllers");

app.use("/api", apiRouter);

app.use(handlesNotFoundErrors);

app.use(handlesPSQLErrors);

app.use(handlesCustomErrors);

app.use(handlesInternalServerErrors);

module.exports = app;