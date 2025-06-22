const express = require("express");
const router = express.Router();
const {
  rateProduct,
  getProductRatings,
  getMyRating,
  updateMyRating,
  deleteMyRating,
  markReviewHelpful,
  getRatingStats,
} = require("../controllers/productRatingController");
const auth = require("../middlewares/auth");

/**
 * @swagger
 * components:
 *   schemas:
 *     ProductRating:
 *       type: object
 *       required:
 *         - rating
 *       properties:
 *         rating:
 *           type: number
 *           minimum: 1
 *           maximum: 5
 *           description: Rating value (1-5 stars)
 *         review:
 *           type: string
 *           maxLength: 500
 *           description: Optional review text
 *         orderId:
 *           type: string
 *           description: Order ID for verified purchase
 *     ProductRatingResponse:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           description: Rating ID
 *         product:
 *           type: string
 *           description: Product ID
 *         user:
 *           type: object
 *           properties:
 *             id:
 *               type: string
 *             name:
 *               type: string
 *         rating:
 *           type: number
 *           minimum: 1
 *           maximum: 5
 *         review:
 *           type: string
 *         orderId:
 *           type: string
 *         isVerified:
 *           type: boolean
 *           description: Whether this is a verified purchase
 *         helpful:
 *           type: number
 *           description: Number of helpful votes
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *     RatingStats:
 *       type: object
 *       properties:
 *         averageRating:
 *           type: number
 *           minimum: 0
 *           maximum: 5
 *         totalRatings:
 *           type: number
 *         verifiedRatings:
 *           type: number
 *         ratingDistribution:
 *           type: object
 *           properties:
 *             1:
 *               type: number
 *             2:
 *               type: number
 *             3:
 *               type: number
 *             4:
 *               type: number
 *             5:
 *               type: number
 *         percentageVerified:
 *           type: string
 *           description: Percentage of verified ratings
 */

/**
 * @swagger
 * /api/products/{productId}/rate:
 *   post:
 *     summary: Rate a product
 *     tags: [Product Ratings]
 *     security:
 *       - bearerAuth: []
 *       - xAuthToken: []
 *     parameters:
 *       - in: path
 *         name: productId
 *         required: true
 *         schema:
 *           type: string
 *         description: Product ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ProductRating'
 *     responses:
 *       201:
 *         description: Product rated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 msg:
 *                   type: string
 *                   example: "Product rated successfully"
 *                 rating:
 *                   $ref: '#/components/schemas/ProductRatingResponse'
 *       400:
 *         description: Invalid rating value
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Product not found
 *       500:
 *         description: Server error
 */
router.post("/:productId/rate", auth, rateProduct);

/**
 * @swagger
 * /api/products/{productId}/ratings:
 *   get:
 *     summary: Get all ratings for a product
 *     tags: [Product Ratings]
 *     parameters:
 *       - in: path
 *         name: productId
 *         required: true
 *         schema:
 *           type: string
 *         description: Product ID
 *       - in: query
 *         name: page
 *         schema:
 *           type: number
 *           default: 1
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: number
 *           default: 10
 *         description: Number of ratings per page
 *       - in: query
 *         name: rating
 *         schema:
 *           type: number
 *           minimum: 1
 *           maximum: 5
 *         description: Filter by specific rating
 *       - in: query
 *         name: verified
 *         schema:
 *           type: boolean
 *         description: Filter by verified purchases only
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *           enum: [createdAt, rating, helpful]
 *           default: createdAt
 *         description: Sort field
 *       - in: query
 *         name: sortOrder
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *           default: desc
 *         description: Sort order
 *     responses:
 *       200:
 *         description: Ratings retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 ratings:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/ProductRatingResponse'
 *                 pagination:
 *                   type: object
 *                   properties:
 *                     currentPage:
 *                       type: number
 *                     totalPages:
 *                       type: number
 *                     totalRatings:
 *                       type: number
 *                     hasNextPage:
 *                       type: boolean
 *                     hasPrevPage:
 *                       type: boolean
 *                 productStats:
 *                   $ref: '#/components/schemas/RatingStats'
 *       404:
 *         description: Product not found
 *       500:
 *         description: Server error
 */
router.get("/:productId/ratings", getProductRatings);

/**
 * @swagger
 * /api/products/{productId}/rating-stats:
 *   get:
 *     summary: Get detailed rating statistics for a product
 *     tags: [Product Ratings]
 *     parameters:
 *       - in: path
 *         name: productId
 *         required: true
 *         schema:
 *           type: string
 *         description: Product ID
 *     responses:
 *       200:
 *         description: Rating statistics retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/RatingStats'
 *       404:
 *         description: Product not found
 *       500:
 *         description: Server error
 */
router.get("/:productId/rating-stats", getRatingStats);

/**
 * @swagger
 * /api/products/{productId}/ratings/my:
 *   get:
 *     summary: Get user's rating for a product
 *     tags: [Product Ratings]
 *     security:
 *       - bearerAuth: []
 *       - xAuthToken: []
 *     parameters:
 *       - in: path
 *         name: productId
 *         required: true
 *         schema:
 *           type: string
 *         description: Product ID
 *     responses:
 *       200:
 *         description: User's rating retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ProductRatingResponse'
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Rating not found
 *       500:
 *         description: Server error
 */
router.get("/:productId/ratings/my", auth, getMyRating);

/**
 * @swagger
 * /api/products/{productId}/ratings/my:
 *   put:
 *     summary: Update user's rating for a product
 *     tags: [Product Ratings]
 *     security:
 *       - bearerAuth: []
 *       - xAuthToken: []
 *     parameters:
 *       - in: path
 *         name: productId
 *         required: true
 *         schema:
 *           type: string
 *         description: Product ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - rating
 *             properties:
 *               rating:
 *                 type: number
 *                 minimum: 1
 *                 maximum: 5
 *               review:
 *                 type: string
 *                 maxLength: 500
 *     responses:
 *       200:
 *         description: Rating updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 msg:
 *                   type: string
 *                   example: "Rating updated successfully"
 *                 rating:
 *                   $ref: '#/components/schemas/ProductRatingResponse'
 *       400:
 *         description: Invalid rating value
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Rating not found
 *       500:
 *         description: Server error
 */
router.put("/:productId/ratings/my", auth, updateMyRating);

/**
 * @swagger
 * /api/products/{productId}/ratings/my:
 *   delete:
 *     summary: Delete user's rating for a product
 *     tags: [Product Ratings]
 *     security:
 *       - bearerAuth: []
 *       - xAuthToken: []
 *     parameters:
 *       - in: path
 *         name: productId
 *         required: true
 *         schema:
 *           type: string
 *         description: Product ID
 *     responses:
 *       200:
 *         description: Rating deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 msg:
 *                   type: string
 *                   example: "Rating deleted successfully"
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Rating not found
 *       500:
 *         description: Server error
 */
router.delete("/:productId/ratings/my", auth, deleteMyRating);

/**
 * @swagger
 * /api/products/{productId}/ratings/{ratingId}/helpful:
 *   post:
 *     summary: Mark a review as helpful
 *     tags: [Product Ratings]
 *     security:
 *       - bearerAuth: []
 *       - xAuthToken: []
 *     parameters:
 *       - in: path
 *         name: productId
 *         required: true
 *         schema:
 *           type: string
 *         description: Product ID
 *       - in: path
 *         name: ratingId
 *         required: true
 *         schema:
 *           type: string
 *         description: Rating ID
 *     responses:
 *       200:
 *         description: Review marked as helpful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 msg:
 *                   type: string
 *                   example: "Review marked as helpful"
 *                 helpful:
 *                   type: number
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Rating not found
 *       500:
 *         description: Server error
 */
router.post("/:productId/ratings/:ratingId/helpful", auth, markReviewHelpful);

module.exports = router;
