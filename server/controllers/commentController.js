
// // const Comment = require("../models/Comment");
// // const Task = require("../models/Task");
// // const Project = require("../models/Project");

// // // =====================================================
// // // CREATE TASK COMMENT
// // // POST /api/comments/task/:taskId
// // // =====================================================

// // const createComment = async (req, res) => {
// //   try {
// //     const { content } = req.body;
// //     const taskId = req.params.taskId;

// //     if (!content || !content.trim()) {
// //       return res.status(400).json({
// //         success: false,
// //         message: "Comment content is required",
// //       });
// //     }

// //     const task = await Task.findById(taskId);

// //     if (!task) {
// //       return res.status(404).json({
// //         success: false,
// //         message: "Task not found",
// //       });
// //     }

// //     // Check project access
// //     const project = await Project.findOne({
// //       _id: task.project,
// //       $or: [
// //         {
// //           owner: req.user._id,
// //         },
// //         {
// //           members: req.user._id,
// //         },
// //       ],
// //     });

// //     if (!project) {
// //       return res.status(403).json({
// //         success: false,
// //         message: "You don't have access to this task",
// //       });
// //     }

// //     const comment = await Comment.create({
// //       content: content.trim(),
// //       task: taskId,
// //       project: task.project,
// //       createdBy: req.user._id,
// //     });

// //     const populatedComment = await Comment.findById(
// //       comment._id
// //     )
// //       .populate(
// //         "createdBy",
// //         "name username email"
// //       )
// //       .populate(
// //         "task",
// //         "title status"
// //       );

// //     return res.status(201).json({
// //       success: true,
// //       message: "Comment added successfully",
// //       comment: populatedComment,
// //     });
// //   } catch (error) {
// //     console.error(
// //       "Create Task Comment Error:",
// //       error
// //     );

// //     return res.status(500).json({
// //       success: false,
// //       message:
// //         "Server error while creating comment",
// //     });
// //   }
// // };

// // // =====================================================
// // // GET TASK COMMENTS
// // // GET /api/comments/task/:taskId
// // // =====================================================

// // const getTaskComments = async (req, res) => {
// //   try {
// //     const taskId = req.params.taskId;

// //     const task = await Task.findById(taskId);

// //     if (!task) {
// //       return res.status(404).json({
// //         success: false,
// //         message: "Task not found",
// //       });
// //     }

// //     // Check project access
// //     const project = await Project.findOne({
// //       _id: task.project,
// //       $or: [
// //         {
// //           owner: req.user._id,
// //         },
// //         {
// //           members: req.user._id,
// //         },
// //       ],
// //     });

// //     if (!project) {
// //       return res.status(403).json({
// //         success: false,
// //         message: "You don't have access to this task",
// //       });
// //     }

// //     const comments = await Comment.find({
// //       task: taskId,
// //     })
// //       .populate(
// //         "createdBy",
// //         "name username email"
// //       )
// //       .populate(
// //         "task",
// //         "title status"
// //       )
// //       .sort({
// //         createdAt: 1,
// //       });

// //     return res.status(200).json({
// //       success: true,
// //       count: comments.length,
// //       comments,
// //     });
// //   } catch (error) {
// //     console.error(
// //       "Get Task Comments Error:",
// //       error
// //     );

// //     return res.status(500).json({
// //       success: false,
// //       message:
// //         "Server error while fetching task comments",
// //     });
// //   }
// // };

// // // =====================================================
// // // CREATE PROJECT COMMENT
// // // POST /api/comments/project/:projectId
// // // =====================================================

// // const createProjectComment = async (req, res) => {
// //   try {
// //     const { content } = req.body;
// //     const projectId = req.params.projectId;

// //     // -------------------------------------------------
// //     // VALIDATE CONTENT
// //     // -------------------------------------------------

// //     if (!content || !content.trim()) {
// //       return res.status(400).json({
// //         success: false,
// //         message: "Comment content is required",
// //       });
// //     }

// //     // -------------------------------------------------
// //     // CHECK PROJECT + USER ACCESS
// //     // -------------------------------------------------

// //     const project = await Project.findOne({
// //       _id: projectId,
// //       $or: [
// //         {
// //           owner: req.user._id,
// //         },
// //         {
// //           members: req.user._id,
// //         },
// //       ],
// //     });

// //     if (!project) {
// //       return res.status(404).json({
// //         success: false,
// //         message:
// //           "Project not found or you don't have access",
// //       });
// //     }

// //     // -------------------------------------------------
// //     // CREATE COMMENT
// //     // -------------------------------------------------

// //     const comment = await Comment.create({
// //       content: content.trim(),
// //       project: projectId,
// //       createdBy: req.user._id,
// //     });

// //     // -------------------------------------------------
// //     // POPULATE COMMENT
// //     // -------------------------------------------------

// //     const populatedComment =
// //       await Comment.findById(comment._id)
// //         .populate(
// //           "createdBy",
// //           "name username email"
// //         )
// //         .populate(
// //           "project",
// //           "name title"
// //         );

// //     // -------------------------------------------------
// //     // RESPONSE
// //     // -------------------------------------------------

// //     return res.status(201).json({
// //       success: true,
// //       message: "Comment added successfully",
// //       comment: populatedComment,
// //     });
// //   } catch (error) {
// //     console.error(
// //       "Create Project Comment Error:",
// //       error
// //     );

// //     return res.status(500).json({
// //       success: false,
// //       message:
// //         "Server error while creating project comment",
// //     });
// //   }
// // };

// // // =====================================================
// // // GET PROJECT COMMENTS
// // // GET /api/comments/project/:projectId
// // // =====================================================

// // const getProjectComments = async (req, res) => {
// //   try {
// //     const projectId = req.params.projectId;

// //     // -------------------------------------------------
// //     // CHECK PROJECT + USER ACCESS
// //     // -------------------------------------------------

// //     const project = await Project.findOne({
// //       _id: projectId,
// //       $or: [
// //         {
// //           owner: req.user._id,
// //         },
// //         {
// //           members: req.user._id,
// //         },
// //       ],
// //     });

// //     if (!project) {
// //       return res.status(404).json({
// //         success: false,
// //         message:
// //           "Project not found or you don't have access",
// //       });
// //     }

// //     // -------------------------------------------------
// //     // GET COMMENTS
// //     // -------------------------------------------------

// //     const comments = await Comment.find({
// //       project: projectId,
// //       task: null,
// //     })
// //       .populate(
// //         "createdBy",
// //         "name username email"
// //       )
// //       .populate(
// //         "project",
// //         "name title"
// //       )
// //       .sort({
// //         createdAt: 1,
// //       });

// //     // -------------------------------------------------
// //     // RESPONSE
// //     // -------------------------------------------------

// //     return res.status(200).json({
// //       success: true,
// //       count: comments.length,
// //       comments,
// //     });
// //   } catch (error) {
// //     console.error(
// //       "Get Project Comments Error:",
// //       error
// //     );

// //     return res.status(500).json({
// //       success: false,
// //       message:
// //         "Server error while fetching project comments",
// //     });
// //   }
// // };

// // // =====================================================
// // // GET SINGLE COMMENT
// // // GET /api/comments/:id
// // // =====================================================

// // const getComment = async (req, res) => {
// //   try {
// //     const comment = await Comment.findById(
// //       req.params.id
// //     )
// //       .populate(
// //         "createdBy",
// //         "name username email"
// //       )
// //       .populate(
// //         "task",
// //         "title status"
// //       )
// //       .populate(
// //         "project",
// //         "name title"
// //       );

// //     if (!comment) {
// //       return res.status(404).json({
// //         success: false,
// //         message: "Comment not found",
// //       });
// //     }

// //     // -------------------------------------------------
// //     // CHECK PROJECT ACCESS
// //     // -------------------------------------------------

// //     const project = await Project.findOne({
// //       _id: comment.project,
// //       $or: [
// //         {
// //           owner: req.user._id,
// //         },
// //         {
// //           members: req.user._id,
// //         },
// //       ],
// //     });

// //     if (!project) {
// //       return res.status(403).json({
// //         success: false,
// //         message:
// //           "You don't have access to this comment",
// //       });
// //     }

// //     return res.status(200).json({
// //       success: true,
// //       comment,
// //     });
// //   } catch (error) {
// //     console.error(
// //       "Get Comment Error:",
// //       error
// //     );

// //     return res.status(500).json({
// //       success: false,
// //       message:
// //         "Server error while fetching comment",
// //     });
// //   }
// // };

// // // =====================================================
// // // UPDATE COMMENT
// // // PUT /api/comments/:id
// // // =====================================================

// // const updateComment = async (req, res) => {
// //   try {
// //     const { content } = req.body;

// //     // -------------------------------------------------
// //     // VALIDATE CONTENT
// //     // -------------------------------------------------

// //     if (!content || !content.trim()) {
// //       return res.status(400).json({
// //         success: false,
// //         message: "Comment content is required",
// //       });
// //     }

// //     // -------------------------------------------------
// //     // FIND COMMENT
// //     // -------------------------------------------------

// //     const comment = await Comment.findById(
// //       req.params.id
// //     );

// //     if (!comment) {
// //       return res.status(404).json({
// //         success: false,
// //         message: "Comment not found",
// //       });
// //     }

// //     // -------------------------------------------------
// //     // ONLY CREATOR CAN EDIT
// //     // -------------------------------------------------

// //     if (
// //       comment.createdBy.toString() !==
// //       req.user._id.toString()
// //     ) {
// //       return res.status(403).json({
// //         success: false,
// //         message:
// //           "Only comment creator can update this comment",
// //       });
// //     }

// //     // -------------------------------------------------
// //     // UPDATE
// //     // -------------------------------------------------

// //     comment.content = content.trim();

// //     await comment.save();

// //     // -------------------------------------------------
// //     // POPULATE UPDATED COMMENT
// //     // -------------------------------------------------

// //     const updatedComment =
// //       await Comment.findById(comment._id)
// //         .populate(
// //           "createdBy",
// //           "name username email"
// //         )
// //         .populate(
// //           "task",
// //           "title status"
// //         )
// //         .populate(
// //           "project",
// //           "name title"
// //         );

// //     return res.status(200).json({
// //       success: true,
// //       message: "Comment updated successfully",
// //       comment: updatedComment,
// //     });
// //   } catch (error) {
// //     console.error(
// //       "Update Comment Error:",
// //       error
// //     );

// //     return res.status(500).json({
// //       success: false,
// //       message:
// //         "Server error while updating comment",
// //     });
// //   }
// // };

// // // =====================================================
// // // DELETE COMMENT
// // // DELETE /api/comments/:id
// // // =====================================================

// // const deleteComment = async (req, res) => {
// //   try {
// //     // -------------------------------------------------
// //     // FIND COMMENT
// //     // -------------------------------------------------

// //     const comment = await Comment.findById(
// //       req.params.id
// //     );

// //     if (!comment) {
// //       return res.status(404).json({
// //         success: false,
// //         message: "Comment not found",
// //       });
// //     }

// //     // -------------------------------------------------
// //     // FIND PROJECT
// //     // -------------------------------------------------

// //     const project = await Project.findById(
// //       comment.project
// //     );

// //     if (!project) {
// //       return res.status(404).json({
// //         success: false,
// //         message: "Project not found",
// //       });
// //     }

// //     // -------------------------------------------------
// //     // PERMISSIONS
// //     // -------------------------------------------------

// //     const isCommentOwner =
// //       comment.createdBy.toString() ===
// //       req.user._id.toString();

// //     const isProjectOwner =
// //       project.owner.toString() ===
// //       req.user._id.toString();

// //     // Comment creator OR project owner
// //     // can delete comment

// //     if (
// //       !isCommentOwner &&
// //       !isProjectOwner
// //     ) {
// //       return res.status(403).json({
// //         success: false,
// //         message:
// //           "You don't have permission to delete this comment",
// //       });
// //     }

// //     // -------------------------------------------------
// //     // DELETE
// //     // -------------------------------------------------

// //     await Comment.findByIdAndDelete(
// //       comment._id
// //     );

// //     return res.status(200).json({
// //       success: true,
// //       message: "Comment deleted successfully",
// //     });
// //   } catch (error) {
// //     console.error(
// //       "Delete Comment Error:",
// //       error
// //     );

// //     return res.status(500).json({
// //       success: false,
// //       message:
// //         "Server error while deleting comment",
// //     });
// //   }
// // };

// // // =====================================================
// // // EXPORT
// // // =====================================================

// // module.exports = {
// //   // Task comments
// //   createComment,
// //   getTaskComments,

// //   // Project comments
// //   createProjectComment,
// //   getProjectComments,

// //   // Common
// //   getComment,
// //   updateComment,
// //   deleteComment,
// // };



// const Comment = require("../models/Comment");
// const Task = require("../models/Task");
// const Project = require("../models/Project");
// const {
//   createNotification,
// } = require("../services/notificationService");
// // =====================================================
// // HELPER — CHECK PROJECT ACCESS
// // =====================================================

// const checkProjectAccess = async (
//   projectId,
//   userId
// ) => {
//   if (!projectId || !userId) {
//     return null;
//   }

//   const project = await Project.findOne({
//     _id: projectId,
//     $or: [
//       {
//         owner: userId,
//       },
//       {
//         members: userId,
//       },
//     ],
//   });

//   return project;
// };

// // =====================================================
// // HELPER — POPULATE COMMENT
// // =====================================================

// const populateComment = (query) => {
//   return query
//     .populate(
//       "createdBy",
//       "name username email avatar"
//     )
//     .populate(
//       "task",
//       "title status"
//     )
//     .populate(
//       "project",
//       "name title"
//     );
// };

// // =====================================================
// // CREATE TASK COMMENT
// // POST /api/comments/task/:taskId
// // =====================================================


// const createComment = async (req, res) => {
//   try {
//     const { content } = req.body;
//     const taskId = req.params.taskId;

//     // -------------------------------------------------
//     // VALIDATE CONTENT
//     // -------------------------------------------------

//     if (
//       typeof content !== "string" ||
//       !content.trim()
//     ) {
//       return res.status(400).json({
//         success: false,
//         message: "Comment content is required",
//       });
//     }

//     if (content.trim().length > 2000) {
//       return res.status(400).json({
//         success: false,
//         message:
//           "Comment cannot exceed 2000 characters",
//       });
//     }

//     // -------------------------------------------------
//     // FIND TASK
//     // -------------------------------------------------

//     const task = await Task.findById(taskId);

//     if (!task) {
//       return res.status(404).json({
//         success: false,
//         message: "Task not found",
//       });
//     }

//     // -------------------------------------------------
//     // CHECK PROJECT ACCESS
//     // -------------------------------------------------

//     const project = await checkProjectAccess(
//       task.project,
//       req.user._id
//     );

//     if (!project) {
//       return res.status(403).json({
//         success: false,
//         message:
//           "You don't have access to this task",
//       });
//     }

//     // -------------------------------------------------
//     // CREATE COMMENT
//     // -------------------------------------------------

//     const comment = await Comment.create({
//       content: content.trim(),
//       task: taskId,
//       project: task.project,
//       createdBy: req.user._id,
//     });

//     // =================================================
//     // NOTIFICATION: TASK COMMENT
//     // =================================================

//     const recipients = new Set();

//     // -----------------------------------------------
//     // TASK CREATOR
//     // -----------------------------------------------

//     if (
//       task.createdBy &&
//       task.createdBy.toString() !==
//         req.user._id.toString()
//     ) {
//       recipients.add(
//         task.createdBy.toString()
//       );
//     }

//     // -----------------------------------------------
//     // ASSIGNED USER
//     // -----------------------------------------------

//     if (
//       task.assignedTo &&
//       task.assignedTo.toString() !==
//         req.user._id.toString()
//     ) {
//       recipients.add(
//         task.assignedTo.toString()
//       );
//     }

//     // -----------------------------------------------
//     // CREATE NOTIFICATION FOR EACH USER
//     // -----------------------------------------------

//     for (const recipient of recipients) {
//       try {
//         await createNotification({
//           recipient,
//           sender: req.user._id,

//           type: "COMMENT_ADDED",

//           title: "New Task Comment",

//           message: `${
//             req.user.name || "Someone"
//           } commented on the task "${task.title}".`,

//           project: task.project,
//           task: task._id,
//           comment: comment._id,
//         });
//       } catch (notificationError) {
//         console.error(
//           "Task Comment Notification Error:",
//           notificationError
//         );

//         // Notification fail hone par
//         // comment creation fail nahi hoga.
//       }
//     }

//     // -------------------------------------------------
//     // POPULATE COMMENT
//     // -------------------------------------------------

//     const populatedComment =
//       await populateComment(
//         Comment.findById(comment._id)
//       );

//     // -------------------------------------------------
//     // RESPONSE
//     // -------------------------------------------------

//     return res.status(201).json({
//       success: true,
//       message: "Comment added successfully",
//       comment: populatedComment,
//     });

//   } catch (error) {
//     console.error(
//       "Create Task Comment Error:",
//       error
//     );

//     return res.status(500).json({
//       success: false,
//       message:
//         "Server error while creating comment",
//     });
//   }
// };



// // =====================================================
// // GET TASK COMMENTS
// // GET /api/comments/task/:taskId
// // =====================================================

// const getTaskComments = async (
//   req,
//   res
// ) => {
//   try {
//     const taskId =
//       req.params.taskId;

//     // -------------------------------------------------
//     // FIND TASK
//     // -------------------------------------------------

//     const task =
//       await Task.findById(taskId);

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
//       await checkProjectAccess(
//         task.project,
//         req.user._id
//       );

//     if (!project) {
//       return res.status(403).json({
//         success: false,
//         message:
//           "You don't have access to this task",
//       });
//     }

//     // -------------------------------------------------
//     // GET COMMENTS
//     // -------------------------------------------------

//     const comments =
//       await populateComment(
//         Comment.find({
//           task: taskId,
//         }).sort({
//           createdAt: 1,
//         })
//       );

//     // -------------------------------------------------
//     // RESPONSE
//     // -------------------------------------------------

//     return res.status(200).json({
//       success: true,
//       count: comments.length,
//       comments,
//     });
//   } catch (error) {
//     console.error(
//       "Get Task Comments Error:",
//       error
//     );

//     return res.status(500).json({
//       success: false,
//       message:
//         "Server error while fetching task comments",
//     });
//   }
// };

// // =====================================================
// // CREATE PROJECT COMMENT
// // POST /api/comments/project/:projectId
// // =====================================================

// const createProjectComment = async (
//   req,
//   res
// ) => {
//   try {
//     const { content } = req.body;
//     const projectId =
//       req.params.projectId;

//     // -------------------------------------------------
//     // VALIDATE CONTENT
//     // -------------------------------------------------

//     if (
//       typeof content !== "string" ||
//       !content.trim()
//     ) {
//       return res.status(400).json({
//         success: false,
//         message:
//           "Comment content is required",
//       });
//     }

//     if (content.trim().length > 2000) {
//       return res.status(400).json({
//         success: false,
//         message:
//           "Comment cannot exceed 2000 characters",
//       });
//     }

//     // -------------------------------------------------
//     // CHECK PROJECT ACCESS
//     // -------------------------------------------------

//     const project =
//       await checkProjectAccess(
//         projectId,
//         req.user._id
//       );

//     if (!project) {
//       return res.status(403).json({
//         success: false,
//         message:
//           "Project not found or you don't have access",
//       });
//     }

//     // -------------------------------------------------
//     // CREATE COMMENT
//     // -------------------------------------------------

//     const comment =
//       await Comment.create({
//         content: content.trim(),
//         project: projectId,
//         createdBy: req.user._id,
//       });

//     // =====================================================
//     // NOTIFICATION: PROJECT COMMENT ADDED
//     // =====================================================

//     try {
//       const recipients = [
//         project.owner,
//         ...project.members,
//       ];

//       // Remove current commenter
//       const uniqueRecipients = [
//         ...new Set(
//           recipients
//             .map((id) => id.toString())
//             .filter(
//               (id) =>
//                 id !==
//                 req.user._id.toString()
//             )
//         ),
//       ];

//       // Send notification to owner + members
//       await Promise.all(
//         uniqueRecipients.map(
//           (recipientId) =>
//             createNotification({
//               recipient: recipientId,
//               sender: req.user._id,

//               type:
//                 "PROJECT_COMMENT_ADDED",

//               title:
//                 "New Project Comment",

//               message: `A new comment was added to the project "${project.name}".`,

//               project: project._id,
//             })
//         )
//       );
//     } catch (notificationError) {
//       console.error(
//         "Project Comment Notification Error:",
//         notificationError
//       );

//       // Notification fail hone par
//       // comment creation fail nahi hoga.
//     }

//     // -------------------------------------------------
//     // POPULATE
//     // -------------------------------------------------

//     const populatedComment =
//       await populateComment(
//         Comment.findById(
//           comment._id
//         )
//       );

//     // -------------------------------------------------
//     // RESPONSE
//     // -------------------------------------------------

//     return res.status(201).json({
//       success: true,
//       message:
//         "Comment added successfully",
//       comment: populatedComment,
//     });

//   } catch (error) {
//     console.error(
//       "Create Project Comment Error:",
//       error
//     );

//     return res.status(500).json({
//       success: false,
//       message:
//         "Server error while creating project comment",
//     });
//   }
// };

// // =====================================================
// // GET PROJECT COMMENTS
// // GET /api/comments/project/:projectId
// // =====================================================

// const getProjectComments = async (
//   req,
//   res
// ) => {
//   try {
//     const projectId =
//       req.params.projectId;

//     // -------------------------------------------------
//     // CHECK PROJECT ACCESS
//     // -------------------------------------------------

//     const project =
//       await checkProjectAccess(
//         projectId,
//         req.user._id
//       );

//     if (!project) {
//       return res.status(403).json({
//         success: false,
//         message:
//           "Project not found or you don't have access",
//       });
//     }

//     // -------------------------------------------------
//     // GET PROJECT COMMENTS
//     // -------------------------------------------------

//     const comments =
//       await populateComment(
//         Comment.find({
//           project: projectId,
//           task: null,
//         }).sort({
//           createdAt: 1,
//         })
//       );

//     // -------------------------------------------------
//     // RESPONSE
//     // -------------------------------------------------

//     return res.status(200).json({
//       success: true,
//       count: comments.length,
//       comments,
//     });
//   } catch (error) {
//     console.error(
//       "Get Project Comments Error:",
//       error
//     );

//     return res.status(500).json({
//       success: false,
//       message:
//         "Server error while fetching project comments",
//     });
//   }
// };

// // =====================================================
// // GET SINGLE COMMENT
// // GET /api/comments/:id
// // =====================================================

// const getComment = async (
//   req,
//   res
// ) => {
//   try {
//     // -------------------------------------------------
//     // FIND COMMENT
//     // -------------------------------------------------

//     const comment =
//       await populateComment(
//         Comment.findById(
//           req.params.id
//         )
//       );

//     if (!comment) {
//       return res.status(404).json({
//         success: false,
//         message: "Comment not found",
//       });
//     }

//     // -------------------------------------------------
//     // CHECK PROJECT ACCESS
//     // -------------------------------------------------

//     const project =
//       await checkProjectAccess(
//         comment.project?._id ||
//           comment.project,
//         req.user._id
//       );

//     if (!project) {
//       return res.status(403).json({
//         success: false,
//         message:
//           "You don't have access to this comment",
//       });
//     }

//     // -------------------------------------------------
//     // RESPONSE
//     // -------------------------------------------------

//     return res.status(200).json({
//       success: true,
//       comment,
//     });
//   } catch (error) {
//     console.error(
//       "Get Comment Error:",
//       error
//     );

//     return res.status(500).json({
//       success: false,
//       message:
//         "Server error while fetching comment",
//     });
//   }
// };

// // =====================================================
// // UPDATE COMMENT
// // PUT /api/comments/:id
// // =====================================================
// //
// // ONLY COMMENT CREATOR CAN UPDATE
// //
// // =====================================================

// const updateComment = async (
//   req,
//   res
// ) => {
//   try {
//     const { content } = req.body;
//     const commentId =
//       req.params.id;

//     // -------------------------------------------------
//     // VALIDATE CONTENT
//     // -------------------------------------------------

//     if (
//       typeof content !== "string" ||
//       !content.trim()
//     ) {
//       return res.status(400).json({
//         success: false,
//         message:
//           "Comment content is required",
//       });
//     }

//     if (content.trim().length > 2000) {
//       return res.status(400).json({
//         success: false,
//         message:
//           "Comment cannot exceed 2000 characters",
//       });
//     }

//     // -------------------------------------------------
//     // FIND COMMENT
//     // -------------------------------------------------

//     const comment =
//       await Comment.findById(
//         commentId
//       );

//     if (!comment) {
//       return res.status(404).json({
//         success: false,
//         message: "Comment not found",
//       });
//     }

//     // -------------------------------------------------
//     // COMMENT CREATOR CHECK
//     // -------------------------------------------------

//     const commentOwnerId =
//       comment.createdBy?.toString();

//     const currentUserId =
//       req.user._id.toString();

//     if (
//       commentOwnerId !==
//       currentUserId
//     ) {
//       return res.status(403).json({
//         success: false,
//         message:
//           "Only comment creator can update this comment",
//       });
//     }

//     // -------------------------------------------------
//     // OPTIONAL PROJECT ACCESS CHECK
//     // -------------------------------------------------

//     const project =
//       await checkProjectAccess(
//         comment.project,
//         req.user._id
//       );

//     if (!project) {
//       return res.status(403).json({
//         success: false,
//         message:
//           "You don't have access to this project",
//       });
//     }

//     // -------------------------------------------------
//     // UPDATE
//     // -------------------------------------------------

//     comment.content =
//       content.trim();

//     await comment.save();

//     // -------------------------------------------------
//     // GET UPDATED COMMENT
//     // -------------------------------------------------

//     const updatedComment =
//       await populateComment(
//         Comment.findById(
//           comment._id
//         )
//       );

//     // -------------------------------------------------
//     // RESPONSE
//     // -------------------------------------------------

//     return res.status(200).json({
//       success: true,
//       message:
//         "Comment updated successfully",
//       comment: updatedComment,
//     });
//   } catch (error) {
//     console.error(
//       "Update Comment Error:",
//       error
//     );

//     return res.status(500).json({
//       success: false,
//       message:
//         "Server error while updating comment",
//     });
//   }
// };

// // =====================================================
// // DELETE COMMENT
// // DELETE /api/comments/:id
// // =====================================================
// //
// // COMMENT CREATOR  → CAN DELETE
// // PROJECT OWNER    → CAN DELETE
// // OTHER MEMBERS   → CANNOT DELETE
// //
// // =====================================================

// const deleteComment = async (
//   req,
//   res
// ) => {
//   try {
//     const commentId =
//       req.params.id;

//     // -------------------------------------------------
//     // FIND COMMENT
//     // -------------------------------------------------

//     const comment =
//       await Comment.findById(
//         commentId
//       );

//     if (!comment) {
//       return res.status(404).json({
//         success: false,
//         message: "Comment not found",
//       });
//     }

//     // -------------------------------------------------
//     // FIND PROJECT
//     // -------------------------------------------------

//     const project =
//       await Project.findById(
//         comment.project
//       );

//     if (!project) {
//       return res.status(404).json({
//         success: false,
//         message: "Project not found",
//       });
//     }

//     // -------------------------------------------------
//     // CURRENT USER ID
//     // -------------------------------------------------

//     const currentUserId =
//       req.user._id.toString();

//     // -------------------------------------------------
//     // COMMENT CREATOR
//     // -------------------------------------------------

//     const commentOwnerId =
//       comment.createdBy?.toString();

//     const isCommentOwner =
//       Boolean(
//         commentOwnerId &&
//           commentOwnerId ===
//             currentUserId
//       );

//     // -------------------------------------------------
//     // PROJECT OWNER
//     // -------------------------------------------------

//     const projectOwnerId =
//       project.owner?.toString();

//     const isProjectOwner =
//       Boolean(
//         projectOwnerId &&
//           projectOwnerId ===
//             currentUserId
//       );

//     // -------------------------------------------------
//     // PERMISSION
//     // -------------------------------------------------

//     if (
//       !isCommentOwner &&
//       !isProjectOwner
//     ) {
//       return res.status(403).json({
//         success: false,
//         message:
//           "You don't have permission to delete this comment",
//       });
//     }

//     // -------------------------------------------------
//     // DELETE
//     // -------------------------------------------------

//     await Comment.findByIdAndDelete(
//       commentId
//     );

//     // -------------------------------------------------
//     // RESPONSE
//     // -------------------------------------------------

//     return res.status(200).json({
//       success: true,
//       message:
//         "Comment deleted successfully",
//       commentId,
//     });
//   } catch (error) {
//     console.error(
//       "Delete Comment Error:",
//       error
//     );

//     return res.status(500).json({
//       success: false,
//       message:
//         "Server error while deleting comment",
//     });
//   }
// };

// // =====================================================
// // EXPORT
// // =====================================================

// module.exports = {
//   // Task comments
//   createComment,
//   getTaskComments,

//   // Project comments
//   createProjectComment,
//   getProjectComments,

//   // Common
//   getComment,
//   updateComment,
//   deleteComment,
// };



const Comment = require("../models/Comment");
const Task = require("../models/Task");
const Project = require("../models/Project");

const {
  createNotification,
} = require("../services/notificationService");

// =====================================================
// PROJECT ACCESS HELPER
// =====================================================
//
// OWNER  → Own projects
// ADMIN  → All projects
// MEMBER → Assigned project
// MANAGER → Assigned project
// VIEWER → Assigned project (READ ONLY)
// =====================================================

const checkProjectAccess = async (projectId, user) => {
  if (!projectId || !user?._id) {
    return null;
  }

  const userId = user._id;

  // ADMIN → ACCESS TO ALL PROJECTS
  if (user.role === "ADMIN") {
    return await Project.findById(projectId);
  }

  // OWNER / MEMBER / MANAGER / VIEWER
  return await Project.findOne({
    _id: projectId,
    $or: [
      {
        owner: userId,
      },
      {
        members: userId,
      },
    ],
  });
};

// =====================================================
// COMMENT WRITE PERMISSION
// =====================================================
//
// OWNER  → YES
// ADMIN  → YES
// MANAGER → YES
// MEMBER → YES
// VIEWER → NO
// =====================================================

const canCreateComment = (user) => {
  if (!user) {
    return false;
  }

  const allowedRoles = [
    "OWNER",
    "ADMIN",
    "MANAGER",
    "MEMBER",
  ];

  return allowedRoles.includes(user.role);
};

// =====================================================
// COMMENT EDIT PERMISSION
// =====================================================

const canEditComment = (user, comment) => {
  if (!user || !comment) {
    return false;
  }

  // ADMIN can edit any comment
  if (user.role === "ADMIN") {
    return true;
  }

  // Comment creator can edit own comment
  return (
    comment.createdBy?.toString() ===
    user._id.toString()
  );
};

// =====================================================
// COMMENT DELETE PERMISSION
// =====================================================

const canDeleteComment = (user, comment, project) => {
  if (!user || !comment || !project) {
    return false;
  }

  const userId = user._id.toString();

  const commentOwner =
    comment.createdBy?.toString() === userId;

  const projectOwner =
    project.owner?.toString() === userId;

  const admin = user.role === "ADMIN";

  return (
    commentOwner ||
    projectOwner ||
    admin
  );
};

// =====================================================
// POPULATE COMMENT
// =====================================================

const populateComment = (query) => {
  return query
    .populate(
      "createdBy",
      "name username email avatar role"
    )
    .populate(
      "task",
      "title status"
    )
    .populate(
      "project",
      "name title"
    );
};

// =====================================================
// CREATE TASK COMMENT
// POST /api/comments/task/:taskId
// =====================================================

const createComment = async (req, res) => {
  try {
    const { content } = req.body;
    const taskId = req.params.taskId;

    // =================================================
    // VALIDATE CONTENT
    // =================================================

    if (
      typeof content !== "string" ||
      !content.trim()
    ) {
      return res.status(400).json({
        success: false,
        message: "Comment content is required",
      });
    }

    if (content.trim().length > 2000) {
      return res.status(400).json({
        success: false,
        message:
          "Comment cannot exceed 2000 characters",
      });
    }

    // =================================================
    // CHECK COMMENT WRITE PERMISSION
    // =================================================

    if (!canCreateComment(req.user)) {
      return res.status(403).json({
        success: false,
        message:
          "You have view-only access to this project",
      });
    }

    // =================================================
    // FIND TASK
    // =================================================

    const task = await Task.findById(taskId);

    if (!task) {
      return res.status(404).json({
        success: false,
        message: "Task not found",
      });
    }

    // =================================================
    // CHECK PROJECT ACCESS
    // =================================================

    const project = await checkProjectAccess(
      task.project,
      req.user
    );

    if (!project) {
      return res.status(403).json({
        success: false,
        message:
          "You don't have access to this task",
      });
    }

    // =================================================
    // CREATE COMMENT
    // =================================================

    const comment = await Comment.create({
      content: content.trim(),
      task: taskId,
      project: task.project,
      createdBy: req.user._id,
    });

    // =================================================
    // NOTIFICATIONS
    // =================================================

    const recipients = new Set();

    // TASK CREATOR
    if (
      task.createdBy &&
      task.createdBy.toString() !==
        req.user._id.toString()
    ) {
      recipients.add(
        task.createdBy.toString()
      );
    }

    // ASSIGNED USER
    if (
      task.assignedTo &&
      task.assignedTo.toString() !==
        req.user._id.toString()
    ) {
      recipients.add(
        task.assignedTo.toString()
      );
    }

    // PROJECT OWNER
    if (
      project.owner &&
      project.owner.toString() !==
        req.user._id.toString()
    ) {
      recipients.add(
        project.owner.toString()
      );
    }

    // PROJECT MEMBERS
    if (Array.isArray(project.members)) {
      project.members.forEach((memberId) => {
        if (
          memberId &&
          memberId.toString() !==
            req.user._id.toString()
        ) {
          recipients.add(
            memberId.toString()
          );
        }
      });
    }

    // SEND NOTIFICATIONS
    for (const recipient of recipients) {
      try {
        await createNotification({
          recipient,
          sender: req.user._id,
          type: "COMMENT_ADDED",
          title: "New Task Comment",

          message: `${
            req.user.name || "Someone"
          } commented on the task "${task.title}".`,

          project: task.project,
          task: task._id,
          comment: comment._id,
        });
      } catch (notificationError) {
        console.error(
          "Task Comment Notification Error:",
          notificationError
        );
      }
    }

    // =================================================
    // POPULATE
    // =================================================

    const populatedComment =
      await populateComment(
        Comment.findById(comment._id)
      );

    return res.status(201).json({
      success: true,
      message: "Comment added successfully",
      comment: populatedComment,
    });

  } catch (error) {
    console.error(
      "Create Task Comment Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Server error while creating comment",
    });
  }
};

// =====================================================
// GET TASK COMMENTS
// GET /api/comments/task/:taskId
// =====================================================

const getTaskComments = async (req, res) => {
  try {
    const taskId = req.params.taskId;

    const task = await Task.findById(taskId);

    if (!task) {
      return res.status(404).json({
        success: false,
        message: "Task not found",
      });
    }

    const project =
      await checkProjectAccess(
        task.project,
        req.user
      );

    if (!project) {
      return res.status(403).json({
        success: false,
        message:
          "You don't have access to this task",
      });
    }

    const comments =
      await populateComment(
        Comment.find({
          task: taskId,
        }).sort({
          createdAt: 1,
        })
      );

    return res.status(200).json({
      success: true,
      count: comments.length,
      comments,
    });

  } catch (error) {
    console.error(
      "Get Task Comments Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Server error while fetching task comments",
    });
  }
};

// =====================================================
// CREATE PROJECT COMMENT
// POST /api/comments/project/:projectId
// =====================================================

const createProjectComment = async (
  req,
  res
) => {
  try {
    const { content } = req.body;
    const projectId = req.params.projectId;

    // =================================================
    // VALIDATE
    // =================================================

    if (
      typeof content !== "string" ||
      !content.trim()
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Comment content is required",
      });
    }

    if (content.trim().length > 2000) {
      return res.status(400).json({
        success: false,
        message:
          "Comment cannot exceed 2000 characters",
      });
    }

    // =================================================
    // COMMENT PERMISSION
    // =================================================

    if (!canCreateComment(req.user)) {
      return res.status(403).json({
        success: false,
        message:
          "You have view-only access to this project",
      });
    }

    // =================================================
    // PROJECT ACCESS
    // =================================================

    const project =
      await checkProjectAccess(
        projectId,
        req.user
      );

    if (!project) {
      return res.status(403).json({
        success: false,
        message:
          "Project not found or you don't have access",
      });
    }

    // =================================================
    // CREATE
    // =================================================

    const comment =
      await Comment.create({
        content: content.trim(),
        project: projectId,
        createdBy: req.user._id,
      });

    // =================================================
    // NOTIFICATIONS
    // =================================================

    try {
      const recipients = new Set();

      // PROJECT OWNER
      if (
        project.owner &&
        project.owner.toString() !==
          req.user._id.toString()
      ) {
        recipients.add(
          project.owner.toString()
        );
      }

      // PROJECT MEMBERS
      if (Array.isArray(project.members)) {
        project.members.forEach((memberId) => {
          if (
            memberId &&
            memberId.toString() !==
              req.user._id.toString()
          ) {
            recipients.add(
              memberId.toString()
            );
          }
        });
      }

      await Promise.all(
        [...recipients].map(
          (recipientId) =>
            createNotification({
              recipient: recipientId,
              sender: req.user._id,

              type:
                "PROJECT_COMMENT_ADDED",

              title:
                "New Project Comment",

              message: `${
                req.user.name || "Someone"
              } commented on the project "${project.name}".`,

              project: project._id,
              comment: comment._id,
            })
        )
      );

    } catch (notificationError) {
      console.error(
        "Project Comment Notification Error:",
        notificationError
      );
    }

    // =================================================
    // POPULATE
    // =================================================

    const populatedComment =
      await populateComment(
        Comment.findById(
          comment._id
        )
      );

    return res.status(201).json({
      success: true,
      message:
        "Comment added successfully",
      comment: populatedComment,
    });

  } catch (error) {
    console.error(
      "Create Project Comment Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Server error while creating project comment",
    });
  }
};

// =====================================================
// GET PROJECT COMMENTS
// GET /api/comments/project/:projectId
// =====================================================

const getProjectComments = async (
  req,
  res
) => {
  try {
    const projectId =
      req.params.projectId;

    const project =
      await checkProjectAccess(
        projectId,
        req.user
      );

    if (!project) {
      return res.status(403).json({
        success: false,
        message:
          "Project not found or you don't have access",
      });
    }

    const comments =
      await populateComment(
        Comment.find({
          project: projectId,
          task: null,
        }).sort({
          createdAt: 1,
        })
      );

    return res.status(200).json({
      success: true,
      count: comments.length,
      comments,
    });

  } catch (error) {
    console.error(
      "Get Project Comments Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Server error while fetching project comments",
    });
  }
};

// =====================================================
// GET SINGLE COMMENT
// GET /api/comments/:id
// =====================================================

const getComment = async (req, res) => {
  try {
    const comment =
      await populateComment(
        Comment.findById(
          req.params.id
        )
      );

    if (!comment) {
      return res.status(404).json({
        success: false,
        message: "Comment not found",
      });
    }

    const project =
      await checkProjectAccess(
        comment.project?._id ||
          comment.project,
        req.user
      );

    if (!project) {
      return res.status(403).json({
        success: false,
        message:
          "You don't have access to this comment",
      });
    }

    return res.status(200).json({
      success: true,
      comment,
    });

  } catch (error) {
    console.error(
      "Get Comment Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Server error while fetching comment",
    });
  }
};

// =====================================================
// UPDATE COMMENT
// PUT /api/comments/:id
// =====================================================

const updateComment = async (
  req,
  res
) => {
  try {
    const { content } = req.body;
    const commentId = req.params.id;

    if (
      typeof content !== "string" ||
      !content.trim()
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Comment content is required",
      });
    }

    if (content.trim().length > 2000) {
      return res.status(400).json({
        success: false,
        message:
          "Comment cannot exceed 2000 characters",
      });
    }

    const comment =
      await Comment.findById(
        commentId
      );

    if (!comment) {
      return res.status(404).json({
        success: false,
        message: "Comment not found",
      });
    }

    // PROJECT ACCESS
    const project =
      await checkProjectAccess(
        comment.project,
        req.user
      );

    if (!project) {
      return res.status(403).json({
        success: false,
        message:
          "You don't have access to this project",
      });
    }

    // EDIT PERMISSION
    if (
      !canEditComment(
        req.user,
        comment
      )
    ) {
      return res.status(403).json({
        success: false,
        message:
          "Only comment creator or admin can update this comment",
      });
    }

    comment.content =
      content.trim();

    await comment.save();

    const updatedComment =
      await populateComment(
        Comment.findById(
          comment._id
        )
      );

    return res.status(200).json({
      success: true,
      message:
        "Comment updated successfully",
      comment: updatedComment,
    });

  } catch (error) {
    console.error(
      "Update Comment Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Server error while updating comment",
    });
  }
};

// =====================================================
// DELETE COMMENT
// DELETE /api/comments/:id
// =====================================================

const deleteComment = async (
  req,
  res
) => {
  try {
    const commentId =
      req.params.id;

    const comment =
      await Comment.findById(
        commentId
      );

    if (!comment) {
      return res.status(404).json({
        success: false,
        message: "Comment not found",
      });
    }

    const project =
      await Project.findById(
        comment.project
      );

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found",
      });
    }

    // DELETE PERMISSION
    if (
      !canDeleteComment(
        req.user,
        comment,
        project
      )
    ) {
      return res.status(403).json({
        success: false,
        message:
          "You don't have permission to delete this comment",
      });
    }

    await Comment.findByIdAndDelete(
      commentId
    );

    return res.status(200).json({
      success: true,
      message:
        "Comment deleted successfully",
      commentId,
    });

  } catch (error) {
    console.error(
      "Delete Comment Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Server error while deleting comment",
    });
  }
};

// =====================================================
// EXPORT
// =====================================================

module.exports = {
  createComment,
  getTaskComments,

  createProjectComment,
  getProjectComments,

  getComment,
  updateComment,
  deleteComment,
};