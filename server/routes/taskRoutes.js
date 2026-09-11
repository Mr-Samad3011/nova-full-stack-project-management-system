// const express = require("express");

// const {
//   createTask,
//   getProjectTasks,
//   getTask,
//   updateTask,
//   deleteTask,
// } = require("../controllers/taskController");

// const {
//   protect,
// } = require("../middleware/authMiddleware");

// const router = express.Router();


// // ==========================================
// // CREATE TASK
// // ==========================================

// router.post(
//   "/project/:projectId",
//   protect,
//   createTask
// );


// // ==========================================
// // GET PROJECT TASKS
// // ==========================================

// router.get(
//   "/project/:projectId",
//   protect,
//   getProjectTasks
// );


// // ==========================================
// // GET SINGLE TASK
// // ==========================================

// router.get(
//   "/:id",
//   protect,
//   getTask
// );


// // ==========================================
// // UPDATE TASK
// // ==========================================

// router.put(
//   "/:id",
//   protect,
//   updateTask
// );


// // ==========================================
// // DELETE TASK
// // ==========================================

// router.delete(
//   "/:id",
//   protect,
//   deleteTask
// );


// module.exports = router;


const express = require("express");

const {
  createTask,
  getProjectTasks,
  getTask,
  updateTask,
  deleteTask,
} = require("../controllers/taskController");

const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

// =====================================================
// CREATE TASK
// POST /api/tasks/project/:projectId
// =====================================================

router.post(
  "/project/:projectId",
  protect,
  createTask
);

// =====================================================
// GET PROJECT TASKS
// GET /api/tasks/project/:projectId
// =====================================================

router.get(
  "/project/:projectId",
  protect,
  getProjectTasks
);

// =====================================================
// GET SINGLE TASK
// GET /api/tasks/:id
// =====================================================

router.get(
  "/:id",
  protect,
  getTask
);

// =====================================================
// UPDATE TASK
// PATCH /api/tasks/:id
// =====================================================

router.patch(
  "/:id",
  protect,
  updateTask
);

// =====================================================
// DELETE TASK
// DELETE /api/tasks/:id
// =====================================================

router.delete(
  "/:id",
  protect,
  deleteTask
);

// =====================================================
// EXPORT ROUTER
// =====================================================

module.exports = router;

