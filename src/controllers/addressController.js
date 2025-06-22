const Address = require("../models/Address");

// @route   POST api/addresses
// @desc    Add a new address
// @access  Private
exports.addAddress = async (req, res) => {
  const {
    label,
    street,
    city,
    state,
    zip,
    country,
    latitude,
    longitude,
    isDefault,
  } = req.body;

  try {
    // Validate required fields
    if (!street || !city || !state || !zip || !latitude || !longitude) {
      return res.status(400).json({
        msg: "Please provide street, city, state, zip, latitude, and longitude",
      });
    }

    // Validate coordinates
    if (latitude < -90 || latitude > 90) {
      return res.status(400).json({ msg: "Invalid latitude value" });
    }
    if (longitude < -180 || longitude > 180) {
      return res.status(400).json({ msg: "Invalid longitude value" });
    }

    // If this address is set as default, unset other default addresses for this user
    if (isDefault) {
      await Address.updateMany(
        { user: req.user.id, isDefault: true },
        { isDefault: false }
      );
    }

    const address = new Address({
      user: req.user.id,
      label: label || "home",
      street,
      city,
      state,
      zip,
      country: country || "USA",
      latitude,
      longitude,
      isDefault: isDefault || false,
    });

    await address.save();

    res.status(201).json({
      msg: "Address added successfully",
      address,
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

// @route   GET api/addresses
// @desc    Get all addresses for the user
// @access  Private
exports.getAddresses = async (req, res) => {
  try {
    const addresses = await Address.find({ user: req.user.id }).sort({
      isDefault: -1,
      createdAt: -1,
    });

    res.json({
      addresses,
      total: addresses.length,
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

// @route   GET api/addresses/:id
// @desc    Get a specific address by ID
// @access  Private
exports.getAddressById = async (req, res) => {
  try {
    const address = await Address.findOne({
      _id: req.params.id,
      user: req.user.id,
    });

    if (!address) {
      return res.status(404).json({ msg: "Address not found" });
    }

    res.json(address);
  } catch (err) {
    console.error(err.message);
    if (err.kind === "ObjectId") {
      return res.status(404).json({ msg: "Address not found" });
    }
    res.status(500).send("Server error");
  }
};

// @route   PUT api/addresses/:id
// @desc    Update an address
// @access  Private
exports.updateAddress = async (req, res) => {
  const {
    label,
    street,
    city,
    state,
    zip,
    country,
    latitude,
    longitude,
    isDefault,
  } = req.body;

  try {
    // Check if address exists and belongs to user
    let address = await Address.findOne({
      _id: req.params.id,
      user: req.user.id,
    });

    if (!address) {
      return res.status(404).json({ msg: "Address not found" });
    }

    // Validate coordinates if provided
    if (latitude !== undefined && (latitude < -90 || latitude > 90)) {
      return res.status(400).json({ msg: "Invalid latitude value" });
    }
    if (longitude !== undefined && (longitude < -180 || longitude > 180)) {
      return res.status(400).json({ msg: "Invalid longitude value" });
    }

    // If this address is being set as default, unset other default addresses
    if (isDefault && !address.isDefault) {
      await Address.updateMany(
        { user: req.user.id, isDefault: true },
        { isDefault: false }
      );
    }

    // Build update object
    const updateFields = {};
    if (label !== undefined) updateFields.label = label;
    if (street !== undefined) updateFields.street = street;
    if (city !== undefined) updateFields.city = city;
    if (state !== undefined) updateFields.state = state;
    if (zip !== undefined) updateFields.zip = zip;
    if (country !== undefined) updateFields.country = country;
    if (latitude !== undefined) updateFields.latitude = latitude;
    if (longitude !== undefined) updateFields.longitude = longitude;
    if (isDefault !== undefined) updateFields.isDefault = isDefault;

    // Update address
    address = await Address.findByIdAndUpdate(
      req.params.id,
      { $set: updateFields },
      { new: true }
    );

    res.json({
      msg: "Address updated successfully",
      address,
    });
  } catch (err) {
    console.error(err.message);
    if (err.kind === "ObjectId") {
      return res.status(404).json({ msg: "Address not found" });
    }
    res.status(500).send("Server error");
  }
};

// @route   DELETE api/addresses/:id
// @desc    Delete an address
// @access  Private
exports.deleteAddress = async (req, res) => {
  try {
    const address = await Address.findOne({
      _id: req.params.id,
      user: req.user.id,
    });

    if (!address) {
      return res.status(404).json({ msg: "Address not found" });
    }

    await Address.findByIdAndRemove(req.params.id);

    res.json({ msg: "Address removed successfully" });
  } catch (err) {
    console.error(err.message);
    if (err.kind === "ObjectId") {
      return res.status(404).json({ msg: "Address not found" });
    }
    res.status(500).send("Server error");
  }
};

// @route   PUT api/addresses/:id/set-default
// @desc    Set an address as default
// @access  Private
exports.setDefaultAddress = async (req, res) => {
  try {
    // Check if address exists and belongs to user
    const address = await Address.findOne({
      _id: req.params.id,
      user: req.user.id,
    });

    if (!address) {
      return res.status(404).json({ msg: "Address not found" });
    }

    // Unset all other default addresses for this user
    await Address.updateMany(
      { user: req.user.id, isDefault: true },
      { isDefault: false }
    );

    // Set this address as default
    address.isDefault = true;
    await address.save();

    res.json({
      msg: "Default address set successfully",
      address,
    });
  } catch (err) {
    console.error(err.message);
    if (err.kind === "ObjectId") {
      return res.status(404).json({ msg: "Address not found" });
    }
    res.status(500).send("Server error");
  }
};

// @route   GET api/addresses/default
// @desc    Get user's default address
// @access  Private
exports.getDefaultAddress = async (req, res) => {
  try {
    const address = await Address.findOne({
      user: req.user.id,
      isDefault: true,
    });

    if (!address) {
      return res.status(404).json({ msg: "No default address found" });
    }

    res.json(address);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};
