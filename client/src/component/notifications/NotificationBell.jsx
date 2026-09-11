
import React, {
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

import {
  getNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  deleteNotification,
} from "../../services/notificationService";

// =====================================================
// NOTIFICATION BELL
// =====================================================

const NotificationBell = () => {
  // =====================================================
  // STATE
  // =====================================================

  const [notifications, setNotifications] = useState([]);

  const [unreadCount, setUnreadCount] =
    useState(0);

  const [loading, setLoading] =
    useState(false);

  const [actionLoading, setActionLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  const [isOpen, setIsOpen] =
    useState(false);

  const bellRef = useRef(null);

  // =====================================================
  // LOAD NOTIFICATIONS
  // =====================================================

  const loadNotifications = useCallback(
    async () => {
      try {
        setLoading(true);
        setError("");

        const response =
          await getNotifications({
            page: 1,
            limit: 20,
          });

        const notificationData =
          response?.notifications ||
          response?.data?.notifications ||
          response?.data ||
          [];

        const count =
          response?.unreadCount ??
          response?.data?.unreadCount ??
          0;

        setNotifications(
          Array.isArray(notificationData)
            ? notificationData
            : []
        );

        setUnreadCount(
          Number(count) || 0
        );
      } catch (err) {
        console.error(
          "Load Notifications Error:",
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

  // =====================================================
  // INITIAL LOAD
  // =====================================================

  useEffect(() => {
    loadNotifications();
  }, [loadNotifications]);

  // =====================================================
  // CLOSE DROPDOWN WHEN CLICKING OUTSIDE
  // =====================================================

  useEffect(() => {
    const handleClickOutside = (
      event
    ) => {
      if (
        bellRef.current &&
        !bellRef.current.contains(
          event.target
        )
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener(
      "mousedown",
      handleClickOutside
    );

    return () => {
      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );
    };
  }, []);

  // =====================================================
  // CLOSE ON ESC
  // =====================================================

  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    };

    document.addEventListener(
      "keydown",
      handleEscape
    );

    return () => {
      document.removeEventListener(
        "keydown",
        handleEscape
      );
    };
  }, []);

  // =====================================================
  // TOGGLE
  // =====================================================

  const handleToggle = () => {
    setIsOpen(
      (previous) => !previous
    );
  };

  // =====================================================
  // MARK ONE AS READ
  // =====================================================

  const handleMarkAsRead = async (
    notificationId
  ) => {
    if (!notificationId) {
      return;
    }

    try {
      setActionLoading(true);

      await markNotificationAsRead(
        notificationId
      );

      setNotifications(
        (previous) =>
          previous.map(
            (notification) =>
              notification._id ===
                notificationId
                ? {
                    ...notification,
                    isRead: true,
                    readAt:
                      new Date().toISOString(),
                  }
                : notification
          )
      );

      setUnreadCount(
        (previous) =>
          Math.max(previous - 1, 0)
      );
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
    } finally {
      setActionLoading(false);
    }
  };

  // =====================================================
  // MARK ALL AS READ
  // =====================================================

  const handleMarkAllAsRead = async () => {
    if (unreadCount === 0) {
      return;
    }

    try {
      setActionLoading(true);
      setError("");

      await markAllNotificationsAsRead();

      setNotifications(
        (previous) =>
          previous.map(
            (notification) => ({
              ...notification,
              isRead: true,
              readAt:
                notification.readAt ||
                new Date().toISOString(),
            })
          )
      );

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
    } finally {
      setActionLoading(false);
    }
  };

  // =====================================================
  // DELETE NOTIFICATION
  // =====================================================

  const handleDelete = async (
    notificationId
  ) => {
    if (!notificationId) {
      return;
    }

    try {
      setActionLoading(true);
      setError("");

      const notification =
        notifications.find(
          (item) =>
            item._id === notificationId
        );

      await deleteNotification(
        notificationId
      );

      setNotifications(
        (previous) =>
          previous.filter(
            (item) =>
              item._id !== notificationId
          )
      );

      if (
        notification &&
        !notification.isRead
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
    } finally {
      setActionLoading(false);
    }
  };

  // =====================================================
  // FORMAT DATE
  // =====================================================

  const formatDate = (
    createdAt
  ) => {
    if (!createdAt) {
      return "";
    }

    const date =
      new Date(createdAt);

    if (
      Number.isNaN(
        date.getTime()
      )
    ) {
      return "";
    }

    return date.toLocaleString(
      undefined,
      {
        day: "numeric",
        month: "short",
        hour: "2-digit",
        minute: "2-digit",
      }
    );
  };

  // =====================================================
  // NOTIFICATION MESSAGE
  // =====================================================

  const getNotificationMessage = (
    notification
  ) => {
    return (
      notification?.message ||
      notification?.content ||
      notification?.title ||
      "You have a new notification."
    );
  };

  // =====================================================
  // RENDER
  // =====================================================

  return (
    <div
      ref={bellRef}
      className="relative"
    >
      {/* =================================================
          BELL BUTTON
      ================================================= */}

      <button
        type="button"
        onClick={handleToggle}
        aria-label="Notifications"
        aria-expanded={isOpen}
        className="relative flex h-10 w-10 items-center justify-center rounded-xl text-slate-600 transition hover:bg-slate-100 hover:text-slate-900"
      >
        {/* BELL ICON */}

        <svg
          className="h-5 w-5"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75V9a6 6 0 10-12 0v.75a8.967 8.967 0 01-2.31 6.022 23.848 23.848 0 005.454 1.31m5.713 0a24.255 24.255 0 01-5.713 0m5.713 0a3 3 0 11-5.713 0"
          />
        </svg>

        {/* =================================================
            UNREAD BADGE
        ================================================= */}

        {unreadCount > 0 && (
          <span className="absolute right-1 top-1 flex min-h-4 min-w-4 items-center justify-center rounded-full bg-red-600 px-1 text-[9px] font-bold leading-none text-white ring-2 ring-white">
            {unreadCount > 99
              ? "99+"
              : unreadCount}
          </span>
        )}
      </button>

      {/* =================================================
          DROPDOWN
      ================================================= */}

      {isOpen && (
        <div className="absolute right-0 mt-2 w-[360px] max-w-[calc(100vw-2rem)] overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl">

          {/* =================================================
              HEADER
          ================================================= */}

          <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3">

            <div>
              <h3 className="text-sm font-bold text-slate-900">
                Notifications
              </h3>

              <p className="mt-0.5 text-xs text-slate-500">
                {unreadCount > 0
                  ? `${unreadCount} unread`
                  : "All caught up"}
              </p>
            </div>

            {unreadCount > 0 && (
              <button
                type="button"
                onClick={
                  handleMarkAllAsRead
                }
                disabled={actionLoading}
                className="text-xs font-semibold text-slate-600 transition hover:text-slate-900 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Mark all read
              </button>
            )}

          </div>

          {/* =================================================
              ERROR
          ================================================= */}

          {error && (
            <div className="border-b border-red-100 bg-red-50 px-4 py-2">
              <p className="text-xs text-red-600">
                {error}
              </p>
            </div>
          )}

          {/* =================================================
              LOADING
          ================================================= */}

          {loading ? (
            <div className="flex items-center justify-center px-4 py-8">

              <div className="h-6 w-6 animate-spin rounded-full border-3 border-slate-200 border-t-slate-900" />

              <span className="ml-3 text-sm text-slate-500">
                Loading...
              </span>

            </div>
          ) : notifications.length ===
            0 ? (

            /* =================================================
                EMPTY
            ================================================= */

            <div className="px-4 py-10 text-center">

              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-xl">
                🔔
              </div>

              <h4 className="mt-3 text-sm font-semibold text-slate-900">
                No notifications
              </h4>

              <p className="mt-1 text-xs text-slate-500">
                You are all caught up.
              </p>

            </div>
          ) : (

            /* =================================================
                NOTIFICATION LIST
            ================================================= */

            <div className="max-h-[420px] overflow-y-auto">

              {notifications.map(
                (notification) => {

                  const notificationId =
                    notification?._id ||
                    notification?.id;

                  const isRead =
                    Boolean(
                      notification?.isRead
                    );

                  return (
                    <div
                      key={
                        notificationId
                      }
                      className={`border-b border-slate-100 p-4 transition last:border-b-0 ${
                        isRead
                          ? "bg-white"
                          : "bg-slate-50"
                      }`}
                    >

                      <div className="flex gap-3">

                        {/* DOT */}

                        <div className="pt-1">

                          <span
                            className={`block h-2.5 w-2.5 rounded-full ${
                              isRead
                                ? "bg-slate-200"
                                : "bg-red-500"
                            }`}
                          />

                        </div>

                        {/* CONTENT */}

                        <div className="min-w-0 flex-1">

                          {notification?.title && (
                            <p className="text-sm font-semibold text-slate-900">
                              {
                                notification.title
                              }
                            </p>
                          )}

                          <p className="mt-1 break-words text-sm leading-5 text-slate-600">
                            {getNotificationMessage(
                              notification
                            )}
                          </p>

                          <div className="mt-2 flex items-center justify-between gap-3">

                            <span className="text-[11px] text-slate-400">
                              {formatDate(
                                notification.createdAt
                              )}
                            </span>

                            <div className="flex items-center gap-2">

                              {!isRead && (
                                <button
                                  type="button"
                                  onClick={() =>
                                    handleMarkAsRead(
                                      notificationId
                                    )
                                  }
                                  disabled={
                                    actionLoading
                                  }
                                  className="text-[11px] font-semibold text-slate-600 hover:text-slate-900 disabled:opacity-50"
                                >
                                  Mark read
                                </button>
                              )}

                              <button
                                type="button"
                                onClick={() =>
                                  handleDelete(
                                    notificationId
                                  )
                                }
                                disabled={
                                  actionLoading
                                }
                                className="text-[11px] font-semibold text-red-500 hover:text-red-700 disabled:opacity-50"
                              >
                                Delete
                              </button>

                            </div>

                          </div>

                        </div>

                      </div>

                    </div>
                  );
                }
              )}

            </div>
          )}

          {/* =================================================
              FOOTER
          ================================================= */}

          {!loading &&
            notifications.length >
              0 && (
              <div className="border-t border-slate-100 px-4 py-3">

                <button
                  type="button"
                  onClick={() =>
                    loadNotifications()
                  }
                  disabled={loading}
                  className="w-full rounded-lg bg-slate-50 px-3 py-2 text-xs font-semibold text-slate-600 transition hover:bg-slate-100 hover:text-slate-900 disabled:opacity-50"
                >
                  Refresh notifications
                </button>

              </div>
            )}

        </div>
      )}
    </div>
  );
};

export default NotificationBell;

