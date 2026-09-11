
import React from "react";

// =====================================================
// NOTIFICATION DROPDOWN
// =====================================================

const NotificationDropdown = ({
  notifications = [],
  unreadCount = 0,
  loading = false,
  actionLoading = false,
  error = "",
  onMarkAsRead,
  onMarkAllAsRead,
  onDelete,
  onRefresh,
}) => {
  // =====================================================
  // FORMAT DATE
  // =====================================================

  const formatDate = (createdAt) => {
    if (!createdAt) {
      return "";
    }

    const date = new Date(createdAt);

    if (Number.isNaN(date.getTime())) {
      return "";
    }

    return date.toLocaleString(undefined, {
      day: "numeric",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // =====================================================
  // GET MESSAGE
  // =====================================================

  const getMessage = (notification) => {
    return (
      notification?.message ||
      notification?.content ||
      "You have a new notification."
    );
  };

  // =====================================================
  // GET TITLE
  // =====================================================

  const getTitle = (notification) => {
    return (
      notification?.title ||
      "Notification"
    );
  };

  // =====================================================
  // GET TYPE ICON
  // =====================================================

  const getTypeIcon = (type) => {
    switch (type) {
      case "PROJECT":
        return "📁";

      case "TASK":
        return "✓";

      case "COMMENT":
        return "💬";

      case "MEMBER":
        return "👤";

      case "SYSTEM":
        return "⚙️";

      default:
        return "🔔";
    }
  };

  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {
    return (
      <div className="absolute right-0 top-full z-50 mt-2 w-[360px] max-w-[calc(100vw-2rem)] overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl">

        <div className="flex items-center justify-center px-5 py-10">

          <div className="h-6 w-6 animate-spin rounded-full border-3 border-slate-200 border-t-slate-900" />

          <span className="ml-3 text-sm text-slate-500">
            Loading notifications...
          </span>

        </div>

      </div>
    );
  }

  // =====================================================
  // RENDER
  // =====================================================

  return (
    <div className="absolute right-0 top-full z-50 mt-2 w-[360px] max-w-[calc(100vw-2rem)] overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl">

      {/* =================================================
          HEADER
      ================================================= */}

      <div className="flex items-center justify-between border-b border-slate-100 px-4 py-4">

        <div>

          <h3 className="text-sm font-bold text-slate-900">
            Notifications
          </h3>

          <p className="mt-0.5 text-xs text-slate-500">
            {unreadCount > 0
              ? `${unreadCount} unread notification${
                  unreadCount === 1
                    ? ""
                    : "s"
                }`
              : "You're all caught up"}
          </p>

        </div>

        {unreadCount > 0 && (
          <button
            type="button"
            onClick={onMarkAllAsRead}
            disabled={actionLoading}
            className="rounded-lg px-2.5 py-1.5 text-xs font-semibold text-slate-600 transition hover:bg-slate-100 hover:text-slate-900 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Mark all read
          </button>
        )}

      </div>

      {/* =================================================
          ERROR
      ================================================= */}

      {error && (
        <div className="border-b border-red-100 bg-red-50 px-4 py-3">

          <p className="text-xs font-medium text-red-600">
            {error}
          </p>

        </div>
      )}

      {/* =================================================
          EMPTY
      ================================================= */}

      {!error &&
        notifications.length === 0 && (
          <div className="px-5 py-10 text-center">

            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-slate-100 text-2xl">
              🔔
            </div>

            <h4 className="mt-4 text-sm font-semibold text-slate-900">
              No notifications
            </h4>

            <p className="mt-1 text-xs leading-5 text-slate-500">
              You don't have any notifications right now.
            </p>

            <button
              type="button"
              onClick={onRefresh}
              disabled={actionLoading}
              className="mt-4 rounded-lg border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-600 transition hover:bg-slate-50 disabled:opacity-50"
            >
              Refresh
            </button>

          </div>
        )}

      {/* =================================================
          NOTIFICATION LIST
      ================================================= */}

      {notifications.length > 0 && (
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

              const type =
                notification?.type ||
                notification?.notificationType ||
                "SYSTEM";

              return (
                <div
                  key={notificationId}
                  className={`group border-b border-slate-100 px-4 py-4 transition last:border-b-0 ${
                    isRead
                      ? "bg-white"
                      : "bg-slate-50"
                  }`}
                >

                  <div className="flex gap-3">

                    {/* =================================================
                        ICON
                    ================================================= */}

                    <div
                      className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-sm ${
                        isRead
                          ? "bg-slate-100"
                          : "bg-white shadow-sm"
                      }`}
                    >
                      {getTypeIcon(type)}
                    </div>

                    {/* =================================================
                        CONTENT
                    ================================================= */}

                    <div className="min-w-0 flex-1">

                      <div className="flex items-start justify-between gap-2">

                        <div className="min-w-0">

                          <p className="truncate text-sm font-semibold text-slate-900">
                            {getTitle(
                              notification
                            )}
                          </p>

                        </div>

                        {!isRead && (
                          <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-red-500" />
                        )}

                      </div>

                      {/* MESSAGE */}

                      <p className="mt-1 break-words text-sm leading-5 text-slate-600">
                        {getMessage(
                          notification
                        )}
                      </p>

                      {/* =================================================
                          FOOTER
                      ================================================= */}

                      <div className="mt-2 flex flex-wrap items-center justify-between gap-2">

                        <span className="text-[11px] text-slate-400">
                          {formatDate(
                            notification.createdAt
                          )}
                        </span>

                        <div className="flex items-center gap-2">

                          {/* MARK READ */}

                          {!isRead &&
                            onMarkAsRead && (
                              <button
                                type="button"
                                onClick={() =>
                                  onMarkAsRead(
                                    notificationId
                                  )
                                }
                                disabled={
                                  actionLoading
                                }
                                className="rounded-md px-2 py-1 text-[11px] font-semibold text-slate-600 transition hover:bg-slate-200 hover:text-slate-900 disabled:cursor-not-allowed disabled:opacity-50"
                              >
                                Mark read
                              </button>
                            )}

                          {/* DELETE */}

                          {onDelete && (
                            <button
                              type="button"
                              onClick={() =>
                                onDelete(
                                  notificationId
                                )
                              }
                              disabled={
                                actionLoading
                              }
                              className="rounded-md px-2 py-1 text-[11px] font-semibold text-red-500 transition hover:bg-red-50 hover:text-red-700 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                              Delete
                            </button>
                          )}

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

      {notifications.length > 0 && (
        <div className="border-t border-slate-100 bg-white px-4 py-3">

          <button
            type="button"
            onClick={onRefresh}
            disabled={actionLoading}
            className="w-full rounded-lg bg-slate-50 px-3 py-2 text-xs font-semibold text-slate-600 transition hover:bg-slate-100 hover:text-slate-900 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Refresh notifications
          </button>

        </div>
      )}

    </div>
  );
};

export default NotificationDropdown;

