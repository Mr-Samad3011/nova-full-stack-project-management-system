
// eslint-disable-next-line no-unused-vars
import React from "react";
import { useNotifications } from "../context/NotificationContext";
import NotificationItem from "../component/notifications/NotificationItem";

const Notifications = () => {
  // =====================================================
  // NOTIFICATION CONTEXT
  // =====================================================

  const {
    notifications,
    unreadCount,
    loading,
    error,
    fetchNotifications,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    deleteAllNotifications,
  } = useNotifications();

  // =====================================================
  // DELETE ALL
  // =====================================================

  const handleDeleteAll = async () => {
    if (!notifications.length) {
      return;
    }

    const confirmed = window.confirm(
      "Are you sure you want to delete all notifications?"
    );

    if (!confirmed) {
      return;
    }

    try {
      await deleteAllNotifications();
    } catch (err) {
      console.error(
        "Delete All Notifications Error:",
        err
      );
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
      await markAllAsRead();
    } catch (err) {
      console.error(
        "Mark All Notifications Error:",
        err
      );
    }
  };

  // =====================================================
  // DELETE ONE
  // =====================================================

  const handleDelete = async (notificationId) => {
    try {
      await deleteNotification(notificationId);
    } catch (err) {
      console.error(
        "Delete Notification Error:",
        err
      );
    }
  };

  // =====================================================
  // MARK ONE AS READ
  // =====================================================

  const handleRead = async (notificationId) => {
    try {
      await markAsRead(notificationId);
    } catch (err) {
      console.error(
        "Mark Notification Read Error:",
        err
      );
    }
  };

  // =====================================================
  // LOADING
  // =====================================================

  if (loading && notifications.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="mx-auto max-w-4xl">
          <div className="flex min-h-[400px] items-center justify-center rounded-2xl bg-white shadow-sm">
            <div className="text-center">
              <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-4 border-gray-200 border-t-gray-900" />

              <p className="text-sm text-gray-500">
                Loading notifications...
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // =====================================================
  // RENDER
  // =====================================================

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6">
      <div className="mx-auto max-w-4xl">

        {/* =================================================
            HEADER
        ================================================= */}

        <div className="mb-6 rounded-2xl bg-white p-6 shadow-sm">

          <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">

            {/* TITLE */}

            <div>
              <div className="flex items-center gap-3">

                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-900 text-xl text-white">
                  🔔
                </div>

                <div>
                  <h1 className="text-2xl font-bold text-gray-900">
                    Notifications
                  </h1>

                  <p className="mt-1 text-sm text-gray-500">
                    Stay updated with your project activity.
                  </p>
                </div>

              </div>

              {/* UNREAD COUNT */}

              <div className="mt-4">
                <span className="inline-flex rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
                  {unreadCount} unread
                </span>
              </div>
            </div>

            {/* ACTIONS */}

            <div className="flex flex-wrap gap-2">

              <button
                type="button"
                onClick={handleMarkAllAsRead}
                disabled={
                  unreadCount === 0 ||
                  loading
                }
                className="rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Mark all as read
              </button>

              <button
                type="button"
                onClick={handleDeleteAll}
                disabled={
                  notifications.length === 0 ||
                  loading
                }
                className="rounded-lg bg-red-50 px-4 py-2.5 text-sm font-medium text-red-600 transition hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Delete all
              </button>

            </div>

          </div>
        </div>

        {/* =================================================
            ERROR
        ================================================= */}

        {error && (
          <div className="mb-5 flex flex-col gap-3 rounded-xl border border-red-200 bg-red-50 p-4 sm:flex-row sm:items-center sm:justify-between">

            <p className="text-sm font-medium text-red-600">
              {error}
            </p>

            <button
              type="button"
              onClick={fetchNotifications}
              className="w-fit rounded-lg bg-white px-3 py-2 text-sm font-medium text-red-600 shadow-sm hover:bg-red-100"
            >
              Retry
            </button>

          </div>
        )}

        {/* =================================================
            NOTIFICATIONS LIST
        ================================================= */}

        {notifications.length > 0 ? (
          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

            {/* LIST HEADER */}

            <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">

              <div>
                <h2 className="font-semibold text-slate-900">
                  Recent notifications
                </h2>

                <p className="mt-0.5 text-xs text-slate-500">
                  {notifications.length} notification
                  {notifications.length !== 1
                    ? "s"
                    : ""}
                </p>
              </div>

              {loading && (
                <div className="h-5 w-5 animate-spin rounded-full border-2 border-slate-200 border-t-slate-900" />
              )}

            </div>

            {/* ITEMS */}

            <div>
              {notifications.map(
                (notification) => {
                  const notificationId =
                    notification?._id ||
                    notification?.id;

                  return (
                    <NotificationItem
                      key={notificationId}
                      notification={notification}
                      onRead={handleRead}
                      onDelete={handleDelete}
                    />
                  );
                }
              )}
            </div>

          </div>
        ) : (
          /* =================================================
             EMPTY STATE
          ================================================= */

          <div className="rounded-2xl border border-dashed border-gray-300 bg-white p-12 text-center shadow-sm">

            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gray-100 text-3xl">
              🔔
            </div>

            <h2 className="mt-5 text-lg font-semibold text-gray-900">
              No notifications
            </h2>

            <p className="mx-auto mt-2 max-w-md text-sm text-gray-500">
              You're all caught up. New project activity
              and updates will appear here.
            </p>

            <button
              type="button"
              onClick={fetchNotifications}
              disabled={loading}
              className="mt-5 rounded-lg bg-gray-900 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-gray-800 disabled:opacity-50"
            >
              Refresh
            </button>

          </div>
        )}

      </div>
    </div>
  );
};

export default Notifications;
