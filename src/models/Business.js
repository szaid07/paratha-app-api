const mongoose = require("mongoose");

const BusinessSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  name: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  cuisine: [
    {
      type: String,
    },
  ],
  openingHours: {
    type: String,
  },
  profileImage: {
    type: String,
  },
});

module.exports = mongoose.model("Business", BusinessSchema);
