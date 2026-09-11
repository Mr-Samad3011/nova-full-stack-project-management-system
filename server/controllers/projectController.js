// const Project = require("../models/Project");
// const User = require("../models/User");
// const {
//   createNotification,
// } = require("../services/notificationService");

// // ==========================================
// // CREATE PROJECT
// // ==========================================

// const createProject = async (req, res) => {
//   try {
//     const {
//       name,
//       description,
//       status,
//       priority,
//       startDate,
//       dueDate,
//     } = req.body;

//     if (!name) {
//       return res.status(400).json({
//         success: false,
//         message: "Project name is required",
//       });
//     }

//     if (
//       startDate &&
//       dueDate &&
//       new Date(dueDate) < new Date(startDate)
//     ) {
//       return res.status(400).json({
//         success: false,
//         message:
//           "Due date cannot be before start date",
//       });
//     }

//     const project = await Project.create({
//       name,
//       description,
//       status,
//       priority,
//       startDate,
//       dueDate,

//       owner: req.user._id,

//       members: [],
//     });

//     const populatedProject =
//       await Project.findById(project._id)
//         .populate(
//           "owner",
//           "name username email"
//         );

//     return res.status(201).json({
//       success: true,
//       message: "Project created successfully",
//       project: populatedProject,
//     });

//   } catch (error) {

//     console.error(
//       "Create Project Error:",
//       error
//     );

//     return res.status(500).json({
//       success: false,
//       message:
//         "Server error while creating project",
//     });
//   }
// };


// // ==========================================
// // GET ALL PROJECTS
// // ==========================================

// const getProjects = async (req, res) => {
//   try {

//   const projects = await Project.find({
//   $or: [
//     {
//       owner: req.user._id,
//     },
//     {
//       members: req.user._id,
//     },
//   ],
// })
//   .populate(
//     "owner",
//     "name username email"
//   )
//   .populate(
//     "members",
//     "name username email"
//   )
//   .sort({
//     createdAt: -1,
//   });

//     return res.status(200).json({
//       success: true,
//       count: projects.length,
//       projects,
//     });

//   } catch (error) {

//     console.error(
//       "Get Projects Error:",
//       error
//     );

//     return res.status(500).json({
//       success: false,
//       message:
//         "Server error while fetching projects",
//     });
//   }
// };


// // ==========================================
// // GET SINGLE PROJECT
// // ==========================================

// // const getProject = async (req, res) => {
// //   try {

// //    const project =
// //   await Project.findOne({
// //     _id: req.params.id,
// //     $or: [
// //       {
// //         owner: req.user._id,
// //       },
// //       {
// //         members: req.user._id,
// //       },
// //     ],
// //   })
// //     .populate(
// //       "owner",
// //       "name username email"
// //     )
// //     .populate(
// //       "members",
// //       "name username email"
// //     );

// //     if (!project) {
// //       return res.status(404).json({
// //         success: false,
// //         message: "Project not found",
// //       });
// //     }

// //     return res.status(200).json({
// //       success: true,
// //       project,
// //     });

// //   } catch (error) {

// //     console.error(
// //       "Get Project Error:",
// //       error
// //     );

// //     return res.status(500).json({
// //       success: false,
// //       message:
// //         "Server error while fetching project",
// //     });
// //   }
// // };

// const getProject = async (req, res) => {
//   try {

//     const project =
//       await Project.findOne({
//         _id: req.params.id,

//         $or: [
//           {
//             owner: req.user._id,
//           },
//           {
//             members: req.user._id,
//           },
//         ],
//       })
//       .populate(
//         "owner",
//         "name username email"
//       )
//       .populate(
//         "members",
//         "name username email"
//       );


//     if (!project) {

//       return res.status(404).json({
//         success: false,
//         message:
//           "Project not found or access denied",
//       });

//     }


//     return res.status(200).json({
//       success: true,
//       project,
//     });

//   } catch (error) {

//     console.error(
//       "Get Project Error:",
//       error
//     );

//     return res.status(500).json({
//       success: false,
//       message:
//         "Server error while fetching project",
//     });

//   }
// };

// // ==========================================
// // UPDATE PROJECT
// // ==========================================

// const updateProject = async (req, res) => {
//   try {
//     const {
//       name,
//       description,
//       status,
//       priority,
//       startDate,
//       dueDate,
//     } = req.body;

//     // =====================================================
//     // FIND PROJECT
//     // =====================================================

//     const project = await Project.findOne({
//       _id: req.params.id,
//       owner: req.user._id,
//     });

//     if (!project) {
//       return res.status(404).json({
//         success: false,
//         message: "Project not found",
//       });
//     }

//     // =====================================================
//     // UPDATE FIELDS
//     // =====================================================

//     if (name !== undefined) {
//       project.name = name;
//     }

//     if (description !== undefined) {
//       project.description = description;
//     }

//     if (status !== undefined) {
//       project.status = status;
//     }

//     if (priority !== undefined) {
//       project.priority = priority;
//     }

//     if (startDate !== undefined) {
//       project.startDate = startDate;
//     }

//     if (dueDate !== undefined) {
//       project.dueDate = dueDate;
//     }

//     // =====================================================
//     // DATE VALIDATION
//     // =====================================================

//     if (
//       project.startDate &&
//       project.dueDate &&
//       new Date(project.dueDate) <
//         new Date(project.startDate)
//     ) {
//       return res.status(400).json({
//         success: false,
//         message:
//           "Due date cannot be before start date",
//       });
//     }

//     // =====================================================
//     // SAVE UPDATED PROJECT
//     // =====================================================

//     await project.save();

//     // =====================================================
//     // NOTIFICATION: PROJECT UPDATED
//     // =====================================================

//     try {
//       const recipients = project.members
//         .map((memberId) => memberId.toString())
//         .filter(
//           (memberId) =>
//             memberId !== req.user._id.toString()
//         );

//       const uniqueRecipients = [
//         ...new Set(recipients),
//       ];

//       await Promise.all(
//         uniqueRecipients.map((recipientId) =>
//           createNotification({
//             recipient: recipientId,
//             sender: req.user._id,

//             type: "PROJECT_UPDATED",

//             title: "Project Updated",

//             message: `The project "${project.name}" has been updated.`,

//             project: project._id,
//           })
//         )
//       );
//     } catch (notificationError) {
//       console.error(
//         "Project Updated Notification Error:",
//         notificationError
//       );

//       // Notification fail hone par
//       // project update fail nahi hoga.
//     }

//     // =====================================================
//     // GET UPDATED PROJECT
//     // =====================================================

//     const updatedProject =
//       await Project.findById(project._id)
//         .populate(
//           "owner",
//           "name username email"
//         )
//         .populate(
//           "members",
//           "name username email"
//         );

//     // =====================================================
//     // RESPONSE
//     // =====================================================

//     return res.status(200).json({
//       success: true,
//       message: "Project updated successfully",
//       project: updatedProject,
//     });

//   } catch (error) {
//     console.error(
//       "Update Project Error:",
//       error
//     );

//     return res.status(500).json({
//       success: false,
//       message:
//         "Server error while updating project",
//     });
//   }
// };


// // ==========================================
// // DELETE PROJECT
// // ==========================================

// const deleteProject = async (req, res) => {
//   try {
//     // =====================================================
//     // FIND PROJECT
//     // =====================================================

//     const project = await Project.findOne({
//       _id: req.params.id,
//       owner: req.user._id,
//     });

//     if (!project) {
//       return res.status(404).json({
//         success: false,
//         message: "Project not found",
//       });
//     }

//     // =====================================================
//     // SAVE MEMBERS BEFORE DELETE
//     // =====================================================

//     const recipients = [
//       ...new Set(
//         project.members
//           .map((memberId) => memberId.toString())
//           .filter(
//             (memberId) =>
//               memberId !== req.user._id.toString()
//           )
//       ),
//     ];

//     // =====================================================
//     // NOTIFICATION: PROJECT DELETED
//     // =====================================================

//     try {
//       await Promise.all(
//         recipients.map((recipientId) =>
//           createNotification({
//             recipient: recipientId,
//             sender: req.user._id,

//             type: "PROJECT_DELETED",

//             title: "Project Deleted",

//             message: `The project "${project.name}" has been deleted by the project owner.`,

//             project: project._id,
//           })
//         )
//       );
//     } catch (notificationError) {
//       console.error(
//         "Project Deleted Notification Error:",
//         notificationError
//       );

//       // Notification fail hone par
//       // project deletion fail nahi hoga.
//     }

//     // =====================================================
//     // DELETE PROJECT
//     // =====================================================

//     await Project.findByIdAndDelete(
//       project._id
//     );

//     // =====================================================
//     // RESPONSE
//     // =====================================================

//     return res.status(200).json({
//       success: true,
//       message: "Project deleted successfully",
//     });

//   } catch (error) {
//     console.error(
//       "Delete Project Error:",
//       error
//     );

//     return res.status(500).json({
//       success: false,
//       message:
//         "Server error while deleting project",
//     });
//   }
// };


// const addProjectMember = async (req, res) => {
//   try {
//     const { userId } = req.body;

//     // =====================================================
//     // VALIDATION
//     // =====================================================

//     if (!userId) {
//       return res.status(400).json({
//         success: false,
//         message: "User ID is required",
//       });
//     }

//     // =====================================================
//     // FIND PROJECT
//     // =====================================================

//     const project = await Project.findOne({
//       _id: req.params.id,
//       owner: req.user._id,
//     });

//     if (!project) {
//       return res.status(404).json({
//         success: false,
//         message:
//           "Project not found or you are not the owner",
//       });
//     }

//     // =====================================================
//     // OWNER CHECK
//     // =====================================================

//     if (
//       project.owner.toString() ===
//       userId.toString()
//     ) {
//       return res.status(400).json({
//         success: false,
//         message:
//           "Project owner is already part of the project",
//       });
//     }

//     // =====================================================
//     // CHECK USER EXISTS
//     // =====================================================

//     const user = await User.findById(userId);

//     if (!user) {
//       return res.status(404).json({
//         success: false,
//         message: "User not found",
//       });
//     }

//     // =====================================================
//     // CHECK DUPLICATE MEMBER
//     // =====================================================

//     const alreadyMember =
//       project.members.some(
//         (memberId) =>
//           memberId.toString() ===
//           userId.toString()
//       );

//     if (alreadyMember) {
//       return res.status(409).json({
//         success: false,
//         message:
//           "User is already a project member",
//       });
//     }

//     // =====================================================
//     // ADD MEMBER
//     // =====================================================

//     project.members.push(userId);

//     await project.save();

//     // =====================================================
//     // CREATE NOTIFICATION
//     // =====================================================

//     try {
//       const notification =
//         await createNotification({
//           recipient: userId,
//           sender: req.user._id,

//           type: "PROJECT_MEMBER_ADDED",

//           title: "Added to Project",

//           message: `You have been added to the project "${project.name}".`,

//           project: project._id,
//         });

//       console.log(
//         "Project Member Added Notification Created:",
//         notification._id
//       );
//     } catch (notificationError) {
//       console.error(
//         "Project Member Added Notification Error:",
//         notificationError
//       );
//     }

//     // =====================================================
//     // GET UPDATED PROJECT
//     // =====================================================

//     const updatedProject =
//       await Project.findById(project._id)
//         .populate(
//           "owner",
//           "name username email"
//         )
//         .populate(
//           "members",
//           "name username email"
//         );

//     // =====================================================
//     // RESPONSE
//     // =====================================================

//     return res.status(200).json({
//       success: true,
//       message: "Member added successfully",
//       project: updatedProject,
//     });

//   } catch (error) {
//     console.error(
//       "Add Member Error:",
//       error
//     );

//     return res.status(500).json({
//       success: false,
//       message:
//         "Server error while adding member",
//     });
//   }
// };





// const removeProjectMember = async (req, res) => {
//   try {
//     const { userId } = req.body;

//     // =====================================================
//     // VALIDATION
//     // =====================================================

//     if (!userId) {
//       return res.status(400).json({
//         success: false,
//         message: "User ID is required",
//       });
//     }

//     // =====================================================
//     // FIND PROJECT
//     // =====================================================

//     const project = await Project.findOne({
//       _id: req.params.id,
//       owner: req.user._id,
//     });

//     if (!project) {
//       return res.status(404).json({
//         success: false,
//         message:
//           "Project not found or you are not the owner",
//       });
//     }

//     // =====================================================
//     // CHECK MEMBER
//     // =====================================================

//     const isMember = project.members.some(
//       (memberId) =>
//         memberId.toString() === userId.toString()
//     );

//     if (!isMember) {
//       return res.status(404).json({
//         success: false,
//         message:
//           "User is not a member of this project",
//       });
//     }

//     // =====================================================
//     // REMOVE MEMBER
//     // =====================================================

//     project.members = project.members.filter(
//       (memberId) =>
//         memberId.toString() !== userId.toString()
//     );

//     await project.save();

//     // =====================================================
//     // NOTIFICATION: PROJECT MEMBER REMOVED
//     // =====================================================

//     try {
//       await createNotification({
//         recipient: userId,
//         sender: req.user._id,

//         type: "PROJECT_MEMBER_REMOVED",

//         title: "Removed from Project",

//         message: `You have been removed from the project "${project.name}".`,

//         project: project._id,
//       });
//     } catch (notificationError) {
//       console.error(
//         "Project Member Removed Notification Error:",
//         notificationError
//       );

//       // Notification fail hone par
//       // member removal fail nahi hoga.
//     }

//     // =====================================================
//     // POPULATE UPDATED PROJECT
//     // =====================================================

//     const updatedProject =
//       await Project.findById(project._id)
//         .populate(
//           "owner",
//           "name username email"
//         )
//         .populate(
//           "members",
//           "name username email"
//         );

//     // =====================================================
//     // RESPONSE
//     // =====================================================

//     return res.status(200).json({
//       success: true,
//       message: "Member removed successfully",
//       project: updatedProject,
//     });

//   } catch (error) {
//     console.error(
//       "Remove Member Error:",
//       error
//     );

//     return res.status(500).json({
//       success: false,
//       message:
//         "Server error while removing member",
//     });
//   }
// };


// module.exports = {
//   createProject,
//   getProjects,
//   getProject,
//   updateProject,
//   deleteProject,
//   addProjectMember,
//   removeProjectMember,

// };



const mongoose = require("mongoose");

const Project = require("../models/Project");
const User = require("../models/User");

const {
  createNotification,
} = require("../services/notificationService");

// =====================================================
// HELPER — VALIDATE OBJECT ID
// =====================================================

const isValidObjectId = (id) => {
  return mongoose.Types.ObjectId.isValid(id);
};

// =====================================================
// HELPER — NORMALIZE ROLE
// =====================================================

const getUserRole = (req) => {
  return String(
    req.user?.role || "MEMBER"
  )
    .trim()
    .toUpperCase();
};

// =====================================================
// HELPER — GET USER ID
// =====================================================

const getUserId = (req) => {
  return req.user?._id;
};

// =====================================================
// HELPER — POPULATE PROJECT
// =====================================================

const getPopulatedProject = async (
  projectId
) => {
  return await Project.findById(
    projectId
  )
    .populate(
      "owner",
      "name username email role avatar"
    )
    .populate(
      "members",
      "name username email role avatar"
    );
};

// =====================================================
// HELPER — PROJECT ACCESS QUERY
// =====================================================
//
// ADMIN:
//   Can access everything.
//
// OTHER ROLES:
//   Can access projects where:
//   1. User is owner
//   2. User is member
//
// =====================================================

const getProjectAccessQuery = (req) => {
  const userId = getUserId(req);
  const role = getUserRole(req);

  if (role === "ADMIN") {
    return {};
  }

  return {
    $or: [
      {
        owner: userId,
      },
      {
        members: userId,
      },
    ],
  };
};

// =====================================================
// HELPER — PROJECT MANAGEMENT QUERY
// =====================================================
//
// ADMIN:
//   Can manage all.
//
// OWNER:
//   Can manage owned projects.
//
// MANAGER:
//   Can manage projects they own or belong to.
//
// MEMBER / VIEWER:
//   Cannot reach modification routes because RBAC
//   middleware blocks them.
//
// =====================================================

const getProjectManagementQuery = (
  req,
  projectId
) => {
  const userId = getUserId(req);
  const role = getUserRole(req);

  if (role === "ADMIN") {
    return {
      _id: projectId,
    };
  }

  return {
    _id: projectId,

    $or: [
      {
        owner: userId,
      },
      {
        members: userId,
      },
    ],
  };
};

// =====================================================
// CREATE PROJECT
// POST /api/projects
// =====================================================

const createProject = async (
  req,
  res
) => {
  try {
    const {
      name,
      description,
      status,
      priority,
      startDate,
      dueDate,
    } = req.body;

    // =================================================
    // VALIDATION
    // =================================================

    if (
      !name ||
      typeof name !== "string" ||
      !name.trim()
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Project name is required",
      });
    }

    // =================================================
    // DATE VALIDATION
    // =================================================

    if (startDate && dueDate) {
      const start = new Date(
        startDate
      );

      const due = new Date(
        dueDate
      );

      if (
        Number.isNaN(
          start.getTime()
        ) ||
        Number.isNaN(
          due.getTime()
        )
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Invalid project dates",
        });
      }

      if (due < start) {
        return res.status(400).json({
          success: false,
          message:
            "Due date cannot be before start date",
        });
      }
    }

    // =================================================
    // CREATE PROJECT
    // =================================================

    const project =
      await Project.create({
        name: name.trim(),

        description:
          typeof description ===
          "string"
            ? description.trim()
            : "",

        status,

        priority,

        startDate,

        dueDate,

        owner: getUserId(req),

        members: [],
      });

    // =================================================
    // POPULATE
    // =================================================

    const populatedProject =
      await getPopulatedProject(
        project._id
      );

    return res.status(201).json({
      success: true,

      message:
        "Project created successfully",

      project: populatedProject,
    });
  } catch (error) {
    console.error(
      "Create Project Error:",
      error
    );

    return res.status(500).json({
      success: false,

      message:
        "Server error while creating project",
    });
  }
};

// =====================================================
// GET ALL PROJECTS
// GET /api/projects
// =====================================================

const getProjects = async (
  req,
  res
) => {
  try {
    const projectQuery =
      getProjectAccessQuery(req);

    const projects =
      await Project.find(
        projectQuery
      )
        .populate(
          "owner",
          "name username email role avatar"
        )
        .populate(
          "members",
          "name username email role avatar"
        )
        .sort({
          createdAt: -1,
        });

    return res.status(200).json({
      success: true,

      count: projects.length,

      projects,
    });
  } catch (error) {
    console.error(
      "Get Projects Error:",
      error
    );

    return res.status(500).json({
      success: false,

      message:
        "Server error while fetching projects",
    });
  }
};

// =====================================================
// GET SINGLE PROJECT
// GET /api/projects/:id
// =====================================================

const getProject = async (
  req,
  res
) => {
  try {
    const { id } =
      req.params;

    // =================================================
    // VALIDATE ID
    // =================================================

    if (!isValidObjectId(id)) {
      return res.status(400).json({
        success: false,

        message:
          "Invalid project ID",
      });
    }

    // =================================================
    // ACCESS QUERY
    // =================================================

    const accessQuery =
      getProjectAccessQuery(req);

    const project =
      await Project.findOne({
        _id: id,
        ...accessQuery,
      })
        .populate(
          "owner",
          "name username email role avatar"
        )
        .populate(
          "members",
          "name username email role avatar"
        );

    if (!project) {
      return res.status(404).json({
        success: false,

        message:
          "Project not found or access denied",
      });
    }

    return res.status(200).json({
      success: true,

      project,
    });
  } catch (error) {
    console.error(
      "Get Project Error:",
      error
    );

    return res.status(500).json({
      success: false,

      message:
        "Server error while fetching project",
    });
  }
};

// =====================================================
// UPDATE PROJECT
// PUT /api/projects/:id
// =====================================================

const updateProject = async (
  req,
  res
) => {
  try {
    const { id } =
      req.params;

    const {
      name,
      description,
      status,
      priority,
      startDate,
      dueDate,
    } = req.body;

    // =================================================
    // VALIDATE ID
    // =================================================

    if (!isValidObjectId(id)) {
      return res.status(400).json({
        success: false,

        message:
          "Invalid project ID",
      });
    }

    // =================================================
    // FIND PROJECT BASED ON RBAC
    // =================================================

    const projectQuery =
      getProjectManagementQuery(
        req,
        id
      );

    const project =
      await Project.findOne(
        projectQuery
      );

    if (!project) {
      return res.status(404).json({
        success: false,

        message:
          "Project not found or you do not have permission to update it",
      });
    }

    // =================================================
    // UPDATE NAME
    // =================================================

    if (name !== undefined) {
      if (
        typeof name !== "string" ||
        !name.trim()
      ) {
        return res.status(400).json({
          success: false,

          message:
            "Project name cannot be empty",
        });
      }

      project.name =
        name.trim();
    }

    // =================================================
    // DESCRIPTION
    // =================================================

    if (
      description !== undefined
    ) {
      if (
        typeof description !==
        "string"
      ) {
        return res.status(400).json({
          success: false,

          message:
            "Description must be a string",
        });
      }

      project.description =
        description.trim();
    }

    // =================================================
    // STATUS
    // =================================================

    if (
      status !== undefined
    ) {
      project.status =
        status;
    }

    // =================================================
    // PRIORITY
    // =================================================

    if (
      priority !== undefined
    ) {
      project.priority =
        priority;
    }

    // =================================================
    // START DATE
    // =================================================

    if (
      startDate !== undefined
    ) {
      project.startDate =
        startDate;
    }

    // =================================================
    // DUE DATE
    // =================================================

    if (
      dueDate !== undefined
    ) {
      project.dueDate =
        dueDate;
    }

    // =================================================
    // DATE VALIDATION
    // =================================================

    if (
      project.startDate &&
      project.dueDate
    ) {
      const start =
        new Date(
          project.startDate
        );

      const due =
        new Date(
          project.dueDate
        );

      if (
        Number.isNaN(
          start.getTime()
        ) ||
        Number.isNaN(
          due.getTime()
        )
      ) {
        return res.status(400).json({
          success: false,

          message:
            "Invalid project dates",
        });
      }

      if (due < start) {
        return res.status(400).json({
          success: false,

          message:
            "Due date cannot be before start date",
        });
      }
    }

    // =================================================
    // SAVE
    // =================================================

    await project.save();

    // =================================================
    // NOTIFY MEMBERS
    // =================================================

    try {
      const recipients = [
        ...new Set(
          project.members
            .map(
              (memberId) =>
                memberId.toString()
            )
            .filter(
              (memberId) =>
                memberId !==
                getUserId(
                  req
                ).toString()
            )
        ),
      ];

      await Promise.all(
        recipients.map(
          (recipientId) =>
            createNotification({
              recipient:
                recipientId,

              sender:
                getUserId(req),

              type:
                "PROJECT_UPDATED",

              title:
                "Project Updated",

              message:
                `The project "${project.name}" has been updated.`,

              project:
                project._id,
            })
        )
      );
    } catch (
      notificationError
    ) {
      console.error(
        "Project Updated Notification Error:",
        notificationError
      );
    }

    // =================================================
    // UPDATED PROJECT
    // =================================================

    const updatedProject =
      await getPopulatedProject(
        project._id
      );

    return res.status(200).json({
      success: true,

      message:
        "Project updated successfully",

      project:
        updatedProject,
    });
  } catch (error) {
    console.error(
      "Update Project Error:",
      error
    );

    return res.status(500).json({
      success: false,

      message:
        "Server error while updating project",
    });
  }
};

// =====================================================
// DELETE PROJECT
// DELETE /api/projects/:id
// =====================================================
//
// ONLY:
// ADMIN
// actual PROJECT OWNER
//
// MANAGER cannot delete.
// MEMBER cannot delete.
// VIEWER cannot delete.
//
// =====================================================

const deleteProject = async (
  req,
  res
) => {
  try {
    const { id } =
      req.params;

    // =================================================
    // VALIDATE ID
    // =================================================

    if (!isValidObjectId(id)) {
      return res.status(400).json({
        success: false,

        message:
          "Invalid project ID",
      });
    }

    const userId =
      getUserId(req);

    const userRole =
      getUserRole(req);

    // =================================================
    // ADMIN
    // =================================================

    let projectQuery = {
      _id: id,
    };

    // =================================================
    // NON-ADMIN
    // =================================================

    if (
      userRole !== "ADMIN"
    ) {
      projectQuery.owner =
        userId;
    }

    // =================================================
    // FIND PROJECT
    // =================================================

    const project =
      await Project.findOne(
        projectQuery
      );

    if (!project) {
      return res.status(404).json({
        success: false,

        message:
          "Project not found or you do not have permission to delete it",
      });
    }

    // =================================================
    // SAVE RECIPIENTS
    // =================================================

    const recipients = [
      ...new Set(
        project.members
          .map(
            (memberId) =>
              memberId.toString()
          )
          .filter(
            (memberId) =>
              memberId !==
              userId.toString()
          )
      ),
    ];

    // =================================================
    // NOTIFY MEMBERS
    // =================================================

    try {
      await Promise.all(
        recipients.map(
          (recipientId) =>
            createNotification({
              recipient:
                recipientId,

              sender:
                userId,

              type:
                "PROJECT_DELETED",

              title:
                "Project Deleted",

              message:
                `The project "${project.name}" has been deleted.`,

              project:
                project._id,
            })
        )
      );
    } catch (
      notificationError
    ) {
      console.error(
        "Project Deleted Notification Error:",
        notificationError
      );
    }

    // =================================================
    // DELETE
    // =================================================

    await Project.findByIdAndDelete(
      project._id
    );

    return res.status(200).json({
      success: true,

      message:
        "Project deleted successfully",
    });
  } catch (error) {
    console.error(
      "Delete Project Error:",
      error
    );

    return res.status(500).json({
      success: false,

      message:
        "Server error while deleting project",
    });
  }
};

// =====================================================
// ADD PROJECT MEMBER
// POST /api/projects/:id/members
// =====================================================

const addProjectMember = async (
  req,
  res
) => {
  try {
    const { id } =
      req.params;

    const { userId } =
      req.body;

    // =================================================
    // VALIDATE PROJECT ID
    // =================================================

    if (!isValidObjectId(id)) {
      return res.status(400).json({
        success: false,

        message:
          "Invalid project ID",
      });
    }

    // =================================================
    // VALIDATE USER ID
    // =================================================

    if (!userId) {
      return res.status(400).json({
        success: false,

        message:
          "User ID is required",
      });
    }

    if (!isValidObjectId(userId)) {
      return res.status(400).json({
        success: false,

        message:
          "Invalid user ID",
      });
    }

    // =================================================
    // FIND PROJECT
    // =================================================

    const projectQuery =
      getProjectManagementQuery(
        req,
        id
      );

    const project =
      await Project.findOne(
        projectQuery
      );

    if (!project) {
      return res.status(404).json({
        success: false,

        message:
          "Project not found or you do not have permission to manage members",
      });
    }

    // =================================================
    // OWNER CHECK
    // =================================================

    if (
      project.owner.toString() ===
      userId.toString()
    ) {
      return res.status(400).json({
        success: false,

        message:
          "Project owner is already part of the project",
      });
    }

    // =================================================
    // FIND USER
    // =================================================

    const user =
      await User.findById(
        userId
      );

    if (!user) {
      return res.status(404).json({
        success: false,

        message:
          "User not found",
      });
    }

    // =================================================
    // DUPLICATE CHECK
    // =================================================

    const alreadyMember =
      project.members.some(
        (memberId) =>
          memberId.toString() ===
          userId.toString()
      );

    if (alreadyMember) {
      return res.status(409).json({
        success: false,

        message:
          "User is already a project member",
      });
    }

    // =================================================
    // ADD MEMBER
    // =================================================

    project.members.push(
      user._id
    );

    await project.save();

    // =================================================
    // NOTIFICATION
    // =================================================

    try {
      await createNotification({
        recipient: user._id,

        sender:
          getUserId(req),

        type:
          "PROJECT_MEMBER_ADDED",

        title:
          "Added to Project",

        message:
          `You have been added to the project "${project.name}".`,

        project:
          project._id,
      });
    } catch (
      notificationError
    ) {
      console.error(
        "Project Member Added Notification Error:",
        notificationError
      );
    }

    // =================================================
    // UPDATED PROJECT
    // =================================================

    const updatedProject =
      await getPopulatedProject(
        project._id
      );

    return res.status(200).json({
      success: true,

      message:
        "Member added successfully",

      project:
        updatedProject,
    });
  } catch (error) {
    console.error(
      "Add Member Error:",
      error
    );

    return res.status(500).json({
      success: false,

      message:
        "Server error while adding member",
    });
  }
};

// =====================================================
// REMOVE PROJECT MEMBER
// DELETE /api/projects/:id/members
// =====================================================

const removeProjectMember = async (
  req,
  res
) => {
  try {
    const { id } =
      req.params;

    const { userId } =
      req.body;

    // =================================================
    // VALIDATE PROJECT ID
    // =================================================

    if (!isValidObjectId(id)) {
      return res.status(400).json({
        success: false,

        message:
          "Invalid project ID",
      });
    }

    // =================================================
    // VALIDATE USER ID
    // =================================================

    if (!userId) {
      return res.status(400).json({
        success: false,

        message:
          "User ID is required",
      });
    }

    if (!isValidObjectId(userId)) {
      return res.status(400).json({
        success: false,

        message:
          "Invalid user ID",
      });
    }

    // =================================================
    // FIND PROJECT
    // =================================================

    const projectQuery =
      getProjectManagementQuery(
        req,
        id
      );

    const project =
      await Project.findOne(
        projectQuery
      );

    if (!project) {
      return res.status(404).json({
        success: false,

        message:
          "Project not found or you do not have permission to manage members",
      });
    }

    // =================================================
    // PREVENT OWNER REMOVAL
    // =================================================

    if (
      project.owner.toString() ===
      userId.toString()
    ) {
      return res.status(400).json({
        success: false,

        message:
          "Project owner cannot be removed",
      });
    }

    // =================================================
    // CHECK MEMBER
    // =================================================

    const isMember =
      project.members.some(
        (memberId) =>
          memberId.toString() ===
          userId.toString()
      );

    if (!isMember) {
      return res.status(404).json({
        success: false,

        message:
          "User is not a member of this project",
      });
    }

    // =================================================
    // REMOVE MEMBER
    // =================================================

    project.members =
      project.members.filter(
        (memberId) =>
          memberId.toString() !==
          userId.toString()
      );

    await project.save();

    // =================================================
    // NOTIFICATION
    // =================================================

    try {
      await createNotification({
        recipient: userId,

        sender:
          getUserId(req),

        type:
          "PROJECT_MEMBER_REMOVED",

        title:
          "Removed from Project",

        message:
          `You have been removed from the project "${project.name}".`,

        project:
          project._id,
      });
    } catch (
      notificationError
    ) {
      console.error(
        "Project Member Removed Notification Error:",
        notificationError
      );
    }

    // =================================================
    // UPDATED PROJECT
    // =================================================

    const updatedProject =
      await getPopulatedProject(
        project._id
      );

    return res.status(200).json({
      success: true,

      message:
        "Member removed successfully",

      project:
        updatedProject,
    });
  } catch (error) {
    console.error(
      "Remove Member Error:",
      error
    );

    return res.status(500).json({
      success: false,

      message:
        "Server error while removing member",
    });
  }
};

// =====================================================
// EXPORT
// =====================================================

module.exports = {
  createProject,
  getProjects,
  getProject,
  updateProject,
  deleteProject,
  addProjectMember,
  removeProjectMember,
};