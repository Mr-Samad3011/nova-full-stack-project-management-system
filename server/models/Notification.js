const mongoose = require("mongoose");

// =====================================================
// NOTIFICATION SCHEMA
// =====================================================

const notificationSchema = new mongoose.Schema(
  {
    // ===================================================
    // RECIPIENT
    // User who will receive the notification
    // ===================================================

    recipient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    // ===================================================
    // SENDER
    // User who generated the notification
    // ===================================================

    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    // ===================================================
    // NOTIFICATION TYPE
    // ===================================================

    type: {
      type: String,
      enum: [
        "PROJECT_CREATED",
        "PROJECT_MEMBER_ADDED",
        "PROJECT_MEMBER_REMOVED",

        "TASK_CREATED",
        "TASK_ASSIGNED",
        "TASK_UPDATED",
        "TASK_STATUS_CHANGED",
        "TASK_DELETED",

        "COMMENT_CREATED",
        "COMMENT_UPDATED",
        "COMMENT_DELETED",

        "GENERAL",
      ],
      default: "GENERAL",
      required: true,
      index: true,
    },

    // ===================================================
    // TITLE
    // ===================================================

    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 200,
    },

    // ===================================================
    // MESSAGE
    // ===================================================

    message: {
      type: String,
      required: true,
      trim: true,
      maxlength: 1000,
    },

    // ===================================================
    // RELATED PROJECT
    // ===================================================

    project: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
      default: null,
      index: true,
    },

    // ===================================================
    // RELATED TASK
    // ===================================================

    task: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Task",
      default: null,
      index: true,
    },

    // ===================================================
    // RELATED COMMENT
    // ===================================================

    comment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Comment",
      default: null,
    },

    // ===================================================
    // READ STATUS
    // ===================================================

    isRead: {
      type: Boolean,
      default: false,
      index: true,
    },

    // ===================================================
    // READ TIME
    // ===================================================

    readAt: {
      type: Date,
      default: null,
    },
  },

  {
    timestamps: true,
  }
);

// =====================================================
// INDEXES
// =====================================================

// Latest notifications for a user
notificationSchema.index({
  recipient: 1,
  createdAt: -1,
});

// Unread notifications for a user
notificationSchema.index({
  recipient: 1,
  isRead: 1,
  createdAt: -1,
});

// =====================================================
// MARK AS READ METHOD
// =====================================================

notificationSchema.methods.markAsRead = function () {
  this.isRead = true;
  this.readAt = new Date();

  return this.save();
};

// =====================================================
// MARK AS UNREAD METHOD
// =====================================================

notificationSchema.methods.markAsUnread = function () {
  this.isRead = false;
  this.readAt = null;

  return this.save();
};

// =====================================================
// EXPORT
// =====================================================

module.exports = mongoose.model(
  "Notification",
  notificationSchema
);