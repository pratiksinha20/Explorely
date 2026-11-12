const { sendError } = require("../utils/apiResponse");

/**
 * Validates request data (body, query, or params) against a Zod schema
 * @param {import("zod").ZodSchema} schema - Zod validation schema
 * @param {"body" | "query" | "params"} source - Property of request to validate
 */
const validate = (schema, source = "body") => {
  return (req, res, next) => {
    try {
      const parsed = schema.parse(req[source]);
      req[source] = parsed;
      next();
    } catch (err) {
      if (err.errors) {
        const errorMessages = err.errors.map((e) => ({
          field: e.path.join("."),
          message: e.message,
        }));
        return sendError(res, "Validation failed", 400, errorMessages);
      }
      return sendError(res, "Invalid input data", 400);
    }
  };
};

module.exports = { validate };

