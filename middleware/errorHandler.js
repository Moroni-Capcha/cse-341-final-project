// Centralized error handler middleware
const errorHandler = (err, req, res, next) => {
  console.error(`[Error] ${err.name || 'Error'}: ${err.message}`);
  if (err.stack) {
    console.error(err.stack);
  }

  const statusCode = err.statusCode || err.status || 500;
  res.status(statusCode).json({
    status: statusCode,
    message: err.message || 'Internal Server Error',
    ...(process.env.NODE_ENV !== 'production' && { stack: err.stack })
  });
};

// 404 Route Not Found middleware
const notFoundHandler = (req, res, next) => {
  res.status(404).json({
    status: 404,
    message: `Resource not found: ${req.method} ${req.originalUrl}`
  });
};

module.exports = {
  errorHandler,
  notFoundHandler
};
