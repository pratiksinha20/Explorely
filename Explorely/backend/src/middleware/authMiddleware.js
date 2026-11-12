const jwt = require("jsonwebtoken");
const Admin = require("../models/Admin");
const { sendError } = require("../utils/apiResponse");

const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer ")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    return sendError(res, "Access denied. Authentication token is missing.", 401);
  }

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || "explorely_jwt_secret_dev_key_2026_super_secure"
    );

    const admin = await Admin.findById(decoded.id).select("-password");

    if (!admin) {
      return sendError(res, "Token is invalid or admin account no longer exists.", 401);
    }

    req.admin = admin;
    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return sendError(res, "Authentication token has expired. Please login again.", 401);
    }
    return sendError(res, "Invalid authentication token.", 401);
  }
};

module.exports = { protect };

