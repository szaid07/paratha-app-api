const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema({
  business: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Business",
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
    min: 0,
  },
  category: {
    type: String,
    required: true,
  },
  subcategory: {
    type: String,
  },
  imageUrl: {
    type: String,
  },
  isAvailable: {
    type: Boolean,
    default: true,
  },
  preparationTime: {
    type: Number, // in minutes
    default: 15,
  },
  // Nutritional Information
  calories: {
    type: Number,
    min: 0,
  },
  // Macros (Macronutrients)
  protein: {
    type: Number,
    min: 0,
    description: "Protein content in grams",
  },
  carbohydrates: {
    type: Number,
    min: 0,
    description: "Carbohydrate content in grams",
  },
  fat: {
    type: Number,
    min: 0,
    description: "Fat content in grams",
  },
  fiber: {
    type: Number,
    min: 0,
    description: "Fiber content in grams",
  },
  sugar: {
    type: Number,
    min: 0,
    description: "Sugar content in grams",
  },
  sodium: {
    type: Number,
    min: 0,
    description: "Sodium content in milligrams",
  },
  // Rating System
  averageRating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5,
  },
  totalRatings: {
    type: Number,
    default: 0,
  },
  ratingDistribution: {
    1: { type: Number, default: 0 },
    2: { type: Number, default: 0 },
    3: { type: Number, default: 0 },
    4: { type: Number, default: 0 },
    5: { type: Number, default: 0 },
  },
  allergens: [
    {
      type: String,
    },
  ],
  ingredients: [
    {
      type: String,
    },
  ],
  isVegetarian: {
    type: Boolean,
    default: false,
  },
  isVegan: {
    type: Boolean,
    default: false,
  },
  isSpicy: {
    type: Boolean,
    default: false,
  },
  spiceLevel: {
    type: Number,
    min: 0,
    max: 5,
    default: 0,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Update the updatedAt field before saving
ProductSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

// Create index for better search performance
ProductSchema.index({ business: 1, category: 1, isAvailable: 1 });
ProductSchema.index({ name: "text", description: "text" });
ProductSchema.index({ averageRating: -1 });
ProductSchema.index({ calories: 1 });

module.exports = mongoose.model("Product", ProductSchema);
