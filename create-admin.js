const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("./src/models/User");
require("dotenv").config();

// Connect to MongoDB
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("MongoDB connected for admin creation"))
  .catch((err) => {
    console.error("MongoDB connection error:", err);
    process.exit(1);
  });

async function createAdminUser(name, email, password) {
  try {
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      console.log("❌ User already exists with this email");
      return;
    }

    // Create new admin user
    const user = new User({
      name,
      email,
      password,
      role: "admin",
    });

    // Hash password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);

    // Save user
    await user.save();

    console.log("✅ Admin user created successfully!");
    console.log("📧 Email:", email);
    console.log("👤 Name:", name);
    console.log("🔑 Role: admin");
    console.log("🆔 User ID:", user.id);
  } catch (error) {
    console.error("❌ Error creating admin user:", error.message);
  } finally {
    mongoose.connection.close();
  }
}

// Get command line arguments
const args = process.argv.slice(2);

if (args.length < 3) {
  console.log("Usage: node create-admin.js <name> <email> <password>");
  console.log(
    'Example: node create-admin.js "Admin User" "admin@paratha.com" "admin123"'
  );
  process.exit(1);
}

const [name, email, password] = args;

// Validate input
if (password.length < 6) {
  console.log("❌ Password must be at least 6 characters long");
  process.exit(1);
}

if (!email.includes("@")) {
  console.log("❌ Please provide a valid email address");
  process.exit(1);
}

console.log("🚀 Creating admin user...");
createAdminUser(name, email, password);
