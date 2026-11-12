const express = require("express");
const router = express.Router();
const {
  getPlaces,
  getPlaceById,
  getPlaceBySlug,
  getFeaturedPlaces,
} = require("../controllers/placeController");
const { validate } = require("../middleware/validateMiddleware");
const { queryPlacesSchema } = require("../validators/placeValidator");

// Public Places Routes
router.get("/", validate(queryPlacesSchema, "query"), getPlaces);
router.get("/featured", getFeaturedPlaces);
router.get("/slug/:slug", getPlaceBySlug);
router.get("/:id", getPlaceById);

module.exports = router;

