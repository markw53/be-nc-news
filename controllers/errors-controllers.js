// controllers/errors-controllers.js

/**
 * Handle custom errors thrown by your models
 * e.g. { status: 400, msg: "bad request" }
 */
export const handlesCustomErrors = (err, req, res, next) => {
  if (err.status && err.msg) {
    res.status(err.status).send({ msg: err.msg });
  } else {
    next(err);
  }
};

/**
 * Validate body when POSTing topics
 */
export const handlesTopicPostErrors = (req, res, next) => {
  const { slug, description } = req.body;

  if (!slug || !description) {
    return next({
      status: 400,
      msg: 'Bad Request: Missing required fields "slug" and/or "description"',
    });
  }

  next();
};

/**
 * Catch all unhandled errors — equivalent to "500 Internal Server Error"
 */
export const handlesInternalServerErrors = (err, req, res, next) => {
  console.error(err);
  res.status(500).send({ msg: "Internal Server Error" });
};

/**
 * Fallback for 404s
 */
export const handlesNotFoundErrors = (req, res, next) => {
  res.status(404).send({ msg: "Not Found" });
};