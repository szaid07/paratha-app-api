# API Debugging Guide

This guide will help you debug your Paratha App API effectively.

## 🚀 Quick Start

### 1. Start the Server

```bash
npm run swagger
```

### 2. Test API Endpoints

```bash
npm run debug
```

### 3. View Swagger Documentation

Visit: http://localhost:3000/api-docs

## 🔧 Debugging Methods

### Method 1: Using the Debug Script

The `debug-api.js` script provides automated testing with detailed logging:

```bash
npm run debug
```

This will:

- Test signup endpoint
- Test login endpoint
- Test protected routes
- Show detailed request/response logs

### Method 2: Manual Testing with curl

#### Test Signup

```bash
curl -X POST http://localhost:3000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@example.com","password":"password123"}'
```

#### Test Login

```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'
```

#### Test Protected Routes (with token)

```bash
curl -X GET http://localhost:3000/api/menu \
  -H "x-auth-token: YOUR_JWT_TOKEN_HERE"
```

### Method 3: VS Code Debugger

1. Open VS Code in your project directory
2. Go to Run & Debug (Cmd+Shift+D)
3. Create launch.json if needed
4. Set breakpoints in your code
5. Press F5 to start debugging

### Method 4: Console Logging

Add console.log statements in your controllers:

```javascript
exports.signup = async (req, res) => {
  console.log("Signup request body:", req.body);

  try {
    // Your code here
    console.log("User created successfully:", user);
  } catch (err) {
    console.error("Signup error:", err);
    res.status(500).send("Server error");
  }
};
```

## 🐛 Common Issues & Solutions

### 1. "Server error" on every API call

**Cause**: Usually JWT_SECRET not properly configured
**Solution**:

- Check `.env` file exists and has JWT_SECRET
- Ensure JWT_SECRET is not truncated
- Restart server after changing .env

### 2. "secretOrPrivateKey must have a value"

**Cause**: JWT_SECRET is undefined
**Solution**:

- Verify `.env` file is in project root
- Check `require("dotenv").config()` is called before using process.env
- Ensure JWT_SECRET is properly set in .env

### 3. "User already exists"

**Cause**: Email already registered
**Solution**: Use a different email address for testing

### 4. "Invalid Credentials"

**Cause**: Wrong email/password combination
**Solution**: Use correct credentials or create new user

### 5. "No token, authorization denied"

**Cause**: Missing or invalid auth token
**Solution**:

- Include `x-auth-token` header
- Use valid JWT token from login/signup

## 📊 Monitoring & Logs

### Server Logs

Watch your terminal for:

- Server startup messages
- Database connection status
- Error messages
- Request logs

### Database Connection

Check MongoDB connection:

```bash
# Check if MongoDB is running
brew services list | grep mongodb

# Start MongoDB if needed
brew services start mongodb/brew/mongodb-community
```

### Environment Variables

Verify your `.env` file:

```bash
cat .env
```

Should contain:

```
PORT=3000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_secure_jwt_secret
```

## 🛠️ Advanced Debugging

### 1. Enable Detailed Error Logging

Add to your app.js:

```javascript
app.use((err, req, res, next) => {
  console.error("Error details:", {
    message: err.message,
    stack: err.stack,
    url: req.url,
    method: req.method,
    body: req.body,
  });
  res.status(500).json({ error: "Internal server error" });
});
```

### 2. Request Logging Middleware

Add to your app.js:

```javascript
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`, {
    body: req.body,
    headers: req.headers,
  });
  next();
});
```

### 3. Database Query Logging

Enable Mongoose debug mode:

```javascript
mongoose.set("debug", true);
```

## 📱 Testing Tools

### 1. Postman

- Import your Swagger spec
- Create collections for different endpoints
- Set up environment variables for tokens

### 2. Insomnia

- Similar to Postman
- Good for REST API testing

### 3. curl (Command Line)

- Quick testing from terminal
- Good for automation

### 4. Swagger UI

- Interactive documentation
- Built-in testing interface
- Available at http://localhost:3000/api-docs

## 🔍 Debugging Checklist

When debugging API issues:

- [ ] Server is running (`npm run swagger`)
- [ ] MongoDB is connected
- [ ] `.env` file exists and has correct values
- [ ] JWT_SECRET is properly set
- [ ] Request includes correct headers
- [ ] Request body format is correct
- [ ] Check server logs for errors
- [ ] Verify database connection
- [ ] Test with debug script (`npm run debug`)

## 📞 Getting Help

If you're still having issues:

1. Check the server logs for specific error messages
2. Run the debug script and share the output
3. Verify all environment variables are set correctly
4. Ensure MongoDB is running and accessible
5. Check that all required dependencies are installed

## 🎯 Quick Commands Reference

```bash
# Start server with Swagger
npm run swagger

# Start development server
npm run dev

# Run debug tests
npm run debug

# Check server status
curl http://localhost:3000/

# Check Swagger docs
curl http://localhost:3000/api-docs

# Kill all Node processes
pkill -f "node src/index.js"
```
