const mongoose = require("mongoose");
const dotenv = require("dotenv");
const path = require("path");

// Load backend .env
dotenv.config({ path: path.join(__dirname, "../.env") });

const Place = require("../src/models/Place");
const State = require("../src/models/State");
const Admin = require("../src/models/Admin");

// Load JSON datasets from frontend/public/data
const statesJson = require("../../frontend/public/data/states.json");
const citiesJson = require("../../frontend/public/data/cities.json");
const spotsJson = require("../../frontend/public/data/spots.json");

const slugify = (text) => {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
};

const runFullImport = async () => {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.error("MONGODB_URI missing in .env");
    process.exit(1);
  }

  try {
    console.log(`[Import] Connecting to MongoDB Atlas: ${uri.split("@")[1] || uri}`);
    await mongoose.connect(uri, { serverSelectionTimeoutMS: 8000 });
    console.log("[Import] Connected successfully.\n");

    // 1. Group cities by state
    const citiesByState = new Map();
    const cityToStateMap = new Map();

    citiesJson.forEach((c) => {
      const stateName = (c.state || "").trim();
      const cityName = (c.name || "").trim();
      if (!stateName || !cityName) return;

      if (!citiesByState.has(stateName)) {
        citiesByState.set(stateName, new Set());
      }
      citiesByState.get(stateName).add(cityName);
      cityToStateMap.set(cityName.toLowerCase(), stateName);
    });

    // Special cases
    cityToStateMap.set("hubballi-dharwad", "Karnataka");
    cityToStateMap.set("hubli", "Karnataka");
    cityToStateMap.set("dharwad", "Karnataka");

    // 2. Import All 29 States with their respective cities
    console.log(`[Import] Importing ${statesJson.length} States with their cities...`);
    let stateUpsertCount = 0;

    for (const s of statesJson) {
      const stateName = s.name.trim();
      const code = (s.code || "").toUpperCase().trim();
      const slug = slugify(stateName);
      const cities = Array.from(citiesByState.get(stateName) || []);

      await State.findOneAndUpdate(
        { code },
        {
          name: stateName,
          code,
          slug,
          cities,
          isActive: true,
        },
        { upsert: true, new: true }
      );
      stateUpsertCount++;
    }
    console.log(`[Import] ✔ Successfully imported ${stateUpsertCount} States into MongoDB.\n`);

    // 3. Import All 319 Tourist Spots
    console.log(`[Import] Importing ${spotsJson.length} Tourist Places...`);
    let spotUpsertCount = 0;
    const usedSlugs = new Set();

    for (const spot of spotsJson) {
      const name = (spot.name || "").trim();
      const city = (spot.city || "").trim();
      if (!name || !city) continue;

      // Determine state
      let state = spot.state || cityToStateMap.get(city.toLowerCase()) || "India";

      // Generate unique slug
      let baseSlug = slugify(`${name}-${city}`);
      let slug = baseSlug;
      let counter = 1;
      while (usedSlugs.has(slug)) {
        slug = `${baseSlug}-${counter++}`;
      }
      usedSlugs.add(slug);

      // Guess category & best season if not in json
      let category = spot.category || "City Landmark";
      const lower = `${name} ${spot.description || ""}`.toLowerCase();
      if (lower.includes("temple") || lower.includes("gurudwara") || lower.includes("church") || lower.includes("mosque") || lower.includes("stupa") || lower.includes("shrine") || lower.includes("ghat")) {
        category = "Spiritual";
      } else if (lower.includes("fort") || lower.includes("palace") || lower.includes("ruins") || lower.includes("monument") || lower.includes("heritage") || lower.includes("museum")) {
        category = "Heritage";
      } else if (lower.includes("beach") || lower.includes("coast")) {
        category = "Beach";
      } else if (lower.includes("lake") || lower.includes("waterfall") || lower.includes("wildlife") || lower.includes("sanctuary") || lower.includes("park") || lower.includes("valley")) {
        category = "Nature";
      } else if (lower.includes("trek") || lower.includes("pass") || lower.includes("skiing") || lower.includes("adventure") || lower.includes("rafting")) {
        category = "Adventure";
      } else if (lower.includes("hill") || lower.includes("tea garden") || lower.includes("peak")) {
        category = "Hill Station";
      }

      const placeDoc = {
        name,
        slug,
        description: spot.description || `${name} is a renowned tourist attraction in ${city}, ${state}.`,
        state,
        city,
        category,
        bestSeason: spot.bestSeason || "all-season",
        image: spot.image || "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=500",
        mapLink: spot.mapLink || `https://www.google.com/maps?q=${encodeURIComponent(name + " " + city)}`,
        entryFee: spot.entryFee || "Free",
        openingHours: spot.openingHours || "Open 24 hours",
        averageRating: spot.averageRating || 4.5,
        tags: spot.tags || [category.toLowerCase(), city.toLowerCase(), state.toLowerCase()],
        isActive: true,
      };

      await Place.findOneAndUpdate({ slug }, placeDoc, {
        upsert: true,
        new: true,
      });
      spotUpsertCount++;
    }
    console.log(`[Import] ✔ Successfully imported ${spotUpsertCount} Tourist Places into MongoDB.\n`);

    // 4. Ensure Default Admin Exists
    const adminEmail = "admin@explorely.in";
    const existingAdmin = await Admin.findOne({ email: adminEmail });
    if (!existingAdmin) {
      await Admin.create({
        name: "Explorely Administrator",
        email: adminEmail,
        password: "AdminPassword123!",
        role: "superadmin",
      });
      console.log(`[Import] ✔ Default admin verified (${adminEmail})\n`);
    }

    console.log("=================================================");
    console.log("🎉 FULL IMPORT COMPLETED! ALL 100% DATA IS IN ATLAS!");
    console.log("=================================================");
    process.exit(0);
  } catch (err) {
    console.error(`[Import] Failed: ${err.message}`);
    process.exit(1);
  }
};

runFullImport();

