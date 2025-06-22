const mongoose = require("mongoose");

const DiscountSchema = new mongoose.Schema({
  code: {
    type: String,
    required: true,
    unique: true,
  },
  percentage: {
    type: Number,
    required: true,
  },
  business: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Business", // Can be null if it's a platform-wide discount
  },
  expiryDate: {
    type: Date,
    required: true,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
});

module.exports = mongoose.model("Discount", DiscountSchema);
