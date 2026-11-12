/**
 * Explorely API Service Layer
 * 
 * Provides clean, decoupled methods to communicate with the Explorely Node.js backend.
 * Includes automatic fallback to static JSON files when the backend is offline
 * or when the REACT_APP_USE_API feature flag is disabled.
 */

const API_BASE = process.env.REACT_APP_API_URL || "http://localhost:5000/api/v1";
const USE_API = process.env.REACT_APP_USE_API === "true";

/**
 * Helper to execute fetch requests with error handling
 */
const request = async (endpoint, options = {}) => {
  const url = `${API_BASE}${endpoint}`;
  const response = await fetch(url, {
    headers: {
      "Content-Type": "application/json",
      ...(options.token ? { Authorization: `Bearer ${options.token}` } : {}),
      ...options.headers,
    },
    ...options,
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || `API Error: ${response.status}`);
  }

  return data;
};

// ==========================================
// 1. STATES & CITIES APIs
// ==========================================

export const fetchStates = async () => {
  if (USE_API) {
    try {
      const res = await request("/states");
      return res.data;
    } catch (err) {
      console.warn("Backend /states failed, falling back to static JSON:", err.message);
    }
  }
  // Static Fallback
  const res = await fetch(process.env.PUBLIC_URL + "/data/states.json");
  return await res.json();
};

export const fetchCitiesByState = async (stateName) => {
  if (USE_API) {
    try {
      const res = await request(`/states/${encodeURIComponent(stateName)}/cities`);
      return res.data;
    } catch (err) {
      console.warn("Backend /cities failed, falling back to static JSON:", err.message);
    }
  }
  // Static Fallback
  const res = await fetch(process.env.PUBLIC_URL + "/data/cities.json");
  const data = await res.json();
  return data.filter((city) => city.state === stateName);
};

// ==========================================
// 2. TOURIST PLACES APIs
// ==========================================

export const fetchPlaces = async ({
  state = "",
  city = "",
  category = "",
  season = "",
  search = "",
  page = 1,
  limit = 20,
} = {}) => {
  if (USE_API) {
    try {
      const params = new URLSearchParams();
      if (state) params.append("state", state);
      if (city) params.append("city", city);
      if (category) params.append("category", category);
      if (season) params.append("season", season);
      if (search) params.append("search", search);
      params.append("page", page.toString());
      params.append("limit", limit.toString());

      const res = await request(`/places?${params.toString()}`);
      return {
        places: res.data,
        pagination: res.pagination,
      };
    } catch (err) {
      console.warn("Backend /places failed, falling back to static JSON:", err.message);
    }
  }

  // Static Fallback
  const res = await fetch(process.env.PUBLIC_URL + "/data/spots.json");
  const data = await res.json();
  const filtered = city ? data.filter((s) => s.city === city) : data;
  return {
    places: filtered,
    pagination: { page: 1, limit: filtered.length, total: filtered.length, totalPages: 1 },
  };
};

export const fetchPlaceBySlug = async (slug) => {
  const res = await request(`/places/slug/${encodeURIComponent(slug)}`);
  return res.data;
};

export const fetchFeaturedPlaces = async () => {
  const res = await request("/places/featured");
  return res.data;
};

// ==========================================
// 3. ADMIN AUTH & CRUD APIs
// ==========================================

export const adminLogin = async (email, password) => {
  const res = await request("/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
  return res.data; // contains { token, admin }
};

export const fetchAdminProfile = async (token) => {
  const res = await request("/auth/me", { token });
  return res.data;
};

export const createPlaceAdmin = async (placeData, token) => {
  const res = await request("/admin/places", {
    method: "POST",
    token,
    body: JSON.stringify(placeData),
  });
  return res.data;
};

export const updatePlaceAdmin = async (id, placeData, token) => {
  const res = await request(`/admin/places/${id}`, {
    method: "PUT",
    token,
    body: JSON.stringify(placeData),
  });
  return res.data;
};

export const deletePlaceAdmin = async (id, token) => {
  const res = await request(`/admin/places/${id}`, {
    method: "DELETE",
    token,
  });
  return res.data;
};

