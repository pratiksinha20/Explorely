const app = require("../src/app");
const { connectDB, isDatabaseConnected } = require("../src/config/db");

const colors = {
  reset: "\x1b[0m",
  green: "\x1b[32m",
  red: "\x1b[31m",
  yellow: "\x1b[33m",
  cyan: "\x1b[36m",
  bold: "\x1b[1m",
};

const runTest = async (name, fn) => {
  try {
    await fn();
    console.log(`  ${colors.green}✔ PASS${colors.reset} - ${name}`);
    return true;
  } catch (err) {
    console.log(`  ${colors.red}✖ FAIL${colors.reset} - ${name}`);
    console.log(`    ${colors.yellow}Reason: ${err.message}${colors.reset}`);
    return false;
  }
};

const startVerification = async () => {
  console.log(`\n${colors.bold}${colors.cyan}===================================================${colors.reset}`);
  console.log(`${colors.bold}${colors.cyan}      EXPLORELY BACKEND VERIFICATION SUITE         ${colors.reset}`);
  console.log(`${colors.bold}${colors.cyan}===================================================${colors.reset}\n`);

  // Attempt database connection
  await connectDB().catch(() => { });

  // Start app on random available port
  const server = await new Promise((resolve) => {
    const s = app.listen(0, "127.0.0.1", () => resolve(s));
  });

  const port = server.address().port;
  const baseUrl = `http://127.0.0.1:${port}/api/v1`;

  let passed = 0;
  let total = 0;

  const test = async (name, fn) => {
    total++;
    const ok = await runTest(name, fn);
    if (ok) passed++;
  };

  console.log(`${colors.bold}1. Core Application & Health Checks:${colors.reset}`);

  // Test 1: Health Check Endpoint
  await test("GET /api/v1/health responds with HTTP 200 and valid JSON", async () => {
    const res = await fetch(`${baseUrl}/health`);
    const data = await res.json();
    if (res.status !== 200) throw new Error(`Expected 200, got ${res.status}`);
    if (data.success !== true) throw new Error("Expected data.success to be true");
    if (!data.data.status) throw new Error("Missing status in response");
  });

  // Test 2: 404 Not Found Handler
  await test("GET /api/v1/non-existent-route returns structured 404 envelope", async () => {
    const res = await fetch(`${baseUrl}/non-existent-route`);
    const data = await res.json();
    if (res.status !== 404) throw new Error(`Expected 404, got ${res.status}`);
    if (data.success !== false) throw new Error("Expected success: false for 404");
  });

  // Test 3: Validation Error Handling
  await test("POST /api/v1/auth/login with invalid payload returns HTTP 400 validation error", async () => {
    const res = await fetch(`${baseUrl}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: "invalid-email", password: "123" }),
    });
    const data = await res.json();
    if (res.status !== 400) throw new Error(`Expected 400, got ${res.status}`);
    if (!data.errors || data.errors.length === 0) throw new Error("Expected validation errors list");
  });

  // Test 4: Protected Route Rejection Without Token
  await test("GET /api/v1/admin/places rejects unauthorized request with HTTP 401", async () => {
    const res = await fetch(`${baseUrl}/admin/places`);
    const data = await res.json();
    if (res.status !== 401) throw new Error(`Expected 401, got ${res.status}`);
    if (data.success !== false) throw new Error("Expected success: false");
  });

  console.log(`\n${colors.bold}2. Database Dependent Checks:${colors.reset}`);
  const dbLive = isDatabaseConnected();

  if (!dbLive) {
    console.log(`  ${colors.yellow}⚠ Notice: MongoDB is currently not connected locally or MONGODB_URI is not set.${colors.reset}`);
    console.log(`  ${colors.yellow}  Set your MongoDB Atlas string in .env and run 'npm run seed' to enable database tests.${colors.reset}`);
  } else {
    // Test 5: Fetch States
    await test("GET /api/v1/states returns array of states", async () => {
      const res = await fetch(`${baseUrl}/states`);
      const data = await res.json();
      if (res.status !== 200) throw new Error(`Expected 200, got ${res.status}`);
      if (!Array.isArray(data.data)) throw new Error("Expected array of states");
    });

    // Test 6: Fetch Places with Pagination
    await test("GET /api/v1/places returns paginated tourist destinations", async () => {
      const res = await fetch(`${baseUrl}/places?page=1&limit=5`);
      const data = await res.json();
      if (res.status !== 200) throw new Error(`Expected 200, got ${res.status}`);
      if (!data.pagination || typeof data.pagination.total !== "number") {
        throw new Error("Missing pagination metadata");
      }
    });

    // Test 7: Admin Login with Seeded Credentials
    let adminToken = null;
    await test("POST /api/v1/auth/login authenticates default admin and returns JWT", async () => {
      const res = await fetch(`${baseUrl}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: "admin@explorely.in",
          password: "AdminPassword123!",
        }),
      });
      const data = await res.json();
      if (res.status !== 200) throw new Error(`Login failed with status ${res.status}: ${data.message}`);
      if (!data.data.token) throw new Error("Missing JWT token in response");
      adminToken = data.data.token;
    });

    // Test 8: Access Protected Route with Token
    if (adminToken) {
      await test("GET /api/v1/auth/me returns admin profile using Bearer token", async () => {
        const res = await fetch(`${baseUrl}/auth/me`, {
          headers: { Authorization: `Bearer ${adminToken}` },
        });
        const data = await res.json();
        if (res.status !== 200) throw new Error(`Expected 200, got ${res.status}`);
        if (data.data.email !== "admin@explorely.in") throw new Error("Returned wrong admin email");
      });
    }
  }

  server.close();

  console.log(`\n${colors.bold}${colors.cyan}---------------------------------------------------${colors.reset}`);
  console.log(`${colors.bold}SUMMARY: ${passed} / ${total} Checks Passed${colors.reset}`);
  if (passed === total) {
    console.log(`${colors.green}${colors.bold}🎉 All executed checks passed successfully!${colors.reset}\n`);
  } else {
    console.log(`${colors.yellow}Some checks require a live database. See instructions below.${colors.reset}\n`);
  }
};

startVerification();

