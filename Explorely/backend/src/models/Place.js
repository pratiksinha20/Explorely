const mongoose = require("mongoose");

const PlaceSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Place name is required"],
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    description: {
      type: String,
      required: [true, "Place description is required"],
    },
    state: {
      type: String,
      required: [true, "State is required"],
      trim: true,
    },
    city: {
      type: String,
      required: [true, "City is required"],
      trim: true,
    },
    category: {
      type: String,
      enum: [
        "Heritage",
        "Spiritual",
        "Nature",
        "Adventure",
        "Beach",
        "Hill Station",
        "City Landmark",
      ],
      default: "City Landmark",
    },
    bestSeason: {
      type: String,
      enum: ["winter", "summer", "rain", "all-season"],
      default: "all-season",
    },
    image: {
      type: String,
      required: [true, "Primary image URL is required"],
    },
    images: [
      {
        type: String,
      },
    ],
    mapLink: {
      type: String,
      required: [true, "Google Maps URL is required"],
    },
    latitude: {
      type: Number,
    },
    longitude: {
      type: Number,
    },
    entryFee: {
      type: String,
      default: "Free",
    },
    openingHours: {
      type: String,
      default: "Open 24 hours",
    },
    averageRating: {
      type: Number,
      min: [1, "Rating must be at least 1"],
      max: [5, "Rating cannot exceed 5"],
      default: 4.5,
    },
    tags: [
      {
        type: String,
        trim: true,
      },
    ],
    featured: {
      type: Boolean,
      default: false,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// Auto-generate slug from name if not explicitly provided
PlaceSchema.pre("validate", function (next) {
  if (!this.slug && this.name) {
    this.slug = this.name
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)+/g, "");
  }
  next();
});

// Indexes for query performance
PlaceSchema.index({ state: 1, city: 1, isActive: 1 });
PlaceSchema.index({ category: 1, bestSeason: 1 });
PlaceSchema.index({ featured: 1, isActive: 1 });
PlaceSchema.index({ name: "text", description: "text", tags: "text" });

module.exports = mongoose.model("Place", PlaceSchema);

