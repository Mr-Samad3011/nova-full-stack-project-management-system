// const express = require("express");

// const {
//   createProject,
//   getProjects,
//   getProject,
//   updateProject,
//   deleteProject,
//   addProjectMember,
//   removeProjectMember,
// } = require("../controllers/projectController");

// const {
//   protect,
// } = require("../middleware/authMiddleware");

// const router = express.Router();


// // Create
// router.post(
//   "/",
//   protect,
//   createProject
// );


// // Get all
// router.get(
//   "/",
//   protect,
//   getProjects
// );

// router.post(
//   "/:id/members",
//   protect,
//   addProjectMember
// );

// router.delete(
//   "/:id/members",
//   protect,
//   removeProjectMember
// );

// // Get single
// router.get(
//   "/:id",
//   protect,
//   getProject
// );

// router.post(
//   "/:id/members",
//   protect,
//   addProjectMember
// );

// router.delete(
//   "/:id/members",
//   protect,
//   removeProjectMember
// );

// // Update
// router.put(
//   "/:id",
//   protect,
//   updateProject
// );


// // Delete
// router.delete(
//   "/:id",
//   protect,
//   deleteProject
// );





// module.exports = router;



const express = require("express");

const {
  createProject,
  getProjects,
  getProject,
  updateProject,
  deleteProject,
  addProjectMember,
  removeProjectMember,
} = require("../controllers/projectController");

const {
  protect,
  authorize,
} = require("../middleware/authMiddleware");

const router = express.Router();


// =====================================================
// CREATE PROJECT
// POST /api/projects
// =====================================================
// OWNER, ADMIN and MANAGER can create projects.
// MEMBER and VIEWER cannot create projects.
// =====================================================

router.post(
  "/",
  protect,
  authorize(
    "OWNER",
    "ADMIN",
    "MANAGER"
  ),
  createProject
);


// =====================================================
// GET ALL PROJECTS
// GET /api/projects
// =====================================================
// All authenticated roles can view projects.
// =====================================================

router.get(
  "/",
  protect,
  authorize(
    "OWNER",
    "ADMIN",
    "MANAGER",
    "MEMBER",
    "VIEWER"
  ),
  getProjects
);


// =====================================================
// GET SINGLE PROJECT
// GET /api/projects/:id
// =====================================================
// All authenticated roles can view a project.
// =====================================================

router.get(
  "/:id",
  protect,
  authorize(
    "OWNER",
    "ADMIN",
    "MANAGER",
    "MEMBER",
    "VIEWER"
  ),
  getProject
);


// =====================================================
// ADD PROJECT MEMBER
// POST /api/projects/:id/members
// =====================================================
// OWNER, ADMIN and MANAGER can add members.
// =====================================================

router.post(
  "/:id/members",
  protect,
  authorize(
    "OWNER",
    "ADMIN",
    "MANAGER"
  ),
  addProjectMember
);


// =====================================================
// REMOVE PROJECT MEMBER
// DELETE /api/projects/:id/members
// =====================================================
// OWNER, ADMIN and MANAGER can remove members.
// =====================================================

router.delete(
  "/:id/members",
  protect,
  authorize(
    "OWNER",
    "ADMIN",
    "MANAGER"
  ),
  removeProjectMember
);


// =====================================================
// UPDATE PROJECT
// PUT /api/projects/:id
// =====================================================
// OWNER, ADMIN and MANAGER can update projects.
// =====================================================

router.put(
  "/:id",
  protect,
  authorize(
    "OWNER",
    "ADMIN",
    "MANAGER"
  ),
  updateProject
);


// =====================================================
// DELETE PROJECT
// DELETE /api/projects/:id
// =====================================================
// Only OWNER and ADMIN can delete projects.
// =====================================================

router.delete(
  "/:id",
  protect,
  authorize(
    "OWNER",
    "ADMIN"
  ),
  deleteProject
);


module.exports = router;