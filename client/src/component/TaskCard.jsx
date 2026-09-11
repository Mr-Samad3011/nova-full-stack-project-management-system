
// eslint-disable-next-line no-unused-vars
import React, { useState } from "react";

const TaskCard = ({
  task,
  onStatusChange,
  onDelete,
}) => {
  const [statusLoading, setStatusLoading] =
    useState(false);

  const [deleteLoading, setDeleteLoading] =
    useState(false);

  // =====================================================
  // SAFETY
  // =====================================================

  if (!task) {
    return null;
  }

  // =====================================================
  // PRIORITY STYLES
  // =====================================================

  const priorityClass = {
    LOW: "bg-gray-100 text-gray-700",
    MEDIUM: "bg-blue-100 text-blue-700",
    HIGH: "bg-orange-100 text-orange-700",
    URGENT: "bg-red-100 text-red-700",
  };

  const currentPriority =
    task.priority || "MEDIUM";

  const currentPriorityClass =
    priorityClass[currentPriority] ||
    priorityClass.MEDIUM;

  // =====================================================
  // ASSIGNED USER
  // Object OR ID/String
  // =====================================================

  const getAssignedUser = () => {
    if (!task.assignedTo) {
      return null;
    }

    if (
      typeof task.assignedTo === "object"
    ) {
      return (
        task.assignedTo?.name ||
        task.assignedTo?.username ||
        task.assignedTo?.email ||
        "Unknown User"
      );
    }

    return task.assignedTo;
  };

  const assignedUser =
    getAssignedUser();

  // =====================================================
  // DUE DATE
  // =====================================================

  const getFormattedDate = (date) => {
    if (!date) {
      return null;
    }

    const parsedDate =
      new Date(date);

    if (
      Number.isNaN(
        parsedDate.getTime()
      )
    ) {
      return null;
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

  const formattedDueDate =
    getFormattedDate(task.dueDate);

  // =====================================================
  // STATUS
  // =====================================================

  const currentStatus =
    task.status || "TODO";

  // =====================================================
  // STATUS CHANGE
  // =====================================================

  const handleStatusChange =
    async (e) => {
      const newStatus =
        e.target.value;

      if (
        !onStatusChange ||
        newStatus === currentStatus
      ) {
        return;
      }

      try {
        setStatusLoading(true);

        await onStatusChange(
          task._id,
          newStatus
        );
      } catch (error) {
        console.error(
          "Task status update error:",
          error
        );
      } finally {
        setStatusLoading(false);
      }
    };

  // =====================================================
  // DELETE
  // =====================================================

  const handleDelete = async () => {
    if (!onDelete || deleteLoading) {
      return;
    }

    try {
      setDeleteLoading(true);

      await onDelete(task._id);
    } catch (error) {
      console.error(
        "Task delete error:",
        error
      );
    } finally {
      setDeleteLoading(false);
    }
  };

  // =====================================================
  // STATUS LABEL
  // =====================================================

  const statusLabels = {
    TODO: "To Do",
    IN_PROGRESS: "In Progress",
    REVIEW: "Review",
    DONE: "Done",
  };

  // =====================================================
  // RENDER
  // =====================================================

  return (
    <div className="rounded-xl bg-white p-4 shadow-sm transition hover:shadow-md">

      {/* =================================================
          TASK HEADER
      ================================================= */}

      <div className="flex items-start justify-between gap-3">

        <h4 className="min-w-0 break-words font-semibold text-gray-900">
          {task.title || "Untitled Task"}
        </h4>

        <button
          type="button"
          onClick={handleDelete}
          disabled={deleteLoading}
          className="shrink-0 rounded-md px-2 py-1 text-lg text-gray-400 transition hover:bg-red-50 hover:text-red-500 disabled:cursor-not-allowed disabled:opacity-50"
          title={
            deleteLoading
              ? "Deleting task..."
              : "Delete task"
          }
          aria-label="Delete task"
        >
          {deleteLoading ? "..." : "×"}
        </button>

      </div>

      {/* =================================================
          DESCRIPTION
      ================================================= */}

      {task.description && (
        <p className="mt-2 line-clamp-3 text-sm leading-5 text-gray-500">
          {task.description}
        </p>
      )}

      {/* =================================================
          PRIORITY
      ================================================= */}

      <div className="mt-4">

        <p className="mb-1 text-xs font-medium text-gray-500">
          Priority
        </p>

        <span
          className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${currentPriorityClass}`}
        >
          {currentPriority}
        </span>

      </div>

      {/* =================================================
          ASSIGNED USER
      ================================================= */}

      {assignedUser && (
        <div className="mt-4">

          <p className="text-xs font-medium text-gray-500">
            Assigned to
          </p>

          <p className="mt-0.5 truncate text-sm font-medium text-gray-700">
            {assignedUser}
          </p>

        </div>
      )}

      {/* =================================================
          DUE DATE
      ================================================= */}

      {formattedDueDate && (
        <div className="mt-4">

          <p className="text-xs font-medium text-gray-500">
            Due Date
          </p>

          <p className="mt-0.5 text-sm font-medium text-gray-700">
            {formattedDueDate}
          </p>

        </div>
      )}

      {/* =================================================
          STATUS
      ================================================= */}

      <div className="mt-4">

        <div className="mb-1 flex items-center justify-between">

          <label
            htmlFor={`task-status-${task._id}`}
            className="text-xs font-medium text-gray-500"
          >
            Status
          </label>

          {statusLoading && (
            <span className="text-xs text-gray-400">
              Updating...
            </span>
          )}

        </div>

        <select
          id={`task-status-${task._id}`}
          value={currentStatus}
          onChange={handleStatusChange}
          disabled={
            statusLoading ||
            deleteLoading
          }
          className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm outline-none transition focus:border-gray-500 focus:ring-2 focus:ring-gray-200 disabled:cursor-not-allowed disabled:bg-gray-100"
        >

          <option value="TODO">
            {statusLabels.TODO}
          </option>

          <option value="IN_PROGRESS">
            {statusLabels.IN_PROGRESS}
          </option>

          <option value="REVIEW">
            {statusLabels.REVIEW}
          </option>

          <option value="DONE">
            {statusLabels.DONE}
          </option>

        </select>

      </div>

    </div>
  );
};

export default TaskCard;

