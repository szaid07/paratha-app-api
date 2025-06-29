const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const Business = require("../models/Business");
const DeliveryPartner = require("../models/DeliveryPartner");
const Address = require("../models/Address");

// @route   POST api/auth/signup
// @desc    Register a user
// @access  Public
exports.signup = async (req, res) => {
  const { name, email, password, phone, address, role = "customer" } = req.body;

  try {
    let user = await User.findOne({ email });

    if (user) {
      return res.status(400).json({ msg: "User already exists" });
    }

    user = new User({
      name,
      email,
      password,
      phone,
      role,
    });

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);

    await user.save();

    // Create and save the address if provided
    if (address) {
      const newAddress = new Address({
        user: user.id,
        address,
      });
      await newAddress.save();
      user.addresses.push(newAddress.id);
      await user.save();
    }

    const payload = {
      user: {
        id: user.id,
        role: user.role,
      },
    };

    jwt.sign(payload, process.env.JWT_SECRET, {}, (err, token) => {
      if (err) throw err;
      res.json({
        token,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          role: user.role,
        },
      });
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

// @route   POST api/auth/login
// @desc    Authenticate user & get token
// @access  Public
exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    let user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ msg: "Invalid Credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ msg: "Invalid Credentials" });
    }

    const payload = {
      user: {
        id: user.id,
        role: user.role,
      },
    };

    jwt.sign(payload, process.env.JWT_SECRET, {}, (err, token) => {
      if (err) throw err;
      res.json({
        token,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          role: user.role,
        },
      });
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

// @route   POST api/auth/business/signup
// @desc    Register a business
// @access  Public
exports.businessSignup = async (req, res) => {
  const { name, email, password, phone, address, gstNumber, cuisine } =
    req.body;
  try {
    let user = await User.findOne({ email });

    if (user) {
      return res.status(400).json({ msg: "User already exists" });
    }

    user = new User({
      name: name, // Use business name as user name
      email,
      password,
      phone,
      role: "business",
    });

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);

    await user.save();

    // Create and save the business address, and link it to the user
    if (address) {
      const newAddress = new Address({
        user: user.id,
        address,
        isBusinessAddress: true,
      });
      await newAddress.save();
      if (!Array.isArray(user.addresses)) {
        user.addresses = [];
      }
      user.addresses.push(newAddress.id);
      await user.save();
    }

    const business = new Business({
      user: user.id,
      name: name,
      address,
      phone,
      gstNumber,
      cuisine,
    });

    await business.save();

    const payload = {
      user: {
        id: user.id,
        role: user.role,
      },
    };

    jwt.sign(payload, process.env.JWT_SECRET, {}, (err, token) => {
      if (err) throw err;
      res.json({
        token,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          role: user.role,
        },
      });
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
};

// @route   POST api/auth/delivery/signup
// @desc    Register a delivery partner
// @access  Public
exports.deliveryPartnerSignup = async (req, res) => {
  const { name, email, password, phone, vehicleType, licenseNumber, address } =
    req.body;

  try {
    let user = await User.findOne({ email });

    if (user) {
      return res.status(400).json({ msg: "User already exists" });
    }

    user = new User({
      name,
      email,
      password,
      phone,
      role: "delivery",
    });

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);

    await user.save();

    // Create and save the address if provided
    if (address) {
      const newAddress = new Address({
        user: user.id,
        address,
      });
      await newAddress.save();
      if (!Array.isArray(user.addresses)) {
        user.addresses = [];
      }
      user.addresses.push(newAddress.id);
      await user.save();
    }

    const deliveryPartner = new DeliveryPartner({
      user: user.id,
      phone,
      vehicle: vehicleType,
      licenseNumber,
    });

    await deliveryPartner.save();

    const payload = {
      user: {
        id: user.id,
        role: user.role,
      },
    };

    jwt.sign(payload, process.env.JWT_SECRET, {}, (err, token) => {
      if (err) throw err;
      res.json({
        token,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          role: user.role,
        },
      });
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

// @route   POST api/auth/admin/signup
// @desc    Register an admin user
// @access  Public
exports.adminSignup = async (req, res) => {
  const { name, email, password, phone } = req.body;

  try {
    let user = await User.findOne({ email });

    if (user) {
      return res.status(400).json({ msg: "User already exists" });
    }

    user = new User({
      name,
      email,
      password,
      phone,
      role: "admin",
    });

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);

    await user.save();

    const payload = {
      user: {
        id: user.id,
        role: user.role,
      },
    };

    jwt.sign(payload, process.env.JWT_SECRET, {}, (err, token) => {
      if (err) throw err;
      res.json({
        token,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          role: user.role,
        },
      });
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

// @route   GET api/auth
// @desc    Get logged in user
// @access  Private
exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};
