const express = require("express");
const router = express.Router();
const {
  getProfile,
  updateProfile,
  changePassword,
} = require("../controllers/userController");
const auth = require("../middlewares/auth");

/**
 * @swagger
 * components:
 *   schemas:
 *     ProfileUpdate:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *           description: User's full name
 *         phone:
 *           type: string
 *           description: User's phone number
 *         gender:
 *           type: string
 *           enum: [male, female, other, prefer_not_to_say]
 *           description: User's gender
 *     PasswordChange:
 *       type: object
 *       required:
 *         - currentPassword
 *         - newPassword
 *       properties:
 *         currentPassword:
 *           type: string
 *           description: Current password
 *         newPassword:
 *           type: string
 *           minLength: 6
 *           description: New password (minimum 6 characters)
 *     UserProfile:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           description: User ID
 *         name:
 *           type: string
 *           description: User's full name
 *         email:
 *           type: string
 *           format: email
 *           description: User's email address
 *         phone:
 *           type: string
 *           description: User's phone number
 *         gender:
 *           type: string
 *           enum: [male, female, other, prefer_not_to_say]
 *           description: User's gender
 *         role:
 *           type: string
 *           enum: [customer, business, delivery, admin]
 *           description: User's role
 *         date:
 *           type: string
 *           format: date-time
 *           description: User registration date
 */

/**
 * @swagger
 * /api/user/profile:
 *   get:
 *     summary: Get user profile
 *     tags: [User Profile]
 *     security:
 *       - bearerAuth: []
 *       - xAuthToken: []
 *     responses:
 *       200:
 *         description: User profile retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserProfile'
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: User not found
 *       500:
 *         description: Server error
 */
router.get("/profile", auth, getProfile);

/**
 * @swagger
 * /api/user/profile:
 *   put:
 *     summary: Update user profile (name, phone, gender)
 *     tags: [User Profile]
 *     security:
 *       - bearerAuth: []
 *       - xAuthToken: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ProfileUpdate'
 *     responses:
 *       200:
 *         description: Profile updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 msg:
 *                   type: string
 *                   example: "Profile updated successfully"
 *                 user:
 *                   $ref: '#/components/schemas/UserProfile'
 *       400:
 *         description: Invalid input data
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: User not found
 *       500:
 *         description: Server error
 */
router.put("/profile", auth, updateProfile);

/**
 * @swagger
 * /api/user/change-password:
 *   put:
 *     summary: Change user password
 *     tags: [User Profile]
 *     security:
 *       - bearerAuth: []
 *       - xAuthToken: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/PasswordChange'
 *     responses:
 *       200:
 *         description: Password changed successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 msg:
 *                   type: string
 *                   example: "Password changed successfully"
 *       400:
 *         description: Invalid input data or incorrect current password
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: User not found
 *       500:
 *         description: Server error
 */
router.put("/change-password", auth, changePassword);

module.exports = router;
