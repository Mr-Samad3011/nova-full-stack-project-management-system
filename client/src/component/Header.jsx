
import {
  useEffect,
  useRef,
  useState,
} from "react";

import {
  Link,
  NavLink,
  useNavigate,
} from "react-router-dom";

import { useAuth } from "../context/AuthContext";

import {
  getNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  deleteNotification,
} from "../services/notificationService";

const Header = () => {
  // =====================================================
  // AUTH
  // =====================================================

  const { user, logout } = useAuth();

  const navigate = useNavigate();

  // =====================================================
  // UI STATE
  // =====================================================

  const [mobileOpen, setMobileOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [notificationOpen, setNotificationOpen] = useState(false);

  // PROFILE POPUP
  const [profileOpen, setProfileOpen] = useState(false);

  // =====================================================
  // NOTIFICATION STATE
  // =====================================================

  const [notifications, setNotifications] = useState([]);
  const [notificationLoading, setNotificationLoading] = useState(false);
  const [notificationError, setNotificationError] = useState("");

  // =====================================================
  // REFS
  // =====================================================

  const userMenuRef = useRef(null);
  const notificationRef = useRef(null);

  // =====================================================
  // USER DATA
  // =====================================================

  const userName =
    user?.name ||
    user?.username ||
    "User";

  const userUsername =
    user?.username ||
    "";

  const userEmail =
    user?.email ||
    "";

  const userRole =
    user?.role ||
    "MEMBER";

  // =====================================================
  // AVATAR
  // =====================================================

  const avatarLetter =
    userName
      ?.charAt(0)
      ?.toUpperCase() ||
    "U";

  // =====================================================
  // LOAD NOTIFICATIONS
  // =====================================================

  const loadNotifications = async () => {
    if (!user) {
      setNotifications([]);
      return;
    }

    try {
      setNotificationLoading(true);
      setNotificationError("");

      const response = await getNotifications();

      const notificationData =
        response?.notifications ||
        response?.data?.notifications ||
        response?.data ||
        [];

      setNotifications(
        Array.isArray(notificationData)
          ? notificationData
          : []
      );
    } catch (error) {
      console.error(
        "Header Notification Error:",
        error
      );

      setNotificationError(
        error?.response?.data?.message ||
        error?.message ||
        "Unable to load notifications"
      );
    } finally {
      setNotificationLoading(false);
    }
  };

  // =====================================================
  // LOAD NOTIFICATIONS WHEN USER LOGS IN
  // =====================================================

  useEffect(() => {
    if (!user) {
      setNotifications([]);
      return;
    }

    loadNotifications();
  }, [user]);

  // =====================================================
  // AUTO REFRESH NOTIFICATIONS
  // =====================================================

  useEffect(() => {
    if (!user) {
      return;
    }

    const interval = setInterval(() => {
      loadNotifications();
    }, 30000);

    return () => {
      clearInterval(interval);
    };
  }, [user]);

  // =====================================================
  // CLOSE DROPDOWNS WHEN CLICKING OUTSIDE
  // =====================================================

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        userMenuRef.current &&
        !userMenuRef.current.contains(event.target)
      ) {
        setUserMenuOpen(false);
      }

      if (
        notificationRef.current &&
        !notificationRef.current.contains(event.target)
      ) {
        setNotificationOpen(false);
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
  // ESCAPE KEY
  // =====================================================

  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === "Escape") {
        setMobileOpen(false);
        setUserMenuOpen(false);
        setNotificationOpen(false);
        setProfileOpen(false);
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
  // LOGOUT
  // =====================================================

  const handleLogout = () => {
    setMobileOpen(false);
    setUserMenuOpen(false);
    setNotificationOpen(false);
    setProfileOpen(false);

    setNotifications([]);

    logout();

    navigate("/login", {
      replace: true,
    });
  };

  // =====================================================
  // OPEN PROFILE POPUP
  // =====================================================

  const handleOpenProfile = () => {
    setUserMenuOpen(false);
    setNotificationOpen(false);
    setMobileOpen(false);
    setProfileOpen(true);
  };

  // =====================================================
  // CLOSE PROFILE POPUP
  // =====================================================

  const handleCloseProfile = () => {
    setProfileOpen(false);
  };

  // =====================================================
  // NAVIGATION
  // =====================================================

  const navigation = [
    {
      name: "Dashboard",
      path: "/dashboard",
    },
    {
      name: "Projects",
      path: "/projects",
    },
    {
      name: "Tasks",
      path: "/tasks",
    },
    {
      name: "Analytics",
      path: "/analytics",
    },
    {
      name: "Team",
      path: "/team",
    },
  ];

  // =====================================================
  // ACTIVE NAV CLASS
  // =====================================================

  const getNavLinkClass = ({ isActive }) => {
    return `
      relative rounded-lg px-3 py-2
      text-sm font-medium
      transition-all duration-200
      ${
        isActive
          ? "bg-slate-900 text-white shadow-sm"
          : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
      }
    `;
  };

  // =====================================================
  // MOBILE NAV CLASS
  // =====================================================

  const getMobileNavLinkClass = ({ isActive }) => {
    return `
      block w-full rounded-lg px-4 py-3
      text-sm font-medium
      transition-all duration-200
      ${
        isActive
          ? "bg-slate-900 text-white"
          : "text-slate-700 hover:bg-slate-100"
      }
    `;
  };

  // =====================================================
  // NOTIFICATION ID
  // =====================================================

  const getNotificationId = (notification) => {
    return (
      notification?._id ||
      notification?.id
    );
  };

  // =====================================================
  // UNREAD CHECK
  // =====================================================

  const isNotificationRead = (notification) => {
    return (
      notification?.isRead === true ||
      notification?.read === true ||
      notification?.status === "READ"
    );
  };

  // =====================================================
  // UNREAD COUNT
  // =====================================================

  const unreadCount =
    notifications.filter(
      (notification) =>
        !isNotificationRead(notification)
    ).length;

  // =====================================================
  // NOTIFICATION MESSAGE
  // =====================================================

  const getNotificationMessage = (notification) => {
    return (
      notification?.message ||
      notification?.content ||
      notification?.text ||
      "You have a new notification."
    );
  };

  // =====================================================
  // NOTIFICATION TYPE
  // =====================================================

  const getNotificationType = (notification) => {
    return (
      notification?.type ||
      notification?.notificationType ||
      "GENERAL"
    );
  };

  // =====================================================
  // NOTIFICATION DATE
  // =====================================================

  const getNotificationDate = (notification) => {
    const date =
      notification?.createdAt ||
      notification?.created_at;

    if (!date) {
      return "";
    }

    const parsedDate = new Date(date);

    if (
      Number.isNaN(parsedDate.getTime())
    ) {
      return "";
    }

    return parsedDate.toLocaleDateString(
      undefined,
      {
        day: "numeric",
        month: "short",
      }
    );
  };

  // =====================================================
  // MARK ONE AS READ
  // =====================================================

  const handleNotificationClick = async (
    notification
  ) => {
    const notificationId =
      getNotificationId(notification);

    if (!notificationId) {
      return;
    }

    if (
      isNotificationRead(notification)
    ) {
      return;
    }

    try {
      await markNotificationAsRead(
        notificationId
      );

      setNotifications((previous) =>
        previous.map((item) =>
          getNotificationId(item) ===
          notificationId
            ? {
                ...item,
                isRead: true,
                read: true,
                status: "READ",
              }
            : item
        )
      );
    } catch (error) {
      console.error(
        "Mark Notification Error:",
        error
      );
    }
  };

  // =====================================================
  // MARK ALL AS READ
  // =====================================================

  const handleMarkAllAsRead = async () => {
    if (notifications.length === 0) {
      return;
    }

    try {
      await markAllNotificationsAsRead();

      setNotifications((previous) =>
        previous.map((notification) => ({
          ...notification,
          isRead: true,
          read: true,
          status: "READ",
        }))
      );
    } catch (error) {
      console.error(
        "Mark All Notifications Error:",
        error
      );
    }
  };

  // =====================================================
  // DELETE NOTIFICATION
  // =====================================================

  const handleDeleteNotification = async (
    event,
    notificationId
  ) => {
    event.stopPropagation();

    if (!notificationId) {
      return;
    }

    try {
      await deleteNotification(
        notificationId
      );

      setNotifications((previous) =>
        previous.filter(
          (notification) =>
            getNotificationId(notification) !==
            notificationId
        )
      );
    } catch (error) {
      console.error(
        "Delete Notification Error:",
        error
      );
    }
  };

  // =====================================================
  // NOTIFICATION ICON
  // =====================================================

  const NotificationIcon = () => (
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
        d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75V9a6 6 0 10-12 0v.75a8.967 8.967 0 01-2.31 6.022c1.69.53 3.5.925 5.31 1.13"
      />

      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M9.75 17.25a2.25 2.25 0 004.5 0"
      />
    </svg>
  );

  // =====================================================
  // NOT LOGGED IN
  // =====================================================

  if (!user) {
    return null;
  }

  // =====================================================
  // RENDER
  // =====================================================

  return (
    <>
      {/* =====================================================
          HEADER
      ===================================================== */}

      <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 backdrop-blur">

        {/* =================================================
            MAIN HEADER
        ================================================= */}

        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">

          {/* LOGO */}

          <Link
            to="/dashboard"
            onClick={() => {
              setMobileOpen(false);
              setUserMenuOpen(false);
              setNotificationOpen(false);
            }}
            className="flex items-center gap-2"
          >

            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-900 text-sm font-bold text-white shadow-sm">
              N
            </div>

            <div>

              <p className="text-lg font-bold tracking-tight text-slate-900">
                NOVA
              </p>

              <p className="-mt-1 hidden text-[10px] font-medium tracking-wider text-slate-400 sm:block">
                TEAM PRODUCTIVITY
              </p>

            </div>

          </Link>


          {/* =================================================
              DESKTOP NAVIGATION
          ================================================= */}

          <nav className="hidden items-center gap-1 md:flex">

            {navigation.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.path === "/dashboard"}
                className={getNavLinkClass}
                onClick={() => {
                  setUserMenuOpen(false);
                  setNotificationOpen(false);
                }}
              >
                {item.name}
              </NavLink>
            ))}

          </nav>


          {/* =================================================
              RIGHT SIDE
          ================================================= */}

          <div className="flex items-center gap-2">

            {/* =================================================
                NOTIFICATION
            ================================================= */}

            <div
              ref={notificationRef}
              className="relative"
            >

              <button
                type="button"
                onClick={() => {
                  setNotificationOpen(
                    (previous) => !previous
                  );

                  setUserMenuOpen(false);

                  if (!notificationOpen) {
                    loadNotifications();
                  }
                }}
                aria-label="Notifications"
                aria-expanded={notificationOpen}
                className="relative rounded-xl p-2.5 text-slate-600 transition hover:bg-slate-100 hover:text-slate-900"
              >

                <NotificationIcon />

                {unreadCount > 0 && (
                  <span className="absolute -right-0.5 -top-0.5 flex min-h-5 min-w-5 items-center justify-center rounded-full bg-red-600 px-1 text-[10px] font-bold text-white ring-2 ring-white">
                    {unreadCount > 99
                      ? "99+"
                      : unreadCount}
                  </span>
                )}

              </button>


              {/* =================================================
                  NOTIFICATION DROPDOWN
              ================================================= */}

              {notificationOpen && (
                <div className="absolute right-0 mt-2 w-[calc(100vw-2rem)] max-w-sm overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl">

                  <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3">

                    <div>

                      <h3 className="text-sm font-bold text-slate-900">
                        Notifications
                      </h3>

                      <p className="text-xs text-slate-500">
                        {unreadCount} unread
                      </p>

                    </div>

                    {unreadCount > 0 && (
                      <button
                        type="button"
                        onClick={
                          handleMarkAllAsRead
                        }
                        className="text-xs font-semibold text-slate-600 hover:text-slate-900"
                      >
                        Mark all read
                      </button>
                    )}

                  </div>


                  {notificationError && (
                    <div className="border-b border-red-100 bg-red-50 px-4 py-3">

                      <p className="text-xs text-red-600">
                        {notificationError}
                      </p>

                    </div>
                  )}


                  {notificationLoading &&
                    notifications.length === 0 && (
                      <div className="flex items-center justify-center px-4 py-8">

                        <div className="h-6 w-6 animate-spin rounded-full border-4 border-slate-200 border-t-slate-900" />

                        <span className="ml-3 text-sm text-slate-500">
                          Loading...
                        </span>

                      </div>
                    )}


                  {!notificationLoading &&
                    notifications.length === 0 && (
                      <div className="px-4 py-10 text-center">

                        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-slate-100">
                          <NotificationIcon />
                        </div>

                        <p className="mt-3 text-sm font-semibold text-slate-900">
                          No notifications
                        </p>

                        <p className="mt-1 text-xs text-slate-500">
                          You're all caught up.
                        </p>

                      </div>
                    )}


                  {notifications.length > 0 && (
                    <div className="max-h-[420px] overflow-y-auto">

                      {notifications.map(
                        (notification) => {

                          const notificationId =
                            getNotificationId(
                              notification
                            );

                          const isRead =
                            isNotificationRead(
                              notification
                            );

                          return (
                            <div
                              key={notificationId}
                              onClick={() =>
                                handleNotificationClick(
                                  notification
                                )
                              }
                              className={`group relative cursor-pointer border-b border-slate-100 px-4 py-3 transition last:border-b-0 hover:bg-slate-50 ${
                                !isRead
                                  ? "bg-slate-50"
                                  : "bg-white"
                              }`}
                            >

                              <div className="flex gap-3">

                                <div className="pt-1.5">

                                  <span
                                    className={`block h-2.5 w-2.5 rounded-full ${
                                      isRead
                                        ? "bg-slate-200"
                                        : "bg-red-500"
                                    }`}
                                  />

                                </div>

                                <div className="min-w-0 flex-1">

                                  <div className="flex items-start justify-between gap-2">

                                    <p className="text-[10px] font-bold uppercase tracking-wide text-slate-400">
                                      {getNotificationType(
                                        notification
                                      )}
                                    </p>

                                    <button
                                      type="button"
                                      onClick={(event) =>
                                        handleDeleteNotification(
                                          event,
                                          notificationId
                                        )
                                      }
                                      className="rounded-md p-1 text-slate-300 opacity-0 transition hover:bg-red-50 hover:text-red-500 group-hover:opacity-100"
                                      aria-label="Delete notification"
                                    >

                                      <svg
                                        className="h-4 w-4"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="1.8"
                                      >

                                        <path
                                          strokeLinecap="round"
                                          strokeLinejoin="round"
                                          d="M6 7h12M9 7V4.5A1.5 1.5 0 0110.5 3h3A1.5 1.5 0 0115 4.5V7m-7.5 0l.75 12A2.25 2.25 0 0010.495 21h3.01a2.25 2.25 0 002.245-2L16.5 7M10 11v6M14 11v6"
                                        />

                                      </svg>

                                    </button>

                                  </div>

                                  <p className="mt-1 text-sm leading-5 text-slate-700">
                                    {getNotificationMessage(
                                      notification
                                    )}
                                  </p>

                                  <p className="mt-1 text-[11px] text-slate-400">
                                    {getNotificationDate(
                                      notification
                                    )}
                                  </p>

                                </div>

                              </div>

                            </div>
                          );
                        }
                      )}

                    </div>
                  )}

                </div>
              )}

            </div>


            {/* =================================================
                USER DROPDOWN
            ================================================= */}

            <div
              ref={userMenuRef}
              className="relative"
            >

              <button
                type="button"
                onClick={() => {
                  setUserMenuOpen(
                    (previous) => !previous
                  );

                  setNotificationOpen(false);
                }}
                aria-expanded={userMenuOpen}
                className="flex items-center gap-2 rounded-xl px-2 py-1.5 transition hover:bg-slate-100"
              >

                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-900 text-sm font-semibold uppercase text-white">
                  {avatarLetter}
                </div>

                <div className="hidden text-left lg:block">

                  <p className="max-w-32 truncate text-sm font-semibold text-slate-900">
                    {userName}
                  </p>

                  <p className="max-w-32 truncate text-xs text-slate-500">
                    @{userUsername || "user"}
                  </p>

                </div>

                <svg
                  className={`hidden h-4 w-4 text-slate-500 transition-transform lg:block ${
                    userMenuOpen
                      ? "rotate-180"
                      : ""
                  }`}
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >

                  <path
                    fillRule="evenodd"
                    d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.51a.75.75 0 01.02-1.06l-4.25-4.51a.75.75 0 01-1.08-.02L10 9.58l3.19-3.39a.75.75 0 011.08 1.04L10 11.168 6.31 7.23a.75.75 0 01-1.08-.02z"
                    clipRule="evenodd"
                  />

                </svg>

              </button>


              {/* =================================================
                  USER DROPDOWN
              ================================================= */}

              {userMenuOpen && (
                <div className="absolute right-0 mt-2 w-72 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xl">

                  <div className="border-b border-slate-100 px-4 py-4">

                    <div className="flex items-center gap-3">

                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-slate-900 text-base font-semibold uppercase text-white">
                        {avatarLetter}
                      </div>

                      <div className="min-w-0">

                        <p className="truncate font-semibold text-slate-900">
                          {userName}
                        </p>

                        {userEmail && (
                          <p className="truncate text-xs text-slate-500">
                            {userEmail}
                          </p>
                        )}

                      </div>

                    </div>

                    <div className="mt-3">

                      <span className="inline-flex rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold uppercase tracking-wide text-slate-600">
                        {userRole}
                      </span>

                    </div>

                  </div>


                  {/* =================================================
                      USER ACTIONS
                  ================================================= */}

                  <div className="p-2">

                    {/* PROFILE POPUP BUTTON */}

                    <button
                      type="button"
                      onClick={handleOpenProfile}
                      className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm font-medium text-slate-700 transition hover:bg-slate-100 hover:text-slate-900"
                    >

                      <svg
                        className="h-5 w-5 text-slate-500"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.8"
                      >

                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M15 19a6 6 0 00-12 0"
                        />

                        <circle
                          cx="9"
                          cy="7"
                          r="4"
                        />

                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M19 8v6M22 11h-6"
                        />

                      </svg>

                      Profile

                    </button>


                    {/* SETTINGS */}

                    <Link
                      to="/settings"
                      onClick={() =>
                        setUserMenuOpen(false)
                      }
                      className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-100 hover:text-slate-900"
                    >

                      <svg
                        className="h-5 w-5 text-slate-500"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.8"
                      >

                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M12 15.5a3.5 3.5 0 100-7 3.5 3.5 0 000 7z"
                        />

                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M19.4 15a1.7 1.7 0 00.34 1.88l.06.06-1.7 1.7-.06-.06a1.7 1.7 0 00-1.88-.34 1.7 1.7 0 00-1.03 1.56V20h-2.4v-.2a1.7 1.7 0 00-1.03-1.56 1.7 1.7 0 00-1.88.34l-.06.06-1.7-1.7.06-.06A1.7 1.7 0 008.6 15a1.7 1.7 0 00-1.56-1.03H6v-2.4h.2A1.7 1.7 0 007.76 10a1.7 1.7 0 00-.34-1.88l-.06-.06 1.7-1.7.06.06A1.7 1.7 0 0011 6.76 1.7 1.7 0 0012.03 5.2V5h2.4v.2A1.7 1.7 0 0015.46 6.76a1.7 1.7 0 001.88-.34l.06-.06 1.7 1.7-.06.06A1.7 1.7 0 0018.7 10a1.7 1.7 0 001.56 1.03h.2v2.4h-.2A1.7 1.7 0 0019.4 15z"
                        />

                      </svg>

                      Settings

                    </Link>

                  </div>


                  {/* =================================================
                      LOGOUT
                  ================================================= */}

                  <div className="border-t border-slate-100 p-2">

                    <button
                      type="button"
                      onClick={handleLogout}
                      className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-red-600 transition hover:bg-red-50"
                    >

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
                          d="M10 17l5-5-5-5"
                        />

                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M15 12H3"
                        />

                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M21 19V5a2 2 0 00-2-2h-5"
                        />

                      </svg>

                      Logout

                    </button>

                  </div>

                </div>
              )}

            </div>


            {/* =================================================
                MOBILE BUTTON
            ================================================= */}

            <button
              type="button"
              onClick={() => {
                setMobileOpen(
                  (previous) => !previous
                );

                setUserMenuOpen(false);
                setNotificationOpen(false);
              }}
              aria-label="Toggle navigation menu"
              aria-expanded={mobileOpen}
              className="rounded-lg p-2 text-slate-700 transition hover:bg-slate-100 md:hidden"
            >

              {mobileOpen ? (
                <svg
                  className="h-6 w-6"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >

                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18L18 6M6 6l12 12"
                  />

                </svg>
              ) : (
                <svg
                  className="h-6 w-6"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >

                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M4 6h16M4 12h16M4 18h16"
                  />

                </svg>
              )}

            </button>

          </div>

        </div>


        {/* =====================================================
            MOBILE NAVIGATION
        ===================================================== */}

        {mobileOpen && (
          <div className="border-t border-slate-200 bg-white md:hidden">

            <div className="mx-auto max-w-7xl space-y-1 px-4 py-4 sm:px-6">

              {/* MOBILE USER */}

              <div className="mb-3 flex items-center gap-3 rounded-xl bg-slate-50 p-3">

                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-900 text-sm font-semibold uppercase text-white">
                  {avatarLetter}
                </div>

                <div className="min-w-0">

                  <p className="truncate text-sm font-semibold text-slate-900">
                    {userName}
                  </p>

                  <p className="truncate text-xs text-slate-500">
                    {userEmail ||
                      `@${userUsername}`}
                  </p>

                </div>

              </div>


              {/* MOBILE NOTIFICATION */}

              <button
                type="button"
                onClick={() => {
                  setNotificationOpen(true);
                  setMobileOpen(false);
                  loadNotifications();
                }}
                className="flex w-full items-center justify-between rounded-lg px-4 py-3 text-left text-sm font-medium text-slate-700 transition hover:bg-slate-100"
              >

                <span className="flex items-center gap-3">

                  <NotificationIcon />

                  Notifications

                </span>

                {unreadCount > 0 && (
                  <span className="rounded-full bg-red-600 px-2 py-0.5 text-[10px] font-bold text-white">
                    {unreadCount > 99
                      ? "99+"
                      : unreadCount}
                  </span>
                )}

              </button>


              {/* MOBILE NAVIGATION */}

              {navigation.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  end={item.path === "/dashboard"}
                  onClick={() => {
                    setMobileOpen(false);
                    setUserMenuOpen(false);
                    setNotificationOpen(false);
                  }}
                  className={getMobileNavLinkClass}
                >
                  {item.name}
                </NavLink>
              ))}


              <div className="my-3 border-t border-slate-200" />


              {/* =================================================
                  MOBILE PROFILE POPUP
              ================================================= */}

              <button
                type="button"
                onClick={handleOpenProfile}
                className={getMobileNavLinkClass({
                  isActive: false,
                })}
              >
                Profile
              </button>


              {/* SETTINGS */}

              <NavLink
                to="/settings"
                onClick={() =>
                  setMobileOpen(false)
                }
                className={getMobileNavLinkClass}
              >
                Settings
              </NavLink>


              {/* LOGOUT */}

              <button
                type="button"
                onClick={handleLogout}
                className="mt-1 block w-full rounded-lg px-4 py-3 text-left text-sm font-semibold text-red-600 transition hover:bg-red-50"
              >
                Logout
              </button>

            </div>

          </div>
        )}

      </header>


      {/* =====================================================
          PROFILE MODAL / POPUP
      ===================================================== */}

      {profileOpen && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/50 px-4 py-6 backdrop-blur-sm"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              handleCloseProfile();
            }
          }}
        >

          {/* =================================================
              PROFILE CARD
          ================================================= */}

          <div className="relative w-full max-w-md overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl">

            {/* =================================================
                CLOSE BUTTON
            ================================================= */}

            <button
              type="button"
              onClick={handleCloseProfile}
              aria-label="Close profile"
              className="absolute right-4 top-4 z-10 rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-900"
            >

              <svg
                className="h-5 w-5"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >

                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />

              </svg>

            </button>


            {/* =================================================
                PROFILE HEADER
            ================================================= */}

            <div className="bg-slate-950 px-6 py-8 text-center">

              {/* AVATAR */}

              <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-white text-2xl font-bold uppercase text-slate-950 shadow-lg">
                {avatarLetter}
              </div>


              {/* NAME */}

              <h2 className="mt-4 text-xl font-bold text-white">
                {userName}
              </h2>


              {/* USERNAME */}

              <p className="mt-1 text-sm text-slate-400">
                @{userUsername || "user"}
              </p>


              {/* ROLE */}

              <div className="mt-4">

                <span className="inline-flex rounded-full bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-slate-200 ring-1 ring-white/10">
                  {userRole}
                </span>

              </div>

            </div>


            {/* =================================================
                PROFILE INFORMATION
            ================================================= */}

            <div className="space-y-3 px-6 py-6">

              {/* FULL NAME */}

              <div className="rounded-xl border border-slate-100 bg-slate-50 px-4 py-3">

                <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">
                  Full Name
                </p>

                <p className="mt-1 text-sm font-semibold text-slate-900">
                  {userName}
                </p>

              </div>


              {/* USERNAME */}

              <div className="rounded-xl border border-slate-100 bg-slate-50 px-4 py-3">

                <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">
                  Username
                </p>

                <p className="mt-1 text-sm font-semibold text-slate-900">
                  @{userUsername || "user"}
                </p>

              </div>


              {/* EMAIL */}

              <div className="rounded-xl border border-slate-100 bg-slate-50 px-4 py-3">

                <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">
                  Email Address
                </p>

                <p className="mt-1 break-all text-sm font-semibold text-slate-900">
                  {userEmail || "Not available"}
                </p>

              </div>


              {/* ROLE */}

              <div className="rounded-xl border border-slate-100 bg-slate-50 px-4 py-3">

                <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">
                  Account Role
                </p>

                <p className="mt-1 text-sm font-semibold uppercase text-slate-900">
                  {userRole}
                </p>

              </div>

            </div>


            {/* =================================================
                PROFILE FOOTER
            ================================================= */}

            <div className="border-t border-slate-100 bg-slate-50 px-6 py-4">

              <button
                type="button"
                onClick={handleCloseProfile}
                className="w-full rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800"
              >
                Close
              </button>

            </div>

          </div>

        </div>
      )}

    </>
  );
};

export default Header;
