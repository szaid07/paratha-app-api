const User = require("../models/User");
const Business = require("../models/Business");
const DeliveryPartner = require("../models/DeliveryPartner");
const Order = require("../models/Order");

// @route   GET api/admin/users
// @desc    Get all users
// @access  Private (Admin)
exports.getUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.json(users);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

// @route   GET api/admin/businesses
// @desc    Get all businesses
// @access  Private (Admin)
exports.getBusinesses = async (req, res) => {
  try {
    const businesses = await Business.find().populate("user", [
      "name",
      "email",
    ]);
    res.json(businesses);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

// @route   GET api/admin/delivery-partners
// @desc    Get all delivery partners
// @access  Private (Admin)
exports.getDeliveryPartners = async (req, res) => {
  try {
    const deliveryPartners = await DeliveryPartner.find().populate("user", [
      "name",
      "email",
    ]);
    res.json(deliveryPartners);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

// @route   GET api/admin/orders
// @desc    Get all orders
// @access  Private (Admin)
exports.getOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("customer", ["name", "email"])
      .populate("business", ["name"])
      .populate("deliveryPartner", ["user"]);
    res.json(orders);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

// @route   PUT api/admin/assign-order
// @desc    Assign an order to a delivery partner
// @access  Private (Admin)
exports.assignOrder = async (req, res) => {
  const { orderId, deliveryPartnerId } = req.body;

  try {
    let order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ msg: "Order not found" });
    }

    order.deliveryPartner = deliveryPartnerId;
    order.status = "out for delivery";

    await order.save();
    res.json(order);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};
