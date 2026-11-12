const express = require("express");
const router = express.Router();
const {
  getStates,
  getStateByIdentifier,
  getCitiesByState,
} = require("../controllers/stateController");

// Public State & City Routes
router.get("/", getStates);
router.get("/:identifier", getStateByIdentifier);
router.get("/:stateId/cities", getCitiesByState);

module.exports = router;

