const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

// Import schemas
require("./swaggerSchemas");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Paratha App API",
      version: "1.0.0",
      description: "A comprehensive API for Paratha App platform",
      contact: {
        name: "API Support",
        email: "support@fooddelivery.com",
      },
    },
    servers: [
      {
        url: "http://localhost:3000",
        description: "Development server",
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
          description: "Enter your JWT token in the format: Bearer <token>",
        },
        xAuthToken: {
          type: "apiKey",
          in: "header",
          name: "x-auth-token",
          description: "Enter your JWT token (without Bearer prefix)",
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
      {
        xAuthToken: [],
      },
    ],
  },
  apis: ["./src/routes/*.js", "./src/config/swaggerSchemas.js"],
};

const specs = swaggerJsdoc(options);

module.exports = {
  serve: swaggerUi.serve,
  setup: swaggerUi.setup(specs, {
    explorer: true,
    customCss: ".swagger-ui .topbar { display: none }",
    customSiteTitle: "Food Delivery API Documentation",
    swaggerOptions: {
      persistAuthorization: true,
      displayRequestDuration: true,
      filter: true,
      showRequestHeaders: true,
      tryItOutEnabled: true,
    },
  }),
};
