// =====================================================
// NOTIFICATION CONTROLLER
// =====================================================

const Notification = require("../models/Notification");



// =====================================================
// CREATE NOTIFICATION
// =====================================================


// =====================================================
// GET MY NOTIFICATIONS
// GET /api/notifications
// =====================================================

const getMyNotifications = async (req, res) => {
  try {
    const userId = req.user?._id || req.user?.id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }

    // -------------------------------------------------
    // PAGINATION
    // -------------------------------------------------

    const page = Math.max(
      Number.parseInt(req.query.page, 10) || 1,
      1
    );

    const limit = Math.min(
      Math.max(
        Number.parseInt(req.query.limit, 10) || 20,
        1
      ),
      100
    );

    const skip = (page - 1) * limit;

    // -------------------------------------------------
    // OPTIONAL FILTER
    // -------------------------------------------------

    const filter = {
      recipient: userId,
    };

    if (req.query.unread === "true") {
      filter.isRead = false;
    }

    // -------------------------------------------------
    // FETCH
    // -------------------------------------------------

    const [notifications, total] =
      await Promise.all([
        Notification.find(filter)
          .sort({ createdAt: -1 })
          .skip(skip)
          .limit(limit)
          .lean(),

        Notification.countDocuments(filter),
      ]);

    // -------------------------------------------------
    // UNREAD COUNT
    // -------------------------------------------------

    const unreadCount =
      await Notification.countDocuments({
        recipient: userId,
        isRead: false,
      });

    // -------------------------------------------------
    // RESPONSE
    // -------------------------------------------------

    return res.status(200).json({
      success: true,
      notifications,
      unreadCount,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
        hasNextPage:
          page < Math.ceil(total / limit),
        hasPreviousPage: page > 1,
      },
    });
  } catch (error) {
    console.error(
      "Get Notifications Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Unable to fetch notifications",
    });
  }
};

// =====================================================
// GET UNREAD NOTIFICATION COUNT
// GET /api/notifications/unread-count
// =====================================================

const getUnreadNotificationCount = async (
  req,
  res
) => {
  try {
    const userId = req.user?._id || req.user?.id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }

    const unreadCount =
      await Notification.countDocuments({
        recipient: userId,
        isRead: false,
      });

    return res.status(200).json({
      success: true,
      unreadCount,
    });
  } catch (error) {
    console.error(
      "Unread Notification Count Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Unable to fetch unread notification count",
    });
  }
};

// =====================================================
// MARK ONE NOTIFICATION AS READ
// PATCH /api/notifications/:notificationId/read
// =====================================================

const markNotificationAsRead = async (
  req,
  res
) => {
  try {
    const userId = req.user?._id || req.user?.id;

    const { notificationId } = req.params;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }

    if (!notificationId) {
      return res.status(400).json({
        success: false,
        message: "Notification ID is required",
      });
    }

    // -------------------------------------------------
    // FIND ONLY USER'S OWN NOTIFICATION
    // -------------------------------------------------

    const notification =
      await Notification.findOneAndUpdate(
        {
          _id: notificationId,
          recipient: userId,
        },
        {
          $set: {
            isRead: true,
            readAt: new Date(),
          },
        },
        {
          new: true,
        }
      );

    if (!notification) {
      return res.status(404).json({
        success: false,
        message: "Notification not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Notification marked as read",
      notification,
    });
  } catch (error) {
    console.error(
      "Mark Notification Read Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Unable to mark notification as read",
    });
  }
};

// =====================================================
// MARK ALL NOTIFICATIONS AS READ
// PATCH /api/notifications/read-all
// =====================================================

const markAllNotificationsAsRead = async (
  req,
  res
) => {
  try {
    const userId = req.user?._id || req.user?.id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }

    const result =
      await Notification.updateMany(
        {
          recipient: userId,
          isRead: false,
        },
        {
          $set: {
            isRead: true,
            readAt: new Date(),
          },
        }
      );

    return res.status(200).json({
      success: true,
      message:
        "All notifications marked as read",
      modifiedCount: result.modifiedCount,
    });
  } catch (error) {
    console.error(
      "Mark All Notifications Read Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Unable to mark all notifications as read",
    });
  }
};

// =====================================================
// DELETE ONE NOTIFICATION
// DELETE /api/notifications/:notificationId
// =====================================================

const deleteNotification = async (
  req,
  res
) => {
  try {
    const userId = req.user?._id || req.user?.id;

    const { notificationId } = req.params;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }

    if (!notificationId) {
      return res.status(400).json({
        success: false,
        message: "Notification ID is required",
      });
    }

    // -------------------------------------------------
    // DELETE ONLY USER'S OWN NOTIFICATION
    // -------------------------------------------------

    const notification =
      await Notification.findOneAndDelete({
        _id: notificationId,
        recipient: userId,
      });

    if (!notification) {
      return res.status(404).json({
        success: false,
        message: "Notification not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Notification deleted",
      notification,
    });
  } catch (error) {
    console.error(
      "Delete Notification Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Unable to delete notification",
    });
  }
};

// =====================================================
// DELETE ALL NOTIFICATIONS
// DELETE /api/notifications
// =====================================================

const deleteAllNotifications = async (
  req,
  res
) => {
  try {
    const userId = req.user?._id || req.user?.id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }

    const result =
      await Notification.deleteMany({
        recipient: userId,
      });

    return res.status(200).json({
      success: true,
      message: "All notifications deleted",
      deletedCount: result.deletedCount,
    });
  } catch (error) {
    console.error(
      "Delete All Notifications Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Unable to delete all notifications",
    });
  }
};

// =====================================================
// EXPORT
// =====================================================

module.exports = {
   
  getMyNotifications,
  getUnreadNotificationCount,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  deleteNotification,
  deleteAllNotifications,
};