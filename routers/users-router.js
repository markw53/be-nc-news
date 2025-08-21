// routers/users-router.js
import express from "express";
import {
  getUsers,
  getUsersByUsername,
} from "../controllers/users-controllers.js";

const usersRouter = express.Router();

usersRouter.get("/", getUsers);

usersRouter.get("/:username", getUsersByUsername);

export default usersRouter;