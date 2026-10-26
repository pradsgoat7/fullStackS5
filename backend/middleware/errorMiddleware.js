const notFound = (req, res) => {
  res.status(404).json({ message: "Route not found" });
};

// Central error handler: maps known errors to proper status codes and
// never sends stack traces or database messages to the client
const errorHandler = (err, req, res, next) => {
  if (err.type === "entity.parse.failed") {
    return res.status(400).json({ message: "Malformed JSON in request body" });
  }

  if (err.type === "entity.too.large") {
    return res.status(413).json({ message: "Request body is too large" });
  }

  if (err.name === "CastError") {
    return res.status(400).json({ message: `Invalid ${err.path}` });
  }

  if (err.name === "ValidationError") {
    return res.status(400).json({
      message: "Validation failed",
      errors: Object.values(err.errors).map((error) => ({ field: error.path, message: error.message }))
    });
  }

  if (err.code === 11000) {
    return res.status(409).json({ message: "A record with that value already exists" });
  }

  console.error(err);
  res.status(500).json({ message: "Something went wrong" });
};

module.exports = { notFound, errorHandler };
