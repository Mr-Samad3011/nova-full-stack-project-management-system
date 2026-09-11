// const express = require("express");

// const {
//   createComment,
//   getTaskComments,
//   createProjectComment,
//   getProjectComments,
//   updateComment,
//   deleteComment,
// } = require("../controllers/commentController");

// const {
//   protect,
// } = require("../middleware/authMiddleware");

// const router = express.Router();

// // =====================================================
// // TASK COMMENTS
// // =====================================================

// router.post(
//   "/task/:taskId",
//   protect,
//   createComment
// );

// router.get(
//   "/task/:taskId",
//   protect,
//   getTaskComments
// );

// // =====================================================
// // PROJECT COMMENTS
// // =====================================================

// router.post(
//   "/project/:projectId",
//   protect,
//   createProjectComment
// );

// router.get(
//   "/project/:projectId",
//   protect,
//   getProjectComments
// );

// // =====================================================
// // UPDATE / DELETE
// // =====================================================

// router.put(
//   "/:id",
//   protect,
//   updateComment
// );

// router.delete(
//   "/:id",
//   protect,
//   deleteComment
// );

// module.exports = router;


const express = require("express");

const {
  createComment,
  getTaskComments,

  createProjectComment,
  getProjectComments,

  updateComment,
  deleteComment,
} = require("../controllers/commentController");

const {
  protect,
} = require("../middleware/authMiddleware");

const router = express.Router();

// =====================================================
// AUTHENTICATION
// =====================================================
//
// All comment APIs require a logged-in user.
//
// IMPORTANT:
// Do NOT add role middleware here.
//
// ADMIN / OWNER / MANAGER / MEMBER / VIEWER
// can use the comment APIs according to
// project access rules handled inside controller.
// =====================================================


// =====================================================
// TASK COMMENTS
// =====================================================

// -----------------------------------------------------
// CREATE TASK COMMENT
// POST /api/comments/task/:taskId
// -----------------------------------------------------

router.post(
  "/task/:taskId",
  protect,
  createComment
);

// -----------------------------------------------------
// GET TASK COMMENTS
// GET /api/comments/task/:taskId
// -----------------------------------------------------

router.get(
  "/task/:taskId",
  protect,
  getTaskComments
);


// =====================================================
// PROJECT COMMENTS
// =====================================================

// -----------------------------------------------------
// CREATE PROJECT COMMENT
// POST /api/comments/project/:projectId
// -----------------------------------------------------
//
// Any authenticated user who has access to the project
// can create a comment.
//
// Role restriction is NOT applied here.
// -----------------------------------------------------

router.post(
  "/project/:projectId",
  protect,
  createProjectComment
);

// -----------------------------------------------------
// GET PROJECT COMMENTS
// GET /api/comments/project/:projectId
// -----------------------------------------------------
//
// Any authenticated user who has access to the project
// can read project comments.
// -----------------------------------------------------

router.get(
  "/project/:projectId",
  protect,
  getProjectComments
);


// =====================================================
// UPDATE COMMENT
// =====================================================
//
// PUT /api/comments/:id
//
// Controller decides:
// → Only comment creator can update.
//
// -----------------------------------------------------

router.put(
  "/:id",
  protect,
  updateComment
);


// =====================================================
// DELETE COMMENT
// =====================================================
//
// DELETE /api/comments/:id
//
// Controller decides:
// → Comment creator can delete
// → Project owner can delete
// → ADMIN can delete
// → Other users cannot delete
//
// -----------------------------------------------------

router.delete(
  "/:id",
  protect,
  deleteComment
);


// =====================================================
// EXPORT ROUTER
// =====================================================

module.exports = router;
