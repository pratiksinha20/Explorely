const State = require("../models/State");
const { sendSuccess, sendError } = require("../utils/apiResponse");

// @desc    Get all active states
// @route   GET /api/v1/states
// @access  Public
const getStates = async (req, res, next) => {
  try {
    const states = await State.find({ isActive: true })
      .select("name code slug image description cities")
      .sort({ name: 1 })
      .lean();

    // Map into format easily consumed by React dropdowns
    const formatted = states.map((s) => ({
      id: s._id,
      name: s.name,
      code: s.code,
      slug: s.slug,
      image: s.image,
      description: s.description,
      cityCount: s.cities ? s.cities.length : 0,
    }));

    return sendSuccess(res, "States retrieved successfully", formatted);
  } catch (error) {
    next(error);
  }
};

// @desc    Get single state by ID, Code, or Slug
// @route   GET /api/v1/states/:identifier
// @access  Public
const getStateByIdentifier = async (req, res, next) => {
  try {
    const { identifier } = req.params;

    const query = identifier.match(/^[0-9a-fA-F]{24}$/)
      ? { _id: identifier }
      : {
        $or: [
          { slug: identifier.toLowerCase() },
          { code: identifier.toUpperCase() },
          { name: new RegExp(`^${identifier}$`, "i") },
        ],
      };

    const state = await State.findOne({ ...query, isActive: true }).lean();

    if (!state) {
      return sendError(res, "State not found", 404);
    }

    return sendSuccess(res, "State details retrieved successfully", state);
  } catch (error) {
    next(error);
  }
};

// @desc    Get all cities for a specific state
// @route   GET /api/v1/states/:stateId/cities
// @access  Public
const getCitiesByState = async (req, res, next) => {
  try {
    const { stateId } = req.params;

    const query = stateId.match(/^[0-9a-fA-F]{24}$/)
      ? { _id: stateId }
      : {
        $or: [
          { slug: stateId.toLowerCase() },
          { code: stateId.toUpperCase() },
          { name: new RegExp(`^${stateId}$`, "i") },
        ],
      };

    const state = await State.findOne(query).select("name code cities").lean();

    if (!state) {
      return sendError(res, "State not found", 404);
    }

    // Format cities as an array of objects matching frontend expectation: { name, state }
    const formattedCities = (state.cities || []).map((cityName) => ({
      name: cityName,
      state: state.name,
      stateCode: state.code,
    }));

    return sendSuccess(
      res,
      `Cities in ${state.name} retrieved successfully`,
      formattedCities
    );
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getStates,
  getStateByIdentifier,
  getCitiesByState,
};

