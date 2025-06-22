const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const swaggerConfig = require("./config/swagger");

// Import routes
const authRoutes = require("./routes/authRoutes");
const customerRoutes = require("./routes/customerRoutes");
const businessRoutes = require("./routes/businessRoutes");
const deliveryRoutes = require("./routes/deliveryRoutes");
const adminRoutes = require("./routes/adminRoutes");
const userRoutes = require("./routes/userRoutes");
const addressRoutes = require("./routes/addressRoutes");
const productRoutes = require("./routes/productRoutes");

const app = express();

// Connect Database
connectDB();

// Init Middleware
app.use(cors());
app.use(express.json({ extended: false }));

// Swagger Documentation
app.use("/api-docs", swaggerConfig.serve, swaggerConfig.setup);

app.get("/", (req, res) =>
  res.json({
    message: "Paratha App API is running",
    version: "1.0.0",
    docs: "/api-docs",
  })
);

app.get("/health", (req, res) =>
  res.json({
    status: "OK",
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || "development",
  })
);

// Define Routes
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/addresses", addressRoutes);
app.use("/api/products", productRoutes);
app.use("/api", customerRoutes);
app.use("/api/business", businessRoutes);
app.use("/api/delivery", deliveryRoutes);
app.use("/api/admin", adminRoutes);

module.exports = app;
