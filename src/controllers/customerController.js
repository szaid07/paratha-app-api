const Product = require("../models/Product");
const Order = require("../models/Order");
const Address = require("../models/Address");

// @route   GET api/menu
// @desc    Get all products (menu)
// @access  Public
exports.getMenu = async (req, res) => {
  try {
    const menu = await Product.find().populate("business", ["name", "address"]);
    res.json(menu);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

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

// @route   POST api/addresses
// @desc    Add a new address
// @access  Private
exports.addAddress = async (req, res) => {
  const { street, city, state, zip, country } = req.body;
  try {
    const newAddress = new Address({
      user: req.user.id,
      street,
      city,
      state,
      zip,
      country,
    });
    const address = await newAddress.save();
    res.json(address);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

// @route   GET api/addresses
// @desc    Get all addresses for a customer
// @access  Private
exports.getAddresses = async (req, res) => {
  try {
    const addresses = await Address.find({ user: req.user.id });
    res.json(addresses);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

// @route   DELETE api/addresses/:id
// @desc    Delete an address
// @access  Private
exports.deleteAddress = async (req, res) => {
  try {
    let address = await Address.findById(req.params.id);
    if (!address) {
      return res.status(404).json({ msg: "Address not found" });
    }
    // Make sure user owns the address
    if (address.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: "Not authorized" });
    }
    await Address.findByIdAndRemove(req.params.id);
    res.json({ msg: "Address removed" });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};
