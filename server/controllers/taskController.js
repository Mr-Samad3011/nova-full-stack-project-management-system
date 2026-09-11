
// const Task = require("../models/Task");
// const Project = require("../models/Project");
// const User = require("../models/User");

// const {
//   createNotification,
// } = require("../services/notificationService");

// // =====================================================
// // CREATE TASK
// // POST /api/projects/:projectId/tasks
// // =====================================================

// const createTask = async (req, res) => {
//   try {
//     const {
//       title,
//       description,
//       status,
//       priority,
//       dueDate,
//       assignedTo,
//     } = req.body;

//     const projectId = req.params.projectId;

//     // -------------------------------------------------
//     // VALIDATION
//     // -------------------------------------------------

//     if (!title) {
//       return res.status(400).json({
//         success: false,
//         message: "Task title is required",
//       });
//     }

//     // -------------------------------------------------
//     // FIND PROJECT + CHECK ACCESS
//     // -------------------------------------------------

//     const project = await Project.findOne({
//       _id: projectId,
//       $or: [
//         {
//           owner: req.user._id,
//         },
//         {
//           members: req.user._id,
//         },
//       ],
//     });

//     if (!project) {
//       return res.status(404).json({
//         success: false,
//         message:
//           "Project not found or you don't have access",
//       });
//     }

//     // -------------------------------------------------
//     // CHECK ASSIGNED USER
//     // -------------------------------------------------

//     if (assignedTo) {
//       const isMember = project.members.some(
//         (memberId) =>
//           memberId.toString() ===
//           assignedTo.toString()
//       );

//       const isOwner =
//         project.owner.toString() ===
//         assignedTo.toString();

//       if (!isMember && !isOwner) {
//         return res.status(400).json({
//           success: false,
//           message:
//             "Task can only be assigned to project members",
//         });
//       }
//     }

//     // -------------------------------------------------
//     // DUE DATE VALIDATION
//     // -------------------------------------------------

//     if (
//       dueDate &&
//       new Date(dueDate) < new Date()
//     ) {
//       return res.status(400).json({
//         success: false,
//         message:
//           "Due date cannot be in the past",
//       });
//     }

//     // -------------------------------------------------
//     // CREATE TASK
//     // -------------------------------------------------

//     const task = await Task.create({
//       title,
//       description,
//       status,
//       priority,
//       dueDate,
//       project: projectId,
//       assignedTo: assignedTo || null,
//       createdBy: req.user._id,
//     });

//     // -------------------------------------------------
//     // CREATE NOTIFICATION
//     // -------------------------------------------------

//     if (
//       assignedTo &&
//       assignedTo.toString() !==
//         req.user._id.toString()
//     ) {
//       try {
//         await createNotification({
//           recipient: assignedTo,
//           sender: req.user._id,

//           type: "TASK_ASSIGNED",

//           title: "Task Assigned",

//           message: `You have been assigned a new task: ${task.title}`,

//           project: projectId,
//           task: task._id,
//         });
//       } catch (notificationError) {
//         console.error(
//           "Task Assignment Notification Error:",
//           notificationError
//         );
//       }
//     }

//     // -------------------------------------------------
//     // POPULATE TASK
//     // -------------------------------------------------

//     const populatedTask =
//       await Task.findById(task._id)
//         .populate(
//           "assignedTo",
//           "name username email"
//         )
//         .populate(
//           "createdBy",
//           "name username email"
//         )
//         .populate(
//           "project",
//           "name status"
//         );

//     // -------------------------------------------------
//     // RESPONSE
//     // -------------------------------------------------

//     return res.status(201).json({
//       success: true,
//       message: "Task created successfully",
//       task: populatedTask,
//     });
//   } catch (error) {
//     console.error(
//       "Create Task Error:",
//       error
//     );

//     return res.status(500).json({
//       success: false,
//       message:
//         "Server error while creating task",
//     });
//   }
// };

// // =====================================================
// // GET PROJECT TASKS
// // GET /api/projects/:projectId/tasks
// // =====================================================

// const getProjectTasks = async (req, res) => {
//   try {
//     const projectId = req.params.projectId;

//     // -------------------------------------------------
//     // CHECK PROJECT ACCESS
//     // -------------------------------------------------

//     const project = await Project.findOne({
//       _id: projectId,
//       $or: [
//         {
//           owner: req.user._id,
//         },
//         {
//           members: req.user._id,
//         },
//       ],
//     });

//     if (!project) {
//       return res.status(404).json({
//         success: false,
//         message:
//           "Project not found or you don't have access",
//       });
//     }

//     // -------------------------------------------------
//     // FETCH TASKS
//     // -------------------------------------------------

//     const tasks = await Task.find({
//       project: projectId,
//     })
//       .populate(
//         "assignedTo",
//         "name username email"
//       )
//       .populate(
//         "createdBy",
//         "name username email"
//       )
//       .sort({
//         createdAt: -1,
//       });

//     // -------------------------------------------------
//     // RESPONSE
//     // -------------------------------------------------

//     return res.status(200).json({
//       success: true,
//       count: tasks.length,
//       tasks,
//     });
//   } catch (error) {
//     console.error(
//       "Get Tasks Error:",
//       error
//     );

//     return res.status(500).json({
//       success: false,
//       message:
//         "Server error while fetching tasks",
//     });
//   }
// };

// // =====================================================
// // GET SINGLE TASK
// // GET /api/tasks/:id
// // =====================================================

// const getTask = async (req, res) => {
//   try {
//     // -------------------------------------------------
//     // FIND TASK
//     // -------------------------------------------------

//     const task = await Task.findById(
//       req.params.id
//     )
//       .populate(
//         "assignedTo",
//         "name username email"
//       )
//       .populate(
//         "createdBy",
//         "name username email"
//       )
//       .populate(
//         "project",
//         "name status"
//       );

//     if (!task) {
//       return res.status(404).json({
//         success: false,
//         message: "Task not found",
//       });
//     }

//     // -------------------------------------------------
//     // CHECK PROJECT ACCESS
//     // -------------------------------------------------

//     const project =
//       await Project.findOne({
//         _id: task.project._id,
//         $or: [
//           {
//             owner: req.user._id,
//           },
//           {
//             members: req.user._id,
//           },
//         ],
//       });

//     if (!project) {
//       return res.status(403).json({
//         success: false,
//         message:
//           "You don't have access to this task",
//       });
//     }

//     // -------------------------------------------------
//     // RESPONSE
//     // -------------------------------------------------

//     return res.status(200).json({
//       success: true,
//       task,
//     });
//   } catch (error) {
//     console.error(
//       "Get Task Error:",
//       error
//     );

//     return res.status(500).json({
//       success: false,
//       message:
//         "Server error while fetching task",
//     });
//   }
// };

// // =====================================================
// // UPDATE TASK
// // PATCH /api/tasks/:id
// // =====================================================

// // const updateTask = async (req, res) => {
// //   try {
// //     const {
// //       title,
// //       description,
// //       status,
// //       priority,
// //       dueDate,
// //       assignedTo,
// //     } = req.body;

// //     // -------------------------------------------------
// //     // FIND TASK
// //     // -------------------------------------------------

// //     const task = await Task.findById(
// //       req.params.id
// //     );

// //     if (!task) {
// //       return res.status(404).json({
// //         success: false,
// //         message: "Task not found",
// //       });
// //     }

// //     // -------------------------------------------------
// //     // SAVE OLD VALUES
// //     // -------------------------------------------------

// //     const oldAssignedTo =
// //       task.assignedTo
// //         ? task.assignedTo.toString()
// //         : null;

// //     const oldStatus = task.status;

// //     // -------------------------------------------------
// //     // CHECK PROJECT ACCESS
// //     // -------------------------------------------------

// //     const project =
// //       await Project.findOne({
// //         _id: task.project,
// //         $or: [
// //           {
// //             owner: req.user._id,
// //           },
// //           {
// //             members: req.user._id,
// //           },
// //         ],
// //       });

// //     if (!project) {
// //       return res.status(403).json({
// //         success: false,
// //         message:
// //           "You don't have access to this task",
// //       });
// //     }

// //     // -------------------------------------------------
// //     // CHECK NEW ASSIGNED USER
// //     // -------------------------------------------------

// //     if (assignedTo) {
// //       const isMember =
// //         project.members.some(
// //           (memberId) =>
// //             memberId.toString() ===
// //             assignedTo.toString()
// //         );

// //       const isOwner =
// //         project.owner.toString() ===
// //         assignedTo.toString();

// //       if (!isMember && !isOwner) {
// //         return res.status(400).json({
// //           success: false,
// //           message:
// //             "User is not a project member",
// //         });
// //       }
// //     }

// //     // -------------------------------------------------
// //     // UPDATE FIELDS
// //     // -------------------------------------------------

// //     if (title !== undefined) {
// //       task.title = title;
// //     }

// //     if (description !== undefined) {
// //       task.description = description;
// //     }

// //     if (status !== undefined) {
// //       task.status = status;
// //     }

// //     if (priority !== undefined) {
// //       task.priority = priority;
// //     }

// //     if (dueDate !== undefined) {
// //       task.dueDate = dueDate;
// //     }

// //     if (assignedTo !== undefined) {
// //       task.assignedTo =
// //         assignedTo || null;
// //     }

// //     // -------------------------------------------------
// //     // SAVE TASK
// //     // -------------------------------------------------

// //     await task.save();

// //     // -------------------------------------------------
// //     // NEW ASSIGNED USER
// //     // -------------------------------------------------

// //     const newAssignedTo =
// //       task.assignedTo
// //         ? task.assignedTo.toString()
// //         : null;

// //     // =================================================
// //     // NOTIFICATION: TASK ASSIGNED
// //     // =================================================

// //     if (
// //       newAssignedTo &&
// //       newAssignedTo !== oldAssignedTo &&
// //       newAssignedTo !==
// //         req.user._id.toString()
// //     ) {
// //       try {
// //         await createNotification({
// //           recipient: newAssignedTo,
// //           sender: req.user._id,

// //           type: "TASK_ASSIGNED",

// //           title: "Task Assigned",

// //           message: `You have been assigned a task: ${task.title}`,

// //           project: task.project,
// //           task: task._id,
// //         });
// //       } catch (notificationError) {
// //         console.error(
// //           "Task Assignment Notification Error:",
// //           notificationError
// //         );
// //       }
// //     }

// //     // =================================================
// //     // NOTIFICATION: STATUS CHANGED
// //     // =================================================

// //     if (
// //       status !== undefined &&
// //       status !== oldStatus &&
// //       newAssignedTo &&
// //       newAssignedTo !==
// //         req.user._id.toString()
// //     ) {
// //       try {
// //         await createNotification({
// //           recipient: newAssignedTo,
// //           sender: req.user._id,

// //           type: "TASK_STATUS_CHANGED",

// //           title: "Task Status Changed",

// //           message: `The status of "${task.title}" changed from "${oldStatus}" to "${task.status}".`,

// //           project: task.project,
// //           task: task._id,
// //         });
// //       } catch (notificationError) {
// //         console.error(
// //           "Task Status Notification Error:",
// //           notificationError
// //         );
// //       }
// //     }

// //     // =================================================
// //     // NOTIFICATION: TASK UPDATED
// //     // =================================================

// //     if (
// //       !(
// //         status !== undefined &&
// //         status !== oldStatus
// //       ) &&
// //       newAssignedTo &&
// //       newAssignedTo === oldAssignedTo &&
// //       newAssignedTo !==
// //         req.user._id.toString()
// //     ) {
// //       try {
// //         await createNotification({
// //           recipient: newAssignedTo,
// //           sender: req.user._id,

// //           type: "TASK_UPDATED",

// //           title: "Task Updated",

// //           message: `The task "${task.title}" has been updated.`,

// //           project: task.project,
// //           task: task._id,
// //         });
// //       } catch (notificationError) {
// //         console.error(
// //           "Task Update Notification Error:",
// //           notificationError
// //         );
// //       }
// //     }

// //     // -------------------------------------------------
// //     // POPULATE UPDATED TASK
// //     // -------------------------------------------------

// //     const updatedTask =
// //       await Task.findById(task._id)
// //         .populate(
// //           "assignedTo",
// //           "name username email"
// //         )
// //         .populate(
// //           "createdBy",
// //           "name username email"
// //         )
// //         .populate(
// //           "project",
// //           "name status"
// //         );

// //     // -------------------------------------------------
// //     // RESPONSE
// //     // -------------------------------------------------

// //     return res.status(200).json({
// //       success: true,
// //       message: "Task updated successfully",
// //       task: updatedTask,
// //     });
// //   } catch (error) {
// //     console.error(
// //       "Update Task Error:",
// //       error
// //     );

// //     return res.status(500).json({
// //       success: false,
// //       message:
// //         "Server error while updating task",
// //     });
// //   }
// // };


// const updateTask = async (req, res) => {
//   try {
//     const {
//       title,
//       description,
//       status,
//       priority,
//       dueDate,
//       assignedTo,
//     } = req.body;

//     // -------------------------------------------------
//     // FIND TASK
//     // -------------------------------------------------

//     const task = await Task.findById(
//       req.params.id
//     );

//     if (!task) {
//       return res.status(404).json({
//         success: false,
//         message: "Task not found",
//       });
//     }

//     // -------------------------------------------------
//     // SAVE OLD VALUES
//     // -------------------------------------------------

//     const oldAssignedTo = task.assignedTo
//       ? task.assignedTo.toString()
//       : null;

//     const oldStatus = task.status;

//     // -------------------------------------------------
//     // CHECK PROJECT ACCESS
//     // -------------------------------------------------

//     const project =
//       await Project.findOne({
//         _id: task.project,
//         $or: [
//           {
//             owner: req.user._id,
//           },
//           {
//             members: req.user._id,
//           },
//         ],
//       });

//     if (!project) {
//       return res.status(403).json({
//         success: false,
//         message:
//           "You don't have access to this task",
//       });
//     }

//     // -------------------------------------------------
//     // CHECK NEW ASSIGNED USER
//     // -------------------------------------------------

//     if (assignedTo) {
//       const isMember =
//         project.members.some(
//           (memberId) =>
//             memberId.toString() ===
//             assignedTo.toString()
//         );

//       const isOwner =
//         project.owner.toString() ===
//         assignedTo.toString();

//       if (!isMember && !isOwner) {
//         return res.status(400).json({
//           success: false,
//           message:
//             "User is not a project member",
//         });
//       }
//     }

//     // -------------------------------------------------
//     // UPDATE FIELDS
//     // -------------------------------------------------

//     if (title !== undefined) {
//       task.title = title;
//     }

//     if (description !== undefined) {
//       task.description = description;
//     }

//     if (status !== undefined) {
//       task.status = status;
//     }

//     if (priority !== undefined) {
//       task.priority = priority;
//     }

//     if (dueDate !== undefined) {
//       task.dueDate = dueDate;
//     }

//     if (assignedTo !== undefined) {
//       task.assignedTo =
//         assignedTo || null;
//     }

//     // -------------------------------------------------
//     // SAVE TASK
//     // -------------------------------------------------

//     await task.save();

//     // -------------------------------------------------
//     // NEW VALUES
//     // -------------------------------------------------

//     const newAssignedTo =
//       task.assignedTo
//         ? task.assignedTo.toString()
//         : null;

//     // =================================================
//     // NOTIFICATION: TASK ASSIGNED
//     // =================================================

//     if (
//       newAssignedTo &&
//       newAssignedTo !== oldAssignedTo &&
//       newAssignedTo !==
//         req.user._id.toString()
//     ) {
//       try {
//         await createNotification({
//           recipient: newAssignedTo,
//           sender: req.user._id,

//           type: "TASK_ASSIGNED",

//           title: "Task Assigned",

//           message: `You have been assigned a task: "${task.title}".`,

//           project: task.project,
//           task: task._id,
//         });
//       } catch (notificationError) {
//         console.error(
//           "Task Assignment Notification Error:",
//           notificationError
//         );
//       }
//     }

//     // =================================================
//     // NOTIFICATION: TASK STATUS CHANGED
//     // =================================================

//     if (
//       status !== undefined &&
//       status !== oldStatus &&
//       newAssignedTo &&
//       newAssignedTo !==
//         req.user._id.toString()
//     ) {
//       try {
//         await createNotification({
//           recipient: newAssignedTo,
//           sender: req.user._id,

//           type: "TASK_STATUS_CHANGED",

//           title: "Task Status Changed",

//           message: `The status of "${task.title}" changed from "${oldStatus}" to "${task.status}".`,

//           project: task.project,
//           task: task._id,
//         });
//       } catch (notificationError) {
//         console.error(
//           "Task Status Notification Error:",
//           notificationError
//         );
//       }
//     }

//     // =================================================
//     // NOTIFICATION: TASK UPDATED
//     // =================================================

//     const onlyGeneralUpdate =
//       !(
//         status !== undefined &&
//         status !== oldStatus
//       ) &&
//       newAssignedTo &&
//       newAssignedTo === oldAssignedTo &&
//       newAssignedTo !==
//         req.user._id.toString();

//     if (onlyGeneralUpdate) {
//       try {
//         await createNotification({
//           recipient: newAssignedTo,
//           sender: req.user._id,

//           type: "TASK_UPDATED",

//           title: "Task Updated",

//           message: `The task "${task.title}" has been updated.`,

//           project: task.project,
//           task: task._id,
//         });
//       } catch (notificationError) {
//         console.error(
//           "Task Update Notification Error:",
//           notificationError
//         );
//       }
//     }

//     // -------------------------------------------------
//     // POPULATE UPDATED TASK
//     // -------------------------------------------------

//     const updatedTask =
//       await Task.findById(task._id)
//         .populate(
//           "assignedTo",
//           "name username email"
//         )
//         .populate(
//           "createdBy",
//           "name username email"
//         )
//         .populate(
//           "project",
//           "name status"
//         );

//     // -------------------------------------------------
//     // RESPONSE
//     // -------------------------------------------------

//     return res.status(200).json({
//       success: true,
//       message: "Task updated successfully",
//       task: updatedTask,
//     });

//   } catch (error) {
//     console.error(
//       "Update Task Error:",
//       error
//     );

//     return res.status(500).json({
//       success: false,
//       message:
//         "Server error while updating task",
//     });
//   }
// };


// // =====================================================
// // DELETE TASK
// // DELETE /api/tasks/:id
// // =====================================================

// // const deleteTask = async (req, res) => {
// //   try {
// //     // -------------------------------------------------
// //     // FIND TASK
// //     // -------------------------------------------------

// //     const task = await Task.findById(
// //       req.params.id
// //     );

// //     if (!task) {
// //       return res.status(404).json({
// //         success: false,
// //         message: "Task not found",
// //       });
// //     }

// //     // -------------------------------------------------
// //     // SAVE ASSIGNEE BEFORE DELETE
// //     // -------------------------------------------------

// //     const assignedUserId =
// //       task.assignedTo
// //         ? task.assignedTo.toString()
// //         : null;

// //     // -------------------------------------------------
// //     // CHECK PROJECT OWNER
// //     // -------------------------------------------------

// //     const project =
// //       await Project.findOne({
// //         _id: task.project,
// //         owner: req.user._id,
// //       });

// //     if (!project) {
// //       return res.status(403).json({
// //         success: false,
// //         message:
// //           "Only project owner can delete tasks",
// //       });
// //     }

// //     // -------------------------------------------------
// //     // DELETE TASK
// //     // -------------------------------------------------

// //     await Task.findByIdAndDelete(
// //       task._id
// //     );

// //     // =================================================
// //     // NOTIFICATION: TASK DELETED
// //     // =================================================

// //     if (
// //       assignedUserId &&
// //       assignedUserId !==
// //         req.user._id.toString()
// //     ) {
// //       try {
// //         await createNotification({
// //           recipient: assignedUserId,
// //           sender: req.user._id,

// //           type: "TASK_DELETED",

// //           title: "Task Deleted",

// //           message: `The task "${task.title}" assigned to you has been deleted.`,

// //           project: task.project,
// //           task: null,
// //         });
// //       } catch (notificationError) {
// //         console.error(
// //           "Task Delete Notification Error:",
// //           notificationError
// //         );
// //       }
// //     }

// //     // -------------------------------------------------
// //     // RESPONSE
// //     // -------------------------------------------------

// //     return res.status(200).json({
// //       success: true,
// //       message: "Task deleted successfully",
// //     });
// //   } catch (error) {
// //     console.error(
// //       "Delete Task Error:",
// //       error
// //     );

// //     return res.status(500).json({
// //       success: false,
// //       message:
// //         "Server error while deleting task",
// //     });
// //   }
// // };


// const deleteTask = async (req, res) => {
//   try {
//     // -------------------------------------------------
//     // FIND TASK
//     // -------------------------------------------------

//     const task = await Task.findById(
//       req.params.id
//     );

//     if (!task) {
//       return res.status(404).json({
//         success: false,
//         message: "Task not found",
//       });
//     }

//     // -------------------------------------------------
//     // SAVE VALUES BEFORE DELETE
//     // -------------------------------------------------

//     const assignedUserId =
//       task.assignedTo
//         ? task.assignedTo.toString()
//         : null;

//     const taskTitle = task.title;
//     const projectId = task.project;

//     // -------------------------------------------------
//     // CHECK PROJECT OWNER
//     // -------------------------------------------------

//     const project =
//       await Project.findOne({
//         _id: task.project,
//         owner: req.user._id,
//       });

//     if (!project) {
//       return res.status(403).json({
//         success: false,
//         message:
//           "Only project owner can delete tasks",
//       });
//     }

//     // -------------------------------------------------
//     // DELETE TASK
//     // -------------------------------------------------

//     await Task.findByIdAndDelete(
//       task._id
//     );

//     // =================================================
//     // NOTIFICATION: TASK DELETED
//     // =================================================

//     if (
//       assignedUserId &&
//       assignedUserId !==
//         req.user._id.toString()
//     ) {
//       try {
//         await createNotification({
//           recipient: assignedUserId,
//           sender: req.user._id,

//           type: "TASK_DELETED",

//           title: "Task Deleted",

//           message: `The task "${taskTitle}" assigned to you has been deleted.`,

//           project: projectId,

//           // Task already deleted
//           task: null,
//         });
//       } catch (notificationError) {
//         console.error(
//           "Task Delete Notification Error:",
//           notificationError
//         );

//         // Notification fail hone par
//         // task deletion fail nahi hoga.
//       }
//     }

//     // -------------------------------------------------
//     // RESPONSE
//     // -------------------------------------------------

//     return res.status(200).json({
//       success: true,
//       message:
//         "Task deleted successfully",
//     });

//   } catch (error) {
//     console.error(
//       "Delete Task Error:",
//       error
//     );

//     return res.status(500).json({
//       success: false,
//       message:
//         "Server error while deleting task",
//     });
//   }
// };



// // =====================================================
// // EXPORT
// // =====================================================

// module.exports = {
//   createTask,
//   getProjectTasks,
//   getTask,
//   updateTask,
//   deleteTask,
// };


const mongoose = require("mongoose");

const Task = require("../models/Task");
const Project = require("../models/Project");
const User = require("../models/User");

const {
  createNotification,
} = require("../services/notificationService");

// =====================================================
// CONSTANTS
// =====================================================

const ALLOWED_CREATE_ROLES = [
  "OWNER",
  "ADMIN",
  "MANAGER",
];

const ALLOWED_STATUS = [
  "TODO",
  "IN_PROGRESS",
  "COMPLETED",
  "CANCELLED",
];

const ALLOWED_PRIORITY = [
  "LOW",
  "MEDIUM",
  "HIGH",
  "URGENT",
];


// =====================================================
// HELPER: NORMALIZE ROLE
// =====================================================

const getUserRole = (user) => {
  return String(user?.role || "")
    .trim()
    .toUpperCase();
};


// =====================================================
// HELPER: GET USER ID
// =====================================================

const getUserId = (user) => {
  return (
    user?._id?.toString() ||
    user?.id?.toString() ||
    null
  );
};


// =====================================================
// HELPER: VALIDATE OBJECT ID
// =====================================================

const isValidObjectId = (id) => {
  return mongoose.Types.ObjectId.isValid(id);
};


// =====================================================
// HELPER: CHECK PROJECT MEMBER
// =====================================================

const isProjectMember = (project, userId) => {
  if (!project || !userId) {
    return false;
  }

  const normalizedUserId =
    userId.toString();

  return (
    project.members?.some(
      (memberId) =>
        memberId?.toString() ===
        normalizedUserId
    ) || false
  );
};


// =====================================================
// HELPER: CHECK PROJECT OWNER
// =====================================================

const isProjectOwner = (
  project,
  userId
) => {
  if (!project || !userId) {
    return false;
  }

  return (
    project.owner?.toString() ===
    userId.toString()
  );
};


// =====================================================
// HELPER: CHECK GLOBAL ADMIN
// =====================================================

const isAdmin = (user) => {
  return getUserRole(user) === "ADMIN";
};


// =====================================================
// HELPER: CHECK PROJECT ACCESS
// =====================================================
//
// ADMIN has GLOBAL access.
//
// OWNER has access to own project.
//
// Other users must be project members.
//
// =====================================================

const hasProjectAccess = (
  project,
  user
) => {
  if (!project || !user) {
    return false;
  }

  // -------------------------------------------------
  // ADMIN
  // -------------------------------------------------

  if (isAdmin(user)) {
    return true;
  }

  // -------------------------------------------------
  // USER ID
  // -------------------------------------------------

  const userId = getUserId(user);

  if (!userId) {
    return false;
  }

  // -------------------------------------------------
  // OWNER
  // -------------------------------------------------

  if (
    isProjectOwner(
      project,
      userId
    )
  ) {
    return true;
  }

  // -------------------------------------------------
  // MEMBER
  // -------------------------------------------------

  if (
    isProjectMember(
      project,
      userId
    )
  ) {
    return true;
  }

  return false;
};


// =====================================================
// HELPER: CHECK TASK UPDATE ACCESS
// =====================================================

const canUpdateTask = (
  task,
  project,
  user
) => {
  if (
    !task ||
    !project ||
    !user
  ) {
    return false;
  }

  const role =
    getUserRole(user);

  const userId =
    getUserId(user);

  if (!userId) {
    return false;
  }

  // -------------------------------------------------
  // ADMIN
  // -------------------------------------------------
  // Global administrator can update
  // tasks from any project.
  // -------------------------------------------------

  if (role === "ADMIN") {
    return true;
  }

  // -------------------------------------------------
  // OWNER
  // -------------------------------------------------

  if (
    isProjectOwner(
      project,
      userId
    )
  ) {
    return true;
  }

  // -------------------------------------------------
  // MANAGER
  // -------------------------------------------------

  if (
    role === "MANAGER" &&
    hasProjectAccess(
      project,
      user
    )
  ) {
    return true;
  }

  // -------------------------------------------------
  // MEMBER
  // -------------------------------------------------

  if (role === "MEMBER") {
    const isCreator =
      task.createdBy?.toString() ===
      userId;

    const isAssignee =
      task.assignedTo?.toString() ===
      userId;

    return (
      isCreator ||
      isAssignee
    );
  }

  // -------------------------------------------------
  // VIEWER / UNKNOWN
  // -------------------------------------------------

  return false;
};


// =====================================================
// HELPER: CAN MEMBER CHANGE ASSIGNEE?
// =====================================================

const canChangeAssignee = (
  task,
  user
) => {
  const role =
    getUserRole(user);

  // -------------------------------------------------
  // ADMIN / OWNER / MANAGER
  // -------------------------------------------------

  if (
    [
      "ADMIN",
      "OWNER",
      "MANAGER",
    ].includes(role)
  ) {
    return true;
  }

  // -------------------------------------------------
  // MEMBER
  // -------------------------------------------------
  // Member cannot change assignment.
  // -------------------------------------------------

  return false;
};


// =====================================================
// HELPER: SEND NOTIFICATION SAFELY
// =====================================================

const sendNotificationSafely = async ({
  recipient,
  sender,
  type,
  title,
  message,
  project,
  task,
}) => {
  try {
    await createNotification({
      recipient,
      sender,
      type,
      title,
      message,
      project,
      task,
    });
  } catch (error) {
    console.error(
      `${type} Notification Error:`,
      error
    );
  }
};


// =====================================================
// CREATE TASK
// POST /api/projects/:projectId/tasks
// =====================================================

const createTask = async (
  req,
  res
) => {
  try {
    const {
      title,
      description,
      status,
      priority,
      dueDate,
      assignedTo,
    } = req.body;

    const projectId =
      req.params.projectId;

    // -------------------------------------------------
    // VALIDATE PROJECT ID
    // -------------------------------------------------

    if (
      !isValidObjectId(projectId)
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid project ID",
      });
    }

    // -------------------------------------------------
    // VALIDATE TITLE
    // -------------------------------------------------

    if (
      typeof title !== "string" ||
      !title.trim()
    ) {
      return res.status(400).json({
        success: false,
        message: "Task title is required",
      });
    }

    // -------------------------------------------------
    // VALIDATE STATUS
    // -------------------------------------------------

    if (
      status !== undefined &&
      !ALLOWED_STATUS.includes(
        String(status)
          .trim()
          .toUpperCase()
      )
    ) {
      return res.status(400).json({
        success: false,
        message:
          `Invalid status. Allowed values: ${ALLOWED_STATUS.join(", ")}`,
      });
    }

    // -------------------------------------------------
    // VALIDATE PRIORITY
    // -------------------------------------------------

    if (
      priority !== undefined &&
      !ALLOWED_PRIORITY.includes(
        String(priority)
          .trim()
          .toUpperCase()
      )
    ) {
      return res.status(400).json({
        success: false,
        message:
          `Invalid priority. Allowed values: ${ALLOWED_PRIORITY.join(", ")}`,
      });
    }

    // -------------------------------------------------
    // FIND PROJECT
    // -------------------------------------------------

    const project =
      await Project.findById(
        projectId
      );

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found",
      });
    }

    // -------------------------------------------------
    // PROJECT ACCESS
    // -------------------------------------------------

    if (
      !hasProjectAccess(
        project,
        req.user
      )
    ) {
      return res.status(403).json({
        success: false,
        message:
          "You don't have access to this project",
      });
    }

    // -------------------------------------------------
    // ROLE CHECK
    // -------------------------------------------------

    const role =
      getUserRole(req.user);

    if (
      !ALLOWED_CREATE_ROLES.includes(
        role
      )
    ) {
      return res.status(403).json({
        success: false,
        message:
          "Your role does not allow task creation",
      });
    }

    // -------------------------------------------------
    // CHECK ASSIGNED USER
    // -------------------------------------------------

    if (assignedTo) {
      if (
        !isValidObjectId(
          assignedTo
        )
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Invalid assigned user ID",
        });
      }

      const assignedUser =
        await User.findById(
          assignedTo
        );

      if (!assignedUser) {
        return res.status(400).json({
          success: false,
          message:
            "Assigned user not found",
        });
      }

      const isMember =
        isProjectMember(
          project,
          assignedTo
        );

      const isOwner =
        isProjectOwner(
          project,
          assignedTo
        );

      if (
        !isMember &&
        !isOwner
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Task can only be assigned to project members",
        });
      }
    }

    // -------------------------------------------------
    // DUE DATE VALIDATION
    // -------------------------------------------------

    if (dueDate) {
      const parsedDueDate =
        new Date(dueDate);

      if (
        Number.isNaN(
          parsedDueDate.getTime()
        )
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Invalid due date",
        });
      }

      if (
        parsedDueDate < new Date()
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Due date cannot be in the past",
        });
      }
    }

    // -------------------------------------------------
    // CREATE TASK
    // -------------------------------------------------

    const task =
      await Task.create({
        title:
          title.trim(),

        description:
          typeof description === "string"
            ? description.trim()
            : "",

        status:
          status
            ? String(status)
                .trim()
                .toUpperCase()
            : undefined,

        priority:
          priority
            ? String(priority)
                .trim()
                .toUpperCase()
            : undefined,

        dueDate:
          dueDate || null,

        project:
          projectId,

        assignedTo:
          assignedTo || null,

        createdBy:
          req.user._id,
      });

    // -------------------------------------------------
    // NOTIFICATION: TASK ASSIGNED
    // -------------------------------------------------

    if (
      assignedTo &&
      assignedTo.toString() !==
        req.user._id.toString()
    ) {
      await sendNotificationSafely({
        recipient:
          assignedTo,

        sender:
          req.user._id,

        type:
          "TASK_ASSIGNED",

        title:
          "Task Assigned",

        message:
          `You have been assigned a new task: "${task.title}".`,

        project:
          projectId,

        task:
          task._id,
      });
    }

    // -------------------------------------------------
    // POPULATE
    // -------------------------------------------------

    const populatedTask =
      await Task.findById(
        task._id
      )
        .populate(
          "assignedTo",
          "name username email role"
        )
        .populate(
          "createdBy",
          "name username email role"
        )
        .populate(
          "project",
          "name status owner members"
        );

    // -------------------------------------------------
    // RESPONSE
    // -------------------------------------------------

    return res.status(201).json({
      success: true,
      message:
        "Task created successfully",
      task:
        populatedTask,
    });

  } catch (error) {
    console.error(
      "Create Task Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Server error while creating task",
    });
  }
};


// =====================================================
// GET PROJECT TASKS
// GET /api/projects/:projectId/tasks
// =====================================================

const getProjectTasks = async (
  req,
  res
) => {
  try {
    const projectId =
      req.params.projectId;

    // -------------------------------------------------
    // DEBUG
    // -------------------------------------------------

    console.log(
      "========== GET PROJECT TASKS =========="
    );

    console.log(
      "Project ID:",
      projectId
    );

    console.log(
      "User ID:",
      getUserId(req.user)
    );

    console.log(
      "User Role:",
      getUserRole(req.user)
    );

    // -------------------------------------------------
    // VALIDATE PROJECT ID
    // -------------------------------------------------

    if (
      !isValidObjectId(projectId)
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Invalid project ID",
      });
    }

    // -------------------------------------------------
    // FIND PROJECT
    // -------------------------------------------------

    const project =
      await Project.findById(
        projectId
      );

    if (!project) {
      return res.status(404).json({
        success: false,
        message:
          "Project not found",
      });
    }

    // -------------------------------------------------
    // PROJECT ACCESS
    // -------------------------------------------------

    //
    // IMPORTANT:
    //
    // ADMIN now has global project access.
    //
    // OWNER/MEMBER access is checked normally.
    //
    if (
      !hasProjectAccess(
        project,
        req.user
      )
    ) {
      console.log(
        "ACCESS DENIED"
      );

      console.log(
        "Project Owner:",
        project.owner?.toString()
      );

      console.log(
        "Project Members:",
        project.members?.map(
          (member) =>
            member.toString()
        )
      );

      return res.status(403).json({
        success: false,
        message:
          "You don't have access to this project",
      });
    }

    // -------------------------------------------------
    // GET TASKS
    // -------------------------------------------------

    const tasks =
      await Task.find({
        project:
          projectId,
      })
        .populate(
          "assignedTo",
          "name username email role"
        )
        .populate(
          "createdBy",
          "name username email role"
        )
        .sort({
          createdAt: -1,
        });

    // -------------------------------------------------
    // RESPONSE
    // -------------------------------------------------

    return res.status(200).json({
      success: true,
      count:
        tasks.length,
      tasks,
    });

  } catch (error) {
    console.error(
      "Get Tasks Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Server error while fetching tasks",
    });
  }
};


// =====================================================
// GET SINGLE TASK
// GET /api/tasks/:id
// =====================================================

const getTask = async (
  req,
  res
) => {
  try {
    const taskId =
      req.params.id;

    // -------------------------------------------------
    // VALIDATE TASK ID
    // -------------------------------------------------

    if (
      !isValidObjectId(taskId)
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Invalid task ID",
      });
    }

    // -------------------------------------------------
    // FIND TASK
    // -------------------------------------------------

    const task =
      await Task.findById(
        taskId
      );

    if (!task) {
      return res.status(404).json({
        success: false,
        message:
          "Task not found",
      });
    }

    // -------------------------------------------------
    // FIND PROJECT
    // -------------------------------------------------

    const project =
      await Project.findById(
        task.project
      );

    if (!project) {
      return res.status(404).json({
        success: false,
        message:
          "Project associated with task not found",
      });
    }

    // -------------------------------------------------
    // PROJECT ACCESS
    // -------------------------------------------------

    if (
      !hasProjectAccess(
        project,
        req.user
      )
    ) {
      return res.status(403).json({
        success: false,
        message:
          "You don't have access to this task",
      });
    }

    // -------------------------------------------------
    // POPULATE
    // -------------------------------------------------

    const populatedTask =
      await Task.findById(
        taskId
      )
        .populate(
          "assignedTo",
          "name username email role"
        )
        .populate(
          "createdBy",
          "name username email role"
        )
        .populate(
          "project",
          "name status owner members"
        );

    // -------------------------------------------------
    // RESPONSE
    // -------------------------------------------------

    return res.status(200).json({
      success: true,
      task:
        populatedTask,
    });

  } catch (error) {
    console.error(
      "Get Task Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Server error while fetching task",
    });
  }
};


// =====================================================
// UPDATE TASK
// PATCH /api/tasks/:id
// =====================================================

const updateTask = async (
  req,
  res
) => {
  try {
    const taskId =
      req.params.id;

    const {
      title,
      description,
      status,
      priority,
      dueDate,
      assignedTo,
    } = req.body;

    // -------------------------------------------------
    // VALIDATE TASK ID
    // -------------------------------------------------

    if (
      !isValidObjectId(taskId)
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Invalid task ID",
      });
    }

    // -------------------------------------------------
    // FIND TASK
    // -------------------------------------------------

    const task =
      await Task.findById(
        taskId
      );

    if (!task) {
      return res.status(404).json({
        success: false,
        message:
          "Task not found",
      });
    }

    // -------------------------------------------------
    // FIND PROJECT
    // -------------------------------------------------

    const project =
      await Project.findById(
        task.project
      );

    if (!project) {
      return res.status(404).json({
        success: false,
        message:
          "Project not found",
      });
    }

    // -------------------------------------------------
    // PROJECT ACCESS
    // -------------------------------------------------

    if (
      !hasProjectAccess(
        project,
        req.user
      )
    ) {
      return res.status(403).json({
        success: false,
        message:
          "You don't have access to this task",
      });
    }

    // -------------------------------------------------
    // RBAC
    // -------------------------------------------------

    if (
      !canUpdateTask(
        task,
        project,
        req.user
      )
    ) {
      return res.status(403).json({
        success: false,
        message:
          "You don't have permission to update this task",
      });
    }

    // -------------------------------------------------
    // SAVE OLD VALUES
    // -------------------------------------------------

    const oldAssignedTo =
      task.assignedTo
        ? task.assignedTo.toString()
        : null;

    const oldStatus =
      task.status;

    const oldTitle =
      task.title;

    // -------------------------------------------------
    // STATUS VALIDATION
    // -------------------------------------------------

    if (
      status !== undefined
    ) {
      const normalizedStatus =
        String(status)
          .trim()
          .toUpperCase();

      if (
        !ALLOWED_STATUS.includes(
          normalizedStatus
        )
      ) {
        return res.status(400).json({
          success: false,
          message:
            `Invalid status. Allowed values: ${ALLOWED_STATUS.join(", ")}`,
        });
      }

      task.status =
        normalizedStatus;
    }

    // -------------------------------------------------
    // PRIORITY VALIDATION
    // -------------------------------------------------

    if (
      priority !== undefined
    ) {
      const normalizedPriority =
        String(priority)
          .trim()
          .toUpperCase();

      if (
        !ALLOWED_PRIORITY.includes(
          normalizedPriority
        )
      ) {
        return res.status(400).json({
          success: false,
          message:
            `Invalid priority. Allowed values: ${ALLOWED_PRIORITY.join(", ")}`,
        });
      }

      task.priority =
        normalizedPriority;
    }

    // -------------------------------------------------
    // TITLE
    // -------------------------------------------------

    if (
      title !== undefined
    ) {
      if (
        typeof title !== "string" ||
        !title.trim()
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Task title cannot be empty",
        });
      }

      task.title =
        title.trim();
    }

    // -------------------------------------------------
    // DESCRIPTION
    // -------------------------------------------------

    if (
      description !== undefined
    ) {
      task.description =
        typeof description === "string"
          ? description.trim()
          : description;
    }

    // -------------------------------------------------
    // ASSIGNEE PERMISSION
    // -------------------------------------------------

    if (
      assignedTo !== undefined
    ) {
      if (
        !canChangeAssignee(
          task,
          req.user
        )
      ) {
        return res.status(403).json({
          success: false,
          message:
            "You don't have permission to change task assignment",
        });
      }

      // -------------------------------------------------
      // REMOVE ASSIGNMENT
      // -------------------------------------------------

      if (
        assignedTo === null ||
        assignedTo === ""
      ) {
        task.assignedTo =
          null;
      }

      // -------------------------------------------------
      // ASSIGN NEW USER
      // -------------------------------------------------

      else {
        if (
          !isValidObjectId(
            assignedTo
          )
        ) {
          return res.status(400).json({
            success: false,
            message:
              "Invalid assigned user ID",
          });
        }

        const assignedUser =
          await User.findById(
            assignedTo
          );

        if (!assignedUser) {
          return res.status(400).json({
            success: false,
            message:
              "Assigned user not found",
          });
        }

        const isMember =
          isProjectMember(
            project,
            assignedTo
          );

        const isOwner =
          isProjectOwner(
            project,
            assignedTo
          );

        if (
          !isMember &&
          !isOwner
        ) {
          return res.status(400).json({
            success: false,
            message:
              "User is not a member of this project",
          });
        }

        task.assignedTo =
          assignedTo;
      }
    }

    // -------------------------------------------------
    // DUE DATE
    // -------------------------------------------------

    if (
      dueDate !== undefined
    ) {
      // Remove due date

      if (
        dueDate === null ||
        dueDate === ""
      ) {
        task.dueDate =
          null;
      }

      // Set due date

      else {
        const parsedDueDate =
          new Date(dueDate);

        if (
          Number.isNaN(
            parsedDueDate.getTime()
          )
        ) {
          return res.status(400).json({
            success: false,
            message:
              "Invalid due date",
          });
        }

        if (
          parsedDueDate < new Date()
        ) {
          return res.status(400).json({
            success: false,
            message:
              "Due date cannot be in the past",
          });
        }

        task.dueDate =
          parsedDueDate;
      }
    }

    // -------------------------------------------------
    // SAVE
    // -------------------------------------------------

    await task.save();

    // -------------------------------------------------
    // NEW ASSIGNEE
    // -------------------------------------------------

    const newAssignedTo =
      task.assignedTo
        ? task.assignedTo.toString()
        : null;

    const currentUserId =
      getUserId(req.user);

    // =================================================
    // NOTIFICATION: NEW ASSIGNEE
    // =================================================

    if (
      newAssignedTo &&
      newAssignedTo !==
        oldAssignedTo &&
      newAssignedTo !==
        currentUserId
    ) {
      await sendNotificationSafely({
        recipient:
          newAssignedTo,

        sender:
          req.user._id,

        type:
          "TASK_ASSIGNED",

        title:
          "Task Assigned",

        message:
          `You have been assigned a task: "${task.title}".`,

        project:
          task.project,

        task:
          task._id,
      });
    }

    // =================================================
    // NOTIFICATION: OLD ASSIGNEE
    // =================================================

    if (
      oldAssignedTo &&
      oldAssignedTo !==
        newAssignedTo &&
      oldAssignedTo !==
        currentUserId
    ) {
      await sendNotificationSafely({
        recipient:
          oldAssignedTo,

        sender:
          req.user._id,

        type:
          "TASK_UNASSIGNED",

        title:
          "Task Unassigned",

        message:
          `You are no longer assigned to the task "${task.title}".`,

        project:
          task.project,

        task:
          task._id,
      });
    }

    // =================================================
    // NOTIFICATION: STATUS
    // =================================================

    const statusChanged =
      status !== undefined &&
      task.status !== oldStatus;

    if (
      statusChanged &&
      newAssignedTo &&
      newAssignedTo !==
        currentUserId
    ) {
      await sendNotificationSafely({
        recipient:
          newAssignedTo,

        sender:
          req.user._id,

        type:
          "TASK_STATUS_CHANGED",

        title:
          "Task Status Changed",

        message:
          `The status of "${task.title}" changed from "${oldStatus}" to "${task.status}".`,

        project:
          task.project,

        task:
          task._id,
      });
    }

    // =================================================
    // NOTIFICATION: GENERAL UPDATE
    // =================================================

    const assignmentChanged =
      newAssignedTo !==
      oldAssignedTo;

    const titleChanged =
      title !== undefined &&
      typeof title === "string" &&
      title.trim() !==
        oldTitle;

    const hasGeneralChange =
      titleChanged ||
      description !== undefined ||
      priority !== undefined ||
      dueDate !== undefined;

    if (
      hasGeneralChange &&
      !statusChanged &&
      !assignmentChanged &&
      newAssignedTo &&
      newAssignedTo !==
        currentUserId
    ) {
      await sendNotificationSafely({
        recipient:
          newAssignedTo,

        sender:
          req.user._id,

        type:
          "TASK_UPDATED",

        title:
          "Task Updated",

        message:
          `The task "${task.title}" has been updated.`,

        project:
          task.project,

        task:
          task._id,
      });
    }

    // -------------------------------------------------
    // POPULATE UPDATED TASK
    // -------------------------------------------------

    const updatedTask =
      await Task.findById(
        task._id
      )
        .populate(
          "assignedTo",
          "name username email role"
        )
        .populate(
          "createdBy",
          "name username email role"
        )
        .populate(
          "project",
          "name status owner members"
        );

    // -------------------------------------------------
    // RESPONSE
    // -------------------------------------------------

    return res.status(200).json({
      success: true,
      message:
        "Task updated successfully",
      task:
        updatedTask,
    });

  } catch (error) {
    console.error(
      "Update Task Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Server error while updating task",
    });
  }
};


// =====================================================
// DELETE TASK
// DELETE /api/tasks/:id
// =====================================================

const deleteTask = async (
  req,
  res
) => {
  try {
    const taskId =
      req.params.id;

    // -------------------------------------------------
    // VALIDATE ID
    // -------------------------------------------------

    if (
      !isValidObjectId(taskId)
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Invalid task ID",
      });
    }

    // -------------------------------------------------
    // FIND TASK
    // -------------------------------------------------

    const task =
      await Task.findById(
        taskId
      );

    if (!task) {
      return res.status(404).json({
        success: false,
        message:
          "Task not found",
      });
    }

    // -------------------------------------------------
    // FIND PROJECT
    // -------------------------------------------------

    const project =
      await Project.findById(
        task.project
      );

    if (!project) {
      return res.status(404).json({
        success: false,
        message:
          "Project not found",
      });
    }

    // -------------------------------------------------
    // ONLY PROJECT OWNER CAN DELETE
    // -------------------------------------------------

    if (
      !isProjectOwner(
        project,
        getUserId(req.user)
      )
    ) {
      return res.status(403).json({
        success: false,
        message:
          "Only project owner can delete tasks",
      });
    }

    // -------------------------------------------------
    // SAVE VALUES
    // -------------------------------------------------

    const assignedUserId =
      task.assignedTo
        ? task.assignedTo.toString()
        : null;

    const taskTitle =
      task.title;

    const projectId =
      task.project;

    const taskIdValue =
      task._id;

    // -------------------------------------------------
    // DELETE
    // -------------------------------------------------

    await Task.findByIdAndDelete(
      taskIdValue
    );

    // =================================================
    // NOTIFICATION
    // =================================================

    if (
      assignedUserId &&
      assignedUserId !==
        getUserId(req.user)
    ) {
      await sendNotificationSafely({
        recipient:
          assignedUserId,

        sender:
          req.user._id,

        type:
          "TASK_DELETED",

        title:
          "Task Deleted",

        message:
          `The task "${taskTitle}" assigned to you has been deleted.`,

        project:
          projectId,

        task:
          null,
      });
    }

    // -------------------------------------------------
    // RESPONSE
    // -------------------------------------------------

    return res.status(200).json({
      success: true,
      message:
        "Task deleted successfully",
    });

  } catch (error) {
    console.error(
      "Delete Task Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Server error while deleting task",
    });
  }
};


// =====================================================
// EXPORT
// =====================================================

module.exports = {
  createTask,
  getProjectTasks,
  getTask,
  updateTask,
  deleteTask,
};