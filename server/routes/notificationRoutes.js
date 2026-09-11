const express = require("express");

const router = express.Router();

// =====================================================
// AUTH MIDDLEWARE
// =====================================================

const { protect } = require("../middleware/authMiddleware");

// =====================================================
// NOTIFICATION CONTROLLER
// =====================================================

const {
    
  getMyNotifications,
  getUnreadNotificationCount,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  deleteNotification,
  deleteAllNotifications,
} = require("../controllers/notificationController");

// =====================================================
// GET MY NOTIFICATIONS
// GET /api/notifications
// =====================================================

router.get(
  "/",
  protect,
  getMyNotifications
);

// =====================================================
// GET UNREAD NOTIFICATION COUNT
// GET /api/notifications/unread-count
// =====================================================

router.get(
  "/unread-count",
  protect,
  getUnreadNotificationCount
);

// =====================================================
// MARK ALL NOTIFICATIONS AS READ
// PATCH /api/notifications/read-all
// =====================================================

router.patch(
  "/read-all",
  protect,
  markAllNotificationsAsRead
);

// =====================================================
// MARK ONE NOTIFICATION AS READ
// PATCH /api/notifications/:notificationId/read
// =====================================================

router.patch(
  "/:notificationId/read",
  protect,
  markNotificationAsRead
);

// =====================================================
// DELETE ALL NOTIFICATIONS
// DELETE /api/notifications
// =====================================================

router.delete(
  "/",
  protect,
  deleteAllNotifications
);

// =====================================================
// DELETE ONE NOTIFICATION
// DELETE /api/notifications/:notificationId
// =====================================================

router.delete(
  "/:notificationId",
  protect,
  deleteNotification
);

// =====================================================
// EXPORT
// =====================================================

module.exports = router;