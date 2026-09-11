/* eslint-disable react-hooks/static-components */
/* eslint-disable react-hooks/set-state-in-effect */

import {
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import {
  Link,
  NavLink,
  useLocation,
  useNavigate,
} from "react-router-dom";

import { useAuth } from "../context/AuthContext";

import {
  getNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  deleteNotification,
} from "../services/notificationService";

import { projectPermissions } from "../services/projectService";

// =====================================================
// DEFAULT SETTINGS
// =====================================================

const defaultSettings = {
  theme: "light",

  notifications: {
    taskAssigned: true,
    taskCompleted: true,
    projectUpdates: true,
    teamActivity: true,
    emailNotifications: false,
  },
};

// =====================================================
// APP HEADER
// =====================================================

const AppHeader = () => {
  // =====================================================
  // AUTH
  // =====================================================

  const { user, logout } = useAuth();

  const navigate = useNavigate();
  const location = useLocation();

  // =====================================================
  // UI STATE
  // =====================================================

  const [mobileOpen, setMobileOpen] =
    useState(false);

  const [userMenuOpen, setUserMenuOpen] =
    useState(false);

  const [notificationOpen, setNotificationOpen] =
    useState(false);

  const [profileModalOpen, setProfileModalOpen] =
    useState(false);

  const [settingsModalOpen, setSettingsModalOpen] =
    useState(false);

  // =====================================================
  // SETTINGS STATE
  // =====================================================

  const [settings, setSettings] =
    useState(defaultSettings);

  const [settingsSaved, setSettingsSaved] =
    useState(false);

  const [settingsSaving, setSettingsSaving] =
    useState(false);

  // =====================================================
  // NOTIFICATION STATE
  // =====================================================

  const [notifications, setNotifications] =
    useState([]);

  const [notificationLoading, setNotificationLoading] =
    useState(false);

  const [notificationError, setNotificationError] =
    useState("");

  // =====================================================
  // REFS
  // =====================================================

  const userMenuRef = useRef(null);

  const notificationRef = useRef(null);

  const profileModalRef = useRef(null);

  const settingsModalRef = useRef(null);

  // =====================================================
  // USER DATA
  // =====================================================

  const userName =
    user?.name ||
    user?.username ||
    user?.email ||
    "User";

  const userUsername =
    user?.username || "";

  const userEmail =
    user?.email || "";

  const userRole =
    String(
      user?.role ||
        "MEMBER"
    ).toUpperCase();

  const userId =
    user?._id ||
    user?.id ||
    user?.userId ||
    "";

  const userPhone =
    user?.phone ||
    user?.phoneNumber ||
    "";

  // =====================================================
  // AVATAR
  // =====================================================

  const avatarLetter =
    userName
      ?.charAt(0)
      ?.toUpperCase() ||
    "U";

  // =====================================================
  // PERMISSIONS
  // =====================================================

  // eslint-disable-next-line no-unused-vars
  const permissions = useMemo(() => {
    return {
      canCreateProject:
        projectPermissions.canCreate(),

      canUpdateProject:
        projectPermissions.canUpdate(),

      canDeleteProject:
        projectPermissions.canDelete(),

      canManageMembers:
        projectPermissions.canManageMembers(),
    };
  }, [userRole]);

  // =====================================================
  // NAVIGATION
  // =====================================================

  const navigation = useMemo(() => {
    const items = [
      {
        name: "Dashboard",
        path: "/dashboard",
        visible: true,
      },

      {
        name: "Projects",
        path: "/projects",
        visible: true,
      },

      {
        name: "Tasks",
        path: "/tasks",
        visible: true,
      },

      {
        name: "Analytics",
        path: "/analytics",
        visible: true,
      },

      {
        name: "Team",
        path: "/team",
        visible: true,
      },
    ];

    if (
      userRole === "OWNER" ||
      userRole === "ADMIN"
    ) {
      items.push({
        name: "Users",
        path: "/users",
        visible: true,
      });
    }

    return items.filter(
      (item) => item.visible
    );
  }, [userRole]);

  // =====================================================
  // LOAD SAVED SETTINGS
  // =====================================================

  useEffect(() => {
    try {
      const savedSettings =
        localStorage.getItem(
          "nova_settings"
        );

      if (!savedSettings) {
        return;
      }

      const parsedSettings =
        JSON.parse(savedSettings);

      setSettings((previous) => ({
        ...previous,

        ...parsedSettings,

        notifications: {
          ...previous.notifications,
          ...(parsedSettings.notifications ||
            {}),
        },
      }));
    } catch (error) {
      console.error(
        "Load Settings Error:",
        error
      );
    }
  }, []);

  // =====================================================
  // APPLY THEME
  // =====================================================

  useEffect(() => {
    const root =
      document.documentElement;

    if (settings.theme === "dark") {
      root.classList.add("dark");
      return;
    }

    if (settings.theme === "light") {
      root.classList.remove("dark");
      return;
    }

    const mediaQuery =
      window.matchMedia(
        "(prefers-color-scheme: dark)"
      );

    root.classList.toggle(
      "dark",
      mediaQuery.matches
    );

    const handleThemeChange = (
      event
    ) => {
      if (settings.theme === "system") {
        root.classList.toggle(
          "dark",
          event.matches
        );
      }
    };

    mediaQuery.addEventListener(
      "change",
      handleThemeChange
    );

    return () => {
      mediaQuery.removeEventListener(
        "change",
        handleThemeChange
      );
    };
  }, [settings.theme]);

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

      const response =
        await getNotifications();

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
        "AppHeader Notification Error:",
        error
      );

      setNotificationError(
        error?.response?.data?.message ||
          error?.message ||
          "Unable to load notifications."
      );
    } finally {
      setNotificationLoading(false);
    }
  };

  // =====================================================
  // INITIAL NOTIFICATIONS
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
      return undefined;
    }

    const interval =
      setInterval(() => {
        loadNotifications();
      }, 30000);

    return () => {
      clearInterval(interval);
    };
  }, [user]);

  // =====================================================
  // CLOSE OUTSIDE
  // =====================================================

  useEffect(() => {
    const handleClickOutside = (
      event
    ) => {
      // USER MENU
      if (
        userMenuRef.current &&
        !userMenuRef.current.contains(
          event.target
        )
      ) {
        setUserMenuOpen(false);
      }

      // NOTIFICATIONS
      if (
        notificationRef.current &&
        !notificationRef.current.contains(
          event.target
        )
      ) {
        setNotificationOpen(false);
      }

      // PROFILE
      if (
        profileModalOpen &&
        profileModalRef.current &&
        !profileModalRef.current.contains(
          event.target
        )
      ) {
        setProfileModalOpen(false);
      }

      // SETTINGS
      if (
        settingsModalOpen &&
        settingsModalRef.current &&
        !settingsModalRef.current.contains(
          event.target
        )
      ) {
        setSettingsModalOpen(false);
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
  }, [
    profileModalOpen,
    settingsModalOpen,
  ]);

  // =====================================================
  // ESCAPE KEY
  // =====================================================

  useEffect(() => {
    const handleEscape = (
      event
    ) => {
      if (event.key !== "Escape") {
        return;
      }

      setMobileOpen(false);
      setUserMenuOpen(false);
      setNotificationOpen(false);
      setProfileModalOpen(false);
      setSettingsModalOpen(false);
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
  // CLOSE MENUS ON ROUTE CHANGE
  // =====================================================

  useEffect(() => {
    setMobileOpen(false);
    setUserMenuOpen(false);
    setNotificationOpen(false);
    setProfileModalOpen(false);
    setSettingsModalOpen(false);
  }, [location.pathname]);

  // =====================================================
  // OPEN PROFILE
  // =====================================================

  const handleOpenProfile = () => {
    setUserMenuOpen(false);
    setNotificationOpen(false);
    setMobileOpen(false);
    setSettingsModalOpen(false);

    setProfileModalOpen(true);
  };

  // =====================================================
  // CLOSE PROFILE
  // =====================================================

  const handleCloseProfile = () => {
    setProfileModalOpen(false);
  };

  // =====================================================
  // OPEN SETTINGS
  // =====================================================

  const handleOpenSettings = () => {
    setUserMenuOpen(false);
    setNotificationOpen(false);
    setMobileOpen(false);
    setProfileModalOpen(false);

    setSettingsSaved(false);
    setSettingsModalOpen(true);
  };

  // =====================================================
  // CLOSE SETTINGS
  // =====================================================

  const handleCloseSettings = () => {
    setSettingsModalOpen(false);
    setSettingsSaved(false);
  };

  // =====================================================
  // SETTINGS CHANGE
  // =====================================================

  const handleSettingChange = (
    key,
    value
  ) => {
    setSettings((previous) => ({
      ...previous,
      [key]: value,
    }));

    setSettingsSaved(false);
  };

  // =====================================================
  // NOTIFICATION SETTING CHANGE
  // =====================================================

  const handleNotificationSettingChange = (
    key,
    value
  ) => {
    setSettings((previous) => ({
      ...previous,

      notifications: {
        ...previous.notifications,
        [key]: value,
      },
    }));

    setSettingsSaved(false);
  };

  // =====================================================
  // RESET SETTINGS
  // =====================================================

  const handleResetSettings = () => {
    setSettings({
      ...defaultSettings,

      notifications: {
        ...defaultSettings.notifications,
      },
    });

    setSettingsSaved(false);
  };

  // =====================================================
  // SAVE SETTINGS
  // =====================================================

  const handleSaveSettings = async () => {
    try {
      setSettingsSaving(true);
      setSettingsSaved(false);

      localStorage.setItem(
        "nova_settings",
        JSON.stringify(settings)
      );

      setSettingsSaved(true);

      setTimeout(() => {
        setSettingsSaved(false);
      }, 2500);
    } catch (error) {
      console.error(
        "Save Settings Error:",
        error
      );
    } finally {
      setSettingsSaving(false);
    }
  };

  // =====================================================
  // SETTINGS BACKDROP CLICK
  // =====================================================

  const handleSettingsBackdropClick = (
    event
  ) => {
    if (
      event.target === event.currentTarget
    ) {
      handleCloseSettings();
    }
  };

  // =====================================================
  // LOGOUT
  // =====================================================

  const handleLogout = async () => {
    setMobileOpen(false);
    setUserMenuOpen(false);
    setNotificationOpen(false);
    setProfileModalOpen(false);
    setSettingsModalOpen(false);
    setNotifications([]);

    try {
      await logout();
    } catch (error) {
      console.error(
        "Logout Error:",
        error
      );
    } finally {
      navigate("/login", {
        replace: true,
      });
    }
  };

  // =====================================================
  // NAVIGATION CLICK
  // =====================================================

  const handleNavigationClick = () => {
    setMobileOpen(false);
    setUserMenuOpen(false);
    setNotificationOpen(false);
    setProfileModalOpen(false);
    setSettingsModalOpen(false);
  };

  // =====================================================
  // NOTIFICATION HELPERS
  // =====================================================

  const getNotificationId = (
    notification
  ) => {
    return (
      notification?._id ||
      notification?.id
    );
  };

  const isNotificationRead = (
    notification
  ) => {
    return (
      notification?.isRead === true ||
      notification?.read === true ||
      notification?.status === "READ"
    );
  };

  const getNotificationMessage = (
    notification
  ) => {
    return (
      notification?.message ||
      notification?.content ||
      notification?.text ||
      "You have a new notification."
    );
  };

  const getNotificationType = (
    notification
  ) => {
    return (
      notification?.type ||
      notification?.notificationType ||
      "GENERAL"
    );
  };

  const getNotificationDate = (
    notification
  ) => {
    const date =
      notification?.createdAt ||
      notification?.created_at;

    if (!date) {
      return "";
    }

    const parsedDate =
      new Date(date);

    if (
      Number.isNaN(
        parsedDate.getTime()
      )
    ) {
      return "";
    }

    return parsedDate.toLocaleDateString(
      "en-IN",
      {
        day: "numeric",
        month: "short",
        year: "numeric",
      }
    );
  };

  // =====================================================
  // UNREAD COUNT
  // =====================================================

  const unreadCount =
    notifications.filter(
      (notification) =>
        !isNotificationRead(
          notification
        )
    ).length;

  // =====================================================
  // MARK ONE AS READ
  // =====================================================

  const handleNotificationClick =
    async (notification) => {
      const notificationId =
        getNotificationId(
          notification
        );

      if (!notificationId) {
        return;
      }

      if (
        isNotificationRead(
          notification
        )
      ) {
        return;
      }

      try {
        await markNotificationAsRead(
          notificationId
        );

        setNotifications(
          (previous) =>
            previous.map(
              (item) =>
                getNotificationId(
                  item
                ) === notificationId
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

  const handleMarkAllAsRead =
    async () => {
      if (unreadCount === 0) {
        return;
      }

      try {
        await markAllNotificationsAsRead();

        setNotifications(
          (previous) =>
            previous.map(
              (notification) => ({
                ...notification,
                isRead: true,
                read: true,
                status: "READ",
              })
            )
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

  const handleDeleteNotification =
    async (
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

        setNotifications(
          (previous) =>
            previous.filter(
              (notification) =>
                getNotificationId(
                  notification
                ) !== notificationId
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
  // ICONS
  // =====================================================

  const NotificationIcon = () => (
    <svg
      className="h-5 w-5"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      aria-hidden="true"
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

  const ProfileIcon = () => (
    <svg
      className="h-5 w-5"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      aria-hidden="true"
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
        d="M19 8v6m3-3h-6"
      />
    </svg>
  );

  const SettingsIcon = () => (
    <svg
      className="h-5 w-5"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 15.5a3.5 3.5 0 100-7 3.5 3.5 0 000 7z"
      />

      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M19.4 15a1.7 1.7 0 00.34 1.88l.06.06-1.7 1.7-.06-.06a1.7 1.7 0 00-1.88-.34 1.7 1.7 0 00-1.03 1.56V20h-2.4v-.2a1.7 1.7 0 00-1.03-1.56 1.7 1.7 0 00-1.88.34l-.06.06-1.7-1.7.06-.06A1.7 1.7 0 008.46 15a1.7 1.7 0 00-1.56-1.03H6.7v-2.4h.2A1.7 1.7 0 008.46 10a1.7 1.7 0 00-.34-1.88l-.06-.06 1.7-1.7.06.06a1.7 1.7 0 001.88.34A1.7 1.7 0 0012.73 5.2V5h2.4v.2a1.7 1.7 0 001.03 1.56 1.7 1.7 0 001.88-.34l.06-.06 1.7 1.7-.06.06a1.7 1.7 0 00-.34 1.88 1.7 1.7 0 001.56 1.03h.2v2.4h-.2A1.7 1.7 0 0019.4 15z"
      />
    </svg>
  );

  const CloseIcon = () => (
    <svg
      className="h-5 w-5"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M6 18L18 6M6 6l12 12"
      />
    </svg>
  );

  const CheckIcon = () => (
    <svg
      className="h-3.5 w-3.5"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M5 12l4 4L19 6"
      />
    </svg>
  );

  // =====================================================
  // TOGGLE COMPONENT
  // =====================================================

  const SettingToggle = ({
    enabled,
    onChange,
    label,
  }) => (
    <button
      type="button"
      role="switch"
      aria-label={label}
      aria-checked={enabled}
      onClick={onChange}
      className={`relative h-6 w-11 shrink-0 rounded-full transition ${
        enabled
          ? "bg-slate-900"
          : "bg-slate-200"
      }`}
    >
      <span
        className={`absolute top-1 h-4 w-4 rounded-full bg-white shadow-sm transition ${
          enabled
            ? "left-6"
            : "left-1"
        }`}
      />
    </button>
  );

  // =====================================================
  // NOT AUTHENTICATED
  // =====================================================

  if (!user) {
    return null;
  }

  // =====================================================
  // NAV LINK CLASS
  // =====================================================

  const getNavLinkClass = ({
    isActive,
  }) => {
    return `
      rounded-lg px-3 py-2
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

  const getMobileNavLinkClass = ({
    isActive,
  }) => {
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
  // RENDER
  // =====================================================

  return (
    <>
      {/* ===================================================
          HEADER
      =================================================== */}

      <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 backdrop-blur">

        {/* =================================================
            MAIN HEADER
        ================================================= */}

        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">

          {/* =================================================
              LOGO
          ================================================= */}

          <Link
            to="/dashboard"
            onClick={() => {
              setMobileOpen(false);
              setUserMenuOpen(false);
              setNotificationOpen(false);
              setProfileModalOpen(false);
              setSettingsModalOpen(false);
            }}
            className="flex items-center gap-2"
            aria-label="NOVA Dashboard"
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

          <nav
            className="hidden items-center gap-1 md:flex"
            aria-label="Main navigation"
          >
            {navigation.map(
              (item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  end={
                    item.path ===
                    "/dashboard"
                  }
                  className={
                    getNavLinkClass
                  }
                  onClick={
                    handleNavigationClick
                  }
                >
                  {item.name}
                </NavLink>
              )
            )}
          </nav>

          {/* =================================================
              RIGHT SIDE
          ================================================= */}

          <div className="flex items-center gap-2">

            {/* =================================================
                NOTIFICATIONS
            ================================================= */}

            <div
              ref={notificationRef}
              className="relative"
            >
              <button
                type="button"
                onClick={() => {
                  setNotificationOpen(
                    (previous) =>
                      !previous
                  );

                  setUserMenuOpen(
                    false
                  );

                  setProfileModalOpen(
                    false
                  );

                  setSettingsModalOpen(
                    false
                  );

                  if (
                    !notificationOpen
                  ) {
                    loadNotifications();
                  }
                }}
                aria-label="Notifications"
                aria-expanded={
                  notificationOpen
                }
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

                  {/* HEADER */}

                  <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3">
                    <div>
                      <h3 className="text-sm font-bold text-slate-900">
                        Notifications
                      </h3>

                      <p className="text-xs text-slate-500">
                        {unreadCount}{" "}
                        unread
                      </p>
                    </div>

                    {unreadCount >
                      0 && (
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

                  {/* ERROR */}

                  {notificationError && (
                    <div className="border-b border-red-100 bg-red-50 px-4 py-3">
                      <p className="text-xs text-red-600">
                        {
                          notificationError
                        }
                      </p>
                    </div>
                  )}

                  {/* LOADING */}

                  {notificationLoading &&
                    notifications.length ===
                      0 && (
                      <div className="flex items-center justify-center px-4 py-8">
                        <div className="h-6 w-6 animate-spin rounded-full border-4 border-slate-200 border-t-slate-900" />

                        <span className="ml-3 text-sm text-slate-500">
                          Loading...
                        </span>
                      </div>
                    )}

                  {/* EMPTY */}

                  {!notificationLoading &&
                    notifications.length ===
                      0 && (
                      <div className="px-4 py-10 text-center">
                        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-slate-500">
                          <NotificationIcon />
                        </div>

                        <p className="mt-3 text-sm font-semibold text-slate-900">
                          No notifications
                        </p>

                        <p className="mt-1 text-xs text-slate-500">
                          You're all
                          caught up.
                        </p>
                      </div>
                    )}

                  {/* NOTIFICATION LIST */}

                  {notifications.length >
                    0 && (
                    <div className="max-h-[420px] overflow-y-auto">
                      {notifications.map(
                        (
                          notification
                        ) => {
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
                              key={
                                notificationId
                              }
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
                                      onClick={(
                                        event
                                      ) =>
                                        handleDeleteNotification(
                                          event,
                                          notificationId
                                        )
                                      }
                                      aria-label="Delete notification"
                                      className="rounded-md p-1 text-slate-300 opacity-0 transition hover:bg-red-50 hover:text-red-500 group-hover:opacity-100"
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
                USER MENU
            ================================================= */}

            <div
              ref={userMenuRef}
              className="relative"
            >
              <button
                type="button"
                onClick={() => {
                  setUserMenuOpen(
                    (previous) =>
                      !previous
                  );

                  setNotificationOpen(
                    false
                  );

                  setProfileModalOpen(
                    false
                  );

                  setSettingsModalOpen(
                    false
                  );
                }}
                aria-expanded={
                  userMenuOpen
                }
                aria-label="Open user menu"
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
                    @
                    {userUsername ||
                      "user"}
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
                    d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.51a.75.75 0 00-.02-1.06l-4.25-4.51a.75.75 0 01-.02-1.06z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>

              {/* =================================================
                  USER DROPDOWN
              ================================================= */}

              {userMenuOpen && (
                <div className="absolute right-0 mt-2 w-72 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xl">

                  {/* USER INFO */}

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

                  {/* MENU */}

                  <div className="p-2">

                    {/* PROFILE */}

                    <button
                      type="button"
                      onClick={
                        handleOpenProfile
                      }
                      className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm font-medium text-slate-700 transition hover:bg-slate-100 hover:text-slate-900"
                    >
                      <ProfileIcon />

                      <span>
                        Profile
                      </span>
                    </button>

                    {/* SETTINGS */}

                    <button
                      type="button"
                      onClick={
                        handleOpenSettings
                      }
                      className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm font-medium text-slate-700 transition hover:bg-slate-100 hover:text-slate-900"
                    >
                      <SettingsIcon />

                      <span>
                        Settings
                      </span>
                    </button>

                    {/* ADMIN USERS */}

                    {(userRole ===
                      "OWNER" ||
                      userRole ===
                        "ADMIN") && (
                      <Link
                        to="/users"
                        onClick={
                          handleNavigationClick
                        }
                        className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-100 hover:text-slate-900"
                      >
                        <span className="flex h-5 w-5 items-center justify-center text-xs font-bold">
                          #
                        </span>

                        <span>
                          User Management
                        </span>
                      </Link>
                    )}
                  </div>

                  {/* LOGOUT */}

                  <div className="border-t border-slate-100 p-2">
                    <button
                      type="button"
                      onClick={
                        handleLogout
                      }
                      className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-red-600 transition hover:bg-red-50"
                    >
                      Logout
                    </button>
                  </div>

                </div>
              )}
            </div>

            {/* =================================================
                MOBILE MENU BUTTON
            ================================================= */}

            <button
              type="button"
              onClick={() => {
                setMobileOpen(
                  (previous) =>
                    !previous
                );

                setUserMenuOpen(
                  false
                );

                setNotificationOpen(
                  false
                );

                setProfileModalOpen(
                  false
                );

                setSettingsModalOpen(
                  false
                );
              }}
              aria-label="Toggle navigation menu"
              aria-expanded={
                mobileOpen
              }
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

                <span className="ml-auto rounded-full bg-slate-200 px-2 py-1 text-[10px] font-bold uppercase text-slate-600">
                  {userRole}
                </span>

              </div>

              {/* MOBILE NOTIFICATIONS */}

              <button
                type="button"
                onClick={() => {
                  setNotificationOpen(
                    true
                  );

                  setMobileOpen(
                    false
                  );

                  setUserMenuOpen(
                    false
                  );

                  setProfileModalOpen(
                    false
                  );

                  setSettingsModalOpen(
                    false
                  );

                  loadNotifications();
                }}
                className="flex w-full items-center justify-between rounded-lg px-4 py-3 text-left text-sm font-medium text-slate-700 transition hover:bg-slate-100"
              >
                <span className="flex items-center gap-3">
                  <NotificationIcon />

                  Notifications
                </span>

                {unreadCount >
                  0 && (
                  <span className="rounded-full bg-red-600 px-2 py-0.5 text-[10px] font-bold text-white">
                    {unreadCount >
                    99
                      ? "99+"
                      : unreadCount}
                  </span>
                )}
              </button>

              {/* NAVIGATION */}

              {navigation.map(
                (item) => (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    end={
                      item.path ===
                      "/dashboard"
                    }
                    onClick={
                      handleNavigationClick
                    }
                    className={
                      getMobileNavLinkClass
                    }
                  >
                    {item.name}
                  </NavLink>
                )
              )}

              <div className="my-3 border-t border-slate-200" />

              {/* PROFILE */}

              <button
                type="button"
                onClick={
                  handleOpenProfile
                }
                className="flex w-full items-center gap-3 rounded-lg px-4 py-3 text-left text-sm font-medium text-slate-700 transition hover:bg-slate-100"
              >
                <ProfileIcon />

                <span>
                  Profile
                </span>
              </button>

              {/* SETTINGS */}

              <button
                type="button"
                onClick={
                  handleOpenSettings
                }
                className="flex w-full items-center gap-3 rounded-lg px-4 py-3 text-left text-sm font-medium text-slate-700 transition hover:bg-slate-100"
              >
                <SettingsIcon />

                <span>
                  Settings
                </span>
              </button>

              {/* LOGOUT */}

              <button
                type="button"
                onClick={
                  handleLogout
                }
                className="mt-1 block w-full rounded-lg px-4 py-3 text-left text-sm font-semibold text-red-600 transition hover:bg-red-50"
              >
                Logout
              </button>

            </div>
          </div>
        )}
      </header>

      {/* =====================================================
          PROFILE MODAL
      ===================================================== */}

      {profileModalOpen && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/60 px-4 py-6 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-labelledby="profile-modal-title"
        >

          <div
            ref={profileModalRef}
            className="relative flex max-h-[90vh] w-full max-w-lg flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl"
          >

            {/* HEADER */}

            <div className="relative shrink-0 bg-slate-900 px-6 py-6">

              <button
                type="button"
                onClick={
                  handleCloseProfile
                }
                aria-label="Close profile"
                className="absolute right-4 top-4 rounded-lg p-2 text-slate-300 transition hover:bg-white/10 hover:text-white"
              >
                <CloseIcon />
              </button>

              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
                Account Profile
              </p>

              <h2
                id="profile-modal-title"
                className="mt-2 text-xl font-bold text-white"
              >
                My Profile
              </h2>

              <p className="mt-1 text-sm text-slate-400">
                View your account information
              </p>

            </div>

            {/* CONTENT */}

            <div className="min-h-0 flex-1 overflow-y-auto">

              <div className="px-6 pb-6">

                {/* SUMMARY */}

                <div className="flex items-center gap-4 border-b border-slate-100 py-6">

                  <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl bg-slate-900 text-3xl font-bold uppercase text-white shadow-md">
                    {avatarLetter}
                  </div>

                  <div className="min-w-0 flex-1">

                    <h3 className="truncate text-xl font-bold text-slate-900">
                      {userName}
                    </h3>

                    {userUsername && (
                      <p className="mt-1 truncate text-sm text-slate-500">
                        @{userUsername}
                      </p>
                    )}

                    <span className="mt-3 inline-flex rounded-full bg-slate-100 px-3 py-1 text-xs font-bold uppercase tracking-wide text-slate-600">
                      {userRole}
                    </span>

                  </div>
                </div>

                {/* ACCOUNT INFORMATION */}

                <div className="mt-6">

                  <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400">
                    Account Information
                  </h3>

                  <div className="mt-3 space-y-3">

                    {/* EMAIL */}

                    <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                      <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                        Email
                      </p>

                      <p className="mt-1 break-all text-sm font-medium text-slate-800">
                        {userEmail ||
                          "Not available"}
                      </p>
                    </div>

                    {/* USERNAME */}

                    <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                      <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                        Username
                      </p>

                      <p className="mt-1 text-sm font-medium text-slate-800">
                        {userUsername
                          ? `@${userUsername}`
                          : "Not available"}
                      </p>
                    </div>

                    {/* PHONE */}

                    {userPhone && (
                      <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                        <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                          Phone
                        </p>

                        <p className="mt-1 text-sm font-medium text-slate-800">
                          {userPhone}
                        </p>
                      </div>
                    )}

                    {/* ROLE */}

                    <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                      <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                        Role
                      </p>

                      <p className="mt-1 text-sm font-semibold uppercase text-slate-800">
                        {userRole}
                      </p>
                    </div>

                    {/* USER ID */}

                    {userId && (
                      <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                        <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                          User ID
                        </p>

                        <p className="mt-1 break-all font-mono text-xs text-slate-600">
                          {userId}
                        </p>
                      </div>
                    )}

                  </div>
                </div>

                {/* CLOSE */}

                <button
                  type="button"
                  onClick={
                    handleCloseProfile
                  }
                  className="mt-6 w-full rounded-xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 active:scale-[0.99]"
                >
                  Close
                </button>

              </div>
            </div>

          </div>
        </div>
      )}

      {/* =====================================================
          SETTINGS MODAL
      ===================================================== */}

      {settingsModalOpen && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/60 px-4 py-6 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-labelledby="settings-modal-title"
          onMouseDown={
            handleSettingsBackdropClick
          }
        >

          <div
            ref={settingsModalRef}
            className="relative flex max-h-[90vh] w-full max-w-2xl flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl"
          >

            {/* =================================================
                SETTINGS HEADER
            ================================================= */}

            <div className="relative shrink-0 bg-slate-900 px-6 py-6">

              {/* CLOSE */}

              <button
                type="button"
                onClick={
                  handleCloseSettings
                }
                aria-label="Close settings"
                className="absolute right-4 top-4 rounded-lg p-2 text-slate-300 transition hover:bg-white/10 hover:text-white"
              >
                <CloseIcon />
              </button>

              {/* ICON */}

              <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-white/10 text-white">
                <SettingsIcon />
              </div>

              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
                Application Preferences
              </p>

              <h2
                id="settings-modal-title"
                className="mt-2 text-xl font-bold text-white"
              >
                Settings
              </h2>

              <p className="mt-1 text-sm text-slate-400">
                Manage your NOVA account and application preferences.
              </p>

            </div>

            {/* =================================================
                SETTINGS CONTENT
            ================================================= */}

            <div className="min-h-0 flex-1 overflow-y-auto">

              <div className="space-y-8 px-6 py-6">

                {/* =================================================
                    ACCOUNT
                ================================================= */}

                <section>

                  <div className="mb-4">

                    <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400">
                      Account
                    </h3>

                    <p className="mt-1 text-xs text-slate-500">
                      Basic information associated with your account.
                    </p>

                  </div>

                  <div className="grid gap-3 sm:grid-cols-2">

                    {/* NAME */}

                    <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">

                      <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                        Name
                      </p>

                      <p className="mt-1 truncate text-sm font-semibold text-slate-800">
                        {userName}
                      </p>

                    </div>

                    {/* USERNAME */}

                    <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">

                      <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                        Username
                      </p>

                      <p className="mt-1 truncate text-sm font-semibold text-slate-800">
                        {userUsername
                          ? `@${userUsername}`
                          : "Not available"}
                      </p>

                    </div>

                    {/* EMAIL */}

                    <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 sm:col-span-2">

                      <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                        Email
                      </p>

                      <p className="mt-1 break-all text-sm font-semibold text-slate-800">
                        {userEmail ||
                          "Not available"}
                      </p>

                    </div>

                  </div>
                </section>

                {/* =================================================
                    APPEARANCE
                ================================================= */}

                <section>

                  <div className="mb-4">

                    <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400">
                      Appearance
                    </h3>

                    <p className="mt-1 text-xs text-slate-500">
                      Choose how NOVA should look on your device.
                    </p>

                  </div>

                  <div className="grid gap-3 sm:grid-cols-3">

                    {/* LIGHT */}

                    <button
                      type="button"
                      onClick={() =>
                        handleSettingChange(
                          "theme",
                          "light"
                        )
                      }
                      className={`rounded-xl border p-4 text-left transition ${
                        settings.theme ===
                        "light"
                          ? "border-slate-900 bg-slate-900 text-white shadow-sm"
                          : "border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50"
                      }`}
                    >

                      <div className="flex items-center justify-between">

                        <span className="text-sm font-semibold">
                          Light
                        </span>

                        {settings.theme ===
                          "light" && (
                          <span className="flex h-5 w-5 items-center justify-center rounded-full bg-white text-slate-900">
                            <CheckIcon />
                          </span>
                        )}

                      </div>

                      <p
                        className={`mt-1 text-xs ${
                          settings.theme ===
                          "light"
                            ? "text-slate-300"
                            : "text-slate-500"
                        }`}
                      >
                        Bright interface
                      </p>

                    </button>

                    {/* DARK */}

                    <button
                      type="button"
                      onClick={() =>
                        handleSettingChange(
                          "theme",
                          "dark"
                        )
                      }
                      className={`rounded-xl border p-4 text-left transition ${
                        settings.theme ===
                        "dark"
                          ? "border-slate-900 bg-slate-900 text-white shadow-sm"
                          : "border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50"
                      }`}
                    >

                      <div className="flex items-center justify-between">

                        <span className="text-sm font-semibold">
                          Dark
                        </span>

                        {settings.theme ===
                          "dark" && (
                          <span className="flex h-5 w-5 items-center justify-center rounded-full bg-white text-slate-900">
                            <CheckIcon />
                          </span>
                        )}

                      </div>

                      <p
                        className={`mt-1 text-xs ${
                          settings.theme ===
                          "dark"
                            ? "text-slate-300"
                            : "text-slate-500"
                        }`}
                      >
                        Dark interface
                      </p>

                    </button>

                    {/* SYSTEM */}

                    <button
                      type="button"
                      onClick={() =>
                        handleSettingChange(
                          "theme",
                          "system"
                        )
                      }
                      className={`rounded-xl border p-4 text-left transition ${
                        settings.theme ===
                        "system"
                          ? "border-slate-900 bg-slate-900 text-white shadow-sm"
                          : "border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50"
                      }`}
                    >

                      <div className="flex items-center justify-between">

                        <span className="text-sm font-semibold">
                          System
                        </span>

                        {settings.theme ===
                          "system" && (
                          <span className="flex h-5 w-5 items-center justify-center rounded-full bg-white text-slate-900">
                            <CheckIcon />
                          </span>
                        )}

                      </div>

                      <p
                        className={`mt-1 text-xs ${
                          settings.theme ===
                          "system"
                            ? "text-slate-300"
                            : "text-slate-500"
                        }`}
                      >
                        Follow device
                      </p>

                    </button>

                  </div>
                </section>

                {/* =================================================
                    NOTIFICATIONS
                ================================================= */}

                <section>

                  <div className="mb-4">

                    <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400">
                      Notifications
                    </h3>

                    <p className="mt-1 text-xs text-slate-500">
                      Control which activity updates you receive.
                    </p>

                  </div>

                  <div className="overflow-hidden rounded-xl border border-slate-200">

                    {/* TASK ASSIGNED */}

                    <div className="flex items-center justify-between gap-4 border-b border-slate-100 px-4 py-4">

                      <div>

                        <p className="text-sm font-semibold text-slate-800">
                          Task assigned
                        </p>

                        <p className="mt-1 text-xs text-slate-500">
                          Notify me when a task is assigned to me.
                        </p>

                      </div>

                      <SettingToggle
                        label="Task assigned notifications"
                        enabled={
                          settings
                            .notifications
                            .taskAssigned
                        }
                        onChange={() =>
                          handleNotificationSettingChange(
                            "taskAssigned",
                            !settings
                              .notifications
                              .taskAssigned
                          )
                        }
                      />

                    </div>

                    {/* TASK COMPLETED */}

                    <div className="flex items-center justify-between gap-4 border-b border-slate-100 px-4 py-4">

                      <div>

                        <p className="text-sm font-semibold text-slate-800">
                          Task completed
                        </p>

                        <p className="mt-1 text-xs text-slate-500">
                          Notify me when assigned tasks are completed.
                        </p>

                      </div>

                      <SettingToggle
                        label="Task completed notifications"
                        enabled={
                          settings
                            .notifications
                            .taskCompleted
                        }
                        onChange={() =>
                          handleNotificationSettingChange(
                            "taskCompleted",
                            !settings
                              .notifications
                              .taskCompleted
                          )
                        }
                      />

                    </div>

                    {/* PROJECT UPDATES */}

                    <div className="flex items-center justify-between gap-4 border-b border-slate-100 px-4 py-4">

                      <div>

                        <p className="text-sm font-semibold text-slate-800">
                          Project updates
                        </p>

                        <p className="mt-1 text-xs text-slate-500">
                          Receive updates about project activity.
                        </p>

                      </div>

                      <SettingToggle
                        label="Project update notifications"
                        enabled={
                          settings
                            .notifications
                            .projectUpdates
                        }
                        onChange={() =>
                          handleNotificationSettingChange(
                            "projectUpdates",
                            !settings
                              .notifications
                              .projectUpdates
                          )
                        }
                      />

                    </div>

                    {/* TEAM ACTIVITY */}

                    <div className="flex items-center justify-between gap-4 border-b border-slate-100 px-4 py-4">

                      <div>

                        <p className="text-sm font-semibold text-slate-800">
                          Team activity
                        </p>

                        <p className="mt-1 text-xs text-slate-500">
                          Notify me about important team activity.
                        </p>

                      </div>

                      <SettingToggle
                        label="Team activity notifications"
                        enabled={
                          settings
                            .notifications
                            .teamActivity
                        }
                        onChange={() =>
                          handleNotificationSettingChange(
                            "teamActivity",
                            !settings
                              .notifications
                              .teamActivity
                          )
                        }
                      />

                    </div>

                    {/* EMAIL */}

                    <div className="flex items-center justify-between gap-4 px-4 py-4">

                      <div>

                        <p className="text-sm font-semibold text-slate-800">
                          Email notifications
                        </p>

                        <p className="mt-1 text-xs text-slate-500">
                          Receive selected notifications by email.
                        </p>

                      </div>

                      <SettingToggle
                        label="Email notifications"
                        enabled={
                          settings
                            .notifications
                            .emailNotifications
                        }
                        onChange={() =>
                          handleNotificationSettingChange(
                            "emailNotifications",
                            !settings
                              .notifications
                              .emailNotifications
                          )
                        }
                      />

                    </div>

                  </div>
                </section>

                {/* =================================================
                    SECURITY
                ================================================= */}

                <section>

                  <div className="mb-4">

                    <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400">
                      Security
                    </h3>

                    <p className="mt-1 text-xs text-slate-500">
                      Keep your NOVA account secure.
                    </p>

                  </div>

                  <div className="space-y-3">

                    {/* CHANGE PASSWORD */}

                    <button
                      type="button"
                      onClick={() =>
                        navigate(
                          "/forgot-password"
                        )
                      }
                      className="flex w-full items-center justify-between rounded-xl border border-slate-200 bg-white p-4 text-left transition hover:bg-slate-50"
                    >

                      <div className="flex items-center gap-3">

                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-100 text-slate-600">

                          <svg
                            className="h-5 w-5"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.8"
                          >
                            <rect
                              x="4"
                              y="10"
                              width="16"
                              height="10"
                              rx="2"
                            />

                            <path
                              strokeLinecap="round"
                              d="M8 10V7a4 4 0 018 0v3"
                            />
                          </svg>

                        </div>

                        <div>

                          <p className="text-sm font-semibold text-slate-800">
                            Change password
                          </p>

                          <p className="mt-1 text-xs text-slate-500">
                            Update your account password.
                          </p>

                        </div>

                      </div>

                      <svg
                        className="h-5 w-5 text-slate-400"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M9 5l7 7-7 7"
                        />
                      </svg>

                    </button>

                    {/* TWO FACTOR */}

                    <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 p-4">

                      <div>

                        <p className="text-sm font-semibold text-slate-800">
                          Two-factor authentication
                        </p>

                        <p className="mt-1 text-xs text-slate-500">
                          Add an extra layer of account security.
                        </p>

                      </div>

                      <span className="rounded-full bg-slate-200 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-slate-500">
                        Coming Soon
                      </span>

                    </div>

                  </div>
                </section>

                {/* =================================================
                    DANGER ZONE
                ================================================= */}

                <section>

                  <div className="rounded-xl border border-red-200 bg-red-50 p-4">

                    <div className="flex items-start gap-3">

                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-red-100 text-red-600">

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
                            d="M12 9v4m0 4h.01M10.3 3.6L2.9 17a2 2 0 001.75 3h14.7a2 2 0 001.75-3L13.7 3.6a2 2 0 00-3.4 0z"
                          />
                        </svg>

                      </div>

                      <div className="min-w-0">

                        <h3 className="text-sm font-bold text-red-700">
                          Danger Zone
                        </h3>

                        <p className="mt-1 text-xs leading-5 text-red-600">
                          Account deletion is permanent. All associated data may be removed and cannot be recovered.
                        </p>

                        <button
                          type="button"
                          onClick={() =>
                            window.alert(
                              "Account deletion will be implemented here."
                            )
                          }
                          className="mt-3 rounded-lg border border-red-200 bg-white px-3 py-2 text-xs font-semibold text-red-600 transition hover:bg-red-100"
                        >
                          Delete Account
                        </button>

                      </div>

                    </div>

                  </div>

                </section>

              </div>
            </div>

            {/* =================================================
                SETTINGS FOOTER
            ================================================= */}

            <div className="flex shrink-0 items-center justify-between gap-3 border-t border-slate-200 bg-slate-50 px-6 py-4">

              {/* RESET */}

              <button
                type="button"
                onClick={
                  handleResetSettings
                }
                disabled={
                  settingsSaving
                }
                className="rounded-xl px-4 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-200 hover:text-slate-900 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Reset
              </button>

              <div className="flex items-center gap-2">

                {/* SAVED */}

                {settingsSaved && (
                  <span className="mr-2 hidden text-xs font-semibold text-emerald-600 sm:block">
                    ✓ Saved
                  </span>
                )}

                {/* CANCEL */}

                <button
                  type="button"
                  onClick={
                    handleCloseSettings
                  }
                  disabled={
                    settingsSaving
                  }
                  className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Cancel
                </button>

                {/* SAVE */}

                <button
                  type="button"
                  onClick={
                    handleSaveSettings
                  }
                  disabled={
                    settingsSaving
                  }
                  className="flex min-w-[125px] items-center justify-center gap-2 rounded-xl bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-70"
                >

                  {settingsSaving ? (
                    <>
                      <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />

                      Saving...
                    </>
                  ) : (
                    "Save Changes"
                  )}

                </button>

              </div>
            </div>

          </div>
        </div>
      )}
    </>
  );
};

export default AppHeader;
