const express = require("express");
const router = express.Router();
const {
  getAllProducts,
  getProductById,
  getProductsByBusiness,
  getCategories,
  addProduct,
  updateProduct,
  deleteProduct,
  searchProducts,
} = require("../controllers/productController");
const auth = require("../middlewares/auth");

/**
 * @swagger
 * components:
 *   schemas:
 *     Product:
 *       type: object
 *       required:
 *         - name
 *         - description
 *         - price
 *         - category
 *       properties:
 *         name:
 *           type: string
 *           description: Product name
 *         description:
 *           type: string
 *           description: Product description
 *         price:
 *           type: number
 *           minimum: 0
 *           description: Product price
 *         category:
 *           type: string
 *           description: Product category
 *         subcategory:
 *           type: string
 *           description: Product subcategory
 *         imageUrl:
 *           type: string
 *           description: Product image URL
 *         isAvailable:
 *           type: boolean
 *           default: true
 *           description: Product availability status
 *         preparationTime:
 *           type: number
 *           default: 15
 *           description: Preparation time in minutes
 *         calories:
 *           type: number
 *           minimum: 0
 *           description: Calories per serving
 *         protein:
 *           type: number
 *           minimum: 0
 *           description: Protein content in grams
 *         carbohydrates:
 *           type: number
 *           minimum: 0
 *           description: Carbohydrate content in grams
 *         fat:
 *           type: number
 *           minimum: 0
 *           description: Fat content in grams
 *         fiber:
 *           type: number
 *           minimum: 0
 *           description: Fiber content in grams
 *         sugar:
 *           type: number
 *           minimum: 0
 *           description: Sugar content in grams
 *         sodium:
 *           type: number
 *           minimum: 0
 *           description: Sodium content in milligrams
 *         allergens:
 *           type: array
 *           items:
 *             type: string
 *           description: List of allergens
 *         ingredients:
 *           type: array
 *           items:
 *             type: string
 *           description: List of ingredients
 *         isVegetarian:
 *           type: boolean
 *           default: false
 *           description: Vegetarian status
 *         isVegan:
 *           type: boolean
 *           default: false
 *           description: Vegan status
 *         isSpicy:
 *           type: boolean
 *           default: false
 *           description: Spicy status
 *         spiceLevel:
 *           type: number
 *           minimum: 0
 *           maximum: 5
 *           default: 0
 *           description: Spice level (0-5)
 *         averageRating:
 *           type: number
 *           minimum: 0
 *           maximum: 5
 *           default: 0
 *           description: Average rating
 *         totalRatings:
 *           type: number
 *           default: 0
 *           description: Total number of ratings
 *         ratingDistribution:
 *           type: object
 *           properties:
 *             1:
 *               type: number
 *               default: 0
 *             2:
 *               type: number
 *               default: 0
 *             3:
 *               type: number
 *               default: 0
 *             4:
 *               type: number
 *               default: 0
 *             5:
 *               type: number
 *               default: 0
 *           description: Distribution of ratings
 *         business:
 *           type: object
 *           properties:
 *             id:
 *               type: string
 *             name:
 *               type: string
 *             address:
 *               type: string
 *             phone:
 *               type: string
 *             cuisine:
 *               type: string
 *             openingHours:
 *               type: object
 *             profileImage:
 *               type: string
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *     BusinessInfo:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           description: Business ID
 *         name:
 *           type: string
 *           description: Business name
 *         address:
 *           type: string
 *           description: Business address
 *         phone:
 *           type: string
 *           description: Business phone number
 *         cuisine:
 *           type: array
 *           items:
 *             type: string
 *           description: Cuisine types
 *         openingHours:
 *           type: string
 *           description: Opening hours
 *         profileImage:
 *           type: string
 *           description: Business profile image
 *         description:
 *           type: string
 *           description: Business description
 *     ProductResponse:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           description: Product ID
 *         business:
 *           $ref: '#/components/schemas/BusinessInfo'
 *         name:
 *           type: string
 *         description:
 *           type: string
 *         price:
 *           type: number
 *         category:
 *           type: string
 *         subcategory:
 *           type: string
 *         imageUrl:
 *           type: string
 *         isAvailable:
 *           type: boolean
 *         preparationTime:
 *           type: number
 *         calories:
 *           type: number
 *         allergens:
 *           type: array
 *           items:
 *             type: string
 *         ingredients:
 *           type: array
 *           items:
 *             type: string
 *         rating:
 *           type: number
 *           minimum: 0
 *           maximum: 5
 *         totalRatings:
 *           type: number
 *         isVegetarian:
 *           type: boolean
 *         isVegan:
 *           type: boolean
 *         isSpicy:
 *           type: boolean
 *         spiceLevel:
 *           type: number
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *     ProductList:
 *       type: object
 *       properties:
 *         products:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/ProductResponse'
 *         pagination:
 *           type: object
 *           properties:
 *             currentPage:
 *               type: number
 *             totalPages:
 *               type: number
 *             totalProducts:
 *               type: number
 *             hasNextPage:
 *               type: boolean
 *             hasPrevPage:
 *               type: boolean
 */

/**
 * @swagger
 * /api/products:
 *   get:
 *     summary: Get all products with business details
 *     tags: [Products]
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
 *         description: Number of products per page
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *         description: Filter by category
 *       - in: query
 *         name: businessId
 *         schema:
 *           type: string
 *         description: Filter by business ID
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search in name and description
 *       - in: query
 *         name: minPrice
 *         schema:
 *           type: number
 *         description: Minimum price filter
 *       - in: query
 *         name: maxPrice
 *         schema:
 *           type: number
 *         description: Maximum price filter
 *       - in: query
 *         name: isAvailable
 *         schema:
 *           type: boolean
 *         description: Filter by availability
 *       - in: query
 *         name: isVegetarian
 *         schema:
 *           type: boolean
 *         description: Filter vegetarian products
 *       - in: query
 *         name: isVegan
 *         schema:
 *           type: boolean
 *         description: Filter vegan products
 *       - in: query
 *         name: isSpicy
 *         schema:
 *           type: boolean
 *         description: Filter spicy products
 *       - in: query
 *         name: minCalories
 *         schema:
 *           type: number
 *         description: Minimum calories filter
 *       - in: query
 *         name: maxCalories
 *         schema:
 *           type: number
 *         description: Maximum calories filter
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *           enum: [createdAt, price, averageRating, calories]
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
 *         description: Products retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 products:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Product'
 *                 pagination:
 *                   type: object
 *                   properties:
 *                     currentPage:
 *                       type: number
 *                     totalPages:
 *                       type: number
 *                     totalProducts:
 *                       type: number
 *                     hasNextPage:
 *                       type: boolean
 *                     hasPrevPage:
 *                       type: boolean
 *       500:
 *         description: Server error
 */
router.get("/", getAllProducts);

/**
 * @swagger
 * /api/products/categories:
 *   get:
 *     summary: Get all product categories
 *     tags: [Products]
 *     responses:
 *       200:
 *         description: Categories retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: string
 *       500:
 *         description: Server error
 */
router.get("/categories", getCategories);

/**
 * @swagger
 * /api/products/search:
 *   get:
 *     summary: Search products by name or description
 *     tags: [Products]
 *     parameters:
 *       - in: query
 *         name: q
 *         required: true
 *         schema:
 *           type: string
 *         description: Search query
 *       - in: query
 *         name: businessId
 *         schema:
 *           type: string
 *         description: Filter by business ID
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *         description: Filter by category
 *       - in: query
 *         name: limit
 *         schema:
 *           type: number
 *           default: 10
 *         description: Number of results
 *     responses:
 *       200:
 *         description: Search results
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 products:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Product'
 *                 total:
 *                   type: number
 *                 query:
 *                   type: string
 *       400:
 *         description: Search query is required
 *       500:
 *         description: Server error
 */
router.get("/search", searchProducts);

/**
 * @swagger
 * /api/products/business/{businessId}:
 *   get:
 *     summary: Get all products for a specific business
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: businessId
 *         required: true
 *         schema:
 *           type: string
 *         description: Business ID
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *         description: Filter by category
 *       - in: query
 *         name: isAvailable
 *         schema:
 *           type: boolean
 *         description: Filter by availability
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *           enum: [name, price, averageRating, createdAt]
 *           default: name
 *         description: Sort field
 *       - in: query
 *         name: sortOrder
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *           default: asc
 *         description: Sort order
 *     responses:
 *       200:
 *         description: Products retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 products:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Product'
 *                 total:
 *                   type: number
 *       500:
 *         description: Server error
 */
router.get("/business/:businessId", getProductsByBusiness);

/**
 * @swagger
 * /api/products/{id}:
 *   get:
 *     summary: Get a specific product with business details
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Product ID
 *     responses:
 *       200:
 *         description: Product retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *       404:
 *         description: Product not found
 *       500:
 *         description: Server error
 */
router.get("/:id", getProductById);

/**
 * @swagger
 * /api/products:
 *   post:
 *     summary: Add a new product (Business only)
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *       - xAuthToken: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - description
 *               - price
 *               - category
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               price:
 *                 type: number
 *                 minimum: 0
 *               category:
 *                 type: string
 *               subcategory:
 *                 type: string
 *               imageUrl:
 *                 type: string
 *               isAvailable:
 *                 type: boolean
 *                 default: true
 *               preparationTime:
 *                 type: number
 *                 default: 15
 *               calories:
 *                 type: number
 *                 minimum: 0
 *               protein:
 *                 type: number
 *                 minimum: 0
 *               carbohydrates:
 *                 type: number
 *                 minimum: 0
 *               fat:
 *                 type: number
 *                 minimum: 0
 *               fiber:
 *                 type: number
 *                 minimum: 0
 *               sugar:
 *                 type: number
 *                 minimum: 0
 *               sodium:
 *                 type: number
 *                 minimum: 0
 *               allergens:
 *                 type: array
 *                 items:
 *                   type: string
 *               ingredients:
 *                 type: array
 *                 items:
 *                   type: string
 *               isVegetarian:
 *                 type: boolean
 *                 default: false
 *               isVegan:
 *                 type: boolean
 *                 default: false
 *               isSpicy:
 *                 type: boolean
 *                 default: false
 *               spiceLevel:
 *                 type: number
 *                 minimum: 0
 *                 maximum: 5
 *                 default: 0
 *     responses:
 *       201:
 *         description: Product added successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 msg:
 *                   type: string
 *                   example: "Product added successfully"
 *                 product:
 *                   $ref: '#/components/schemas/Product'
 *       400:
 *         description: Missing required fields
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Only businesses can add products
 *       404:
 *         description: Business profile not found
 *       500:
 *         description: Server error
 */
router.post("/", auth, addProduct);

/**
 * @swagger
 * /api/products/{id}:
 *   put:
 *     summary: Update a product (Business only)
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *       - xAuthToken: []
 *     parameters:
 *       - in: path
 *         name: id
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
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               price:
 *                 type: number
 *                 minimum: 0
 *               category:
 *                 type: string
 *               subcategory:
 *                 type: string
 *               imageUrl:
 *                 type: string
 *               isAvailable:
 *                 type: boolean
 *               preparationTime:
 *                 type: number
 *               calories:
 *                 type: number
 *                 minimum: 0
 *               protein:
 *                 type: number
 *                 minimum: 0
 *               carbohydrates:
 *                 type: number
 *                 minimum: 0
 *               fat:
 *                 type: number
 *                 minimum: 0
 *               fiber:
 *                 type: number
 *                 minimum: 0
 *               sugar:
 *                 type: number
 *                 minimum: 0
 *               sodium:
 *                 type: number
 *                 minimum: 0
 *               allergens:
 *                 type: array
 *                 items:
 *                   type: string
 *               ingredients:
 *                 type: array
 *                 items:
 *                   type: string
 *               isVegetarian:
 *                 type: boolean
 *               isVegan:
 *                 type: boolean
 *               isSpicy:
 *                 type: boolean
 *               spiceLevel:
 *                 type: number
 *                 minimum: 0
 *                 maximum: 5
 *     responses:
 *       200:
 *         description: Product updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 msg:
 *                   type: string
 *                   example: "Product updated successfully"
 *                 product:
 *                   $ref: '#/components/schemas/Product'
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Only businesses can update products
 *       404:
 *         description: Product not found
 *       500:
 *         description: Server error
 */
router.put("/:id", auth, updateProduct);

/**
 * @swagger
 * /api/products/{id}:
 *   delete:
 *     summary: Delete a product (Business only)
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *       - xAuthToken: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Product ID
 *     responses:
 *       200:
 *         description: Product removed successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 msg:
 *                   type: string
 *                   example: "Product removed successfully"
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Only businesses can delete products
 *       404:
 *         description: Product not found
 *       500:
 *         description: Server error
 */
router.delete("/:id", auth, deleteProduct);

module.exports = router;
