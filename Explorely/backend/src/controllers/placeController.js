const Place = require("../models/Place");
const { sendSuccess, sendError } = require("../utils/apiResponse");

// @desc    Get all active places with search, filter, and pagination
// @route   GET /api/v1/places
// @access  Public
const getPlaces = async (req, res, next) => {
  try {
    const {
      page = 1,
      limit = 10,
      state,
      city,
      category,
      season,
      search,
      sort = "newest",
    } = req.query;

    const pageNum = Math.max(1, parseInt(page, 10) || 1);
    const limitNum = Math.min(50, Math.max(1, parseInt(limit, 10) || 10));
    const skip = (pageNum - 1) * limitNum;

    // Build filter query
    const filter = { isActive: true };

    if (state) {
      filter.state = new RegExp(`^${state.trim()}$`, "i");
    }

    if (city) {
      filter.city = new RegExp(`^${city.trim()}$`, "i");
    }

    if (category) {
      filter.category = new RegExp(`^${category.trim()}$`, "i");
    }

    if (season && season !== "all-season") {
      filter.$or = [{ bestSeason: season.toLowerCase() }, { bestSeason: "all-season" }];
    }

    if (search) {
      const searchRegex = new RegExp(search.trim(), "i");
      filter.$or = [
        { name: searchRegex },
        { description: searchRegex },
        { city: searchRegex },
        { state: searchRegex },
        { tags: { $in: [searchRegex] } },
      ];
    }

    // Determine sorting criteria
    let sortOptions = { createdAt: -1 };
    if (sort === "rating_desc") sortOptions = { averageRating: -1 };
    if (sort === "rating_asc") sortOptions = { averageRating: 1 };
    if (sort === "name_asc") sortOptions = { name: 1 };
    if (sort === "name_desc") sortOptions = { name: -1 };

    // Execute query in parallel for speed
    const [places, total] = await Promise.all([
      Place.find(filter)
        .select(
          "name slug description state city category bestSeason image images mapLink entryFee openingHours averageRating tags featured"
        )
        .sort(sortOptions)
        .skip(skip)
        .limit(limitNum)
        .lean(),
      Place.countDocuments(filter),
    ]);

    const totalPages = Math.ceil(total / limitNum) || 1;

    return sendSuccess(
      res,
      "Tourist places fetched successfully",
      places,
      200,
      {
        page: pageNum,
        limit: limitNum,
        total,
        totalPages,
      }
    );
  } catch (error) {
    next(error);
  }
};

// @desc    Get single place by ID
// @route   GET /api/v1/places/:id
// @access  Public
const getPlaceById = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return sendError(res, "Invalid place ID format", 400);
    }

    const place = await Place.findOne({ _id: id, isActive: true }).lean();

    if (!place) {
      return sendError(res, "Tourist place not found", 404);
    }

    return sendSuccess(res, "Place details retrieved successfully", place);
  } catch (error) {
    next(error);
  }
};

// @desc    Get single place by unique slug
// @route   GET /api/v1/places/slug/:slug
// @access  Public
const getPlaceBySlug = async (req, res, next) => {
  try {
    const { slug } = req.params;

    const place = await Place.findOne({
      slug: slug.toLowerCase().trim(),
      isActive: true,
    }).lean();

    if (!place) {
      return sendError(res, `Tourist place not found with slug: ${slug}`, 404);
    }

    return sendSuccess(res, "Place details retrieved successfully", place);
  } catch (error) {
    next(error);
  }
};

// @desc    Get featured places for hero/showcase
// @route   GET /api/v1/places/featured
// @access  Public
const getFeaturedPlaces = async (req, res, next) => {
  try {
    const featured = await Place.find({ featured: true, isActive: true })
      .select("name slug description state city category bestSeason image mapLink averageRating")
      .limit(6)
      .lean();

    return sendSuccess(res, "Featured places retrieved successfully", featured);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getPlaces,
  getPlaceById,
  getPlaceBySlug,
  getFeaturedPlaces,
};

