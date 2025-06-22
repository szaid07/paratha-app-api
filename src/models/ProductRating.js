const mongoose = require("mongoose");

const ProductRatingSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5,
  },
  review: {
    type: String,
    maxlength: 500,
  },
  orderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Order",
    description: "Reference to the order that contained this product",
  },
  isVerified: {
    type: Boolean,
    default: false,
    description: "Whether this rating is from a verified purchase",
  },
  helpful: {
    type: Number,
    default: 0,
    description: "Number of users who found this review helpful",
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
ProductRatingSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

// Ensure one rating per user per product
ProductRatingSchema.index({ product: 1, user: 1 }, { unique: true });

// Index for better query performance
ProductRatingSchema.index({ product: 1, rating: 1 });
ProductRatingSchema.index({ user: 1, createdAt: -1 });
ProductRatingSchema.index({ isVerified: 1 });

module.exports = mongoose.model("ProductRating", ProductRatingSchema);
