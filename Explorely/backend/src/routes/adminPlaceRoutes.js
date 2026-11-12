const express = require("express");
const router = express.Router();
const {
  getAllPlacesAdmin,
  createPlace,
  updatePlace,
  deletePlace,
} = require("../controllers/adminPlaceController");
const { protect } = require("../middleware/authMiddleware");
const { validate } = require("../middleware/validateMiddleware");
const {
  createPlaceSchema,
  updatePlaceSchema,
} = require("../validators/placeValidator");

// All admin place routes require valid JWT authentication
router.use(protect);

router.get("/", getAllPlacesAdmin);
router.post("/", validate(createPlaceSchema, "body"), createPlace);
router.put("/:id", validate(updatePlaceSchema, "body"), updatePlace);
router.delete("/:id", deletePlace);

module.exports = router;

