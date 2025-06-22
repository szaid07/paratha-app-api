const express = require("express");
const router = express.Router();
const {
  signup,
  login,
  businessSignup,
  deliveryPartnerSignup,
  adminSignup,
} = require("../controllers/authController");

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       required:
 *         - name
 *         - email
 *         - password
 *         - phone
 *       properties:
 *         name:
 *           type: string
 *           description: User's full name
 *         email:
 *           type: string
 *           format: email
 *           description: User's email address
 *         password:
 *           type: string
 *           minLength: 6
 *           description: User's password (min 6 characters)
 *         phone:
 *           type: string
 *           description: User's phone number
 *     Business:
 *       type: object
 *       required:
 *         - name
 *         - email
 *         - password
 *         - phone
 *         - businessType
 *         - address
 *       properties:
 *         name:
 *           type: string
 *           description: Business name
 *         email:
 *           type: string
 *           format: email
 *           description: Business email address
 *         password:
 *           type: string
 *           minLength: 6
 *           description: Business password
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
 *     DeliveryPartner:
 *       type: object
 *       required:
 *         - name
 *         - email
 *         - password
 *         - phone
 *         - vehicleType
 *       properties:
 *         name:
 *           type: string
 *           description: Delivery partner's name
 *         email:
 *           type: string
 *           format: email
 *           description: Delivery partner's email
 *         password:
 *           type: string
 *           minLength: 6
 *           description: Delivery partner's password
 *         phone:
 *           type: string
 *           description: Delivery partner's phone number
 *         vehicleType:
 *           type: string
 *           enum: [bike, car, scooter]
 *           description: Type of vehicle used for delivery
 *     LoginRequest:
 *       type: object
 *       required:
 *         - email
 *         - password
 *       properties:
 *         email:
 *           type: string
 *           format: email
 *           description: User's email address
 *         password:
 *           type: string
 *           description: User's password
 *     AuthResponse:
 *       type: object
 *       properties:
 *         token:
 *           type: string
 *           description: JWT authentication token
 *         user:
 *           type: object
 *           properties:
 *             id:
 *               type: string
 *             name:
 *               type: string
 *             email:
 *               type: string
 *             role:
 *               type: string
 *               enum: [customer, business, delivery, admin]
 */

/**
 * @swagger
 * /api/auth/signup:
 *   post:
 *     summary: Register a new customer
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       201:
 *         description: User registered successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AuthResponse'
 *       400:
 *         description: Invalid input data
 *       409:
 *         description: User already exists
 */
router.post("/signup", signup);

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Authenticate user and get token
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LoginRequest'
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AuthResponse'
 *       400:
 *         description: Invalid credentials
 *       401:
 *         description: Authentication failed
 */
router.post("/login", login);

/**
 * @swagger
 * /api/auth/business/signup:
 *   post:
 *     summary: Register a new business
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Business'
 *     responses:
 *       201:
 *         description: Business registered successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AuthResponse'
 *       400:
 *         description: Invalid input data
 *       409:
 *         description: User already exists
 */
router.post("/business/signup", businessSignup);

/**
 * @swagger
 * /api/auth/delivery/signup:
 *   post:
 *     summary: Register a new delivery partner
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/DeliveryPartner'
 *     responses:
 *       201:
 *         description: Delivery partner registered successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AuthResponse'
 *       400:
 *         description: Invalid input data
 *       409:
 *         description: User already exists
 */
router.post("/delivery/signup", deliveryPartnerSignup);

/**
 * @swagger
 * /api/auth/admin/signup:
 *   post:
 *     summary: Register a new admin user
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       201:
 *         description: Admin registered successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AuthResponse'
 *       400:
 *         description: Invalid input data
 *       409:
 *         description: User already exists
 */
router.post("/admin/signup", adminSignup);

module.exports = router;
