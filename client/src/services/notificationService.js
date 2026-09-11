
import api from "../services/api";




// =====================================================
// GET NOTIFICATIONS
// =====================================================

/*
  GET /api/notifications

  Logged-in user ki notifications fetch karta hai.
*/

export const getNotifications = async () => {
  try {
    const response = await api.get("/notifications");

    return response.data;
  } catch (error) {
    console.error(
      "Get Notifications Error:",
      error
    );

    throw error;
  }
};

// =====================================================
// MARK NOTIFICATION AS READ
// =====================================================

/*
  PATCH /api/notifications/:notificationId/read

  Ek notification ko read mark karta hai.
*/

export const markNotificationAsRead = async (
  notificationId
) => {
  if (!notificationId) {
    throw new Error(
      "Notification ID is required"
    );
  }

  try {
    const response = await api.patch(
      `/notifications/${notificationId}/read`
    );

    return response.data;
  } catch (error) {
    console.error(
      "Mark Notification Read Error:",
      error
    );

    throw error;
  }
};

// =====================================================
// MARK ALL NOTIFICATIONS AS READ
// =====================================================

/*
  PATCH /api/notifications/read-all

  Logged-in user ki saari notifications
  read mark karta hai.
*/

export const markAllNotificationsAsRead =
  async () => {
    try {
      const response = await api.patch(
        "/notifications/read-all"
      );

      return response.data;
    } catch (error) {
      console.error(
        "Mark All Notifications Read Error:",
        error
      );

      throw error;
    }
  };

// =====================================================
// DELETE NOTIFICATION
// =====================================================

/*
  DELETE /api/notifications/:notificationId

  Ek notification delete karta hai.
*/

export const deleteNotification = async (
  notificationId
) => {
  if (!notificationId) {
    throw new Error(
      "Notification ID is required"
    );
  }

  try {
    const response = await api.delete(
      `/notifications/${notificationId}`
    );

    return response.data;
  } catch (error) {
    console.error(
      "Delete Notification Error:",
      error
    );

    throw error;
  }
};

