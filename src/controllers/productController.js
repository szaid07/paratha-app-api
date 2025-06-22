const Product = require("../models/Product");
const Business = require("../models/Business");

// @route   GET api/products
// @desc    Get all products with business details
// @access  Public
exports.getAllProducts = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      category,
      businessId,
      search,
      minPrice,
      maxPrice,
      isAvailable,
      isVegetarian,
      isVegan,
      isSpicy,
      minCalories,
      maxCalories,
      sortBy = "createdAt",
      sortOrder = "desc",
    } = req.query;

    // Build filter object
    const filter = {};

    if (category) filter.category = category;
    if (businessId) filter.business = businessId;
    if (isAvailable !== undefined) filter.isAvailable = isAvailable === "true";
    if (isVegetarian !== undefined)
      filter.isVegetarian = isVegetarian === "true";
    if (isVegan !== undefined) filter.isVegan = isVegan === "true";
    if (isSpicy !== undefined) filter.isSpicy = isSpicy === "true";

    // Price range filter
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = parseFloat(minPrice);
      if (maxPrice) filter.price.$lte = parseFloat(maxPrice);
    }

    // Calories range filter
    if (minCalories || maxCalories) {
      filter.calories = {};
      if (minCalories) filter.calories.$gte = parseFloat(minCalories);
      if (maxCalories) filter.calories.$lte = parseFloat(maxCalories);
    }

    // Text search
    if (search) {
      filter.$text = { $search: search };
    }

    // Build sort object
    const sort = {};
    sort[sortBy] = sortOrder === "desc" ? -1 : 1;

    // Calculate pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Get products with business details
    const products = await Product.find(filter)
      .populate(
        "business",
        "name address phone cuisine openingHours profileImage"
      )
      .sort(sort)
      .limit(parseInt(limit))
      .skip(skip);

    // Get total count for pagination
    const total = await Product.countDocuments(filter);

    res.json({
      products,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / parseInt(limit)),
        totalProducts: total,
        hasNextPage: skip + products.length < total,
        hasPrevPage: parseInt(page) > 1,
      },
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

// @route   GET api/products/:id
// @desc    Get a specific product with business details
// @access  Public
exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate(
      "business",
      "name address phone cuisine openingHours profileImage description"
    );

    if (!product) {
      return res.status(404).json({ msg: "Product not found" });
    }

    res.json(product);
  } catch (err) {
    console.error(err.message);
    if (err.kind === "ObjectId") {
      return res.status(404).json({ msg: "Product not found" });
    }
    res.status(500).send("Server error");
  }
};

// @route   GET api/products/business/:businessId
// @desc    Get all products for a specific business
// @access  Public
exports.getProductsByBusiness = async (req, res) => {
  try {
    const { businessId } = req.params;
    const {
      category,
      isAvailable,
      sortBy = "name",
      sortOrder = "asc",
    } = req.query;

    // Build filter object
    const filter = { business: businessId };

    if (category) filter.category = category;
    if (isAvailable !== undefined) filter.isAvailable = isAvailable === "true";

    // Build sort object
    const sort = {};
    sort[sortBy] = sortOrder === "desc" ? -1 : 1;

    const products = await Product.find(filter)
      .populate(
        "business",
        "name address phone cuisine openingHours profileImage"
      )
      .sort(sort);

    res.json({
      products,
      total: products.length,
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

// @route   GET api/products/categories
// @desc    Get all product categories
// @access  Public
exports.getCategories = async (req, res) => {
  try {
    const categories = await Product.distinct("category");
    res.json(categories);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

// @route   POST api/products
// @desc    Add a new product (Business only)
// @access  Private
exports.addProduct = async (req, res) => {
  const {
    name,
    description,
    price,
    category,
    subcategory,
    imageUrl,
    isAvailable,
    preparationTime,
    calories,
    protein,
    carbohydrates,
    fat,
    fiber,
    sugar,
    sodium,
    allergens,
    ingredients,
    isVegetarian,
    isVegan,
    isSpicy,
    spiceLevel,
  } = req.body;

  try {
    // Validate required fields
    if (!name || !description || !price || !category) {
      return res.status(400).json({
        msg: "Please provide name, description, price, and category",
      });
    }

    // Check if user is a business
    if (req.user.role !== "business") {
      return res.status(403).json({ msg: "Only businesses can add products" });
    }

    // Get business details
    const business = await Business.findOne({ user: req.user.id });
    if (!business) {
      return res.status(404).json({ msg: "Business profile not found" });
    }

    const product = new Product({
      business: business._id,
      name,
      description,
      price: parseFloat(price),
      category,
      subcategory,
      imageUrl,
      isAvailable: isAvailable !== undefined ? isAvailable : true,
      preparationTime: preparationTime || 15,
      calories: calories ? parseFloat(calories) : undefined,
      protein: protein ? parseFloat(protein) : undefined,
      carbohydrates: carbohydrates ? parseFloat(carbohydrates) : undefined,
      fat: fat ? parseFloat(fat) : undefined,
      fiber: fiber ? parseFloat(fiber) : undefined,
      sugar: sugar ? parseFloat(sugar) : undefined,
      sodium: sodium ? parseFloat(sodium) : undefined,
      allergens: allergens || [],
      ingredients: ingredients || [],
      isVegetarian: isVegetarian || false,
      isVegan: isVegan || false,
      isSpicy: isSpicy || false,
      spiceLevel: spiceLevel || 0,
    });

    await product.save();

    // Populate business details before sending response
    await product.populate(
      "business",
      "name address phone cuisine openingHours profileImage"
    );

    res.status(201).json({
      msg: "Product added successfully",
      product,
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

// @route   PUT api/products/:id
// @desc    Update a product (Business only)
// @access  Private
exports.updateProduct = async (req, res) => {
  const {
    name,
    description,
    price,
    category,
    subcategory,
    imageUrl,
    isAvailable,
    preparationTime,
    calories,
    protein,
    carbohydrates,
    fat,
    fiber,
    sugar,
    sodium,
    allergens,
    ingredients,
    isVegetarian,
    isVegan,
    isSpicy,
    spiceLevel,
  } = req.body;

  try {
    // Check if user is a business
    if (req.user.role !== "business") {
      return res
        .status(403)
        .json({ msg: "Only businesses can update products" });
    }

    // Get business details
    const business = await Business.findOne({ user: req.user.id });
    if (!business) {
      return res.status(404).json({ msg: "Business profile not found" });
    }

    // Check if product exists and belongs to this business
    let product = await Product.findOne({
      _id: req.params.id,
      business: business._id,
    });

    if (!product) {
      return res.status(404).json({ msg: "Product not found" });
    }

    // Build update object
    const updateFields = {};
    if (name !== undefined) updateFields.name = name;
    if (description !== undefined) updateFields.description = description;
    if (price !== undefined) updateFields.price = parseFloat(price);
    if (category !== undefined) updateFields.category = category;
    if (subcategory !== undefined) updateFields.subcategory = subcategory;
    if (imageUrl !== undefined) updateFields.imageUrl = imageUrl;
    if (isAvailable !== undefined) updateFields.isAvailable = isAvailable;
    if (preparationTime !== undefined)
      updateFields.preparationTime = preparationTime;
    if (calories !== undefined)
      updateFields.calories = calories ? parseFloat(calories) : undefined;
    if (protein !== undefined)
      updateFields.protein = protein ? parseFloat(protein) : undefined;
    if (carbohydrates !== undefined)
      updateFields.carbohydrates = carbohydrates
        ? parseFloat(carbohydrates)
        : undefined;
    if (fat !== undefined) updateFields.fat = fat ? parseFloat(fat) : undefined;
    if (fiber !== undefined)
      updateFields.fiber = fiber ? parseFloat(fiber) : undefined;
    if (sugar !== undefined)
      updateFields.sugar = sugar ? parseFloat(sugar) : undefined;
    if (sodium !== undefined)
      updateFields.sodium = sodium ? parseFloat(sodium) : undefined;
    if (allergens !== undefined) updateFields.allergens = allergens;
    if (ingredients !== undefined) updateFields.ingredients = ingredients;
    if (isVegetarian !== undefined) updateFields.isVegetarian = isVegetarian;
    if (isVegan !== undefined) updateFields.isVegan = isVegan;
    if (isSpicy !== undefined) updateFields.isSpicy = isSpicy;
    if (spiceLevel !== undefined) updateFields.spiceLevel = spiceLevel;

    // Update product
    product = await Product.findByIdAndUpdate(
      req.params.id,
      { $set: updateFields },
      { new: true }
    ).populate(
      "business",
      "name address phone cuisine openingHours profileImage"
    );

    res.json({
      msg: "Product updated successfully",
      product,
    });
  } catch (err) {
    console.error(err.message);
    if (err.kind === "ObjectId") {
      return res.status(404).json({ msg: "Product not found" });
    }
    res.status(500).send("Server error");
  }
};

// @route   DELETE api/products/:id
// @desc    Delete a product (Business only)
// @access  Private
exports.deleteProduct = async (req, res) => {
  try {
    // Check if user is a business
    if (req.user.role !== "business") {
      return res
        .status(403)
        .json({ msg: "Only businesses can delete products" });
    }

    // Get business details
    const business = await Business.findOne({ user: req.user.id });
    if (!business) {
      return res.status(404).json({ msg: "Business profile not found" });
    }

    // Check if product exists and belongs to this business
    const product = await Product.findOne({
      _id: req.params.id,
      business: business._id,
    });

    if (!product) {
      return res.status(404).json({ msg: "Product not found" });
    }

    await Product.findByIdAndRemove(req.params.id);

    res.json({ msg: "Product removed successfully" });
  } catch (err) {
    console.error(err.message);
    if (err.kind === "ObjectId") {
      return res.status(404).json({ msg: "Product not found" });
    }
    res.status(500).send("Server error");
  }
};

// @route   GET api/products/search
// @desc    Search products by name or description
// @access  Public
exports.searchProducts = async (req, res) => {
  try {
    const { q, businessId, category, limit = 10 } = req.query;

    if (!q) {
      return res.status(400).json({ msg: "Search query is required" });
    }

    // Build filter object
    const filter = { $text: { $search: q } };

    if (businessId) filter.business = businessId;
    if (category) filter.category = category;

    const products = await Product.find(filter)
      .populate(
        "business",
        "name address phone cuisine openingHours profileImage"
      )
      .limit(parseInt(limit))
      .sort({ score: { $meta: "textScore" } });

    res.json({
      products,
      total: products.length,
      query: q,
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};
