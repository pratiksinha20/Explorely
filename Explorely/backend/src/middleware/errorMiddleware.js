const { sendError } = require("../utils/apiResponse");

// 404 Route Not Found
const notFound = (req, res, next) => {
  return sendError(res, `Endpoint not found: ${req.method} ${req.originalUrl}`, 404);
};

// Global Error Handler
const errorHandler = (err, req, res, next) => {
  console.error(`[Error] ${err.stack || err.message}`);

  let statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  let message = err.message || "Internal server error";
  let errors = null;

  // Mongoose Bad ObjectId (CastError)
  if (err.name === "CastError") {
    message = `Resource not found with invalid identifier: ${err.value}`;
    statusCode = 404;
  }

  // Mongoose Duplicate Key (11000)
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    message = `Duplicate value entered for '${field}': ${err.keyValue[field]}. Must be unique.`;
    statusCode = 409;
  }

  // Mongoose Validation Error
  if (err.name === "ValidationError") {
    message = "Validation Error";
    errors = Object.values(err.errors).map((val) => val.message);
    statusCode = 400;
  }

  return sendError(
    res,
    message,
    statusCode,
    process.env.NODE_ENV === "development" ? (errors || err.stack) : errors
  );
};

module.exports = {
  notFound,
  errorHandler,
};

