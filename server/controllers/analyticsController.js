// const Task = require("../models/Task");
// const Project = require("../models/Project");

// // =====================================================
// // GET ANALYTICS
// // GET /api/analytics
// // =====================================================

// const getAnalytics = async (req, res) => {
//   try {
//     const userId = req.user._id;

//     // =================================================
//     // FIND USER'S PROJECTS
//     // =================================================

//     const projects = await Project.find({
//       $or: [
//         {
//           owner: userId,
//         },
//         {
//           members: userId,
//         },
//       ],
//     }).select("_id name status priority owner members");

//     const projectIds = projects.map(
//       (project) => project._id
//     );

//     // =================================================
//     // FIND USER'S TASKS
//     // =================================================

//     const tasks = await Task.find({
//       project: {
//         $in: projectIds,
//       },
//     })
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
//         "name status priority"
//       )
//       .sort({
//         createdAt: -1,
//       });

//     // =================================================
//     // TOTAL COUNTS
//     // =================================================

//     const totalProjects =
//       projects.length;

//     const totalTasks =
//       tasks.length;

//     // =================================================
//     // TASK STATUS COUNTS
//     // =================================================

//     const todoTasks =
//       tasks.filter(
//         (task) =>
//           task.status === "TODO"
//       ).length;

//     const inProgressTasks =
//       tasks.filter(
//         (task) =>
//           task.status === "IN_PROGRESS"
//       ).length;

//     const reviewTasks =
//       tasks.filter(
//         (task) =>
//           task.status === "REVIEW"
//       ).length;

//     const completedTasks =
//       tasks.filter(
//         (task) =>
//           task.status === "DONE"
//       ).length;

//     // =================================================
//     // PRIORITY COUNTS
//     // =================================================

//     const lowPriorityTasks =
//       tasks.filter(
//         (task) =>
//           task.priority === "LOW"
//       ).length;

//     const mediumPriorityTasks =
//       tasks.filter(
//         (task) =>
//           task.priority === "MEDIUM"
//       ).length;

//     const highPriorityTasks =
//       tasks.filter(
//         (task) =>
//           task.priority === "HIGH"
//       ).length;

//     const urgentPriorityTasks =
//       tasks.filter(
//         (task) =>
//           task.priority === "URGENT"
//       ).length;

//     // =================================================
//     // OVERDUE TASKS
//     // =================================================

//     const now = new Date();

//     const overdueTasks =
//       tasks.filter(
//         (task) =>
//           task.dueDate &&
//           new Date(task.dueDate) < now &&
//           task.status !== "DONE"
//       ).length;

//     // =================================================
//     // MY TASKS
//     // =================================================

//     const myTasks =
//       tasks.filter(
//         (task) =>
//           task.assignedTo &&
//           task.assignedTo._id.toString() ===
//             userId.toString()
//       ).length;

//     const myCompletedTasks =
//       tasks.filter(
//         (task) =>
//           task.assignedTo &&
//           task.assignedTo._id.toString() ===
//             userId.toString() &&
//           task.status === "DONE"
//       ).length;

//     const myPendingTasks =
//       myTasks - myCompletedTasks;

//     // =================================================
//     // COMPLETION PERCENTAGE
//     // =================================================

//     const completionPercentage =
//       totalTasks > 0
//         ? Math.round(
//             (completedTasks /
//               totalTasks) *
//               100
//           )
//         : 0;

//     // =================================================
//     // PROJECT-WISE ANALYTICS
//     // =================================================

//     const projectAnalytics =
//       projects.map((project) => {
//         const projectTasks =
//           tasks.filter(
//             (task) =>
//               task.project &&
//               task.project._id.toString() ===
//                 project._id.toString()
//           );

//         const projectTotalTasks =
//           projectTasks.length;

//         const projectCompletedTasks =
//           projectTasks.filter(
//             (task) =>
//               task.status === "DONE"
//           ).length;

//         const projectInProgressTasks =
//           projectTasks.filter(
//             (task) =>
//               task.status ===
//               "IN_PROGRESS"
//           ).length;

//         const projectTodoTasks =
//           projectTasks.filter(
//             (task) =>
//               task.status === "TODO"
//           ).length;

//         const projectReviewTasks =
//           projectTasks.filter(
//             (task) =>
//               task.status === "REVIEW"
//           ).length;

//         const projectOverdueTasks =
//           projectTasks.filter(
//             (task) =>
//               task.dueDate &&
//               new Date(task.dueDate) < now &&
//               task.status !== "DONE"
//           ).length;

//         const projectCompletion =
//           projectTotalTasks > 0
//             ? Math.round(
//                 (projectCompletedTasks /
//                   projectTotalTasks) *
//                   100
//               )
//             : 0;

//         return {
//           _id: project._id,
//           name: project.name,
//           status: project.status,
//           priority: project.priority,

//           totalTasks:
//             projectTotalTasks,

//           completedTasks:
//             projectCompletedTasks,

//           todoTasks:
//             projectTodoTasks,

//           inProgressTasks:
//             projectInProgressTasks,

//           reviewTasks:
//             projectReviewTasks,

//           overdueTasks:
//             projectOverdueTasks,

//           completionPercentage:
//             projectCompletion,
//         };
//       });

//     // =================================================
//     // STATUS DISTRIBUTION
//     // =================================================

//     const statusDistribution = {
//       TODO: todoTasks,
//       IN_PROGRESS: inProgressTasks,
//       REVIEW: reviewTasks,
//       DONE: completedTasks,
//     };

//     // =================================================
//     // PRIORITY DISTRIBUTION
//     // =================================================

//     const priorityDistribution = {
//       LOW: lowPriorityTasks,
//       MEDIUM: mediumPriorityTasks,
//       HIGH: highPriorityTasks,
//       URGENT: urgentPriorityTasks,
//     };

//     // =================================================
//     // RECENT TASKS
//     // =================================================

//     const recentTasks =
//       tasks.slice(0, 5);

//     // =================================================
//     // RECENT PROJECTS
//     // =================================================

//     const recentProjects =
//       [...projects]
//         .sort(
//           (a, b) =>
//             new Date(b.createdAt) -
//             new Date(a.createdAt)
//         )
//         .slice(0, 5);

//     // =================================================
//     // RESPONSE
//     // =================================================

//     return res.status(200).json({
//       success: true,

//       analytics: {
//         // ---------------------------------------------
//         // OVERVIEW
//         // ---------------------------------------------

//         overview: {
//           totalProjects,
//           totalTasks,
//           completedTasks,
//           overdueTasks,
//           myTasks,
//           myCompletedTasks,
//           myPendingTasks,
//           completionPercentage,
//         },

//         // ---------------------------------------------
//         // TASK STATUS
//         // ---------------------------------------------

//         taskStatus: {
//           todo: todoTasks,
//           inProgress: inProgressTasks,
//           review: reviewTasks,
//           completed: completedTasks,
//         },

//         statusDistribution,

//         // ---------------------------------------------
//         // PRIORITY
//         // ---------------------------------------------

//         priorityDistribution,

//         // ---------------------------------------------
//         // PROJECT ANALYTICS
//         // ---------------------------------------------

//         projectAnalytics,

//         // ---------------------------------------------
//         // RECENT DATA
//         // ---------------------------------------------

//         recentTasks,
//         recentProjects,
//       },
//     });
//   } catch (error) {
//     console.error(
//       "Get Analytics Error:",
//       error
//     );

//     return res.status(500).json({
//       success: false,
//       message:
//         "Server error while fetching analytics",
//     });
//   }
// };

// module.exports = {
//   getAnalytics,
// };


const Task = require("../models/Task");
const Project = require("../models/Project");

// =====================================================
// CONSTANTS
// =====================================================

const ADMIN_ROLES = [
  "OWNER",
  "ADMIN",
];

const ALLOWED_TASK_STATUS = [
  "TODO",
  "IN_PROGRESS",
  "COMPLETED",
  "CANCELLED",
];

const ALLOWED_TASK_PRIORITY = [
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
// HELPER: CHECK ADMIN / OWNER
// =====================================================

const isAdminOrOwner = (user) => {
  const role = getUserRole(user);

  return ADMIN_ROLES.includes(role);
};

// =====================================================
// HELPER: CHECK PROJECT ACCESS
// =====================================================

const hasProjectAccess = (project, user) => {
  if (!project || !user) {
    return false;
  }

  // OWNER + ADMIN
  // Can access ALL projects
  if (isAdminOrOwner(user)) {
    return true;
  }

  const userId = user._id.toString();

  // Project owner
  const isOwner =
    project.owner &&
    project.owner.toString() === userId;

  // Project member
  const isMember =
    project.members?.some(
      (memberId) =>
        memberId.toString() === userId
    ) || false;

  return isOwner || isMember;
};

// =====================================================
// GET ANALYTICS
// GET /api/analytics
// =====================================================

const getAnalytics = async (req, res) => {
  try {
    // =================================================
    // USER
    // =================================================

    const userId = req.user._id;
    const role = getUserRole(req.user);

    // =================================================
    // FIND PROJECTS
    // =================================================
    //
    // OWNER + ADMIN
    // ----------------
    // See ALL projects
    //
    // MANAGER + MEMBER
    // ----------------
    // See only projects where:
    // - user is owner
    // - OR user is member
    //
    // =================================================

    let projects = [];

    if (isAdminOrOwner(req.user)) {
      // -----------------------------------------------
      // OWNER + ADMIN = ALL PROJECTS
      // -----------------------------------------------

      projects = await Project.find({})
        .select(
          "_id name status priority owner members createdAt"
        )
        .sort({
          createdAt: -1,
        });
    } else {
      // -----------------------------------------------
      // MANAGER + MEMBER
      // -----------------------------------------------

      projects = await Project.find({
        $or: [
          {
            owner: userId,
          },
          {
            members: userId,
          },
        ],
      })
        .select(
          "_id name status priority owner members createdAt"
        )
        .sort({
          createdAt: -1,
        });
    }

    // =================================================
    // IF NO PROJECTS
    // =================================================

    if (!projects.length) {
      return res.status(200).json({
        success: true,

        analytics: {
          overview: {
            totalProjects: 0,
            totalTasks: 0,
            completedTasks: 0,
            overdueTasks: 0,
            myTasks: 0,
            myCompletedTasks: 0,
            myPendingTasks: 0,
            completionPercentage: 0,
          },

          taskStatus: {
            todo: 0,
            inProgress: 0,
            completed: 0,
            cancelled: 0,
          },

          statusDistribution: {
            TODO: 0,
            IN_PROGRESS: 0,
            COMPLETED: 0,
            CANCELLED: 0,
          },

          priorityDistribution: {
            LOW: 0,
            MEDIUM: 0,
            HIGH: 0,
            URGENT: 0,
          },

          projectAnalytics: [],

          recentTasks: [],

          recentProjects: [],
        },
      });
    }

    // =================================================
    // PROJECT IDS
    // =================================================

    const projectIds = projects.map(
      (project) => project._id
    );

    // =================================================
    // FIND TASKS
    // =================================================
    //
    // IMPORTANT:
    // Since projectIds already contain only the projects
    // user is allowed to see, tasks are automatically
    // restricted to accessible projects.
    //
    // OWNER + ADMIN:
    //     all project tasks
    //
    // MANAGER + MEMBER:
    //     only their project tasks
    //
    // =================================================

    const tasks = await Task.find({
      project: {
        $in: projectIds,
      },
    })
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
        "name status priority owner members"
      )
      .sort({
        createdAt: -1,
      });

    // =================================================
    // TOTAL COUNTS
    // =================================================

    const totalProjects =
      projects.length;

    const totalTasks =
      tasks.length;

    // =================================================
    // TASK STATUS COUNTS
    // =================================================

    const todoTasks =
      tasks.filter(
        (task) =>
          task.status === "TODO"
      ).length;

    const inProgressTasks =
      tasks.filter(
        (task) =>
          task.status === "IN_PROGRESS"
      ).length;

    const completedTasks =
      tasks.filter(
        (task) =>
          task.status === "COMPLETED"
      ).length;

    const cancelledTasks =
      tasks.filter(
        (task) =>
          task.status === "CANCELLED"
      ).length;

    // =================================================
    // PRIORITY COUNTS
    // =================================================

    const lowPriorityTasks =
      tasks.filter(
        (task) =>
          task.priority === "LOW"
      ).length;

    const mediumPriorityTasks =
      tasks.filter(
        (task) =>
          task.priority === "MEDIUM"
      ).length;

    const highPriorityTasks =
      tasks.filter(
        (task) =>
          task.priority === "HIGH"
      ).length;

    const urgentPriorityTasks =
      tasks.filter(
        (task) =>
          task.priority === "URGENT"
      ).length;

    // =================================================
    // OVERDUE TASKS
    // =================================================

    const now = new Date();

    const overdueTasks =
      tasks.filter(
        (task) =>
          task.dueDate &&
          new Date(task.dueDate) < now &&
          task.status !== "COMPLETED" &&
          task.status !== "CANCELLED"
      ).length;

    // =================================================
    // MY TASKS
    // =================================================
    //
    // This always means tasks assigned to the
    // currently logged-in user.
    //
    // OWNER/ADMIN can have their own assigned tasks too.
    //
    // =================================================

    const myTasks =
      tasks.filter(
        (task) =>
          task.assignedTo &&
          task.assignedTo._id &&
          task.assignedTo._id.toString() ===
            userId.toString()
      ).length;

    // =================================================
    // MY COMPLETED TASKS
    // =================================================

    const myCompletedTasks =
      tasks.filter(
        (task) =>
          task.assignedTo &&
          task.assignedTo._id &&
          task.assignedTo._id.toString() ===
            userId.toString() &&
          task.status === "COMPLETED"
      ).length;

    // =================================================
    // MY PENDING TASKS
    // =================================================

    const myPendingTasks =
      myTasks - myCompletedTasks;

    // =================================================
    // COMPLETION PERCENTAGE
    // =================================================

    const completionPercentage =
      totalTasks > 0
        ? Math.round(
            (completedTasks /
              totalTasks) *
              100
          )
        : 0;

    // =================================================
    // PROJECT-WISE ANALYTICS
    // =================================================

    const projectAnalytics =
      projects.map((project) => {
        // ---------------------------------------------
        // PROJECT TASKS
        // ---------------------------------------------

        const projectTasks =
          tasks.filter(
            (task) =>
              task.project &&
              task.project._id &&
              task.project._id.toString() ===
                project._id.toString()
          );

        // ---------------------------------------------
        // TOTAL
        // ---------------------------------------------

        const projectTotalTasks =
          projectTasks.length;

        // ---------------------------------------------
        // COMPLETED
        // ---------------------------------------------

        const projectCompletedTasks =
          projectTasks.filter(
            (task) =>
              task.status === "COMPLETED"
          ).length;

        // ---------------------------------------------
        // IN PROGRESS
        // ---------------------------------------------

        const projectInProgressTasks =
          projectTasks.filter(
            (task) =>
              task.status ===
              "IN_PROGRESS"
          ).length;

        // ---------------------------------------------
        // TODO
        // ---------------------------------------------

        const projectTodoTasks =
          projectTasks.filter(
            (task) =>
              task.status === "TODO"
          ).length;

        // ---------------------------------------------
        // CANCELLED
        // ---------------------------------------------

        const projectCancelledTasks =
          projectTasks.filter(
            (task) =>
              task.status ===
              "CANCELLED"
          ).length;

        // ---------------------------------------------
        // OVERDUE
        // ---------------------------------------------

        const projectOverdueTasks =
          projectTasks.filter(
            (task) =>
              task.dueDate &&
              new Date(task.dueDate) <
                now &&
              task.status !==
                "COMPLETED" &&
              task.status !==
                "CANCELLED"
          ).length;

        // ---------------------------------------------
        // COMPLETION %
        // ---------------------------------------------

        const projectCompletion =
          projectTotalTasks > 0
            ? Math.round(
                (projectCompletedTasks /
                  projectTotalTasks) *
                  100
              )
            : 0;

        // ---------------------------------------------
        // RETURN
        // ---------------------------------------------

        return {
          _id: project._id,

          name: project.name,

          status: project.status,

          priority: project.priority,

          totalTasks:
            projectTotalTasks,

          completedTasks:
            projectCompletedTasks,

          todoTasks:
            projectTodoTasks,

          inProgressTasks:
            projectInProgressTasks,

          cancelledTasks:
            projectCancelledTasks,

          overdueTasks:
            projectOverdueTasks,

          completionPercentage:
            projectCompletion,
        };
      });

    // =================================================
    // STATUS DISTRIBUTION
    // =================================================

    const statusDistribution = {
      TODO: todoTasks,

      IN_PROGRESS:
        inProgressTasks,

      COMPLETED:
        completedTasks,

      CANCELLED:
        cancelledTasks,
    };

    // =================================================
    // PRIORITY DISTRIBUTION
    // =================================================

    const priorityDistribution = {
      LOW:
        lowPriorityTasks,

      MEDIUM:
        mediumPriorityTasks,

      HIGH:
        highPriorityTasks,

      URGENT:
        urgentPriorityTasks,
    };

    // =================================================
    // RECENT TASKS
    // =================================================

    const recentTasks =
      tasks.slice(0, 5);

    // =================================================
    // RECENT PROJECTS
    // =================================================

    const recentProjects =
      [...projects]
        .sort(
          (a, b) =>
            new Date(b.createdAt) -
            new Date(a.createdAt)
        )
        .slice(0, 5);

    // =================================================
    // RESPONSE
    // =================================================

    return res.status(200).json({
      success: true,

      analytics: {
        // =============================================
        // USER / RBAC INFO
        // =============================================

        access: {
          role,

          isAdminOrOwner:
            isAdminOrOwner(
              req.user
            ),

          scope:
            isAdminOrOwner(
              req.user
            )
              ? "ALL_PROJECTS"
              : "MEMBER_PROJECTS",
        },

        // =============================================
        // OVERVIEW
        // =============================================

        overview: {
          totalProjects,

          totalTasks,

          completedTasks,

          overdueTasks,

          myTasks,

          myCompletedTasks,

          myPendingTasks,

          completionPercentage,
        },

        // =============================================
        // TASK STATUS
        // =============================================

        taskStatus: {
          todo:
            todoTasks,

          inProgress:
            inProgressTasks,

          completed:
            completedTasks,

          cancelled:
            cancelledTasks,
        },

        // =============================================
        // STATUS DISTRIBUTION
        // =============================================

        statusDistribution,

        // =============================================
        // PRIORITY
        // =============================================

        priorityDistribution,

        // =============================================
        // PROJECT ANALYTICS
        // =============================================

        projectAnalytics,

        // =============================================
        // RECENT DATA
        // =============================================

        recentTasks,

        recentProjects,
      },
    });
  } catch (error) {
    console.error(
      "Get Analytics Error:",
      error
    );

    return res.status(500).json({
      success: false,

      message:
        "Server error while fetching analytics",
    });
  }
};

// =====================================================
// EXPORT
// =====================================================

module.exports = {
  getAnalytics,
};

