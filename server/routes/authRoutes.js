// const express = require("express");

// const {
//   registerUser,
//   loginUser,getMe,
// } = require("../controllers/authController");

// const {
//   protect,
// } = require("../middleware/authMiddleware");

// const router = express.Router();

// router.post("/register", registerUser);

// router.post("/login", loginUser);

// router.get("/me", protect, getMe);

// module.exports = router;


const express = require("express");

const {
  registerUser,
  loginUser,
  getMe,
} = require("../controllers/authController");

const {
  protect,
} = require("../middleware/authMiddleware");

const router = express.Router();

// =====================================================
// REGISTER
// POST /api/auth/register
// =====================================================

router.post(
  "/register",
  registerUser
);

// =====================================================
// LOGIN
// POST /api/auth/login
// =====================================================

router.post(
  "/login",
  loginUser
);

// =====================================================
// CURRENT USER
// GET /api/auth/me
// =====================================================

router.get(
  "/me",
  protect,
  getMe
);

module.exports = router;

