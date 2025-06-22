const axios = require("axios");

const BASE_URL = "http://localhost:3000/api";

async function adminLogin(email, password) {
  try {
    console.log("🔐 Logging in as admin...");

    const response = await axios.post(`${BASE_URL}/auth/login`, {
      email,
      password,
    });

    const token = response.data.token;

    console.log("✅ Login successful!");
    console.log("🔑 Token:", token);
    console.log("\n📋 Copy this token to use with admin routes:");
    console.log("x-auth-token:", token);

    return token;
  } catch (error) {
    console.log("❌ Login failed:", error.response?.data?.msg || error.message);
    return null;
  }
}

async function testAdminRoutes(token) {
  if (!token) {
    console.log("❌ No token provided");
    return;
  }

  console.log("\n🧪 Testing admin routes...");

  const routes = [
    "/admin/users",
    "/admin/businesses",
    "/admin/delivery-partners",
    "/admin/orders",
  ];

  for (const route of routes) {
    try {
      const response = await axios.get(`${BASE_URL}${route}`, {
        headers: { "x-auth-token": token },
      });

      console.log(`✅ ${route}: ${response.data.length || 0} items`);
    } catch (error) {
      console.log(`❌ ${route}: ${error.response?.data?.msg || error.message}`);
    }
  }
}

// Get command line arguments
const args = process.argv.slice(2);

if (args.length < 2) {
  console.log("Usage: node admin-login.js <email> <password>");
  console.log("Example: node admin-login.js admin@paratha.com admin");
  process.exit(1);
}

const [email, password] = args;

// Run admin login
adminLogin(email, password).then((token) => {
  if (token) {
    testAdminRoutes(token);
  }
});
