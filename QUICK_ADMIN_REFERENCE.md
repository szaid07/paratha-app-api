# Quick Admin Reference

## 🔐 **Admin Login & Token Usage**

### **Problem**: "No token, authorization denied"

**Solution**: You need to include the JWT token in your requests.

---

## 🚀 **Quick Admin Login**

### **Method 1: Using the Admin Login Script**

```bash
npm run admin-login admin@paratha.com admin
```

This will:

- ✅ Login and get your token
- ✅ Test all admin routes automatically
- ✅ Show you the token to copy

### **Method 2: Manual Login**

```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@paratha.com","password":"admin"}'
```

---

## 🔑 **Using the Token**

### **Copy the token from the login response and use it in the header:**

```bash
curl -X GET http://localhost:3000/api/admin/users \
  -H "x-auth-token: YOUR_TOKEN_HERE"
```

### **Example with actual token:**

```bash
curl -X GET http://localhost:3000/api/admin/users \
  -H "x-auth-token: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoiNjg1N2Q5MGNhMTc1Nzg2YWFhYThlNWY1Iiwicm9sZSI6ImFkbWluIn0sImlhdCI6MTc1MDU4NzkzOSwiZXhwIjoxNzUwNTkxNTM5fQ.ZUJ9x165mXJGkYFiJjECWEst0PA1UelzO5JBWezX_b4"
```

---

## 📋 **Admin Routes That Need Token**

| Route                          | Method | Description                      | Header Required |
| ------------------------------ | ------ | -------------------------------- | --------------- |
| `/api/admin/users`             | GET    | View all users                   | `x-auth-token`  |
| `/api/admin/businesses`        | GET    | View all businesses              | `x-auth-token`  |
| `/api/admin/delivery-partners` | GET    | View all delivery partners       | `x-auth-token`  |
| `/api/admin/orders`            | GET    | View all orders                  | `x-auth-token`  |
| `/api/admin/orders/assign`     | POST   | Assign order to delivery partner | `x-auth-token`  |

---

## 🛠️ **Quick Commands**

### **Login and Test All Routes:**

```bash
npm run admin-login admin@paratha.com admin
```

### **Create New Admin User:**

```bash
npm run create-admin "New Admin" "newadmin@example.com" "password123"
```

### **Test All API Endpoints:**

```bash
npm run debug
```

### **View Swagger Documentation:**

```bash
npm run swagger
```

---

## 🔍 **Troubleshooting**

### **"No token, authorization denied"**

- ✅ Make sure you're logged in first
- ✅ Copy the token from login response
- ✅ Include `x-auth-token` header (not `Authorization`)
- ✅ Check that token hasn't expired (1 hour)

### **"Invalid Credentials"**

- ✅ Check email and password spelling
- ✅ Make sure the admin user exists

### **"Token is not valid"**

- ✅ Token has expired (get new one)
- ✅ Token is malformed
- ✅ Wrong token format

---

## 📱 **Using with Postman/Insomnia**

1. **Login first:**

   - Method: `POST`
   - URL: `http://localhost:3000/api/auth/login`
   - Body: `{"email":"admin@paratha.com","password":"admin"}`

2. **Copy the token from response**

3. **Use token in admin requests:**
   - Add header: `x-auth-token: YOUR_TOKEN`
   - Make requests to admin endpoints

---

## 🎯 **Example Workflow**

```bash
# 1. Login and get token
npm run admin-login admin@paratha.com admin

# 2. Copy the token from output

# 3. Use token in your requests
curl -X GET http://localhost:3000/api/admin/users \
  -H "x-auth-token: YOUR_TOKEN_HERE"
```

---

## ⚡ **Pro Tips**

- **Token expires in 1 hour** - get a new one if needed
- **Use the admin-login script** - it's the easiest way
- **Copy the exact token** - don't modify it
- **Include the header name** - `x-auth-token` not just the token
- **Test with the debug script** - it handles everything automatically
