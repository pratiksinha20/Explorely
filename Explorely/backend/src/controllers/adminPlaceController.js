const Place = require("../models/Place");
const { sendSuccess, sendError } = require("../utils/apiResponse");

// @desc    Get all places (including inactive) for admin management
// @route   GET /api/v1/admin/places
// @access  Private (Admin)
const getAllPlacesAdmin = async (req, res, next) => {
  try {
    const { page = 1, limit = 20, search } = req.query;

    const pageNum = Math.max(1, parseInt(page, 10) || 1);
    const limitNum = Math.min(100, Math.max(1, parseInt(limit, 10) || 20));
    const skip = (pageNum - 1) * limitNum;

    const filter = {};
    if (search) {
      const searchRegex = new RegExp(search.trim(), "i");
      filter.$or = [
        { name: searchRegex },
        { city: searchRegex },
        { state: searchRegex },
      ];
    }

    const [places, total] = await Promise.all([
      Place.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limitNum)
        .lean(),
      Place.countDocuments(filter),
    ]);

    return sendSuccess(res, "Admin places retrieved", places, 200, {
      page: pageNum,
      limit: limitNum,
      total,
      totalPages: Math.ceil(total / limitNum) || 1,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create a new tourist place
// @route   POST /api/v1/admin/places
// @access  Private (Admin)
const createPlace = async (req, res, next) => {
  try {
    const placeData = req.body;

    // Check slug uniqueness if provided
    if (placeData.slug) {
      const existing = await Place.findOne({ slug: placeData.slug.toLowerCase().trim() });
      if (existing) {
        return sendError(res, `A place with slug '${placeData.slug}' already exists`, 409);
      }
    }

    const newPlace = await Place.create(placeData);

    return sendSuccess(res, "Tourist place created successfully", newPlace, 201);
  } catch (error) {
    next(error);
  }
};

// @desc    Update an existing tourist place
// @route   PUT /api/v1/admin/places/:id
// @access  Private (Admin)
const updatePlace = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return sendError(res, "Invalid place ID format", 400);
    }

    // Check if new slug conflicts with another place
    if (req.body.slug) {
      const slugConflict = await Place.findOne({
        slug: req.body.slug.toLowerCase().trim(),
        _id: { $ne: id },
      });

      if (slugConflict) {
        return sendError(res, `Slug '${req.body.slug}' is already taken by another place`, 409);
      }
    }

    const updatedPlace = await Place.findByIdAndUpdate(
      id,
      { ...req.body, updatedAt: Date.now() },
      { new: true, runValidators: true }
    );

    if (!updatedPlace) {
      return sendError(res, "Tourist place not found to update", 404);
    }

    return sendSuccess(res, "Tourist place updated successfully", updatedPlace);
  } catch (error) {
    next(error);
  }
};

// @desc    Soft-delete a place (set isActive = false)
// @route   DELETE /api/v1/admin/places/:id
// @access  Private (Admin)
const deletePlace = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return sendError(res, "Invalid place ID format", 400);
    }

    const place = await Place.findById(id);

    if (!place) {
      return sendError(res, "Tourist place not found", 404);
    }

    place.isActive = false;
    await place.save();

    return sendSuccess(res, `Place '${place.name}' deactivated successfully (soft-deleted)`, {
      id: place._id,
      name: place.name,
      isActive: false,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllPlacesAdmin,
  createPlace,
  updatePlace,
  deletePlace,
};

