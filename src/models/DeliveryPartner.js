const mongoose = require("mongoose");

const DeliveryPartnerSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  phone: {
    type: String,
    required: true,
  },
  vehicle: {
    type: String,
    required: true,
  },
  availability: {
    type: Boolean,
    default: false,
  },
  currentLocation: {
    type: {
      type: String,
      enum: ["Point"],
    },
    coordinates: {
      type: [Number],
      index: "2dsphere",
    },
  },
});

module.exports = mongoose.model("DeliveryPartner", DeliveryPartnerSchema);
