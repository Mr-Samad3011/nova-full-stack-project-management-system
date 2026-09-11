/* eslint-disable react-hooks/set-state-in-effect */
import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import { useNavigate } from "react-router-dom";

import { getDashboardStats } from "../services/dashboardService";

import { useAuth } from "../context/AuthContext";

// =====================================================
// DASHBOARD
// =====================================================

const Dashboard = () => {
  const navigate = useNavigate();

  // =====================================================
  // AUTH / RBAC
  // =====================================================

  const { user } = useAuth();

  // =====================================================
  // STATE
  // =====================================================

  const [dashboard, setDashboard] = useState(null);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  // =====================================================
  // ROLE
  // =====================================================

  const userRole = String(
    dashboard?.userRole ||
      user?.role ||
      "MEMBER"
  )
    .trim()
    .toUpperCase();

  const isOwner = userRole === "OWNER";

  const isAdmin = userRole === "ADMIN";

  const isManager = userRole === "MANAGER";

  const isMember = userRole === "MEMBER";

  // Owner + Admin have elevated dashboard access.
  const hasAdminAccess =
    isOwner || isAdmin;

  // =====================================================
  // LOAD DASHBOARD
  // =====================================================

  const loadDashboard = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const response = await getDashboardStats();

      // dashboardService already returns:
      //
      // {
      //   stats: {},
      //   recentProjects: [],
      //   recentTasks: []
      // }
      //
      // So do NOT use response.data here.

      setDashboard(response || {});
    } catch (err) {
      console.error(
        "Dashboard Error:",
        err
      );

      const status =
        err?.response?.status;

      // =================================================
      // 401
      // =================================================

      if (status === 401) {
        setError(
          "Your session has expired. Please login again."
        );

        return;
      }

      // =================================================
      // 403
      // =================================================

      if (status === 403) {
        setError(
          "You do not have permission to access this dashboard."
        );

        return;
      }

      // =================================================
      // OTHER ERRORS
      // =================================================

      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Unable to load dashboard."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  // =====================================================
  // INITIAL LOAD
  // =====================================================

  useEffect(() => {
    // Wait until AuthContext has a user.
    if (!user) {
      setLoading(false);
      return;
    }

    loadDashboard();
  }, [user, loadDashboard]);

  // =====================================================
  // SAFE DATA
  // =====================================================

  const stats =
    dashboard?.stats || {};

  const recentProjects = Array.isArray(
    dashboard?.recentProjects
  )
    ? dashboard.recentProjects
    : [];

  const recentTasks = Array.isArray(
    dashboard?.recentTasks
  )
    ? dashboard.recentTasks
    : [];

  // =====================================================
  // SAFE NUMERIC VALUES
  // =====================================================

  const totalProjects =
    Number(
      stats?.totalProjects
    ) || 0;

  const totalTasks =
    Number(
      stats?.totalTasks
    ) || 0;

  const completedTasks =
    Number(
      stats?.completedTasks
    ) || 0;

  const overdueTasks =
    Number(
      stats?.overdueTasks
    ) || 0;

  const todoTasks =
    Number(
      stats?.todoTasks
    ) || 0;

  const inProgressTasks =
    Number(
      stats?.inProgressTasks
    ) || 0;

  const reviewTasks =
    Number(
      stats?.reviewTasks
    ) || 0;

  const myTasks =
    Number(
      stats?.myTasks
    ) || 0;

  const completionPercentage =
    Math.min(
      Math.max(
        Number(
          stats?.completionPercentage
        ) || 0,
        0
      ),
      100
    );

  // =====================================================
  // TASK DISTRIBUTION
  // =====================================================

  const taskDistribution =
    useMemo(
      () => [
        {
          label: "To Do",
          value: todoTasks,
          className:
            "bg-gray-400",
        },

        {
          label: "In Progress",
          value: inProgressTasks,
          className:
            "bg-blue-500",
        },

        {
          label: "Review",
          value: reviewTasks,
          className:
            "bg-yellow-500",
        },

        {
          label: "Completed",
          value: completedTasks,
          className:
            "bg-green-500",
        },
      ],
      [
        todoTasks,
        inProgressTasks,
        reviewTasks,
        completedTasks,
      ]
    );

  // =====================================================
  // PROJECT STATUS CLASS
  // =====================================================

  const getStatusClass = (status) => {
    switch (
      String(status || "")
        .trim()
        .toUpperCase()
    ) {
      case "ACTIVE":
        return "bg-green-100 text-green-700";

      case "COMPLETED":
      case "DONE":
        return "bg-blue-100 text-blue-700";

      case "PLANNING":
        return "bg-yellow-100 text-yellow-700";

      case "ON_HOLD":
      case "ON HOLD":
        return "bg-orange-100 text-orange-700";

      case "ARCHIVED":
        return "bg-gray-100 text-gray-600";

      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  // =====================================================
  // TASK STATUS CLASS
  // =====================================================

  const getTaskStatusClass = (status) => {
    switch (
      String(status || "")
        .trim()
        .toUpperCase()
    ) {
      case "TODO":
        return "bg-gray-100 text-gray-700";

      case "IN_PROGRESS":
        return "bg-blue-100 text-blue-700";

      case "REVIEW":
        return "bg-yellow-100 text-yellow-700";

      case "DONE":
      case "COMPLETED":
        return "bg-green-100 text-green-700";

      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  // =====================================================
  // PRIORITY CLASS
  // =====================================================

  const getPriorityClass = (priority) => {
    switch (
      String(priority || "")
        .trim()
        .toUpperCase()
    ) {
      case "LOW":
        return "bg-gray-100 text-gray-700";

      case "MEDIUM":
        return "bg-blue-100 text-blue-700";

      case "HIGH":
        return "bg-orange-100 text-orange-700";

      case "URGENT":
        return "bg-red-100 text-red-700";

      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="text-center">
          <div
            className="
              mx-auto
              mb-4
              h-10
              w-10
              animate-spin
              rounded-full
              border-4
              border-gray-200
              border-t-gray-900
            "
          />

          <p className="text-sm text-gray-500">
            Loading dashboard...
          </p>
        </div>
      </div>
    );
  }

  // =====================================================
  // ERROR
  // =====================================================

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 p-6">
        <div className="w-full max-w-md rounded-2xl bg-white p-8 text-center shadow-sm">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-50">
            <span className="text-xl font-bold text-red-600">
              !
            </span>
          </div>

          <h2 className="mt-4 text-lg font-semibold text-gray-900">
            Unable to load dashboard
          </h2>

          <p className="mt-2 text-sm text-red-500">
            {error}
          </p>

          <button
            type="button"
            onClick={loadDashboard}
            className="
              mt-5
              rounded-lg
              bg-gray-900
              px-5
              py-2.5
              text-sm
              font-medium
              text-white
              transition
              hover:bg-gray-800
            "
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // =====================================================
  // RENDER
  // =====================================================

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6">
      <div className="mx-auto max-w-7xl">

        {/* =================================================
            HEADER
        ================================================= */}

        <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-bold text-gray-900">
                Dashboard
              </h1>

              {/* ROLE BADGE */}

              <span
                className={`
                  rounded-full
                  px-3
                  py-1
                  text-xs
                  font-semibold
                  ${
                    hasAdminAccess
                      ? "bg-purple-100 text-purple-700"
                      : isManager
                      ? "bg-blue-100 text-blue-700"
                      : "bg-gray-100 text-gray-700"
                  }
                `}
              >
                {userRole}
              </span>
            </div>

            <p className="mt-1 text-sm text-gray-500">
              Here's what's happening with your projects.
            </p>
          </div>

          <div className="flex gap-3">
            {/* ANALYTICS */}

            <button
              type="button"
              onClick={() =>
                navigate("/analytics")
              }
              className="
                rounded-lg
                border
                border-gray-200
                bg-white
                px-5
                py-2.5
                text-sm
                font-medium
                text-gray-700
                transition
                hover:bg-gray-50
              "
            >
              Analytics
            </button>

            {/* PROJECTS */}

            <button
              type="button"
              onClick={() =>
                navigate("/projects")
              }
              className="
                rounded-lg
                bg-gray-900
                px-5
                py-2.5
                text-sm
                font-medium
                text-white
                transition
                hover:bg-gray-800
              "
            >
              View Projects
            </button>
          </div>
        </div>

        {/* =================================================
            OWNER / ADMIN INFO
        ================================================= */}

        {hasAdminAccess && (
          <div className="mb-6 rounded-2xl border border-purple-100 bg-purple-50 p-5">
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-purple-100">
                <span className="font-bold text-purple-700">
                  {isOwner ? "O" : "A"}
                </span>
              </div>

              <div>
                <h2 className="font-semibold text-purple-900">
                  {isOwner
                    ? "Owner Dashboard"
                    : "Administrator Dashboard"}
                </h2>

                <p className="mt-1 text-sm text-purple-700">
                  {isOwner
                    ? "You have owner-level access to the dashboard and system resources."
                    : "You have administrator privileges. Project and user management permissions depend on the protected backend routes."}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* =================================================
            MANAGER INFO
        ================================================= */}

        {isManager && (
          <div className="mb-6 rounded-2xl border border-blue-100 bg-blue-50 p-5">
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-100">
                <span className="font-bold text-blue-700">
                  M
                </span>
              </div>

              <div>
                <h2 className="font-semibold text-blue-900">
                  Manager Dashboard
                </h2>

                <p className="mt-1 text-sm text-blue-700">
                  You can view projects and tasks that
                  you own or belong to.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* =================================================
            MEMBER INFO
        ================================================= */}

        {isMember && (
          <div className="mb-6 rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gray-100">
                <span className="font-bold text-gray-600">
                  M
                </span>
              </div>

              <div>
                <h2 className="font-semibold text-gray-900">
                  Member Dashboard
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                  You can view projects and tasks that
                  you own or are a member of.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* =================================================
            STAT CARDS
        ================================================= */}

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            label="Total Projects"
            value={totalProjects}
          />

          <StatCard
            label="Total Tasks"
            value={totalTasks}
          />

          <StatCard
            label="Completed"
            value={completedTasks}
            valueClass="text-green-600"
          />

          <StatCard
            label="Overdue"
            value={overdueTasks}
            valueClass="text-red-600"
          />
        </div>

        {/* =================================================
            OVERALL PROGRESS
        ================================================= */}

        <div className="mt-8 rounded-2xl bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">
                Overall Progress
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                Completion across your accessible tasks
              </p>
            </div>

            <span className="text-2xl font-bold text-gray-900">
              {completionPercentage.toFixed(0)}%
            </span>
          </div>

          <div className="mt-5 h-3 overflow-hidden rounded-full bg-gray-100">
            <div
              className="
                h-full
                rounded-full
                bg-blue-600
                transition-all
                duration-700
              "
              style={{
                width:
                  `${completionPercentage}%`,
              }}
            />
          </div>

          <div className="mt-3 flex justify-between text-xs text-gray-400">
            <span>
              {completedTasks} completed
            </span>

            <span>
              {totalTasks} total tasks
            </span>
          </div>
        </div>

        {/* =================================================
            MAIN CONTENT
        ================================================= */}

        <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-2">

          {/* =================================================
              TASK OVERVIEW
          ================================================= */}

          <div className="rounded-2xl bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold text-gray-900">
                  Task Overview
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                  Current task distribution
                </p>
              </div>

              <button
                type="button"
                onClick={() =>
                  navigate("/tasks")
                }
                className="
                  text-sm
                  font-medium
                  text-blue-600
                  hover:text-blue-700
                "
              >
                View all
              </button>
            </div>

            <div className="mt-6 space-y-5">
              {taskDistribution.map(
                (item) => (
                  <DashboardProgress
                    key={item.label}
                    label={item.label}
                    value={item.value}
                    total={totalTasks}
                    className={
                      item.className
                    }
                  />
                )
              )}

              <div className="flex items-center justify-between border-t border-gray-100 pt-4">
                <span className="text-sm text-gray-600">
                  My Tasks
                </span>

                <span className="rounded-full bg-gray-100 px-3 py-1 text-sm font-semibold text-gray-800">
                  {myTasks}
                </span>
              </div>
            </div>
          </div>

          {/* =================================================
              RECENT PROJECTS
          ================================================= */}

          <div className="rounded-2xl bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold text-gray-900">
                  Recent Projects
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                  Your latest accessible projects
                </p>
              </div>

              <button
                type="button"
                onClick={() =>
                  navigate("/projects")
                }
                className="
                  text-sm
                  font-medium
                  text-blue-600
                  hover:text-blue-700
                "
              >
                View all
              </button>
            </div>

            <div className="mt-6 space-y-3">
              {recentProjects.length === 0 ? (
                <EmptyState
                  message="No projects found."
                  actionLabel="Create your first project"
                  onAction={() =>
                    navigate(
                      "/projects/create"
                    )
                  }
                />
              ) : (
                recentProjects
                  .slice(0, 6)
                  .map((project) => (
                    <button
                      key={
                        project?._id ||
                        project?.id
                      }
                      type="button"
                      disabled={!project?._id}
                      onClick={() => {
                        if (
                          project?._id
                        ) {
                          navigate(
                            `/projects/${project._id}`
                          );
                        }
                      }}
                      className="
                        flex
                        w-full
                        items-center
                        justify-between
                        gap-4
                        rounded-xl
                        border
                        border-gray-100
                        p-4
                        text-left
                        transition
                        hover:bg-gray-50
                        disabled:cursor-default
                      "
                    >
                      <div className="min-w-0">
                        <p className="truncate font-medium text-gray-900">
                          {project?.name ||
                            project?.title ||
                            "Untitled Project"}
                        </p>

                        <p className="mt-1 line-clamp-1 text-sm text-gray-500">
                          {project?.description ||
                            "No description"}
                        </p>
                      </div>

                      <div className="flex shrink-0 items-center gap-3">
                        <span
                          className={`
                            rounded-full
                            px-2.5
                            py-1
                            text-xs
                            font-semibold
                            ${getStatusClass(
                              project?.status
                            )}
                          `}
                        >
                          {formatProjectStatus(
                            project?.status
                          )}
                        </span>

                        <span className="text-gray-400">
                          →
                        </span>
                      </div>
                    </button>
                  ))
              )}
            </div>
          </div>
        </div>

        {/* =================================================
            RECENT TASKS
        ================================================= */}

        <div className="mt-8 rounded-2xl bg-white p-6 shadow-sm">
          <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                Recent Tasks
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                Recently created or updated tasks
              </p>
            </div>

            <button
              type="button"
              onClick={() =>
                navigate("/tasks")
              }
              className="
                text-sm
                font-medium
                text-blue-600
                hover:text-blue-700
              "
            >
              View all
            </button>
          </div>

          {recentTasks.length === 0 ? (
            <div className="mt-6">
              <EmptyState message="No tasks found." />
            </div>
          ) : (
            <div className="mt-6 overflow-x-auto">
              <table className="w-full min-w-[700px]">
                <thead>
                  <tr className="border-b border-gray-100 text-left text-sm text-gray-500">
                    <th className="pb-3 font-medium">
                      Task
                    </th>

                    <th className="pb-3 font-medium">
                      Project
                    </th>

                    <th className="pb-3 font-medium">
                      Status
                    </th>

                    <th className="pb-3 font-medium">
                      Priority
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {recentTasks
                    .slice(0, 8)
                    .map((task) => (
                      <tr
                        key={
                          task?._id ||
                          task?.id
                        }
                        className="
                          border-b
                          border-gray-100
                          last:border-b-0
                        "
                      >
                        <td className="py-4">
                          <p className="font-medium text-gray-900">
                            {task?.title ||
                              "Untitled Task"}
                          </p>

                          {task?.dueDate && (
                            <p className="mt-1 text-xs text-gray-400">
                              Due:{" "}
                              {formatDate(
                                task.dueDate
                              )}
                            </p>
                          )}
                        </td>

                        <td className="py-4 text-sm text-gray-500">
                          {task?.project
                            ?.name ||
                            task?.project
                              ?.title ||
                            "Unknown Project"}
                        </td>

                        <td className="py-4">
                          <span
                            className={`
                              rounded-full
                              px-2.5
                              py-1
                              text-xs
                              font-semibold
                              ${getTaskStatusClass(
                                task?.status
                              )}
                            `}
                          >
                            {formatTaskStatus(
                              task?.status
                            )}
                          </span>
                        </td>

                        <td className="py-4">
                          <span
                            className={`
                              rounded-full
                              px-2.5
                              py-1
                              text-xs
                              font-semibold
                              ${getPriorityClass(
                                task?.priority
                              )}
                            `}
                          >
                            {formatPriority(
                              task?.priority
                            )}
                          </span>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* =================================================
            QUICK ACTIONS
        ================================================= */}

        <div
          className={`
            mt-8
            grid
            grid-cols-1
            gap-4
            ${
              hasAdminAccess
                ? "sm:grid-cols-4"
                : "sm:grid-cols-3"
            }
          `}
        >
          {/* PROJECTS */}

          <QuickAction
            title="Projects"
            description="Manage your accessible projects"
            onClick={() =>
              navigate("/projects")
            }
          />

          {/* TASKS */}

          <QuickAction
            title="Tasks"
            description="View and manage tasks"
            onClick={() =>
              navigate("/tasks")
            }
          />

          {/* TEAM */}

          <QuickAction
            title="Team"
            description="View project teams"
            onClick={() =>
              navigate("/team")
            }
          />

          {/* OWNER / ADMIN */}

          {hasAdminAccess && (
            <QuickAction
              title={
                isOwner
                  ? "Owner"
                  : "Admin"
              }
              description={
                isOwner
                  ? "Manage system ownership and access"
                  : "Manage users and system access"
              }
              onClick={() =>
                navigate(
                  isOwner
                    ? "/owner"
                    : "/admin"
                )
              }
            />
          )}
        </div>
      </div>
    </div>
  );
};

// =====================================================
// STAT CARD
// =====================================================

const StatCard = ({
  label,
  value,
  valueClass = "text-gray-900",
}) => {
  return (
    <div
      className="
        rounded-2xl
        bg-white
        p-6
        shadow-sm
        transition
        hover:-translate-y-0.5
        hover:shadow-md
      "
    >
      <p className="text-sm font-medium text-gray-500">
        {label}
      </p>

      <p
        className={`
          mt-2
          text-3xl
          font-bold
          ${valueClass}
        `}
      >
        {value}
      </p>
    </div>
  );
};

// =====================================================
// DASHBOARD PROGRESS
// =====================================================

const DashboardProgress = ({
  label,
  value,
  total,
  className,
}) => {
  const percentage =
    total > 0
      ? Math.min(
          (value / total) * 100,
          100
        )
      : 0;

  return (
    <div>
      <div className="mb-2 flex justify-between text-sm">
        <span className="text-gray-600">
          {label}
        </span>

        <span className="font-semibold text-gray-900">
          {value}
        </span>
      </div>

      <div className="h-2 overflow-hidden rounded-full bg-gray-100">
        <div
          className={`
            h-full
            rounded-full
            transition-all
            duration-500
            ${className}
          `}
          style={{
            width:
              `${percentage}%`,
          }}
        />
      </div>
    </div>
  );
};

// =====================================================
// EMPTY STATE
// =====================================================

const EmptyState = ({
  message,
  actionLabel,
  onAction,
}) => {
  return (
    <div className="rounded-xl border border-dashed border-gray-200 p-6 text-center">
      <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-gray-100">
        <span className="text-lg text-gray-400">
          —
        </span>
      </div>

      <p className="mt-3 text-sm text-gray-500">
        {message}
      </p>

      {actionLabel && onAction && (
        <button
          type="button"
          onClick={onAction}
          className="
            mt-3
            text-sm
            font-medium
            text-blue-600
            hover:text-blue-700
          "
        >
          {actionLabel} →
        </button>
      )}
    </div>
  );
};

// =====================================================
// QUICK ACTION
// =====================================================

const QuickAction = ({
  title,
  description,
  onClick,
}) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className="
        rounded-2xl
        border
        border-gray-100
        bg-white
        p-5
        text-left
        shadow-sm
        transition
        hover:-translate-y-0.5
        hover:shadow-md
      "
    >
      <p className="font-semibold text-gray-900">
        {title}
      </p>

      <p className="mt-1 text-sm text-gray-500">
        {description}
      </p>

      <span className="mt-4 inline-block text-sm font-medium text-blue-600">
        Open →
      </span>
    </button>
  );
};

// =====================================================
// PROJECT STATUS FORMATTER
// =====================================================

const formatProjectStatus = (status) => {
  if (!status) {
    return "Unknown";
  }

  return String(status)
    .replaceAll("_", " ")
    .split(" ")
    .map(
      (word) =>
        word.charAt(0).toUpperCase() +
        word.slice(1).toLowerCase()
    )
    .join(" ");
};

// =====================================================
// TASK STATUS FORMATTER
// =====================================================

const formatTaskStatus = (status) => {
  switch (
    String(status || "")
      .trim()
      .toUpperCase()
  ) {
    case "TODO":
      return "To Do";

    case "IN_PROGRESS":
      return "In Progress";

    case "REVIEW":
      return "Review";

    case "DONE":
    case "COMPLETED":
      return "Completed";

    default:
      return formatProjectStatus(
        status
      );
  }
};

// =====================================================
// PRIORITY FORMATTER
// =====================================================

const formatPriority = (priority) => {
  if (!priority) {
    return "Unknown";
  }

  return String(priority)
    .replaceAll("_", " ")
    .split(" ")
    .map(
      (word) =>
        word.charAt(0).toUpperCase() +
        word.slice(1).toLowerCase()
    )
    .join(" ");
};

// =====================================================
// DATE FORMATTER
// =====================================================

const formatDate = (date) => {
  if (!date) {
    return "Not set";
  }

  const parsedDate = new Date(date);

  if (
    Number.isNaN(
      parsedDate.getTime()
    )
  ) {
    return "Invalid date";
  }

  return parsedDate.toLocaleDateString(
    "en-IN",
    {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }
  );
};

// =====================================================
// EXPORT
// =====================================================

export default Dashboard;
