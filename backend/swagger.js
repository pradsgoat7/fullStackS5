// OpenAPI description of the CampusEats API, served by Swagger UI at /api/docs (non-production only)
const PORT = process.env.PORT || 5000;

const jsonBody = (schemaRef, example) => ({
  required: true,
  content: { "application/json": { schema: { $ref: schemaRef }, example } }
});

const message = (description) => ({
  description,
  content: { "application/json": { schema: { $ref: "#/components/schemas/Message" } } }
});

const unauthorized = message("Missing, invalid or expired token");
const forbidden = message("Logged in, but the role is not allowed");

module.exports = {
  openapi: "3.0.3",
  info: {
    title: "CampusEats API",
    version: "1.0.0",
    description: "Smart College Canteen API — JWT authentication with role-based authorization (student, staff, admin)."
  },
  servers: [{ url: `http://localhost:${PORT}` }],
  tags: [
    { name: "Auth", description: "Register, login and the current user" },
    { name: "Protected", description: "Routes that need a valid JWT" },
    { name: "Foods", description: "Menu items (writes are admin only)" }
  ],
  components: {
    securitySchemes: {
      bearerAuth: { type: "http", scheme: "bearer", bearerFormat: "JWT" }
    },
    schemas: {
      Message: { type: "object", properties: { message: { type: "string" } } },
      RegisterInput: {
        type: "object",
        required: ["name", "email", "password"],
        properties: {
          name: { type: "string" },
          email: { type: "string", format: "email" },
          password: { type: "string", minLength: 8, maxLength: 72 }
        }
      },
      LoginInput: {
        type: "object",
        required: ["email", "password"],
        properties: { email: { type: "string", format: "email" }, password: { type: "string" } }
      },
      FoodInput: {
        type: "object",
        required: ["name", "price", "category", "stock"],
        properties: {
          name: { type: "string" },
          price: { type: "number", minimum: 0 },
          category: { type: "string" },
          description: { type: "string" },
          stock: { type: "integer", minimum: 0 }
        }
      }
    }
  },
  paths: {
    "/api/auth/register": {
      post: {
        tags: ["Auth"],
        summary: "Register a new student account",
        requestBody: jsonBody("#/components/schemas/RegisterInput", {
          name: "Pradnyesh Patil",
          email: "pradnyesh@campuseats.com",
          password: "Pradnyesh@2026"
        }),
        responses: {
          201: { description: "Registered; returns a JWT and the user" },
          400: { description: "Validation failed" },
          409: message("Email is already registered")
        }
      }
    },
    "/api/auth/login": {
      post: {
        tags: ["Auth"],
        summary: "Log in and receive a JWT",
        requestBody: jsonBody("#/components/schemas/LoginInput", {
          email: "pradnyesh@campuseats.com",
          password: "Pradnyesh@2026"
        }),
        responses: {
          200: { description: "Logged in; returns a JWT and the user" },
          401: message("Invalid email or password"),
          429: message("Too many failed attempts")
        }
      }
    },
    "/api/auth/profile": {
      get: {
        tags: ["Auth"],
        summary: "Current user's profile",
        security: [{ bearerAuth: [] }],
        responses: { 200: { description: "The logged-in user" }, 401: unauthorized }
      }
    },
    "/api/dashboard": {
      get: {
        tags: ["Protected"],
        summary: "Student dashboard (any logged-in user)",
        security: [{ bearerAuth: [] }],
        responses: { 200: { description: "Welcome message and user" }, 401: unauthorized }
      }
    },
    "/api/admin": {
      get: {
        tags: ["Protected"],
        summary: "Admin panel (admin only)",
        security: [{ bearerAuth: [] }],
        responses: { 200: { description: "Admin stats" }, 401: unauthorized, 403: forbidden }
      }
    },
    "/api/users": {
      get: {
        tags: ["Protected"],
        summary: "List all users (admin only)",
        security: [{ bearerAuth: [] }],
        responses: { 200: { description: "All users, without passwords" }, 401: unauthorized, 403: forbidden }
      }
    },
    "/api/announcements": {
      get: {
        tags: ["Protected"],
        summary: "Latest announcements (any logged-in user)",
        security: [{ bearerAuth: [] }],
        responses: { 200: { description: "Up to 5 most recent announcements" }, 401: unauthorized }
      },
      post: {
        tags: ["Protected"],
        summary: "Post an announcement and push it live to all connected clients (admin only)",
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: { "application/json": { example: { title: "Today's Special", body: "South Indian Thali available 1:00–2:30 PM." } } }
        },
        responses: { 201: { description: "Created and broadcast over Socket.IO" }, 400: { description: "Validation failed" }, 401: unauthorized, 403: forbidden }
      }
    },
    "/api/foods": {
      get: {
        tags: ["Foods"],
        summary: "List menu items (public)",
        responses: { 200: { description: "All food items" } }
      },
      post: {
        tags: ["Foods"],
        summary: "Add a menu item (admin only)",
        security: [{ bearerAuth: [] }],
        requestBody: jsonBody("#/components/schemas/FoodInput", {
          name: "Masala Dosa",
          price: 80,
          category: "South Indian",
          description: "Crispy dosa with potato masala, sambar and chutney",
          stock: 25
        }),
        responses: { 201: { description: "Created" }, 400: { description: "Validation failed" }, 401: unauthorized, 403: forbidden }
      }
    },
    "/api/foods/{id}": {
      parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
      get: {
        tags: ["Foods"],
        summary: "Get one menu item (public)",
        responses: { 200: { description: "The food item" }, 400: { description: "Invalid id" }, 404: message("Not found") }
      },
      put: {
        tags: ["Foods"],
        summary: "Update a menu item (admin only)",
        security: [{ bearerAuth: [] }],
        requestBody: jsonBody("#/components/schemas/FoodInput", { price: 85, stock: 30 }),
        responses: { 200: { description: "Updated item" }, 401: unauthorized, 403: forbidden, 404: message("Not found") }
      },
      delete: {
        tags: ["Foods"],
        summary: "Delete a menu item (admin only)",
        security: [{ bearerAuth: [] }],
        responses: { 200: message("Deleted"), 401: unauthorized, 403: forbidden, 404: message("Not found") }
      }
    }
  }
};
