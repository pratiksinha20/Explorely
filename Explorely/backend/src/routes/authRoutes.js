const express = require("express");
const router = express.Router();
const { login, getMe } = require("../controllers/authController");
const { protect } = require("../middleware/authMiddleware");
const { validate } = require("../middleware/validateMiddleware");
const { adminLoginSchema } = require("../validators/placeValidator");

// Auth Routes
router.post("/login", validate(adminLoginSchema, "body"), login);
router.get("/me", protect, getMe);

module.exports = router;

