const mongoose = require("mongoose");

const OrderSchema = new mongoose.Schema({
  customer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  business: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Business",
  },
  deliveryPartner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "DeliveryPartner",
  },
  items: [
    {
      product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
      },
      quantity: {
        type: Number,
        required: true,
      },
    },
  ],
  totalPrice: {
    type: Number,
    required: true,
  },
  deliveryAddress: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Address",
  },
  status: {
    type: String,
    enum: [
      "pending",
      "confirmed",
      "preparing",
      "out for delivery",
      "delivered",
      "cancelled",
    ],
    default: "pending",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Order", OrderSchema);
