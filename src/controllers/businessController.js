const Business = require("../models/Business");
const Product = require("../models/Product");
const Order = require("../models/Order");

// @route   GET api/business/profile
// @desc    Get business profile
// @access  Private
exports.getBusinessProfile = async (req, res) => {
  try {
    const business = await Business.findOne({ user: req.user.id });
    if (!business) {
      return res.status(400).json({ msg: "Business profile not found" });
    }
    res.json(business);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

// @route   PUT api/business/profile
// @desc    Update business profile
// @access  Private
exports.updateBusinessProfile = async (req, res) => {
  const { name, address, phone, description, cuisine, openingHours } = req.body;
  const profileFields = {
    name,
    address,
    phone,
    description,
    cuisine,
    openingHours,
  };

  try {
    let business = await Business.findOne({ user: req.user.id });
    if (!business) {
      return res.status(400).json({ msg: "Business profile not found" });
    }

    business = await Business.findOneAndUpdate(
      { user: req.user.id },
      { $set: profileFields },
      { new: true }
    );

    res.json(business);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

// @route   POST api/business/menu
// @desc    Add a product to the menu
// @access  Private
exports.addProduct = async (req, res) => {
  const { name, description, price, category, imageUrl } = req.body;

  try {
    const business = await Business.findOne({ user: req.user.id });
    if (!business) {
      return res.status(400).json({ msg: "Business profile not found" });
    }

    const newProduct = new Product({
      business: business.id,
      name,
      description,
      price,
      category,
      imageUrl,
    });

    const product = await newProduct.save();
    res.json(product);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

// @route   PUT api/business/menu/:id
// @desc    Edit a product on the menu
// @access  Private
exports.editProduct = async (req, res) => {
  const { name, description, price, category, imageUrl } = req.body;
  const productFields = { name, description, price, category, imageUrl };

  try {
    let product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ msg: "Product not found" });
    }

    const business = await Business.findOne({ user: req.user.id });
    if (product.business.toString() !== business.id) {
      return res.status(401).json({ msg: "Not authorized" });
    }

    product = await Product.findByIdAndUpdate(
      req.params.id,
      { $set: productFields },
      { new: true }
    );

    res.json(product);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

// @route   GET api/business/orders
// @desc    Get all current orders for the business
// @access  Private
exports.getBusinessOrders = async (req, res) => {
  try {
    const business = await Business.findOne({ user: req.user.id });
    if (!business) {
      return res.status(400).json({ msg: "Business not found" });
    }
    const orders = await Order.find({
      business: business.id,
      status: { $nin: ["delivered", "cancelled"] },
    }).populate("customer", ["name", "email"]);
    res.json(orders);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

// @route   GET api/business/orders/history
// @desc    Get order history for the business
// @access  Private
exports.getBusinessOrderHistory = async (req, res) => {
  try {
    const business = await Business.findOne({ user: req.user.id });
    if (!business) {
      return res.status(400).json({ msg: "Business not found" });
    }
    const orders = await Order.find({
      business: business.id,
      status: { $in: ["delivered", "cancelled"] },
    }).populate("customer", ["name", "email"]);
    res.json(orders);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};
