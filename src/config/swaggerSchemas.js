/**
 * @swagger
 * components:
 *   schemas:
 *     # Authentication Schemas
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
 *               description: User ID
 *             name:
 *               type: string
 *               description: User's full name
 *             email:
 *               type: string
 *               format: email
 *               description: User's email address
 *             phone:
 *               type: string
 *               description: User's phone number
 *             role:
 *               type: string
 *               enum: [customer, business, delivery, admin]
 *               description: User's role
 *
 *     # Customer Schemas
 *     MenuItem:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           description: Menu item ID
 *         name:
 *           type: string
 *           description: Item name
 *         description:
 *           type: string
 *           description: Item description
 *         price:
 *           type: number
 *           description: Item price
 *         category:
 *           type: string
 *           description: Item category
 *         businessId:
 *           type: string
 *           description: Business ID
 *         isAvailable:
 *           type: boolean
 *           description: Item availability
 *     Order:
 *       type: object
 *       required:
 *         - items
 *         - deliveryAddress
 *       properties:
 *         items:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               menuItemId:
 *                 type: string
 *               quantity:
 *                 type: number
 *         deliveryAddress:
 *           type: string
 *           description: Delivery address
 *         specialInstructions:
 *           type: string
 *           description: Special delivery instructions
 *     OrderResponse:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *         customerId:
 *           type: string
 *         items:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/MenuItem'
 *         totalAmount:
 *           type: number
 *         status:
 *           type: string
 *           enum: [pending, confirmed, preparing, out_for_delivery, delivered, cancelled]
 *         deliveryAddress:
 *           type: string
 *         createdAt:
 *           type: string
 *           format: date-time
 *         estimatedDeliveryTime:
 *           type: string
 *           format: date-time
 *     Address:
 *       type: object
 *       required:
 *         - street
 *         - city
 *         - state
 *         - zipCode
 *       properties:
 *         street:
 *           type: string
 *           description: Street address
 *         city:
 *           type: string
 *           description: City
 *         state:
 *           type: string
 *           description: State
 *         zipCode:
 *           type: string
 *           description: ZIP code
 *         isDefault:
 *           type: boolean
 *           description: Default address flag
 *     OrderHistory:
 *       type: object
 *       properties:
 *         orders:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/OrderResponse'
 *         totalOrders:
 *           type: number
 *         page:
 *           type: number
 *         limit:
 *           type: number
 *
 *     # Business Schemas
 *     BusinessProfile:
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
 *         description:
 *           type: string
 *           description: Business description
 *         openingHours:
 *           type: object
 *           properties:
 *             monday:
 *               type: string
 *             tuesday:
 *               type: string
 *             wednesday:
 *               type: string
 *             thursday:
 *               type: string
 *             friday:
 *               type: string
 *             saturday:
 *               type: string
 *             sunday:
 *               type: string
 *         isOpen:
 *           type: boolean
 *           description: Business open status
 *     Product:
 *       type: object
 *       required:
 *         - name
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
 *           description: Product price
 *         category:
 *           type: string
 *           description: Product category
 *         image:
 *           type: string
 *           description: Product image URL
 *         isAvailable:
 *           type: boolean
 *           description: Product availability
 *         preparationTime:
 *           type: number
 *           description: Preparation time in minutes
 *     BusinessOrder:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *         customerId:
 *           type: string
 *         customerName:
 *           type: string
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
 *         status:
 *           type: string
 *           enum: [pending, confirmed, preparing, out_for_delivery, delivered, cancelled]
 *         deliveryAddress:
 *           type: string
 *         createdAt:
 *           type: string
 *           format: date-time
 *         estimatedDeliveryTime:
 *           type: string
 *           format: date-time
 *     BusinessOrderHistory:
 *       type: object
 *       properties:
 *         orders:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/BusinessOrder'
 *         totalOrders:
 *           type: number
 *         page:
 *           type: number
 *         limit:
 *           type: number
 *
 *     # Delivery Schemas
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
 *
 *     # Admin Schemas
 *     AdminUser:
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
 *     AdminBusiness:
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
 *     AdminDeliveryPartner:
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
 *             $ref: '#/components/schemas/AdminUser'
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
 *             $ref: '#/components/schemas/AdminBusiness'
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
 *             $ref: '#/components/schemas/AdminDeliveryPartner'
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

module.exports = {};
