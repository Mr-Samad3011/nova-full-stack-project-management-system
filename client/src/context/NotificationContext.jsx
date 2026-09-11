/* eslint-disable react-refresh/only-export-components */
/* eslint-disable react-hooks/set-state-in-effect */

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

import api from "../services/api";

// =====================================================
// CREATE CONTEXT
// =====================================================

const NotificationContext = createContext(null);

// =====================================================
// PROVIDER
// =====================================================

export const NotificationProvider = ({
  children,
}) => {
  // ===================================================
  // STATE
  // ===================================================

  const [notifications, setNotifications] =
    useState([]);

  const [unreadCount, setUnreadCount] =
    useState(0);

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  // ===================================================
  // GET NOTIFICATION DATA
  // ===================================================

  const fetchNotifications = useCallback(
    async () => {
      try {
        setLoading(true);
        setError("");

        const response = await api.get(
          "/notifications"
        );

        const data =
          response?.data || {};

        const notificationList =
          data?.notifications ||
          data?.data?.notifications ||
          [];

        const count =
          data?.unreadCount ??
          data?.data?.unreadCount ??
          0;

        setNotifications(
          Array.isArray(notificationList)
            ? notificationList
            : []
        );

        setUnreadCount(
          Number(count) || 0
        );
      } catch (err) {
        console.error(
          "Fetch Notifications Error:",
          err
        );

        setError(
          err?.response?.data?.message ||
            err?.message ||
            "Unable to load notifications"
        );
      } finally {
        setLoading(false);
      }
    },
    []
  );

  // ===================================================
  // GET UNREAD COUNT
  // ===================================================

  const fetchUnreadCount =
    useCallback(async () => {
      try {
        const response =
          await api.get(
            "/notifications/unread-count"
          );

        const data =
          response?.data || {};

        const count =
          data?.unreadCount ??
          data?.data?.unreadCount ??
          0;

        setUnreadCount(
          Number(count) || 0
        );
      } catch (err) {
        console.error(
          "Fetch Unread Count Error:",
          err
        );
      }
    }, []);

  // ===================================================
  // MARK ONE AS READ
  // ===================================================

  const markAsRead = useCallback(
    async (notificationId) => {
      if (!notificationId) {
        return;
      }

      try {
        const response =
          await api.patch(
            `/notifications/${notificationId}/read`
          );

        const updatedNotification =
          response?.data?.notification ||
          response?.data?.data?.notification;

        // -----------------------------------------------
        // UPDATE LOCAL STATE
        // -----------------------------------------------

        setNotifications(
          (previous) =>
            previous.map((notification) => {
              const id =
                notification?._id ||
                notification?.id;

              if (id !== notificationId) {
                return notification;
              }

              return (
                updatedNotification || {
                  ...notification,
                  isRead: true,
                  readAt:
                    new Date().toISOString(),
                }
              );
            })
        );

        // -----------------------------------------------
        // UPDATE COUNT
        // -----------------------------------------------

        setUnreadCount(
          (previous) =>
            Math.max(previous - 1, 0)
        );

        return updatedNotification;
      } catch (err) {
        console.error(
          "Mark Notification Read Error:",
          err
        );

        setError(
          err?.response?.data?.message ||
            err?.message ||
            "Unable to mark notification as read"
        );

        throw err;
      }
    },
    []
  );

  // ===================================================
  // MARK ALL AS READ
  // ===================================================

  const markAllAsRead =
    useCallback(async () => {
      try {
        await api.patch(
          "/notifications/read-all"
        );

        // -----------------------------------------------
        // UPDATE LOCAL NOTIFICATIONS
        // -----------------------------------------------

        setNotifications(
          (previous) =>
            previous.map(
              (notification) => ({
                ...notification,
                isRead: true,
                readAt:
                  notification?.readAt ||
                  new Date().toISOString(),
              })
            )
        );

        // -----------------------------------------------
        // RESET COUNT
        // -----------------------------------------------

        setUnreadCount(0);
      } catch (err) {
        console.error(
          "Mark All Notifications Read Error:",
          err
        );

        setError(
          err?.response?.data?.message ||
            err?.message ||
            "Unable to mark all notifications as read"
        );

        throw err;
      }
    }, []);

  // ===================================================
  // DELETE ONE NOTIFICATION
  // ===================================================

  const deleteNotification =
    useCallback(
      async (notificationId) => {
        if (!notificationId) {
          return;
        }

        try {
          const notification =
            notifications.find(
              (item) =>
                (item?._id || item?.id) ===
                notificationId
            );

          await api.delete(
            `/notifications/${notificationId}`
          );

          // ---------------------------------------------
          // REMOVE FROM LOCAL STATE
          // ---------------------------------------------

          setNotifications(
            (previous) =>
              previous.filter(
                (item) =>
                  (item?._id || item?.id) !==
                  notificationId
              )
          );

          // ---------------------------------------------
          // UPDATE UNREAD COUNT
          // ---------------------------------------------

          if (
            notification &&
            notification.isRead === false
          ) {
            setUnreadCount(
              (previous) =>
                Math.max(previous - 1, 0)
            );
          }
        } catch (err) {
          console.error(
            "Delete Notification Error:",
            err
          );

          setError(
            err?.response?.data?.message ||
              err?.message ||
              "Unable to delete notification"
          );

          throw err;
        }
      },
      [notifications]
    );

  // ===================================================
  // DELETE ALL NOTIFICATIONS
  // ===================================================

  const deleteAllNotifications =
    useCallback(async () => {
      try {
        await api.delete(
          "/notifications"
        );

        setNotifications([]);

        setUnreadCount(0);
      } catch (err) {
        console.error(
          "Delete All Notifications Error:",
          err
        );

        setError(
          err?.response?.data?.message ||
            err?.message ||
            "Unable to delete all notifications"
        );

        throw err;
      }
    }, []);

  // ===================================================
  // CLEAR ERROR
  // ===================================================

  const clearNotificationError =
    useCallback(() => {
      setError("");
    }, []);

  // ===================================================
  // INITIAL LOAD
  // ===================================================

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  // ===================================================
  // CONTEXT VALUE
  // ===================================================

  const value = {
    notifications,
    unreadCount,

    loading,
    error,

    fetchNotifications,
    fetchUnreadCount,

    markAsRead,
    markAllAsRead,

    deleteNotification,
    deleteAllNotifications,

    clearNotificationError,
  };

  // ===================================================
  // PROVIDER
  // ===================================================

  return (
    <NotificationContext.Provider
      value={value}
    >
      {children}
    </NotificationContext.Provider>
  );
};

// =====================================================
// CUSTOM HOOK
// =====================================================

export const useNotifications = () => {
  const context =
    useContext(NotificationContext);

  if (!context) {
    throw new Error(
      "useNotifications must be used inside NotificationProvider"
    );
  }

  return context;
};

// =====================================================
// DEFAULT EXPORT
// =====================================================

export default NotificationContext;
