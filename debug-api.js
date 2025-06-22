const axios = require("axios");

// Debug configuration
const BASE_URL = "http://localhost:3000/api";
const DEBUG = true;

// Helper function to log requests and responses
function logRequest(method, url, data = null) {
  console.log(`\n🔍 ${method.toUpperCase()} ${url}`);
  if (data) {
    console.log("📤 Request Data:", JSON.stringify(data, null, 2));
  }
}

function logResponse(response) {
  console.log(`✅ Status: ${response.status}`);
  console.log("📥 Response:", JSON.stringify(response.data, null, 2));
}

function logError(error) {
  console.log(`❌ Error: ${error.response?.status || "Network Error"}`);
  console.log(
    "📥 Error Response:",
    JSON.stringify(error.response?.data || error.message, null, 2)
  );
}

// Test functions
async function testSignup() {
  try {
    const data = {
      name: "Debug User",
      email: `debug${Date.now()}@example.com`,
      password: "password123",
    };

    logRequest("POST", "/auth/signup", data);
    const response = await axios.post(`${BASE_URL}/auth/signup`, data);
    logResponse(response);
    return response.data.token;
  } catch (error) {
    logError(error);
    return null;
  }
}

async function testAdminSignup() {
  try {
    const data = {
      name: "Admin User",
      email: `admin${Date.now()}@example.com`,
      password: "admin123",
    };

    logRequest("POST", "/auth/admin/signup", data);
    const response = await axios.post(`${BASE_URL}/auth/admin/signup`, data);
    logResponse(response);
    return response.data.token;
  } catch (error) {
    logError(error);
    return null;
  }
}

async function testLogin(email, password) {
  try {
    const data = { email, password };
    logRequest("POST", "/auth/login", data);
    const response = await axios.post(`${BASE_URL}/auth/login`, data);
    logResponse(response);
    return response.data.token;
  } catch (error) {
    logError(error);
    return null;
  }
}

async function testProtectedRoute(token, endpoint) {
  try {
    logRequest("GET", endpoint);
    const response = await axios.get(`${BASE_URL}${endpoint}`, {
      headers: { "x-auth-token": token },
    });
    logResponse(response);
  } catch (error) {
    logError(error);
  }
}

async function testAdminRoute(token, endpoint) {
  try {
    logRequest("GET", endpoint);
    const response = await axios.get(`${BASE_URL}${endpoint}`, {
      headers: { "x-auth-token": token },
    });
    logResponse(response);
  } catch (error) {
    logError(error);
  }
}

// Main debug function
async function debugAPI() {
  console.log("🚀 Starting API Debug Session...\n");

  // Test customer signup
  console.log("=== Testing Customer Signup ===");
  const customerToken = await testSignup();

  // Test admin signup
  console.log("\n=== Testing Admin Signup ===");
  const adminToken = await testAdminSignup();

  if (customerToken) {
    // Test customer login
    console.log("\n=== Testing Customer Login ===");
    await testLogin("debug@example.com", "password123");

    // Test customer protected routes
    console.log("\n=== Testing Customer Protected Routes ===");
    await testProtectedRoute(customerToken, "/menu");
    await testProtectedRoute(customerToken, "/addresses");
  }

  if (adminToken) {
    // Test admin routes
    console.log("\n=== Testing Admin Routes ===");
    await testAdminRoute(adminToken, "/admin/users");
    await testAdminRoute(adminToken, "/admin/businesses");
    await testAdminRoute(adminToken, "/admin/delivery-partners");
    await testAdminRoute(adminToken, "/admin/orders");
  }

  console.log("\n✅ Debug session completed!");
}

// Run debug if this file is executed directly
if (require.main === module) {
  debugAPI().catch(console.error);
}

module.exports = {
  testSignup,
  testAdminSignup,
  testLogin,
  testProtectedRoute,
  testAdminRoute,
  logRequest,
  logResponse,
  logError,
};
