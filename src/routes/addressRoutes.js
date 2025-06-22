const express = require("express");
const router = express.Router();
const {
  addAddress,
  getAddresses,
  getAddressById,
  updateAddress,
  deleteAddress,
  setDefaultAddress,
  getDefaultAddress,
} = require("../controllers/addressController");
const auth = require("../middlewares/auth");

/**
 * @swagger
 * components:
 *   schemas:
 *     Address:
 *       type: object
 *       required:
 *         - label
 *         - street
 *         - city
 *         - state
 *         - zip
 *         - latitude
 *         - longitude
 *       properties:
 *         label:
 *           type: string
 *           enum: [home, work, other]
 *           description: Address label for easy identification
 *         street:
 *           type: string
 *           description: Street address
 *         city:
 *           type: string
 *           description: City name
 *         state:
 *           type: string
 *           description: State or province
 *         zip:
 *           type: string
 *           description: ZIP or postal code
 *         country:
 *           type: string
 *           default: "USA"
 *           description: Country name
 *         latitude:
 *           type: number
 *           minimum: -90
 *           maximum: 90
 *           description: Latitude coordinate
 *         longitude:
 *           type: number
 *           minimum: -180
 *           maximum: 180
 *           description: Longitude coordinate
 *         isDefault:
 *           type: boolean
 *           default: false
 *           description: Whether this is the default address
 *     AddressResponse:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           description: Address ID
 *         user:
 *           type: string
 *           description: User ID
 *         label:
 *           type: string
 *           enum: [home, work, other]
 *         street:
 *           type: string
 *         city:
 *           type: string
 *         state:
 *           type: string
 *         zip:
 *           type: string
 *         country:
 *           type: string
 *         latitude:
 *           type: number
 *         longitude:
 *           type: number
 *         isDefault:
 *           type: boolean
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *     AddressList:
 *       type: object
 *       properties:
 *         addresses:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/AddressResponse'
 *         total:
 *           type: number
 *           description: Total number of addresses
 */

/**
 * @swagger
 * /api/addresses:
 *   post:
 *     summary: Add a new address
 *     tags: [Address Management]
 *     security:
 *       - bearerAuth: []
 *       - xAuthToken: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Address'
 *     responses:
 *       201:
 *         description: Address added successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 msg:
 *                   type: string
 *                   example: "Address added successfully"
 *                 address:
 *                   $ref: '#/components/schemas/AddressResponse'
 *       400:
 *         description: Invalid input data
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
router.post("/", auth, addAddress);

/**
 * @swagger
 * /api/addresses:
 *   get:
 *     summary: Get all addresses for the user
 *     tags: [Address Management]
 *     security:
 *       - bearerAuth: []
 *       - xAuthToken: []
 *     responses:
 *       200:
 *         description: Addresses retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AddressList'
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
router.get("/", auth, getAddresses);

/**
 * @swagger
 * /api/addresses/default:
 *   get:
 *     summary: Get user's default address
 *     tags: [Address Management]
 *     security:
 *       - bearerAuth: []
 *       - xAuthToken: []
 *     responses:
 *       200:
 *         description: Default address retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AddressResponse'
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: No default address found
 *       500:
 *         description: Server error
 */
router.get("/default", auth, getDefaultAddress);

/**
 * @swagger
 * /api/addresses/{id}:
 *   get:
 *     summary: Get a specific address by ID
 *     tags: [Address Management]
 *     security:
 *       - bearerAuth: []
 *       - xAuthToken: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Address ID
 *     responses:
 *       200:
 *         description: Address retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AddressResponse'
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Address not found
 *       500:
 *         description: Server error
 */
router.get("/:id", auth, getAddressById);

/**
 * @swagger
 * /api/addresses/{id}:
 *   put:
 *     summary: Update an address
 *     tags: [Address Management]
 *     security:
 *       - bearerAuth: []
 *       - xAuthToken: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Address ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Address'
 *     responses:
 *       200:
 *         description: Address updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 msg:
 *                   type: string
 *                   example: "Address updated successfully"
 *                 address:
 *                   $ref: '#/components/schemas/AddressResponse'
 *       400:
 *         description: Invalid input data
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Address not found
 *       500:
 *         description: Server error
 */
router.put("/:id", auth, updateAddress);

/**
 * @swagger
 * /api/addresses/{id}/set-default:
 *   put:
 *     summary: Set an address as default
 *     tags: [Address Management]
 *     security:
 *       - bearerAuth: []
 *       - xAuthToken: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Address ID
 *     responses:
 *       200:
 *         description: Default address set successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 msg:
 *                   type: string
 *                   example: "Default address set successfully"
 *                 address:
 *                   $ref: '#/components/schemas/AddressResponse'
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Address not found
 *       500:
 *         description: Server error
 */
router.put("/:id/set-default", auth, setDefaultAddress);

/**
 * @swagger
 * /api/addresses/{id}:
 *   delete:
 *     summary: Delete an address
 *     tags: [Address Management]
 *     security:
 *       - bearerAuth: []
 *       - xAuthToken: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Address ID
 *     responses:
 *       200:
 *         description: Address deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 msg:
 *                   type: string
 *                   example: "Address removed successfully"
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Address not found
 *       500:
 *         description: Server error
 */
router.delete("/:id", auth, deleteAddress);

module.exports = router;
