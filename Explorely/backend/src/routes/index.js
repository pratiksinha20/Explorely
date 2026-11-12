const express = require("express");
const router = express.Router();
const stateRoutes = require("./stateRoutes");
const placeRoutes = require("./placeRoutes");
const authRoutes = require("./authRoutes");
const adminPlaceRoutes = require("./adminPlaceRoutes");
const { isDatabaseConnected } = require("../config/db");
const { sendSuccess } = require("../utils/apiResponse");

// Health check endpoint
router.get("/health", (req, res) => {
  return sendSuccess(res, "Explorely API is running", {
    status: "healthy",
    uptimeSeconds: Math.floor(process.uptime()),
    database: isDatabaseConnected() ? "connected" : "disconnected",
    timestamp: new Date().toISOString(),
  });
});

// Mount modular subroutes
router.use("/states", stateRoutes);
router.use("/places", placeRoutes);
router.use("/auth", authRoutes);
router.use("/admin/places", adminPlaceRoutes);

module.exports = router;

