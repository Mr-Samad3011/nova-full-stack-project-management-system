
// const express = require("express");

// const {
//   searchUsers,
//   getUserById,
// } = require("../controllers/userController");

// const {
//   protect,
// } = require("../middleware/authMiddleware");

// const router = express.Router();

// // =====================================================
// // SEARCH USERS
// // =====================================================

// router.get(
//   "/search",
//   protect,
//   searchUsers
// );

// // =====================================================
// // GET USER BY ID
// // =====================================================

// router.get(
//   "/:id",
//   protect,
//   getUserById
// );

// module.exports = router;


const express = require("express");

const {
  searchUsers,
  getUsers,
  getUserById,
  updateUser,
  updateUserRole,
  deleteUser,
} = require("../controllers/userController");

const {
  protect,
} = require("../middleware/authMiddleware");

const router = express.Router();


// =====================================================
// GET ALL USERS
// GET /api/users
// =====================================================

router.get(
  "/",
  protect,
  getUsers
);


// =====================================================
// SEARCH USERS
// GET /api/users/search?q=keyword
// IMPORTANT: Keep this BEFORE /:id
// =====================================================

router.get(
  "/search",
  protect,
  searchUsers
);


// =====================================================
// GET USER BY ID
// GET /api/users/:id
// =====================================================

router.get(
  "/:id",
  protect,
  getUserById
);


// =====================================================
// UPDATE USER ROLE
// PATCH /api/users/:id/role
// =====================================================

router.patch(
  "/:id/role",
  protect,
  updateUserRole
);


// =====================================================
// UPDATE USER
// PATCH /api/users/:id
// =====================================================

router.patch(
  "/:id",
  protect,
  updateUser
);


// =====================================================
// DELETE USER
// DELETE /api/users/:id
// =====================================================

router.delete(
  "/:id",
  protect,
  deleteUser
);


// =====================================================
// EXPORT
// =====================================================

module.exports = router;

