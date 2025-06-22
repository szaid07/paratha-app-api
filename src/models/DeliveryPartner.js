const mongoose = require("mongoose");

const DeliveryPartnerSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
  vehicle: {
    type: String,
    required: true,
  },
  licenseNumber: {
    type: String,
    required: false,
    trim: true,
    uppercase: true,
    description: "Driving license number of the delivery partner",
  },
  isAvailable: {
    type: Boolean,
    default: true,
  },
  currentLocation: {
    type: {
      type: String,
      enum: ["Point"],
    },
    coordinates: {
      type: [Number],
    },
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

DeliveryPartnerSchema.index({ currentLocation: "2dsphere" });

module.exports = mongoose.model("DeliveryPartner", DeliveryPartnerSchema);
