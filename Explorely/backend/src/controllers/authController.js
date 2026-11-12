const jwt = require("jsonwebtoken");
const Admin = require("../models/Admin");
const { sendSuccess, sendError } = require("../utils/apiResponse");

// Helper to generate JWT token
const generateToken = (admin) => {
  return jwt.sign(
    { id: admin._id, role: admin.role },
    process.env.JWT_SECRET || "explorely_jwt_secret_dev_key_2026_super_secure",
    {
      expiresIn: process.env.JWT_EXPIRES_IN || "7d",
    }
  );
};

// @desc    Admin login and return JWT token
// @route   POST /api/v1/auth/login
// @access  Public
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Find admin and explicitly include password for comparison
    const admin = await Admin.findOne({ email: email.toLowerCase().trim() }).select("+password");

    if (!admin) {
      return sendError(res, "Invalid email or password", 401);
    }

    const isMatch = await admin.comparePassword(password);
    if (!isMatch) {
      return sendError(res, "Invalid email or password", 401);
    }

    const token = generateToken(admin);

    return sendSuccess(res, "Admin logged in successfully", {
      token,
      admin: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
        role: admin.role,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get currently logged-in admin profile
// @route   GET /api/v1/auth/me
// @access  Private (Admin)
const getMe = async (req, res, next) => {
  try {
    return sendSuccess(res, "Current admin profile retrieved", {
      id: req.admin._id,
      name: req.admin.name,
      email: req.admin.email,
      role: req.admin.role,
      createdAt: req.admin.createdAt,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  login,
  getMe,
};

