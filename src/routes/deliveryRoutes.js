const express = require("express");
const router = express.Router();
const {
  getAssignedOrders,
  updateOrderStatus,
  getDeliveryHistory,
} = require("../controllers/deliveryController");
const auth = require("../middlewares/auth");
const checkRole = require("../middlewares/checkRole");

/**
 * @swagger
 * components:
 *   schemas:
 *     DeliveryOrder:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           description: Order ID
 *         customerId:
 *           type: string
 *           description: Customer ID
 *         customerName:
 *           type: string
 *           description: Customer name
 *         customerPhone:
 *           type: string
 *           description: Customer phone number
 *         businessId:
 *           type: string
 *           description: Business ID
 *         businessName:
 *           type: string
 *           description: Business name
 *         businessAddress:
 *           type: string
 *           description: Business address
 *         items:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               quantity:
 *                 type: number
 *               price:
 *                 type: number
 *         totalAmount:
 *           type: number
 *           description: Total order amount
 *         status:
 *           type: string
 *           enum: [pending, confirmed, preparing, out_for_delivery, delivered, cancelled]
 *           description: Order status
 *         deliveryAddress:
 *           type: string
 *           description: Delivery address
 *         pickupAddress:
 *           type: string
 *           description: Pickup address
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Order creation time
 *         estimatedPickupTime:
 *           type: string
 *           format: date-time
 *           description: Estimated pickup time
 *         estimatedDeliveryTime:
 *           type: string
 *           format: date-time
 *           description: Estimated delivery time
 *         actualPickupTime:
 *           type: string
 *           format: date-time
 *           description: Actual pickup time
 *         actualDeliveryTime:
 *           type: string
 *           format: date-time
 *           description: Actual delivery time
 *         specialInstructions:
 *           type: string
 *           description: Special delivery instructions
 *     OrderStatusUpdate:
 *       type: object
 *       required:
 *         - status
 *       properties:
 *         status:
 *           type: string
 *           enum: [confirmed, preparing, out_for_delivery, delivered, cancelled]
 *           description: New order status
 *         notes:
 *           type: string
 *           description: Additional notes for status update
 *         location:
 *           type: object
 *           properties:
 *             latitude:
 *               type: number
 *               description: Current latitude
 *             longitude:
 *               type: number
 *               description: Current longitude
 *     DeliveryHistory:
 *       type: object
 *       properties:
 *         deliveries:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/DeliveryOrder'
 *         totalDeliveries:
 *           type: number
 *           description: Total number of deliveries
 *         completedDeliveries:
 *           type: number
 *           description: Number of completed deliveries
 *         cancelledDeliveries:
 *           type: number
 *           description: Number of cancelled deliveries
 *         totalEarnings:
 *           type: number
 *           description: Total earnings from deliveries
 *         page:
 *           type: number
 *           description: Current page number
 *         limit:
 *           type: number
 *           description: Number of items per page
 */

// All delivery routes are private and for delivery role only
router.use(auth, checkRole(["delivery"]));

/**
 * @swagger
 * /api/delivery/assigned-orders:
 *   get:
 *     summary: Get assigned delivery orders
 *     tags: [Delivery]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [pending, confirmed, preparing, out_for_delivery, delivered, cancelled]
 *         description: Filter by order status
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
 *     responses:
 *       200:
 *         description: Assigned orders retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/DeliveryOrder'
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Delivery role required
 *       500:
 *         description: Server error
 */
router.get("/assigned-orders", getAssignedOrders);

/**
 * @swagger
 * /api/delivery/orders/{orderId}/status:
 *   put:
 *     summary: Update order status
 *     tags: [Delivery]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: orderId
 *         required: true
 *         schema:
 *           type: string
 *         description: Order ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/OrderStatusUpdate'
 *     responses:
 *       200:
 *         description: Order status updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/DeliveryOrder'
 *       400:
 *         description: Invalid status data
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Delivery role required
 *       404:
 *         description: Order not found
 *       500:
 *         description: Server error
 */
router.put("/orders/:orderId/status", updateOrderStatus);

/**
 * @swagger
 * /api/delivery/history:
 *   get:
 *     summary: Get delivery history
 *     tags: [Delivery]
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
 *         description: Number of deliveries per page
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [pending, confirmed, preparing, out_for_delivery, delivered, cancelled]
 *         description: Filter by delivery status
 *     responses:
 *       200:
 *         description: Delivery history retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/DeliveryHistory'
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Delivery role required
 *       500:
 *         description: Server error
 */
router.get("/history", getDeliveryHistory);

module.exports = router;
