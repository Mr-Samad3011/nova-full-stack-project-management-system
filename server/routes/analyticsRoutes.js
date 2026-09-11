
// const express = require("express");

// const router = express.Router();

// const {
//   getAnalytics,
// } = require("../controllers/analyticsController");

// // =====================================================
// // AUTH MIDDLEWARE
// // =====================================================

// // IMPORTANT:
// // Yahan wahi middleware import karo jo tumhare
// // existing protected routes mein already use ho raha hai.
// //
// // Example:
// // const { protect } = require("../middleware/authMiddleware");

// const { protect } = require("../middleware/authMiddleware");

// // =====================================================
// // GET ANALYTICS
// // GET /api/analytics
// // =====================================================

// router.get(
//   "/",
//   protect,
//   getAnalytics
// );

// // =====================================================
// // EXPORT
// // =====================================================

// module.exports = router;




const express = require("express");

const router = express.Router();

// =====================================================
// CONTROLLER
// =====================================================

const {
  getAnalytics,
} = require("../controllers/analyticsController");

// =====================================================
// AUTH MIDDLEWARE
// =====================================================

// Protect analytics route.
// req.user will be available inside analyticsController.

const {
  protect,
} = require("../middleware/authMiddleware");

// =====================================================
// GET ANALYTICS
// GET /api/analytics
// =====================================================
//
// RBAC is handled inside analyticsController:
//
// OWNER  -> All projects + all tasks
// ADMIN  -> All projects + all tasks
// MANAGER -> Only accessible/member projects
// MEMBER -> Only projects where user is a member/owner
// UNKNOWN/VIEWER -> No project analytics
//
// =====================================================

router.get(
  "/",
  protect,
  getAnalytics
);

// =====================================================
// EXPORT
// =====================================================

module.exports = router;

