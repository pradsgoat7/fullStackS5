const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const mongoose = require("mongoose");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
require("dotenv").config();

const swaggerUi = require("swagger-ui-express");
const swaggerSpec = require("./swagger");
const registerSocketHandlers = require("./socket");

const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
const adminRoutes = require("./routes/adminRoutes");
const foodRoutes = require("./routes/foodRoutes");
const announcementRoutes = require("./routes/announcementRoutes");
const orderRoutes = require("./routes/orderRoutes");
const { notFound, errorHandler } = require("./middleware/errorMiddleware");

if (!process.env.MONGO_URI || !process.env.JWT_SECRET) {
  console.error("MONGO_URI and JWT_SECRET must be set in backend/.env");
  process.exit(1);
}

// Strip $-operators (e.g. {"$ne": null}) from query filters to block NoSQL injection
mongoose.set("sanitizeFilter", true);

// Frontend origins allowed to call the API and open sockets (comma-separated in CLIENT_URL)
const allowedOrigins = (process.env.CLIENT_URL || "http://localhost:5173")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

const app = express();

// Behind a reverse proxy (nginx in Docker) the client IP comes from X-Forwarded-For.
// TRUST_PROXY = number of proxy hops; without it every user would share one rate limit.
if (process.env.TRUST_PROXY) {
  app.set("trust proxy", Number(process.env.TRUST_PROXY));
}

// Interactive API docs for development. Mounted before helmet because its strict
// CSP blocks Swagger UI's assets; never exposed in production.
if (process.env.NODE_ENV !== "production") {
  app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
    customSiteTitle: "CampusEats API Docs",
    swaggerOptions: { persistAuthorization: true }
  }));
}

app.use(helmet());
app.use(cors({ origin: allowedOrigins }));
app.use(express.json({ limit: "10kb" }));

// Health/status endpoint, used by the Docker healthcheck, so it sits before the rate limiter
app.get("/", (req, res) => {
  res.json({
    status: "online",
    message: "CampusEats API is running",
    environment: process.env.NODE_ENV || "development",
    database: mongoose.connection.readyState === 1 ? "connected" : "disconnected",
    realtimeClients: req.app.get("io").engine.clientsCount
  });
});

app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    // A single page makes several API calls, so this is per-IP headroom, not a login limit
    limit: 300,
    standardHeaders: "draft-8",
    legacyHeaders: false,
    message: { message: "Too many requests. Please try again later." }
  })
);

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/foods", foodRoutes);
app.use("/api/announcements", announcementRoutes);
app.use("/api/orders", orderRoutes);

app.use(notFound);
app.use(errorHandler);

// One HTTP server for both Express and Socket.IO (WebSockets upgrade on /socket.io/)
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: allowedOrigins }
});
app.set("io", io);
registerSocketHandlers(io);

const PORT = process.env.PORT || 5000;

// Only start accepting requests once the database is reachable
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB Connected");
    server.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.log("MongoDB Connection Error:", error.message);
    process.exit(1);
  });
