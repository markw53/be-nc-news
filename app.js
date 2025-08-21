// app.js
import express from "express";
import cors from "cors";

// Routers
import apiRouter from "./routers/api-router.js";

// Error handlers
import {
  handlesCustomErrors,
  handlesInternalServerErrors,
  handlesNotFoundErrors,
} from "./controllers/errors-controllers.js";

const app = express();

app.use(express.json());
app.use(cors());

// Mount routers
app.use("/api", apiRouter);

// 404 for invalid routes
app.all("/*", handlesNotFoundErrors);

// Error handling middleware
app.use(handlesCustomErrors);
app.use(handlesInternalServerErrors);

export default app;