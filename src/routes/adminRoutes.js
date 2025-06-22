const express = require("express");
const router = express.Router();
const {
  getUsers,
  getBusinesses,
  getDeliveryPartners,
  getOrders,
  assignOrder,
} = require("../controllers/adminController");
const auth = require("../middlewares/auth");
const isAdmin = require("../middlewares/isAdmin");

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           description: User ID
 *         name:
 *           type: string
 *           description: User name
 *         email:
 *           type: string
 *           format: email
 *           description: User email
 *         phone:
 *           type: string
 *           description: User phone number
 *         role:
 *           type: string
 *           enum: [customer, business, delivery, admin]
 *           description: User role
 *         isActive:
 *           type: boolean
 *           description: User active status
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: User creation date
 *         lastLogin:
 *           type: string
 *           format: date-time
 *           description: Last login date
 *     Business:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           description: Business ID
 *         name:
 *           type: string
 *           description: Business name
 *         email:
 *           type: string
 *           format: email
 *           description: Business email
 *         phone:
 *           type: string
 *           description: Business phone number
 *         businessType:
 *           type: string
 *           enum: [restaurant, cafe, bakery, grocery]
 *           description: Type of business
 *         address:
 *           type: string
 *           description: Business address
 *         isVerified:
 *           type: boolean
 *           description: Business verification status
 *         isActive:
 *           type: boolean
 *           description: Business active status
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Business creation date
 *         totalOrders:
 *           type: number
 *           description: Total orders received
 *         totalRevenue:
 *           type: number
 *           description: Total revenue generated
 *     DeliveryPartner:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           description: Delivery partner ID
 *         name:
 *           type: string
 *           description: Delivery partner name
 *         email:
 *           type: string
 *           format: email
 *           description: Delivery partner email
 *         phone:
 *           type: string
 *           description: Delivery partner phone number
 *         vehicleType:
 *           type: string
 *           enum: [bike, car, scooter]
 *           description: Vehicle type
 *         isAvailable:
 *           type: boolean
 *           description: Availability status
 *         isVerified:
 *           type: boolean
 *           description: Verification status
 *         isActive:
 *           type: boolean
 *           description: Active status
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Registration date
 *         totalDeliveries:
 *           type: number
 *           description: Total deliveries completed
 *         totalEarnings:
 *           type: number
 *           description: Total earnings
 *         rating:
 *           type: number
 *           description: Average rating
 *     AdminOrder:
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
 *         businessId:
 *           type: string
 *           description: Business ID
 *         businessName:
 *           type: string
 *           description: Business name
 *         deliveryPartnerId:
 *           type: string
 *           description: Delivery partner ID
 *         deliveryPartnerName:
 *           type: string
 *           description: Delivery partner name
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
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Order creation date
 *         estimatedDeliveryTime:
 *           type: string
 *           format: date-time
 *           description: Estimated delivery time
 *         actualDeliveryTime:
 *           type: string
 *           format: date-time
 *           description: Actual delivery time
 *     OrderAssignment:
 *       type: object
 *       required:
 *         - orderId
 *         - deliveryPartnerId
 *       properties:
 *         orderId:
 *           type: string
 *           description: Order ID to assign
 *         deliveryPartnerId:
 *           type: string
 *           description: Delivery partner ID
 *         notes:
 *           type: string
 *           description: Assignment notes
 *     UserList:
 *       type: object
 *       properties:
 *         users:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/User'
 *         totalUsers:
 *           type: number
 *           description: Total number of users
 *         page:
 *           type: number
 *           description: Current page number
 *         limit:
 *           type: number
 *           description: Number of items per page
 *     BusinessList:
 *       type: object
 *       properties:
 *         businesses:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Business'
 *         totalBusinesses:
 *           type: number
 *           description: Total number of businesses
 *         page:
 *           type: number
 *           description: Current page number
 *         limit:
 *           type: number
 *           description: Number of items per page
 *     DeliveryPartnerList:
 *       type: object
 *       properties:
 *         deliveryPartners:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/DeliveryPartner'
 *         totalDeliveryPartners:
 *           type: number
 *           description: Total number of delivery partners
 *         page:
 *           type: number
 *           description: Current page number
 *         limit:
 *           type: number
 *           description: Number of items per page
 *     OrderList:
 *       type: object
 *       properties:
 *         orders:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/AdminOrder'
 *         totalOrders:
 *           type: number
 *           description: Total number of orders
 *         page:
 *           type: number
 *           description: Current page number
 *         limit:
 *           type: number
 *           description: Number of items per page
 */

// All admin routes are private and for admin role only
router.use(auth, isAdmin);

/**
 * @swagger
 * /api/admin/users:
 *   get:
 *     summary: Get all users
 *     tags: [Admin]
 *     security:
 *       - xAuthToken: []
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
 *         description: Number of users per page
 *       - in: query
 *         name: role
 *         schema:
 *           type: string
 *           enum: [customer, business, delivery, admin]
 *         description: Filter by user role
 *       - in: query
 *         name: isActive
 *         schema:
 *           type: boolean
 *         description: Filter by active status
 *     responses:
 *       200:
 *         description: Users retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserList'
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Admin role required
 *       500:
 *         description: Server error
 */
router.get("/users", getUsers);

/**
 * @swagger
 * /api/admin/businesses:
 *   get:
 *     summary: Get all businesses
 *     tags: [Admin]
 *     security:
 *       - xAuthToken: []
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
 *         description: Number of businesses per page
 *       - in: query
 *         name: businessType
 *         schema:
 *           type: string
 *           enum: [restaurant, cafe, bakery, grocery]
 *         description: Filter by business type
 *       - in: query
 *         name: isVerified
 *         schema:
 *           type: boolean
 *         description: Filter by verification status
 *       - in: query
 *         name: isActive
 *         schema:
 *           type: boolean
 *         description: Filter by active status
 *     responses:
 *       200:
 *         description: Businesses retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/BusinessList'
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Admin role required
 *       500:
 *         description: Server error
 */
router.get("/businesses", getBusinesses);

/**
 * @swagger
 * /api/admin/delivery-partners:
 *   get:
 *     summary: Get all delivery partners
 *     tags: [Admin]
 *     security:
 *       - xAuthToken: []
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
 *         description: Number of delivery partners per page
 *       - in: query
 *         name: vehicleType
 *         schema:
 *           type: string
 *           enum: [bike, car, scooter]
 *         description: Filter by vehicle type
 *       - in: query
 *         name: isAvailable
 *         schema:
 *           type: boolean
 *         description: Filter by availability status
 *       - in: query
 *         name: isVerified
 *         schema:
 *           type: boolean
 *         description: Filter by verification status
 *       - in: query
 *         name: isActive
 *         schema:
 *           type: boolean
 *         description: Filter by active status
 *     responses:
 *       200:
 *         description: Delivery partners retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/DeliveryPartnerList'
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Admin role required
 *       500:
 *         description: Server error
 */
router.get("/delivery-partners", getDeliveryPartners);

/**
 * @swagger
 * /api/admin/orders:
 *   get:
 *     summary: Get all orders
 *     tags: [Admin]
 *     security:
 *       - xAuthToken: []
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
 *       - in: query
 *         name: businessId
 *         schema:
 *           type: string
 *         description: Filter by business ID
 *       - in: query
 *         name: customerId
 *         schema:
 *           type: string
 *         description: Filter by customer ID
 *       - in: query
 *         name: deliveryPartnerId
 *         schema:
 *           type: string
 *         description: Filter by delivery partner ID
 *     responses:
 *       200:
 *         description: Orders retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/OrderList'
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Admin role required
 *       500:
 *         description: Server error
 */
router.get("/orders", getOrders);

/**
 * @swagger
 * /api/admin/orders/assign:
 *   post:
 *     summary: Assign order to delivery partner
 *     tags: [Admin]
 *     security:
 *       - xAuthToken: []
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/OrderAssignment'
 *     responses:
 *       200:
 *         description: Order assigned successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AdminOrder'
 *       400:
 *         description: Invalid assignment data
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Admin role required
 *       404:
 *         description: Order or delivery partner not found
 *       500:
 *         description: Server error
 */
router.post("/orders/assign", assignOrder);

module.exports = router;
