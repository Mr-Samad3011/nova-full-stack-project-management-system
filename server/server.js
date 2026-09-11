
const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

const connectDB = require("./config/db");

const authRoutes = require("./routes/authRoutes");
const projectRoutes = require("./routes/projectRoutes");
const userRoutes = require("./routes/userRoutes");
const taskRoutes = require("./routes/taskRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
const commentRoutes = require("./routes/commentRoutes");
const notificationRoutes = require("./routes/notificationRoutes");
const analyticsRoutes = require("./routes/analyticsRoutes");

dotenv.config();

const app = express();

// =====================================================
// DATABASE
// =====================================================

connectDB();

// =====================================================
// CORS
// =====================================================

const allowedOrigins = [
  "http://localhost:5173",
  "https://novapms.netlify.app",

  // Production frontend
  process.env.CLIENT_URL,
];

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests without Origin
      // Example: Postman / server-to-server
      if (!origin) {
        return callback(null, true);
      }

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(
        new Error("Not allowed by CORS")
      );
    },

    credentials: true,
  })
);

// =====================================================
// BODY PARSER
// =====================================================

app.use(express.json());

// =====================================================
// HEALTH CHECK
// =====================================================

app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "NOVA API is running 🚀",
  });
});

// =====================================================
// AUTH ROUTES
// =====================================================

app.use(
  "/api/auth",
  authRoutes
);

// =====================================================
// PROJECT ROUTES
// =====================================================

app.use(
  "/api/projects",
  projectRoutes
);

// =====================================================
// USER ROUTES
// =====================================================

app.use(
  "/api/users",
  userRoutes
);

// =====================================================
// TASK ROUTES
// =====================================================

app.use(
  "/api/tasks",
  taskRoutes
);

// =====================================================
// DASHBOARD ROUTES
// =====================================================

app.use(
  "/api/dashboard",
  dashboardRoutes
);

// =====================================================
// COMMENT ROUTES
// =====================================================

app.use(
  "/api/comments",
  commentRoutes
);

// =====================================================
// NOTIFICATION ROUTES
// =====================================================

app.use(
  "/api/notifications",
  notificationRoutes
);

// =====================================================
// ANALYTICS ROUTES
// =====================================================

app.use(
  "/api/analytics",
  analyticsRoutes
);

// =====================================================
// PORT
// =====================================================

const PORT =
  process.env.PORT || 5000;

// =====================================================
// START SERVER
// =====================================================

app.listen(
  PORT,
  "0.0.0.0",
  () => {
    console.log(
      `NOVA server running on port ${PORT}`
    );
  }
);

