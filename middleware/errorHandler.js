// 404 handler for unknown routes
const notFound = (req, res, next) => {
  const err = new Error(`Route not found: ${req.method} ${req.originalUrl}`);
  err.status = 404;
  next(err);
};

// Central error handler (4 arguments tells Express this is an error handler)
// eslint-disable-next-line no-unused-vars
const errorHandler = (err, req, res, next) => {
  // Malformed JSON body sent by the client
  if (err.type === "entity.parse.failed") {
    return res.status(400).json({ success: false, message: "Invalid JSON in request body" });
  }

  const status = err.status || 500;
  if (status === 500) console.error(err);

  res.status(status).json({
    success: false,
    message: status === 500 ? "Internal Server Error" : err.message,
    ...(err.details && { errors: err.details }),
  });
};

module.exports = { notFound, errorHandler };
