const mongoose = require("mongoose");
const dotenv = require("dotenv");
const path = require("path");

// Load env from backend/.env
dotenv.config({ path: path.join(__dirname, "../.env") });

const Place = require("../src/models/Place");
const State = require("../src/models/State");
const Admin = require("../src/models/Admin");

const statesData = [
  {
    name: "Punjab",
    code: "PB",
    slug: "punjab",
    description: "The land of five rivers, renowned for its rich culture, vibrant festivals, and holy shrines.",
    cities: ["Amritsar", "Ludhiana", "Jalandhar", "Patiala", "Bathinda"],
  },
  {
    name: "Himachal Pradesh",
    code: "HP",
    slug: "himachal-pradesh",
    description: "A northern Indian state in the Himalayas, famous for climbing, trekking, and serene valleys.",
    cities: ["Manali", "Shimla", "Dharamshala", "Spiti Valley", "Kullu", "Dalhousie"],
  },
  {
    name: "Rajasthan",
    code: "RJ",
    slug: "rajasthan",
    description: "The land of kings, majestic palaces, golden sand dunes, and vibrant heritage.",
    cities: ["Jaipur", "Udaipur", "Jodhpur", "Jaisalmer", "Pushkar"],
  },
  {
    name: "Uttar Pradesh",
    code: "UP",
    slug: "uttar-pradesh",
    description: "Heartland of Indian civilization with sacred rivers, timeless monuments, and deep spirituality.",
    cities: ["Agra", "Varanasi", "Lucknow", "Mathura", "Ayodhya"],
  },
  {
    name: "Goa",
    code: "GA",
    slug: "goa",
    description: "Tropical paradise with world-famous beaches, Portuguese architecture, and nightlife.",
    cities: ["Panaji", "North Goa", "South Goa", "Calangute", "Margao"],
  },
  {
    name: "Kerala",
    code: "KL",
    slug: "kerala",
    description: "God's Own Country, famed for tranquil backwaters, palm-lined beaches, and lush tea estates.",
    cities: ["Kochi", "Munnar", "Alleppey", "Wayanad", "Thiruvananthapuram"],
  },
  {
    name: "Bihar",
    code: "BR",
    slug: "bihar",
    description: "Birthplace of Buddhism and Jainism, featuring ancient educational centers and stupas.",
    cities: ["Patna", "Bodh Gaya", "Gaya", "Nalanda", "Rajgir"],
  },
  {
    name: "Uttarakhand",
    code: "UK",
    slug: "uttarakhand",
    description: "Devbhoomi (Land of the Gods), home to holy Ganges sources, yoga capitals, and hill stations.",
    cities: ["Rishikesh", "Haridwar", "Dehradun", "Nainital", "Mussoorie"],
  },
  {
    name: "Maharashtra",
    code: "MH",
    slug: "maharashtra",
    description: "Dynamic coastal state combining Bollywood, colonial history, Western Ghats, and ancient caves.",
    cities: ["Mumbai", "Pune", "Mahabaleshwar", "Lonavala", "Aurangabad"],
  },
];

const samplePlaces = [
  {
    name: "Taj Mahal",
    slug: "taj-mahal",
    description: "An immense mausoleum of white marble, built in Agra between 1631 and 1648 by the Mughal emperor Shah Jahan. One of the Seven Wonders of the World.",
    state: "Uttar Pradesh",
    city: "Agra",
    category: "Heritage",
    bestSeason: "winter",
    image: "https://upload.wikimedia.org/wikipedia/commons/d/da/Taj-Mahal.jpg",
    mapLink: "https://www.google.com/maps?q=Taj+Mahal+Agra",
    entryFee: "₹50 (Indian), ₹1100 (Foreigner)",
    openingHours: "Sunrise to Sunset (Closed on Fridays)",
    averageRating: 4.9,
    tags: ["wonder", "unesco", "monument", "love", "marble"],
    featured: true,
  },
  {
    name: "Golden Temple",
    slug: "golden-temple",
    description: "Sri Harmandir Sahib, the holiest Gurdwara and supreme spiritual site of Sikhism, famed for its golden dome and community kitchen (Langar).",
    state: "Punjab",
    city: "Amritsar",
    category: "Spiritual",
    bestSeason: "winter",
    image: "https://upload.wikimedia.org/wikipedia/commons/9/94/The_Golden_Temple_of_Amritsar_01.jpg",
    mapLink: "https://www.google.com/maps?q=Golden+Temple+Amritsar",
    entryFee: "Free",
    openingHours: "Open 24 hours",
    averageRating: 4.9,
    tags: ["spiritual", "sikhism", "langar", "peace", "holy"],
    featured: true,
  },
  {
    name: "Solang Valley",
    slug: "solang-valley",
    description: "A side valley at the top of the Kullu Valley in Himachal Pradesh known for its summer and winter adventure sports like paragliding, skiing, and zorbing.",
    state: "Himachal Pradesh",
    city: "Manali",
    category: "Adventure",
    bestSeason: "winter",
    image: "https://upload.wikimedia.org/wikipedia/commons/7/7b/Solang_Valley_Himachal_Pradesh_India.jpg",
    mapLink: "https://www.google.com/maps?q=Solang+Valley+Manali",
    entryFee: "Free (Activities extra)",
    openingHours: "9:00 AM - 6:00 PM",
    averageRating: 4.7,
    tags: ["snow", "adventure", "skiing", "mountains", "paragliding"],
    featured: true,
  },
  {
    name: "Hawa Mahal",
    slug: "hawa-mahal",
    description: "Palace of Winds made with red and pink sandstone with 953 small casements (jharokhas) designed for royal ladies to view the city unnoticed.",
    state: "Rajasthan",
    city: "Jaipur",
    category: "Heritage",
    bestSeason: "winter",
    image: "https://upload.wikimedia.org/wikipedia/commons/7/72/Hawa_Mahal_2011.jpg",
    mapLink: "https://www.google.com/maps?q=Hawa+Mahal+Jaipur",
    entryFee: "₹50 (Indian), ₹200 (Foreigner)",
    openingHours: "9:00 AM - 4:30 PM",
    averageRating: 4.6,
    tags: ["pink city", "palace", "architecture", "rajasthan", "history"],
    featured: true,
  },
  {
    name: "Calangute Beach",
    slug: "calangute-beach",
    description: "The 'Queen of Beaches' in North Goa, offering a long stretch of golden sand, water sports, beach shacks, and vibrant nightlife.",
    state: "Goa",
    city: "Calangute",
    category: "Beach",
    bestSeason: "winter",
    image: "https://upload.wikimedia.org/wikipedia/commons/5/52/Calangute_Beach%2C_Goa.jpg",
    mapLink: "https://www.google.com/maps?q=Calangute+Beach+Goa",
    entryFee: "Free",
    openingHours: "Open 24 hours",
    averageRating: 4.5,
    tags: ["beach", "watersports", "sunset", "shacks", "sea"],
    featured: true,
  },
  {
    name: "Alleppey Backwaters",
    slug: "alleppey-backwaters",
    description: "Known as the Venice of the East, famed for traditional houseboat cruises through a network of canals, lagoons, and paddy fields.",
    state: "Kerala",
    city: "Alleppey",
    category: "Nature",
    bestSeason: "winter",
    image: "https://upload.wikimedia.org/wikipedia/commons/e/e4/Alappuzha_Boat_Beauty_W.jpg",
    mapLink: "https://www.google.com/maps?q=Alleppey+Backwaters",
    entryFee: "Houseboats ₹6000 - ₹15000 / day",
    openingHours: "Open 24 hours",
    averageRating: 4.8,
    tags: ["houseboat", "backwaters", "nature", "peace", "ayurveda"],
    featured: true,
  },
  {
    name: "Mahabodhi Temple",
    slug: "mahabodhi-temple",
    description: "UNESCO World Heritage Site where Siddhartha Gautama (Lord Buddha) attained enlightenment under the Bodhi Tree in 531 BCE.",
    state: "Bihar",
    city: "Bodh Gaya",
    category: "Spiritual",
    bestSeason: "winter",
    image: "https://upload.wikimedia.org/wikipedia/commons/e/ea/Mahabodhi_Temple_-_Bodh_Gaya_%281%29.jpg",
    mapLink: "https://www.google.com/maps?q=Mahabodhi+Temple+Bodh+Gaya",
    entryFee: "Free",
    openingHours: "5:00 AM - 9:00 PM",
    averageRating: 4.8,
    tags: ["buddhism", "unesco", "enlightenment", "bodhi tree", "peace"],
    featured: false,
  },
  {
    name: "Laxman Jhula",
    slug: "laxman-jhula",
    description: "Historic iron suspension bridge across the holy river Ganga, surrounded by ashrams, cafes, and breathtaking Himalayan foothills.",
    state: "Uttarakhand",
    city: "Rishikesh",
    category: "Spiritual",
    bestSeason: "winter",
    image: "https://upload.wikimedia.org/wikipedia/commons/3/36/Laxman_Jhula_Rishikesh.jpg",
    mapLink: "https://www.google.com/maps?q=Laxman+Jhula+Rishikesh",
    entryFee: "Free",
    openingHours: "Open 24 hours",
    averageRating: 4.7,
    tags: ["ganga", "yoga", "suspension bridge", "rafting", "himalayas"],
    featured: false,
  },
  {
    name: "Gateway of India",
    slug: "gateway-of-india",
    description: "An arch-monument built in the 20th century in Mumbai to commemorate the landing of King George V and Queen Mary. Overlooks the Arabian Sea.",
    state: "Maharashtra",
    city: "Mumbai",
    category: "City Landmark",
    bestSeason: "winter",
    image: "https://upload.wikimedia.org/wikipedia/commons/3/3a/Mumbai_03-2016_30_Gateway_of_India.jpg",
    mapLink: "https://www.google.com/maps?q=Gateway+of+India+Mumbai",
    entryFee: "Free",
    openingHours: "Open 24 hours",
    averageRating: 4.6,
    tags: ["mumbai", "harbor", "colonial", "sea", "taj hotel"],
    featured: false,
  },
  {
    name: "Golghar",
    slug: "golghar",
    description: "A historic beehive-shaped granary built in 1786 with panoramic views of the city of Patna and the river Ganges from its spiral staircase.",
    state: "Bihar",
    city: "Patna",
    category: "Heritage",
    bestSeason: "all-season",
    image: "https://upload.wikimedia.org/wikipedia/commons/1/1c/Golghar_patna.jpg",
    mapLink: "https://www.google.com/maps?q=Golghar+Patna",
    entryFee: "₹10",
    openingHours: "10:00 AM - 5:00 PM",
    averageRating: 4.3,
    tags: ["patna", "granary", "panoramic view", "british era"],
    featured: false,
  },
  {
    name: "Lake Pichola",
    slug: "lake-pichola",
    description: "An artificial fresh water lake created in the year 1362 AD, famous for scenic boat rides and views of the Lake Palace and City Palace.",
    state: "Rajasthan",
    city: "Udaipur",
    category: "Nature",
    bestSeason: "winter",
    image: "https://upload.wikimedia.org/wikipedia/commons/d/d7/Lake_Pichola_from_Udaipur_City_Palace.jpg",
    mapLink: "https://www.google.com/maps?q=Lake+Pichola+Udaipur",
    entryFee: "Free (Boat rides ₹400)",
    openingHours: "9:00 AM - 6:00 PM",
    averageRating: 4.8,
    tags: ["lake", "palace", "boat ride", "sunset", "romance"],
    featured: true,
  },
  {
    name: "Dashashwamedh Ghat",
    slug: "dashashwamedh-ghat",
    description: "The main and most spectacular ghat on the river Ganga in Varanasi, famed worldwide for its grand evening Ganga Aarti ritual.",
    state: "Uttar Pradesh",
    city: "Varanasi",
    category: "Spiritual",
    bestSeason: "winter",
    image: "https://upload.wikimedia.org/wikipedia/commons/1/1b/Ganga_Aarti_at_Dashashwamedh_Ghat_in_Varanasi.jpg",
    mapLink: "https://www.google.com/maps?q=Dashashwamedh+Ghat+Varanasi",
    entryFee: "Free",
    openingHours: "Evening Aarti starts around 6:45 PM",
    averageRating: 4.9,
    tags: ["ganga aarti", "banaras", "holy", "river", "spirituality"],
    featured: true,
  },
  {
    name: "Munnar Tea Gardens",
    slug: "munnar-tea-gardens",
    description: "Sprawling emerald tea plantations blanketed by mist in the Western Ghats, perched at 1,600 metres above sea level.",
    state: "Kerala",
    city: "Munnar",
    category: "Hill Station",
    bestSeason: "winter",
    image: "https://upload.wikimedia.org/wikipedia/commons/4/4b/Munnar_tea_plantation.jpg",
    mapLink: "https://www.google.com/maps?q=Munnar+Tea+Gardens",
    entryFee: "₹50 - ₹150 for museum tours",
    openingHours: "9:00 AM - 5:00 PM",
    averageRating: 4.8,
    tags: ["tea estates", "hills", "mist", "greenery", "western ghats"],
    featured: false,
  },
  {
    name: "Wagah Border",
    slug: "wagah-border",
    description: "The international boundary between India and Pakistan, famous for the daily ceremonial Beating Retreat ceremony full of military pomp and patriotic enthusiasm.",
    state: "Punjab",
    city: "Amritsar",
    category: "Heritage",
    bestSeason: "winter",
    image: "https://upload.wikimedia.org/wikipedia/commons/5/5e/Wagah_Border_ceremony_2011.jpg",
    mapLink: "https://www.google.com/maps?q=Wagah+Border+Amritsar",
    entryFee: "Free",
    openingHours: "Ceremony starts 4:30 PM (Winter) / 5:30 PM (Summer)",
    averageRating: 4.8,
    tags: ["patriotic", "border", "ceremony", "military", "amritsar"],
    featured: false,
  },
  {
    name: "Nalanda University Ruins",
    slug: "nalanda-university-ruins",
    description: "Ancient UNESCO World Heritage Mahavihara (Buddhist monastery) dating back to the 5th century CE, attracting scholars worldwide.",
    state: "Bihar",
    city: "Nalanda",
    category: "Heritage",
    bestSeason: "winter",
    image: "https://upload.wikimedia.org/wikipedia/commons/c/c5/Nalanda_Buddhist_University_Ruins%2C_which_flourished_from_427_to_1197_CE%2C_Nalanda%2C_Bihar.jpg",
    mapLink: "https://www.google.com/maps?q=Nalanda+University+Ruins",
    entryFee: "₹40 (Indian), ₹600 (Foreigner)",
    openingHours: "9:00 AM - 5:00 PM",
    averageRating: 4.7,
    tags: ["ancient", "learning", "unesco", "buddhism", "ruins"],
    featured: false,
  }
];

const seedDatabase = async () => {
  const uri = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/explorely";

  try {
    console.log(`[Seed] Connecting to MongoDB: ${uri}`);
    await mongoose.connect(uri, { serverSelectionTimeoutMS: 5000 });
    console.log("[Seed] Connected successfully.");

    // 1. Seed States (Idempotent upsert by 'code')
    console.log("[Seed] Seeding States...");
    for (const state of statesData) {
      await State.findOneAndUpdate({ code: state.code }, state, {
        upsert: true,
        new: true,
      });
    }
    console.log(`[Seed] Successfully seeded/updated ${statesData.length} States.`);

    // 2. Seed Tourist Places (Idempotent upsert by 'slug')
    console.log("[Seed] Seeding Tourist Places...");
    for (const place of samplePlaces) {
      await Place.findOneAndUpdate({ slug: place.slug }, place, {
        upsert: true,
        new: true,
      });
    }
    console.log(`[Seed] Successfully seeded/updated ${samplePlaces.length} Tourist Places.`);

    // 3. Seed Default Admin (Idempotent upsert by 'email')
    console.log("[Seed] Checking Default Admin Account...");
    const adminEmail = "admin@explorely.in";
    const existingAdmin = await Admin.findOne({ email: adminEmail });

    if (!existingAdmin) {
      await Admin.create({
        name: "Explorely Administrator",
        email: adminEmail,
        password: "AdminPassword123!", // Auto-hashed by pre-save hook
        role: "superadmin",
      });
      console.log(`[Seed] Created default admin: ${adminEmail} (password: AdminPassword123!)`);
    } else {
      console.log(`[Seed] Default admin '${adminEmail}' already exists.`);
    }

    console.log("==========================================");
    console.log("🎉 Database seeding completed successfully!");
    console.log("==========================================");
    process.exit(0);
  } catch (error) {
    console.error(`[Seed] Error during seeding: ${error.message}`);
    process.exit(1);
  }
};

seedDatabase();

