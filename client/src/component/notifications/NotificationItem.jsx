
import React from "react";

const NotificationItem = ({
  notification,
  onRead,
  onDelete,
}) => {
  // =====================================================
  // SAFETY
  // =====================================================

  if (!notification) {
    return null;
  }

  // =====================================================
  // NOTIFICATION DATA
  // =====================================================

  const notificationId =
    notification?._id ||
    notification?.id;

  const isRead =
    notification?.isRead === true;

  const title =
    notification?.title ||
    notification?.message ||
    "New notification";

  const message =
    notification?.message ||
    notification?.content ||
    "";

  // =====================================================
  // TYPE
  // =====================================================

  const type =
    notification?.type ||
    "GENERAL";

  // =====================================================
  // DATE
  // =====================================================

  const createdAt =
    notification?.createdAt ||
    notification?.created_at;

  const formattedDate = createdAt
    ? new Date(createdAt).toLocaleString()
    : "";

  // =====================================================
  // ICON
  // =====================================================

  const getIcon = () => {
    switch (type?.toUpperCase()) {
      case "PROJECT":
        return "📁";

      case "TASK":
        return "✓";

      case "COMMENT":
        return "💬";

      case "MEMBER":
        return "👤";

      case "MENTION":
        return "@";

      case "SYSTEM":
        return "⚙";

      default:
        return "🔔";
    }
  };

  // =====================================================
  // CLICK NOTIFICATION
  // =====================================================

  const handleNotificationClick = () => {
    if (!isRead && notificationId && onRead) {
      onRead(notificationId);
    }
  };

  // =====================================================
  // DELETE
  // =====================================================

  const handleDelete = (event) => {
    event.stopPropagation();

    if (notificationId && onDelete) {
      onDelete(notificationId);
    }
  };

  // =====================================================
  // MARK READ
  // =====================================================

  const handleMarkAsRead = (event) => {
    event.stopPropagation();

    if (!isRead && notificationId && onRead) {
      onRead(notificationId);
    }
  };

  // =====================================================
  // RENDER
  // =====================================================

  return (
    <div
      onClick={handleNotificationClick}
      className={`
        group relative flex gap-3 border-b border-slate-100
        p-4 transition
        ${
          isRead
            ? "bg-white hover:bg-slate-50"
            : "bg-slate-50 hover:bg-slate-100"
        }
      `}
    >
      {/* =================================================
          ICON
      ================================================= */}

      <div
        className={`
          flex h-10 w-10 shrink-0 items-center
          justify-center rounded-full text-lg
          ${
            isRead
              ? "bg-slate-100"
              : "bg-slate-900 text-white"
          }
        `}
      >
        {getIcon()}
      </div>

      {/* =================================================
          CONTENT
      ================================================= */}

      <div className="min-w-0 flex-1">

        {/* TITLE + UNREAD DOT */}

        <div className="flex items-start justify-between gap-2">

          <h4
            className={`
              text-sm
              ${
                isRead
                  ? "font-medium text-slate-700"
                  : "font-semibold text-slate-900"
              }
            `}
          >
            {title}
          </h4>

          {!isRead && (
            <span
              className="mt-1 h-2 w-2 shrink-0 rounded-full bg-blue-600"
              title="Unread"
            />
          )}

        </div>

        {/* MESSAGE */}

        {message && message !== title && (
          <p className="mt-1 line-clamp-2 text-sm text-slate-500">
            {message}
          </p>
        )}

        {/* DATE */}

        {formattedDate && (
          <p className="mt-2 text-xs text-slate-400">
            {formattedDate}
          </p>
        )}

        {/* =================================================
            ACTIONS
        ================================================= */}

        <div className="mt-2 flex items-center gap-3">

          {/* MARK AS READ */}

          {!isRead && (
            <button
              type="button"
              onClick={handleMarkAsRead}
              className="text-xs font-medium text-blue-600 transition hover:text-blue-800"
            >
              Mark as read
            </button>
          )}

          {/* DELETE */}

          <button
            type="button"
            onClick={handleDelete}
            className="
              text-xs font-medium text-red-500
              opacity-0 transition
              hover:text-red-700
              group-hover:opacity-100
            "
          >
            Delete
          </button>

        </div>

      </div>
    </div>
  );
};

export default NotificationItem;
