# Paratha App API

A comprehensive REST API for food delivery services with complete Swagger documentation for all controllers.

## Features

- **User Authentication & Authorization**: JWT-based authentication with role-based access control
- **Customer Management**: Menu browsing, order placement, order tracking, address management
- **Business Management**: Profile management, product/menu management, order processing
- **Delivery Partner Management**: Order assignment, status updates, delivery tracking
- **Admin Dashboard**: User management, business oversight, delivery partner management, order assignment
- **Interactive API Documentation**: Complete Swagger documentation for all endpoints

## Prerequisites

- Node.js (v18 or higher)
- MongoDB
- npm or yarn

## Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd food-delivery-api
```

2. Install dependencies:

```bash
npm install
```

3. Set up environment variables:

```bash
cp sample.env .env
```

4. Update the `.env` file with your configuration:

```env
PORT=3000
MONGODB_URI=mongodb://localhost:27017/food-delivery
JWT_SECRET=your_jwt_secret_key
```

5. Start MongoDB:

```bash
brew services start mongodb/brew/mongodb-community
```

## Running the Application

### Development Mode

```bash
npm run dev
```

### Production Mode

```bash
npm start
```

### Start with Swagger Documentation

```bash
npm run swagger
```

This will start the server and automatically open the Swagger documentation in your browser.

## API Documentation

Once the server is running, you can access the interactive API documentation at:

**http://localhost:3000/api-docs**

The Swagger UI provides:

- Complete API endpoint documentation for all controllers
- Request/response schemas with detailed descriptions
- Interactive testing interface
- Authentication token management
- Organized by controller categories (Auth, Customer, Business, Delivery, Admin)

## API Controllers & Endpoints

### 🔐 Authentication Controller

- `POST /api/auth/signup` - Register a new customer
- `POST /api/auth/login` - Authenticate user and get token
- `POST /api/auth/business/signup` - Register a new business
- `POST /api/auth/delivery/signup` - Register a new delivery partner

### 👤 Customer Controller

- `GET /api/menu` - Get all available menu items
- `POST /api/orders` - Place a new order
- `GET /api/orders/history` - Get customer order history
- `GET /api/orders/{orderId}/track` - Track order status
- `POST /api/addresses` - Add a new delivery address
- `GET /api/addresses` - Get all customer addresses
- `DELETE /api/addresses/{addressId}` - Delete a delivery address

### 🏪 Business Controller

- `GET /api/business/profile` - Get business profile
- `PUT /api/business/profile` - Update business profile
- `POST /api/business/products` - Add a new product to menu
- `PUT /api/business/products/{productId}` - Edit an existing product
- `GET /api/business/orders` - Get current business orders
- `GET /api/business/orders/history` - Get business order history

### 🚚 Delivery Controller

- `GET /api/delivery/assigned-orders` - Get assigned delivery orders
- `PUT /api/delivery/orders/{orderId}/status` - Update order status
- `GET /api/delivery/history` - Get delivery history

### 👨‍💼 Admin Controller

- `GET /api/admin/users` - Get all users
- `GET /api/admin/businesses` - Get all businesses
- `GET /api/admin/delivery-partners` - Get all delivery partners
- `GET /api/admin/orders` - Get all orders
- `POST /api/admin/orders/assign` - Assign order to delivery partner

## Authentication & Authorization

The API uses JWT (JSON Web Tokens) for authentication with role-based access control:

- **Customer Role**: Access to customer-specific endpoints
- **Business Role**: Access to business management endpoints
- **Delivery Role**: Access to delivery partner endpoints
- **Admin Role**: Access to all administrative endpoints

Include the token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

## Data Models

The API includes comprehensive data models for:

- **Users**: Customer, Business, Delivery Partner, Admin profiles
- **Orders**: Complete order lifecycle management
- **Products**: Menu items with categories and availability
- **Addresses**: Delivery address management
- **Business Profiles**: Business information and settings

## Database

The application uses MongoDB as the database. Make sure MongoDB is running before starting the application.

## Project Structure

```
src/
├── config/
│   ├── db.js              # Database configuration
│   ├── swagger.js         # Swagger configuration
│   └── swaggerSchemas.js  # API schemas
├── controllers/
│   ├── authController.js
│   ├── customerController.js
│   ├── businessController.js
│   ├── deliveryController.js
│   └── adminController.js
├── middlewares/
│   ├── auth.js           # JWT authentication
│   ├── checkRole.js      # Role-based authorization
│   └── isAdmin.js        # Admin authorization
├── routes/
│   ├── authRoutes.js
│   ├── customerRoutes.js
│   ├── businessRoutes.js
│   ├── deliveryRoutes.js
│   └── adminRoutes.js
├── app.js                # Express app configuration
└── index.js              # Server entry point
```

## Development

### Available Scripts

- `npm start` - Start the production server
- `npm run dev` - Start the development server with nodemon
- `npm run swagger` - Start server and open Swagger documentation

### Environment Variables

- `PORT` - Server port (default: 3000)
- `MONGODB_URI` - MongoDB connection string
- `JWT_SECRET` - Secret key for JWT token generation

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Update documentation as needed
6. Submit a pull request

## License

ISC
