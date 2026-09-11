// =====================================================
// NOTIFICATION SERVICE
// =====================================================

const Notification = require("../models/Notification");

// =====================================================
// CREATE NOTIFICATION
// =====================================================

/**
 * Creates a notification for a user.
 *
 * @param {Object} data
 * @param {String|ObjectId} data.recipient
 * @param {String|ObjectId|null} data.sender
 * @param {String} data.type
 * @param {String} data.title
 * @param {String} data.message
 * @param {String|ObjectId|null} data.project
 * @param {String|ObjectId|null} data.task
 * @param {String|ObjectId|null} data.comment
 *
 * @returns {Object} Created notification
 */

const createNotification = async ({
  recipient,
  sender = null,
  type = "GENERAL",
  title,
  message,
  project = null,
  task = null,
  comment = null,
}) => {
  try {
    // -------------------------------------------------
    // VALIDATION
    // -------------------------------------------------

    if (!recipient) {
      throw new Error(
        "Notification recipient is required"
      );
    }

    if (!title) {
      throw new Error(
        "Notification title is required"
      );
    }

    if (!message) {
      throw new Error(
        "Notification message is required"
      );
    }

    // -------------------------------------------------
    // CREATE NOTIFICATION
    // -------------------------------------------------

    const notification =
      await Notification.create({
        recipient,
        sender,
        type,
        title,
        message,
        project,
        task,
        comment,
      });

    // -------------------------------------------------
    // RETURN CREATED NOTIFICATION
    // -------------------------------------------------

    return notification;
  } catch (error) {
    console.error(
      "Create Notification Service Error:",
      error
    );

    throw error;
  }
};

// =====================================================
// CREATE MULTIPLE NOTIFICATIONS
// =====================================================

/**
 * Useful when the same event needs to notify
 * multiple users.
 *
 * Example:
 * A project has 5 members and all 5 members
 * should receive a notification.
 */

const createNotifications = async (
  notifications = []
) => {
  try {
    if (
      !Array.isArray(notifications) ||
      notifications.length === 0
    ) {
      return [];
    }

    const createdNotifications =
      await Notification.insertMany(
        notifications
      );

    return createdNotifications;
  } catch (error) {
    console.error(
      "Create Multiple Notifications Service Error:",
      error
    );

    throw error;
  }
};

// =====================================================
// DELETE USER NOTIFICATIONS
// =====================================================

/**
 * Deletes all notifications belonging to a user.
 */

const deleteUserNotifications = async (
  userId
) => {
  try {
    if (!userId) {
      throw new Error(
        "User ID is required"
      );
    }

    const result =
      await Notification.deleteMany({
        recipient: userId,
      });

    return result;
  } catch (error) {
    console.error(
      "Delete User Notifications Service Error:",
      error
    );

    throw error;
  }
};

// =====================================================
// EXPORT
// =====================================================

module.exports = {
  createNotification,
  createNotifications,
  deleteUserNotifications,
};