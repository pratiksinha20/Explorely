# 🌍 Explorely — Discover Incredible India

[![React](https://img.shields.io/badge/Frontend-React_18-61DAFB?style=flat-square&logo=react&logoColor=black)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Backend-Node.js_v22-339933?style=flat-square&logo=node.js&logoColor=white)](https://nodejs.org/)
[![Express.js](https://img.shields.io/badge/Server-Express_4-000000?style=flat-square&logo=express&logoColor=white)](https://expressjs.com/)
[![MongoDB Atlas](https://img.shields.io/badge/Database-MongoDB_Atlas-47A248?style=flat-square&logo=mongodb&logoColor=white)](https://www.mongodb.com/atlas)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=flat-square)](https://opensource.org/licenses/MIT)

**Explorely** is a modern full-stack travel platform designed to help travelers discover tourist attractions across India — state by state and city by city. It pairs an interactive, seasonal React frontend with a secure, lightweight Node.js/Express REST API powered by MongoDB Atlas.

🌐 **Production Website:** [https://explorely.in](https://explorely.in)

---

## ✨ Features

### 🎨 Frontend Experience (React)
- **State & City Browsing:** Interactive dropdown and search bar for exploring 29 Indian States and 148+ Cities.
- **Seasonal Themes & Live Effects:** Dynamic weather and season themes (❄️ Winter, 🌞 Summer, 💧 Rain) with custom particles and ambient backgrounds.
- **Dark & Light Mode:** Seamless theme toggle with persistent preferences.
- **Interactive Wishlist:** Slide-in drawer saving favorite destinations with one tap (persisted locally).
- **Google Maps Integration:** One-click links for instant directions and navigation to every destination.
- **Responsive Design:** Optimized for mobile phones, tablets, and wide desktop screens.

### 🛡️ Backend & REST API (Node.js + Express + MongoDB)
- **High-Performance MongoDB Indexing:** Fast compound indexing on `({ state: 1, city: 1 })` and full-text keyword search across places, descriptions, and tags.
- **Dynamic Search & Filtering:** Filter places by state, city, category (Heritage, Spiritual, Nature, Adventure, Beach, Hill Station), and season.
- **Admin Authentication:** Secure administrator management using `bcryptjs` password hashing and signed `JSON Web Tokens (JWT)`.
- **Protected Admin CRUD:** Add, update, and soft-delete tourist spots with automatic SEO slug generation.
- **Security & Hardening:** Enforces `Helmet` security headers, strict `CORS`, IP-based `Rate Limiting`, request body size caps (`10kb`), and centralized error handling.
- **Request Validation:** Input validation using `Zod` to prevent malformed or malicious payloads from hitting the database.
- **Automatic Fallback:** Includes a React API client layer with feature-flag support (`REACT_APP_USE_API`) to seamlessly fall back to static JSON if the backend is ever offline.

---

## 🏗️ Architecture & Tech Stack

```
[ React.js Client (Port 3000) ]
              │
              │ REST API Requests (CORS Restricted)
              ▼
┌─────────────────────────────────────────────────────────────┐
│ Express.js API Server (Port 5000)                          │
│                                                             │
│  ├── Helmet (Security Headers)                              │
│  ├── CORS (Configured to Frontend Origins)                 │
│  ├── Rate Limiter (100 req / 15 min per IP)                │
│  ├── Morgan (Request Logger)                                │
│  ├── Zod Request Validators                                 │
│  ├── JWT Authentication Middleware                          │
│  └── Centralized Error & 404 Handlers                       │
└──────────────────────────────┬──────────────────────────────┘
                               │
                               ▼
               [( MongoDB Atlas Cloud Cluster )]
                ├── states (29 States + Cities)
                ├── places (335+ Tourist Spots)
                └── admins (Hashed Credentials)
```

---

## 📂 Project Structure

```text
explorely/
├── Explorely/
│   ├── backend/                     # Node.js + Express + MongoDB Backend
│   │   ├── src/
│   │   │   ├── config/              # MongoDB connection (db.js)
│   │   │   ├── models/              # Mongoose schemas (Place, State, Admin)
│   │   │   ├── controllers/         # Business logic & request handling
│   │   │   ├── routes/              # Modular API endpoints
│   │   │   ├── middleware/          # Auth (JWT), Validation, Error handlers
│   │   │   ├── validators/          # Zod schema definitions
│   │   │   ├── utils/               # Standardized JSON response envelopes
│   │   │   ├── app.js               # Express application configuration
│   │   │   └── server.js            # Server entry point & graceful shutdown
│   │   ├── scripts/
│   │   │   ├── seed.js              # Seeds curated sample + default admin
│   │   │   ├── import-all.js        # Full dataset importer (335+ places)
│   │   │   └── test-api.js          # Automated end-to-end API verification
│   │   ├── .env.example             # Backend environment template
│   │   └── package.json
│   │
│   └── frontend/                    # React Single Page Application
│       ├── public/                  # Static assets & fallback JSON data
│       │   ├── data/                # states.json, cities.json, spots.json
│       │   └── index.html
│       ├── src/
│       │   ├── services/            # api.js (Backend API service layer)
│       │   ├── App.js               # Core application logic & UI
│       │   ├── SeasonEffects.js     # Rain, snow, and sunlight animations
│       │   └── SeasonBackground.js  # Ambient background gradients
│       ├── .env.example             # Frontend environment template
│       └── package.json
```

---

## 🚀 Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (v18.0.0 or higher)
- [npm](https://www.npmjs.com/) (v9.0.0 or higher)
- A [MongoDB Atlas](https://www.mongodb.com/atlas) cluster (or local MongoDB on `mongodb://127.0.0.1:27017`)

---

### 1. Backend Setup

1. **Navigate to the backend directory:**
   ```bash
   cd Explorely/backend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure environment variables:**
   Create a `.env` file (copied from `.env.example`):
   ```env
   PORT=5000
   NODE_ENV=development
   MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/explorely?retryWrites=true&w=majority
   JWT_SECRET=your_super_secret_jwt_key_here
   JWT_EXPIRES_IN=7d
   FRONTEND_URL=http://localhost:3000
   RATE_LIMIT_WINDOW_MS=900000
   RATE_LIMIT_MAX=100
   ```

4. **Import database data:**
   - To seed the **curated starter sample** (9 states, 15 destinations, default admin):
     ```bash
     npm run seed
     ```
   - To import the **complete dataset** (all 29 states, 148 cities, and 335+ places):
     ```bash
     npm run import-all
     ```

5. **Start the backend development server:**
   ```bash
   npm run dev
   ```
   *The server will start on `http://localhost:5000` with live reload via nodemon.*

---

### 2. Frontend Setup

1. **Open a new terminal and navigate to the frontend directory:**
   ```bash
   cd Explorely/frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure environment variables:**
   Create a `.env` file in `Explorely/frontend/`:
   ```env
   REACT_APP_API_URL=http://localhost:5000/api/v1
   REACT_APP_USE_API=true
   ```
   *(Set `REACT_APP_USE_API=false` anytime you wish to run completely offline using static JSON files).*

4. **Start the React development server:**
   ```bash
   npm start
   ```
   *Open [http://localhost:3000](http://localhost:3000) in your browser.*

---

## 📡 API Reference

All responses follow a standard envelope structure:
```json
{
  "success": true,
  "message": "Action completed successfully",
  "data": { ... },
  "pagination": { "page": 1, "limit": 10, "total": 335, "totalPages": 34 }
}
```

### Public Endpoints

| Method | Endpoint | Description | Query Parameters |
| :--- | :--- | :--- | :--- |
| **`GET`** | `/api/v1/health` | Health check & MongoDB status | None |
| **`GET`** | `/api/v1/states` | List all 29 active Indian states | None |
| **`GET`** | `/api/v1/states/:stateId/cities` | List cities belonging to a state | `stateId` (name, slug, or code) |
| **`GET`** | `/api/v1/places` | Search, filter & paginate tourist places | `search`, `state`, `city`, `category`, `season`, `page`, `limit`, `sort` |
| **`GET`** | `/api/v1/places/:id` | Fetch single place by MongoDB ID | None |
| **`GET`** | `/api/v1/places/slug/:slug` | Fetch single place by unique slug | None |
| **`GET`** | `/api/v1/places/featured` | Fetch highlighted places for showcase | None |

### Authentication & Admin Endpoints

| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| **`POST`** | `/api/v1/auth/login` | Public | Authenticate admin & receive JWT Bearer token |
| **`GET`** | `/api/v1/auth/me` | Admin (JWT) | Get currently logged-in administrator profile |
| **`GET`** | `/api/v1/admin/places` | Admin (JWT) | List all places including inactive/soft-deleted |
| **`POST`** | `/api/v1/admin/places` | Admin (JWT) | Add a new tourist attraction (validates with Zod) |
| **`PUT`** | `/api/v1/admin/places/:id` | Admin (JWT) | Update existing attraction details |
| **`DELETE`**| `/api/v1/admin/places/:id` | Admin (JWT) | Soft-delete a place (`isActive: false`) |

#### Default Administrator Credentials (from seed):
- **Email:** `admin@explorely.in`
- **Password:** `AdminPassword123!`

---

## 🧪 Testing & Verification

The backend includes a comprehensive, automated test runner that validates all endpoints in under 2 seconds:

```bash
cd Explorely/backend
npm test
```

### Checks Performed:
- [x] `GET /api/v1/health` connectivity & uptime status
- [x] Structured 404 handler for invalid routes
- [x] Rejection of malformed requests via Zod validation
- [x] Unauthorized route protection (HTTP 401 without JWT)
- [x] State and city retrieval from MongoDB
- [x] Pagination & filtering metadata
- [x] Admin login authentication and bcrypt password verification
- [x] Token authorization on private endpoints

---

## 🛡️ Security Best Practices Implemented

1. **Environment Isolation:** Zero credentials or secrets in client code.
2. **Encrypted Passwords:** Salted hashing with `bcryptjs` (passwords are never stored in plaintext and excluded from default queries with `select: false`).
3. **CORS Whitelisting:** Cross-Origin Resource Sharing restricted to verified domains (`localhost:3000`, `explorely.in`).
4. **Rate Limiting:** Protects backend APIs against brute-force attacks and denial-of-service abuse.
5. **Sanitized Queries:** Safe Mongoose parameterization prevents NoSQL injection attacks.
6. **Payload Clamping:** Caps request body sizes at `10kb` to thwart buffer inflation exploits.

---

## 📄 License

This project is open-source and available under the [MIT License](LICENSE).
