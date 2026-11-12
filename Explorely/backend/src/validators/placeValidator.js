const { z } = require("zod");

const createPlaceSchema = z.object({
  name: z.string({ required_error: "Place name is required" }).min(2, "Name must be at least 2 characters").trim(),
  slug: z.string().optional(),
  description: z.string({ required_error: "Description is required" }).min(10, "Description must be at least 10 characters"),
  state: z.string({ required_error: "State is required" }).min(2, "State name is too short").trim(),
  city: z.string({ required_error: "City is required" }).min(2, "City name is too short").trim(),
  category: z.enum([
    "Heritage",
    "Spiritual",
    "Nature",
    "Adventure",
    "Beach",
    "Hill Station",
    "City Landmark",
  ]).optional().default("City Landmark"),
  bestSeason: z.enum(["winter", "summer", "rain", "all-season"]).optional().default("all-season"),
  image: z.string({ required_error: "Primary image URL is required" }).url("Must be a valid image URL"),
  images: z.array(z.string().url()).optional(),
  mapLink: z.string({ required_error: "Google Maps link is required" }).url("Must be a valid URL"),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
  entryFee: z.string().optional().default("Free"),
  openingHours: z.string().optional().default("Open 24 hours"),
  averageRating: z.number().min(1).max(5).optional().default(4.5),
  tags: z.array(z.string()).optional(),
  featured: z.boolean().optional().default(false),
  isActive: z.boolean().optional().default(true),
});

const updatePlaceSchema = createPlaceSchema.partial();

const queryPlacesSchema = z.object({
  page: z.string().regex(/^\d+$/).transform(Number).optional().default("1"),
  limit: z.string().regex(/^\d+$/).transform(Number).optional().default("10"),
  state: z.string().trim().optional(),
  city: z.string().trim().optional(),
  category: z.string().trim().optional(),
  season: z.string().trim().optional(),
  search: z.string().trim().optional(),
  sort: z.enum(["rating_desc", "rating_asc", "name_asc", "name_desc", "newest"]).optional().default("newest"),
});

const adminLoginSchema = z.object({
  email: z.string({ required_error: "Email is required" }).email("Invalid email format"),
  password: z.string({ required_error: "Password is required" }).min(6, "Password must be at least 6 characters"),
});

module.exports = {
  createPlaceSchema,
  updatePlaceSchema,
  queryPlacesSchema,
  adminLoginSchema,
};

