const mongoose = require("mongoose");

const AddressSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  street: {
    type: String,
    required: true,
  },
  city: {
    type: String,
    required: true,
  },
  state: {
    type: String,
    required: true,
  },
  zip: {
    type: String,
    required: true,
  },
  country: {
    type: String,
    required: true,
    default: "USA",
  },
  isDefault: {
    type: Boolean,
    default: false,
  },
});

module.exports = mongoose.model("Address", AddressSchema);
