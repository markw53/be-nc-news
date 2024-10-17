const express = require("express");
const apiRouter = require("./routers/api-router");
const app = express();
const cors = require('cors');
app.use(express.json());
app.use(cors());

const {
    handlesPSQLErrors,
    handlesCustomErrors,
    handlesInternalServerErrors,
    handlesNotFoundErrors,
} = require("./controllers/errors-controllers");

app.use("/api", apiRouter);

app.all('/*', handlesNotFoundErrors);

app.use(handlesPSQLErrors);

app.use(handlesCustomErrors);

app.use(handlesInternalServerErrors);

module.exports = app;