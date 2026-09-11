// const mongoose = require("mongoose");

// const commentSchema = new mongoose.Schema(
//   {
//     content: {
//       type: String,
//       required: true,
//       trim: true,
//       maxlength: 2000,
//     },

//     task: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "Task",
//       required: true,
//     },

//     project: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "Project",
//       required: true,
//     },

//     createdBy: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "User",
//       required: true,
//     },
//   },
//   {
//     timestamps: true,
//   }
// );

// module.exports = mongoose.model(
//   "Comment",
//   commentSchema
// );

const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema(
  {
    content: {
      type: String,
      required: true,
      trim: true,
      maxlength: 2000,
    },

    task: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Task",
      required: false,
    },

    project: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
      required: true,
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model(
  "Comment",
  commentSchema
);