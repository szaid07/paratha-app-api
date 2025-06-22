const ProductRating = require("../models/ProductRating");
const Product = require("../models/Product");
const Order = require("../models/Order");

// Helper function to update product rating statistics
const updateProductRatingStats = async (productId) => {
  try {
    const ratings = await ProductRating.find({ product: productId });

    if (ratings.length === 0) {
      await Product.findByIdAndUpdate(productId, {
        averageRating: 0,
        totalRatings: 0,
        ratingDistribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
      });
      return;
    }

    const totalRatings = ratings.length;
    const totalScore = ratings.reduce((sum, rating) => sum + rating.rating, 0);
    const averageRating = totalScore / totalRatings;

    // Calculate rating distribution
    const distribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    ratings.forEach((rating) => {
      distribution[rating.rating]++;
    });

    await Product.findByIdAndUpdate(productId, {
      averageRating: Math.round(averageRating * 10) / 10, // Round to 1 decimal place
      totalRatings,
      ratingDistribution: distribution,
    });
  } catch (error) {
    console.error("Error updating product rating stats:", error);
  }
};

// @route   POST api/products/:productId/rate
// @desc    Rate a product
// @access  Private
exports.rateProduct = async (req, res) => {
  const { rating, review, orderId } = req.body;
  const { productId } = req.params;

  try {
    // Validate rating
    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({ msg: "Rating must be between 1 and 5" });
    }

    // Check if product exists
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ msg: "Product not found" });
    }

    // Check if user has already rated this product
    let existingRating = await ProductRating.findOne({
      product: productId,
      user: req.user.id,
    });

    // Check if this is a verified purchase (if orderId is provided)
    let isVerified = false;
    if (orderId) {
      const order = await Order.findOne({
        _id: orderId,
        customer: req.user.id,
        "items.product": productId,
      });
      isVerified = !!order;
    }

    if (existingRating) {
      // Update existing rating
      existingRating.rating = rating;
      existingRating.review = review || existingRating.review;
      existingRating.orderId = orderId || existingRating.orderId;
      existingRating.isVerified = isVerified || existingRating.isVerified;
      await existingRating.save();
    } else {
      // Create new rating
      existingRating = new ProductRating({
        product: productId,
        user: req.user.id,
        rating,
        review,
        orderId,
        isVerified,
      });
      await existingRating.save();
    }

    // Update product rating statistics
    await updateProductRatingStats(productId);

    // Populate user info for response
    await existingRating.populate("user", "name");

    res.status(201).json({
      msg: "Product rated successfully",
      rating: existingRating,
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

// @route   GET api/products/:productId/ratings
// @desc    Get all ratings for a product
// @access  Public
exports.getProductRatings = async (req, res) => {
  const { productId } = req.params;
  const {
    page = 1,
    limit = 10,
    rating,
    verified,
    sortBy = "createdAt",
    sortOrder = "desc",
  } = req.query;

  try {
    // Check if product exists
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ msg: "Product not found" });
    }

    // Build filter object
    const filter = { product: productId };
    if (rating) filter.rating = parseInt(rating);
    if (verified !== undefined) filter.isVerified = verified === "true";

    // Build sort object
    const sort = {};
    sort[sortBy] = sortOrder === "desc" ? -1 : 1;

    // Calculate pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const ratings = await ProductRating.find(filter)
      .populate("user", "name")
      .sort(sort)
      .limit(parseInt(limit))
      .skip(skip);

    const total = await ProductRating.countDocuments(filter);

    res.json({
      ratings,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / parseInt(limit)),
        totalRatings: total,
        hasNextPage: skip + ratings.length < total,
        hasPrevPage: parseInt(page) > 1,
      },
      productStats: {
        averageRating: product.averageRating,
        totalRatings: product.totalRatings,
        ratingDistribution: product.ratingDistribution,
      },
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

// @route   GET api/products/:productId/ratings/my
// @desc    Get user's rating for a product
// @access  Private
exports.getMyRating = async (req, res) => {
  const { productId } = req.params;

  try {
    const rating = await ProductRating.findOne({
      product: productId,
      user: req.user.id,
    }).populate("user", "name");

    if (!rating) {
      return res
        .status(404)
        .json({ msg: "You haven't rated this product yet" });
    }

    res.json(rating);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

// @route   PUT api/products/:productId/ratings/my
// @desc    Update user's rating for a product
// @access  Private
exports.updateMyRating = async (req, res) => {
  const { rating, review } = req.body;
  const { productId } = req.params;

  try {
    // Validate rating
    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({ msg: "Rating must be between 1 and 5" });
    }

    const existingRating = await ProductRating.findOne({
      product: productId,
      user: req.user.id,
    });

    if (!existingRating) {
      return res
        .status(404)
        .json({ msg: "You haven't rated this product yet" });
    }

    // Update rating
    existingRating.rating = rating;
    if (review !== undefined) existingRating.review = review;
    await existingRating.save();

    // Update product rating statistics
    await updateProductRatingStats(productId);

    await existingRating.populate("user", "name");

    res.json({
      msg: "Rating updated successfully",
      rating: existingRating,
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

// @route   DELETE api/products/:productId/ratings/my
// @desc    Delete user's rating for a product
// @access  Private
exports.deleteMyRating = async (req, res) => {
  const { productId } = req.params;

  try {
    const rating = await ProductRating.findOneAndDelete({
      product: productId,
      user: req.user.id,
    });

    if (!rating) {
      return res.status(404).json({ msg: "Rating not found" });
    }

    // Update product rating statistics
    await updateProductRatingStats(productId);

    res.json({ msg: "Rating deleted successfully" });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

// @route   POST api/products/:productId/ratings/:ratingId/helpful
// @desc    Mark a review as helpful
// @access  Private
exports.markReviewHelpful = async (req, res) => {
  const { ratingId } = req.params;

  try {
    const rating = await ProductRating.findById(ratingId);

    if (!rating) {
      return res.status(404).json({ msg: "Rating not found" });
    }

    // Increment helpful count
    rating.helpful += 1;
    await rating.save();

    res.json({ msg: "Review marked as helpful", helpful: rating.helpful });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

// @route   GET api/products/:productId/rating-stats
// @desc    Get detailed rating statistics for a product
// @access  Public
exports.getRatingStats = async (req, res) => {
  const { productId } = req.params;

  try {
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ msg: "Product not found" });
    }

    // Get additional statistics
    const totalRatings = await ProductRating.countDocuments({
      product: productId,
    });
    const verifiedRatings = await ProductRating.countDocuments({
      product: productId,
      isVerified: true,
    });

    res.json({
      averageRating: product.averageRating,
      totalRatings: product.totalRatings,
      verifiedRatings,
      ratingDistribution: product.ratingDistribution,
      percentageVerified:
        totalRatings > 0
          ? ((verifiedRatings / totalRatings) * 100).toFixed(1)
          : 0,
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};
