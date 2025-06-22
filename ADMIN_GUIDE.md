# Admin User Management Guide

This guide explains how to add and manage admin users in your Paratha App API.

## 🚀 Quick Start

### Method 1: Using the Admin Signup API (Recommended)

```bash
curl -X POST http://localhost:3000/api/auth/admin/signup \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Admin User",
    "email": "admin@paratha.com",
    "password": "admin123"
  }'
```

### Method 2: Using the Create Admin Script

```bash
npm run create-admin "Admin Name" "admin@example.com" "password123"
```

### Method 3: Using the Debug Script

```bash
npm run debug
```

This will test admin signup along with other endpoints.

## 📋 Admin User Details

### Required Fields

- **name**: Full name of the admin user
- **email**: Unique email address
- **password**: Minimum 6 characters

### Admin Role Permissions

Admin users have access to:

- ✅ View all users (`GET /api/admin/users`)
- ✅ View all businesses (`GET /api/admin/businesses`)
- ✅ View all delivery partners (`GET /api/admin/delivery-partners`)
- ✅ View all orders (`GET /api/admin/orders`)
- ✅ Assign orders to delivery partners (`POST /api/admin/orders/assign`)

## 🔐 Authentication

### Login as Admin

```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@paratha.com",
    "password": "admin123"
  }'
```

### Using Admin Token

Include the JWT token in the `x-auth-token` header:

```bash
curl -X GET http://localhost:3000/api/admin/users \
  -H "x-auth-token: YOUR_JWT_TOKEN_HERE"
```

## 🛠️ Admin API Endpoints

### 1. Get All Users

```bash
GET /api/admin/users
```

**Query Parameters:**

- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10)
- `role` (optional): Filter by role (customer, business, delivery, admin)
- `isActive` (optional): Filter by active status

### 2. Get All Businesses

```bash
GET /api/admin/businesses
```

**Query Parameters:**

- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10)
- `businessType` (optional): Filter by business type
- `isVerified` (optional): Filter by verification status
- `isActive` (optional): Filter by active status

### 3. Get All Delivery Partners

```bash
GET /api/admin/delivery-partners
```

**Query Parameters:**

- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10)
- `vehicleType` (optional): Filter by vehicle type
- `isAvailable` (optional): Filter by availability
- `isVerified` (optional): Filter by verification status
- `isActive` (optional): Filter by active status

### 4. Get All Orders

```bash
GET /api/admin/orders
```

**Query Parameters:**

- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10)
- `status` (optional): Filter by order status
- `businessId` (optional): Filter by business ID
- `customerId` (optional): Filter by customer ID
- `deliveryPartnerId` (optional): Filter by delivery partner ID

### 5. Assign Order to Delivery Partner

```bash
POST /api/admin/orders/assign
```

**Request Body:**

```json
{
  "orderId": "order_id_here",
  "deliveryPartnerId": "delivery_partner_id_here",
  "notes": "Optional assignment notes"
}
```

## 📊 Example Admin Workflow

### 1. Create Admin User

```bash
curl -X POST http://localhost:3000/api/auth/admin/signup \
  -H "Content-Type: application/json" \
  -d '{
    "name": "System Administrator",
    "email": "admin@paratha.com",
    "password": "securepassword123"
  }'
```

### 2. Login and Get Token

```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@paratha.com",
    "password": "securepassword123"
  }'
```

### 3. View All Users

```bash
curl -X GET http://localhost:3000/api/admin/users \
  -H "x-auth-token: YOUR_ADMIN_TOKEN"
```

### 4. View All Orders

```bash
curl -X GET http://localhost:3000/api/admin/orders \
  -H "x-auth-token: YOUR_ADMIN_TOKEN"
```

### 5. Assign Order to Delivery Partner

```bash
curl -X POST http://localhost:3000/api/admin/orders/assign \
  -H "Content-Type: application/json" \
  -H "x-auth-token: YOUR_ADMIN_TOKEN" \
  -d '{
    "orderId": "order_id_here",
    "deliveryPartnerId": "delivery_partner_id_here"
  }'
```

## 🔍 Testing Admin Functionality

### Using the Debug Script

```bash
npm run debug
```

This will:

1. Create a test customer user
2. Create a test admin user
3. Test admin routes with the admin token
4. Show detailed logs of all operations

### Using Swagger UI

1. Start the server: `npm run swagger`
2. Visit: http://localhost:3000/api-docs
3. Find the Authentication section
4. Test the admin signup endpoint
5. Use the returned token to test admin routes

## 🛡️ Security Considerations

### 1. Strong Passwords

- Use passwords with at least 8 characters
- Include uppercase, lowercase, numbers, and symbols
- Avoid common passwords

### 2. Token Management

- JWT tokens expire after 1 hour
- Store tokens securely
- Don't share tokens in public repositories

### 3. Access Control

- Admin endpoints require admin role
- Regular users cannot access admin routes
- Use HTTPS in production

## 📝 Admin User Management Best Practices

### 1. Create Multiple Admins

- Have at least 2 admin users for redundancy
- Use different email addresses for each admin

### 2. Regular Monitoring

- Monitor admin user activities
- Review admin access logs
- Rotate admin passwords periodically

### 3. Emergency Access

- Keep admin credentials secure but accessible
- Document admin recovery procedures
- Have backup admin accounts

## 🚨 Troubleshooting

### Common Issues

#### 1. "User already exists"

**Solution**: Use a different email address

#### 2. "Invalid Credentials"

**Solution**: Check email and password spelling

#### 3. "No token, authorization denied"

**Solution**: Include the `x-auth-token` header with valid JWT

#### 4. "Forbidden - Admin role required"

**Solution**: Ensure the user has admin role

### Debug Commands

```bash
# Check if admin user exists
curl -X GET http://localhost:3000/api/admin/users \
  -H "x-auth-token: YOUR_TOKEN"

# Test admin login
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@example.com","password":"password"}'

# Run full debug test
npm run debug
```

## 📞 Support

If you encounter issues:

1. Check the server logs for error messages
2. Verify the admin user was created successfully
3. Ensure the JWT token is valid and not expired
4. Test with the debug script to isolate the issue
5. Check that all required environment variables are set

## 🎯 Quick Reference

```bash
# Create admin user
npm run create-admin "Admin Name" "admin@example.com" "password123"

# Test admin functionality
npm run debug

# View Swagger documentation
npm run swagger

# Start development server
npm run dev
```

**Admin API Base URL**: `http://localhost:3000/api/admin`
**Authentication Header**: `x-auth-token: YOUR_JWT_TOKEN`
**Token Expiry**: 1 hour
