// eslint-disable-next-line no-unused-vars
import React from "react";
import TaskCard from "./TaskCard";

const TaskColumn = ({
  title,
  status,
  tasks = [],
  loading = false,
  error = "",
  onStatusChange,
  onDelete,
}) => {
  // =====================================================
  // SAFETY
  // =====================================================

  const safeTasks = Array.isArray(tasks) ? tasks : [];

  // =====================================================
  // STATUS CONFIG
  // =====================================================

  const statusConfig = {
    TODO: {
      label: "To Do",
      dot: "bg-gray-500",
      count: "bg-gray-100 text-gray-700",
    },

    IN_PROGRESS: {
      label: "In Progress",
      dot: "bg-blue-500",
      count: "bg-blue-100 text-blue-700",
    },

    REVIEW: {
      label: "Review",
      dot: "bg-yellow-500",
      count: "bg-yellow-100 text-yellow-700",
    },

    DONE: {
      label: "Done",
      dot: "bg-green-500",
      count: "bg-green-100 text-green-700",
    },
  };

  const currentStatus =
    String(status || "").toUpperCase();

  const config =
    statusConfig[currentStatus] || {
      label: title || "Tasks",
      dot: "bg-slate-500",
      count: "bg-slate-100 text-slate-700",
    };

  // =====================================================
  // COLUMN TITLE
  // =====================================================

  const columnTitle =
    title || config.label;

  // =====================================================
  // RENDER
  // =====================================================

  return (
    <section className="flex min-w-0 flex-col rounded-2xl bg-slate-100 p-3">

      {/* =================================================
          COLUMN HEADER
      ================================================= */}

      <div className="mb-3 flex items-center justify-between px-1">

        <div className="flex min-w-0 items-center gap-2">

          {/* STATUS DOT */}

          <span
            className={`h-2.5 w-2.5 shrink-0 rounded-full ${config.dot}`}
          />

          {/* TITLE */}

          <h2 className="truncate text-sm font-bold text-slate-800">
            {columnTitle}
          </h2>

        </div>

        {/* TASK COUNT */}

        <span
          className={`ml-2 inline-flex min-w-7 items-center justify-center rounded-full px-2 py-1 text-xs font-bold ${config.count}`}
        >
          {safeTasks.length}
        </span>

      </div>

      {/* =================================================
          ERROR
      ================================================= */}

      {error && (
        <div
          role="alert"
          className="mb-3 rounded-xl border border-red-200 bg-red-50 p-3 text-xs text-red-600"
        >
          {error}
        </div>
      )}

      {/* =================================================
          LOADING
      ================================================= */}

      {loading ? (
        <div className="space-y-3">

          {[1, 2, 3].map((item) => (
            <div
              key={item}
              className="animate-pulse rounded-xl bg-white p-4 shadow-sm"
            >
              <div className="h-4 w-3/4 rounded bg-slate-200" />

              <div className="mt-3 h-3 w-full rounded bg-slate-200" />

              <div className="mt-2 h-3 w-5/6 rounded bg-slate-200" />

              <div className="mt-4 h-8 w-1/3 rounded-full bg-slate-200" />

              <div className="mt-4 h-10 w-full rounded-lg bg-slate-200" />
            </div>
          ))}

        </div>
      ) : safeTasks.length === 0 ? (

        /* =================================================
           EMPTY STATE
        ================================================= */

        <div className="rounded-xl border border-dashed border-slate-300 bg-white/70 px-4 py-8 text-center">

          <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-slate-100">

            <svg
              className="h-5 w-5 text-slate-400"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 5h6M9 9h6M9 13h4M6 3h12a2 2 0 012 2v14a2 2 0 01-2 2H6a2 2 0 01-2-2V5a2 2 0 012-2z"
              />
            </svg>

          </div>

          <p className="mt-3 text-sm font-medium text-slate-600">
            No tasks
          </p>

          <p className="mt-1 text-xs text-slate-400">
            Tasks will appear here.
          </p>

        </div>
      ) : (

        /* =================================================
           TASK LIST
        ================================================= */

        <div className="space-y-3">

          {safeTasks.map((task) => {

            if (!task?._id) {
              return null;
            }

            return (
              <TaskCard
                key={task._id}
                task={task}
                onStatusChange={onStatusChange}
                onDelete={onDelete}
              />
            );
          })}

        </div>
      )}

    </section>
  );
};

export default TaskColumn;

