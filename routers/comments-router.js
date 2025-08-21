// routers/comments-router.js
import express from "express";
import {
  updateCommentVotes,
  deleteComment,
} from "../controllers/comments-controllers.js";

const commentsRouter = express.Router();

commentsRouter.patch("/:comment_id", updateCommentVotes);

commentsRouter.delete("/:comment_id", deleteComment);

export default commentsRouter;