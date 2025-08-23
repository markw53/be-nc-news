// middleware/errorHandler.js
export const errorHandler = (err, req, res, next) => {
  console.error(err);

  // Invalid input / malformed IDs
  if (err.type === "invalid-input") {
    return res.status(400).send({ msg: "Invalid input" });
  }

  // Bad request with no fields
  if (err.type === "bad-request") {
    return res.status(400).send({ msg: err.message || "Bad Request: Missing required fields" });
  }

  // Not found errors (article, user, topic, comment)
  if (err.type === "not-found") {
    return res.status(404).send({ msg: err.message || "Not Found" });
  }

  // Catch-all generic
  res.status(500).send({ msg: "Internal Server Error" });
};