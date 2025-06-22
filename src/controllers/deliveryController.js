const Order = require("../models/Order");
const DeliveryPartner = require("../models/DeliveryPartner");

// @route   GET api/delivery/assigned-orders
// @desc    Get all orders assigned to the delivery partner
// @access  Private
exports.getAssignedOrders = async (req, res) => {
  try {
    // First get the delivery partner profile to get the ID
    const deliveryPartner = await DeliveryPartner.findOne({
      user: req.user.id,
    });
    if (!deliveryPartner) {
      return res
        .status(400)
        .json({ msg: "Delivery partner profile not found" });
    }

    const orders = await Order.find({
      deliveryPartner: deliveryPartner.id,
      status: "out for delivery",
    })
      .populate("customer", ["name", "email"])
      .populate("business", ["name", "address"]);
    res.json(orders);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

// @route   PUT api/delivery/orders/:id/status
// @desc    Update order status
// @access  Private
exports.updateOrderStatus = async (req, res) => {
  const { status } = req.body;

  try {
    const deliveryPartner = await DeliveryPartner.findOne({
      user: req.user.id,
    });
    if (!deliveryPartner) {
      return res
        .status(400)
        .json({ msg: "Delivery partner profile not found" });
    }

    let order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ msg: "Order not found" });
    }

    if (order.deliveryPartner.toString() !== deliveryPartner.id) {
      return res.status(401).json({ msg: "Not authorized" });
    }

    order.status = status;
    await order.save();
    res.json(order);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

// @route   GET api/delivery/history
// @desc    Get delivery history for the partner
// @access  Private
exports.getDeliveryHistory = async (req, res) => {
  try {
    const deliveryPartner = await DeliveryPartner.findOne({
      user: req.user.id,
    });
    if (!deliveryPartner) {
      return res
        .status(400)
        .json({ msg: "Delivery partner profile not found" });
    }
    const orders = await Order.find({
      deliveryPartner: deliveryPartner.id,
      status: "delivered",
    })
      .populate("customer", ["name", "email"])
      .populate("business", ["name", "address"]);
    res.json(orders);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};
