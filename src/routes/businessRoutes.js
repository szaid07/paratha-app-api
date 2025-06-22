const express = require("express");
const router = express.Router();
const {
  getBusinessProfile,
  updateBusinessProfile,
  addProduct,
  editProduct,
  getBusinessOrders,
  getBusinessOrderHistory,
} = require("../controllers/businessController");
const auth = require("../middlewares/auth");
const checkRole = require("../middlewares/checkRole");

// All business routes are private and for business role only
router.use(auth, checkRole(["business"]));

/**
 * @swagger
 * /api/business/profile:
 *   get:
 *     summary: Get business profile
 *     tags: [Business]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Business profile retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/BusinessProfile'
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Business role required
 *       500:
 *         description: Server error
 */
router.get("/profile", getBusinessProfile);

/**
 * @swagger
 * /api/business/profile:
 *   put:
 *     summary: Update business profile
 *     tags: [Business]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/BusinessProfile'
 *     responses:
 *       200:
 *         description: Business profile updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/BusinessProfile'
 *       400:
 *         description: Invalid profile data
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Business role required
 *       500:
 *         description: Server error
 */
router.put("/profile", updateBusinessProfile);

/**
 * @swagger
 * /api/business/products:
 *   post:
 *     summary: Add a new product to menu
 *     tags: [Business]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Product'
 *     responses:
 *       201:
 *         description: Product added successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *       400:
 *         description: Invalid product data
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Business role required
 *       500:
 *         description: Server error
 */
router.post("/products", addProduct);

/**
 * @swagger
 * /api/business/products/{productId}:
 *   put:
 *     summary: Edit an existing product
 *     tags: [Business]
 *     security:
 *       - bearerAuth: []
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
 *             $ref: '#/components/schemas/Product'
 *     responses:
 *       200:
 *         description: Product updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *       400:
 *         description: Invalid product data
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Business role required
 *       404:
 *         description: Product not found
 *       500:
 *         description: Server error
 */
router.put("/products/:productId", editProduct);

/**
 * @swagger
 * /api/business/orders:
 *   get:
 *     summary: Get current business orders
 *     tags: [Business]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [pending, confirmed, preparing, out_for_delivery, delivered, cancelled]
 *         description: Filter by order status
 *     responses:
 *       200:
 *         description: Orders retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/BusinessOrder'
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Business role required
 *       500:
 *         description: Server error
 */
router.get("/orders", getBusinessOrders);

/**
 * @swagger
 * /api/business/orders/history:
 *   get:
 *     summary: Get business order history
 *     tags: [Business]
 *     security:
 *       - bearerAuth: []
 *     parameters:
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
 *         description: Number of orders per page
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [pending, confirmed, preparing, out_for_delivery, delivered, cancelled]
 *         description: Filter by order status
 *     responses:
 *       200:
 *         description: Order history retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/BusinessOrderHistory'
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Business role required
 *       500:
 *         description: Server error
 */
router.get("/orders/history", getBusinessOrderHistory);

module.exports = router;
