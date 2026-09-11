// const Project = require("../models/Project");
// const Task = require("../models/Task");


// // ==========================================
// // GET DASHBOARD STATISTICS
// // ==========================================

// const getDashboardStats = async (req, res) => {
//   try {
//     const userId = req.user._id;

//     // ------------------------------------------
//     // GET USER PROJECTS
//     // ------------------------------------------

//     const projects = await Project.find({
//       $or: [
//         {
//           owner: userId,
//         },
//         {
//           members: userId,
//         },
//       ],
//     });

//     const projectIds = projects.map(
//       (project) => project._id
//     );


//     // ------------------------------------------
//     // GET PROJECT TASKS
//     // ------------------------------------------

//     const tasks = await Task.find({
//       project: {
//         $in: projectIds,
//       },
//     });


//     // ------------------------------------------
//     // TASK COUNTS
//     // ------------------------------------------

//     const totalTasks = tasks.length;

//     const todoTasks = tasks.filter(
//       (task) => task.status === "TODO"
//     ).length;

//     const inProgressTasks = tasks.filter(
//       (task) =>
//         task.status === "IN_PROGRESS"
//     ).length;

//     const reviewTasks = tasks.filter(
//       (task) => task.status === "REVIEW"
//     ).length;

//     const completedTasks = tasks.filter(
//       (task) => task.status === "DONE"
//     ).length;


//     // ------------------------------------------
//     // OVERDUE TASKS
//     // ------------------------------------------

//     const now = new Date();

//     const overdueTasks = tasks.filter(
//       (task) =>
//         task.dueDate &&
//         new Date(task.dueDate) < now &&
//         task.status !== "DONE"
//     ).length;


//     // ------------------------------------------
//     // TASKS ASSIGNED TO CURRENT USER
//     // ------------------------------------------

//     const myTasks = tasks.filter(
//       (task) =>
//         task.assignedTo &&
//         task.assignedTo.toString() ===
//           userId.toString()
//     ).length;


//     // ------------------------------------------
//     // PROJECT COUNT
//     // ------------------------------------------

//     const totalProjects =
//       projects.length;


//     // ------------------------------------------
//     // RECENT PROJECTS
//     // ------------------------------------------

//     const recentProjects =
//       await Project.find({
//         $or: [
//           {
//             owner: userId,
//           },
//           {
//             members: userId,
//           },
//         ],
//       })
//         .populate(
//           "owner",
//           "name username email"
//         )
//         .sort({
//           createdAt: -1,
//         })
//         .limit(5);


//     // ------------------------------------------
//     // RECENT TASKS
//     // ------------------------------------------

//     const recentTasks =
//       await Task.find({
//         project: {
//           $in: projectIds,
//         },
//       })
//         .populate(
//           "assignedTo",
//           "name username email"
//         )
//         .populate(
//           "project",
//           "name"
//         )
//         .sort({
//           createdAt: -1,
//         })
//         .limit(10);

//         const completionPercentage =
//   totalTasks === 0
//     ? 0
//     : Math.round(
//         (completedTasks / totalTasks) *
//           100
//       );

//     // ------------------------------------------
//     // RESPONSE
//     // ------------------------------------------

//     return res.status(200).json({
//       success: true,

//       stats: {
//         totalProjects,
//         totalTasks,
//         todoTasks,
//         inProgressTasks,
//         reviewTasks,
//         completedTasks,
//         overdueTasks,
//         myTasks,
//         completionPercentage,
//       },

//       recentProjects,

//       recentTasks,
//     });

//   } catch (error) {

//     console.error(
//       "Dashboard Error:",
//       error
//     );

//     return res.status(500).json({
//       success: false,
//       message:
//         "Server error while loading dashboard",
//     });
//   }
// };


// module.exports = {
//   getDashboardStats,
// };



const Project = require("../models/Project");
const Task = require("../models/Task");

// =====================================================
// GET DASHBOARD STATISTICS
// GET /api/dashboard/stats
// =====================================================

const getDashboardStats = async (req, res) => {
  try {
    // =================================================
    // CURRENT USER
    // =================================================

    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Not authorized.",
      });
    }

    const userId = req.user._id;

    const userRole = String(
      req.user.role || "MEMBER"
    )
      .trim()
      .toUpperCase();

    // =================================================
    // VALID ROLES
    // =================================================

    const validRoles = [
      "OWNER",
      "ADMIN",
      "MANAGER",
      "MEMBER",
    ];

    if (!validRoles.includes(userRole)) {
      return res.status(403).json({
        success: false,
        message: "Access denied. Invalid user role.",
        userRole,
      });
    }

    // =================================================
    // PROJECT QUERY
    // =================================================
    //
    // OWNER  -> ALL PROJECTS
    // ADMIN  -> ALL PROJECTS
    //
    // MANAGER -> Own projects + member projects
    // MEMBER  -> Own projects + member projects
    //
    // =================================================

    let projectQuery;

    if (
      userRole === "OWNER" ||
      userRole === "ADMIN"
    ) {
      projectQuery = {};
    } else {
      projectQuery = {
        $or: [
          {
            owner: userId,
          },
          {
            members: userId,
          },
        ],
      };
    }

    // =================================================
    // GET ACCESSIBLE PROJECTS
    // =================================================

    const projects = await Project.find(
      projectQuery
    )
      .sort({
        createdAt: -1,
      });

    // =================================================
    // PROJECT IDS
    // =================================================

    const projectIds = projects.map(
      (project) => project._id
    );

    // =================================================
    // TASK QUERY
    // =================================================
    //
    // OWNER / ADMIN
    // -> All tasks
    //
    // MANAGER / MEMBER
    // -> Tasks belonging to accessible projects
    //
    // =================================================

    let taskQuery;

    if (
      userRole === "OWNER" ||
      userRole === "ADMIN"
    ) {
      taskQuery = {};
    } else {
      taskQuery = {
        project: {
          $in: projectIds,
        },
      };
    }

    // =================================================
    // GET ACCESSIBLE TASKS
    // =================================================

    const tasks = await Task.find(
      taskQuery
    );

    // =================================================
    // TASK COUNTS
    // =================================================

    const totalTasks = tasks.length;

    const todoTasks = tasks.filter(
      (task) =>
        String(task.status || "")
          .toUpperCase() === "TODO"
    ).length;

    const inProgressTasks = tasks.filter(
      (task) =>
        String(task.status || "")
          .toUpperCase() === "IN_PROGRESS"
    ).length;

    const reviewTasks = tasks.filter(
      (task) =>
        String(task.status || "")
          .toUpperCase() === "REVIEW"
    ).length;

    const completedTasks = tasks.filter(
      (task) =>
        String(task.status || "")
          .toUpperCase() === "DONE"
    ).length;

    // =================================================
    // OVERDUE TASKS
    // =================================================

    const now = new Date();

    const overdueTasks = tasks.filter(
      (task) => {
        if (!task.dueDate) {
          return false;
        }

        const dueDate = new Date(
          task.dueDate
        );

        return (
          !Number.isNaN(dueDate.getTime()) &&
          dueDate < now &&
          String(task.status || "")
            .toUpperCase() !== "DONE"
        );
      }
    ).length;

    // =================================================
    // MY TASKS
    // =================================================

    const myTasks = tasks.filter(
      (task) => {
        if (!task.assignedTo) {
          return false;
        }

        return (
          task.assignedTo.toString() ===
          userId.toString()
        );
      }
    ).length;

    // =================================================
    // PROJECT COUNT
    // =================================================

    const totalProjects =
      projects.length;

    // =================================================
    // COMPLETION PERCENTAGE
    // =================================================

    const completionPercentage =
      totalTasks === 0
        ? 0
        : Math.round(
            (completedTasks /
              totalTasks) *
              100
          );

    // =================================================
    // RECENT PROJECTS
    // =================================================

    const recentProjects =
      await Project.find(
        projectQuery
      )
        .populate(
          "owner",
          "name username email avatar role"
        )
        .populate(
          "members",
          "name username email avatar role"
        )
        .sort({
          createdAt: -1,
        })
        .limit(5);

    // =================================================
    // RECENT TASKS
    // =================================================

    const recentTasks =
      await Task.find(
        taskQuery
      )
        .populate(
          "assignedTo",
          "name username email avatar role"
        )
        .populate(
          "project",
          "name"
        )
        .sort({
          createdAt: -1,
        })
        .limit(10);

    // =================================================
    // RESPONSE
    // =================================================

    return res.status(200).json({
      success: true,

      userRole,

      stats: {
        totalProjects,
        totalTasks,

        todoTasks,

        inProgressTasks,

        reviewTasks,

        completedTasks,

        overdueTasks,

        myTasks,

        completionPercentage,
      },

      recentProjects,

      recentTasks,
    });
  } catch (error) {
    // =================================================
    // SERVER ERROR
    // =================================================

    console.error(
      "Dashboard Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Server error while loading dashboard",
    });
  }
};

// =====================================================
// EXPORT
// =====================================================

module.exports = {
  getDashboardStats,
};

