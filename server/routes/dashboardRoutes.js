// const express = require("express");

// const {
//   getDashboardStats,
// } = require(
//   "../controllers/dashboardController"
// );

// const {
//   protect,
// } = require(
//   "../middleware/authMiddleware"
// );

// const router = express.Router();


// // Dashboard Statistics

// router.get(
//   "/stats",
//   protect,
//   getDashboardStats
// );


// module.exports = router;

const express = require("express");

const {
  getDashboardStats,
} = require("../controllers/dashboardController");

const {
  protect,
  authorize,
} = require("../middleware/authMiddleware");

const router = express.Router();

// =====================================================
// DASHBOARD STATISTICS
// =====================================================
//
// Authentication required.
//
// Allowed Roles:
// OWNER
// ADMIN
// MANAGER
// MEMBER
//
// =====================================================

router.get(
  "/stats",
  protect,
  authorize(
    "OWNER",
    "ADMIN",
    "MANAGER",
    "MEMBER"
  ),
  getDashboardStats
);

module.exports = router;