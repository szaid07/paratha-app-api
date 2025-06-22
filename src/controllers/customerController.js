const Order = require("../models/Order");

// @route   POST api/orders
// @desc    Place a new order
// @access  Private
exports.placeOrder = async (req, res) => {
  const { items, business, deliveryAddress, totalPrice } = req.body;

  try {
    const newOrder = new Order({
      customer: req.user.id,
      items,
      business,
      deliveryAddress,
      totalPrice,
    });

    const order = await newOrder.save();
    res.json(order);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

// @route   GET api/orders/history
// @desc    Get order history for a customer
// @access  Private
exports.getOrderHistory = async (req, res) => {
  try {
    const orders = await Order.find({ customer: req.user.id }).sort({
      createdAt: -1,
    });
    res.json(orders);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

// @route   GET api/orders/:id/track
// @desc    Track a specific order
// @access  Private
exports.trackOrder = async (req, res) => {
  try {
    const order = await Order.findOne({
      _id: req.params.id,
      customer: req.user.id,
    });

    if (!order) {
      return res.status(404).json({ msg: "Order not found" });
    }

    res.json(order);
  } catch (err) {
    console.error(err.message);
    if (err.kind === "ObjectId") {
      return res.status(404).json({ msg: "Order not found" });
    }
    res.status(500).send("Server Error");
  }
};
