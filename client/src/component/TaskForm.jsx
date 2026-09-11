/* eslint-disable react-hooks/preserve-manual-memoization */
/* eslint-disable react-hooks/set-state-in-effect */

import { useEffect, useMemo, useState } from "react";

const INITIAL_FORM = {
  title: "",
  description: "",
  priority: "MEDIUM",
  dueDate: "",
  assignedTo: "",
};

const TaskForm = ({
  project,
  onSubmit,
  onCancel,
  loading = false,
}) => {
  const [form, setForm] = useState(INITIAL_FORM);
  const [error, setError] = useState("");

  // =====================================================
  // MEMBERS
  // =====================================================

  const members = useMemo(() => {
    if (!Array.isArray(project?.members)) {
      return [];
    }

    return project.members.filter(Boolean);
  }, [project?.members]);

  // =====================================================
  // MINIMUM DATE
  // Prevent selecting past date
  // =====================================================

  const today = useMemo(() => {
    const date = new Date();

    const year = date.getFullYear();
    const month = String(
      date.getMonth() + 1
    ).padStart(2, "0");

    const day = String(
      date.getDate()
    ).padStart(2, "0");

    return `${year}-${month}-${day}`;
  }, []);

  // =====================================================
  // RESET FORM
  // =====================================================

  const resetForm = () => {
    setForm(INITIAL_FORM);
    setError("");
  };

  // =====================================================
  // RESET WHEN PROJECT CHANGES
  // =====================================================

  useEffect(() => {
    resetForm();
  }, [project?._id]);

  // =====================================================
  // HANDLE CHANGE
  // =====================================================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setError("");

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  // =====================================================
  // VALIDATION
  // =====================================================

  const validateForm = () => {
    const title = form.title.trim();

    if (!title) {
      return "Task title is required.";
    }

    if (title.length < 2) {
      return "Task title must contain at least 2 characters.";
    }

    if (title.length > 150) {
      return "Task title cannot exceed 150 characters.";
    }

    if (form.description.trim().length > 2000) {
      return "Description cannot exceed 2000 characters.";
    }

    if (form.dueDate && form.dueDate < today) {
      return "Due date cannot be in the past.";
    }

    const validPriorities = [
      "LOW",
      "MEDIUM",
      "HIGH",
      "URGENT",
    ];

    if (!validPriorities.includes(form.priority)) {
      return "Invalid task priority.";
    }

    return "";
  };

  // =====================================================
  // SUBMIT
  // =====================================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (loading) {
      return;
    }

    setError("");

    const validationError = validateForm();

    if (validationError) {
      setError(validationError);
      return;
    }

    const payload = {
      title: form.title.trim(),

      description:
        form.description.trim(),

      priority: form.priority,

      dueDate:
        form.dueDate || undefined,

      assignedTo:
        form.assignedTo || undefined,
    };

    try {
      const result = await onSubmit(payload);

      /*
       * Parent can return false when API request fails.
       * Only reset form after successful submission.
       */
      if (result === false) {
        return;
      }

      resetForm();
    } catch (err) {
      console.error(
        "Task form submission error:",
        err
      );

      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Unable to create task."
      );
    }
  };

  // =====================================================
  // CANCEL
  // =====================================================

  const handleCancel = () => {
    if (loading) {
      return;
    }

    resetForm();

    if (onCancel) {
      onCancel();
    }
  };

  // =====================================================
  // RENDER
  // =====================================================

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4"
      noValidate
    >
      {/* =================================================
          ERROR
      ================================================= */}

      {error && (
        <div
          role="alert"
          className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600"
        >
          {error}
        </div>
      )}

      {/* =================================================
          TITLE
      ================================================= */}

      <div>
        <label
          htmlFor="task-title"
          className="mb-1 block text-sm font-medium text-gray-700"
        >
          Task Title
        </label>

        <input
          id="task-title"
          type="text"
          name="title"
          value={form.title}
          onChange={handleChange}
          placeholder="Enter task title"
          maxLength={150}
          disabled={loading}
          autoFocus
          className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none transition focus:border-gray-500 focus:ring-2 focus:ring-gray-200 disabled:cursor-not-allowed disabled:bg-gray-100"
          required
        />

        <div className="mt-1 flex justify-end">
          <span className="text-xs text-gray-400">
            {form.title.length}/150
          </span>
        </div>
      </div>

      {/* =================================================
          DESCRIPTION
      ================================================= */}

      <div>
        <label
          htmlFor="task-description"
          className="mb-1 block text-sm font-medium text-gray-700"
        >
          Description
        </label>

        <textarea
          id="task-description"
          name="description"
          value={form.description}
          onChange={handleChange}
          placeholder="Describe the task"
          rows={4}
          maxLength={2000}
          disabled={loading}
          className="w-full resize-none rounded-lg border border-gray-300 px-4 py-3 outline-none transition focus:border-gray-500 focus:ring-2 focus:ring-gray-200 disabled:cursor-not-allowed disabled:bg-gray-100"
        />

        <div className="mt-1 flex justify-end">
          <span className="text-xs text-gray-400">
            {form.description.length}/2000
          </span>
        </div>
      </div>

      {/* =================================================
          PRIORITY
      ================================================= */}

      <div>
        <label
          htmlFor="task-priority"
          className="mb-1 block text-sm font-medium text-gray-700"
        >
          Priority
        </label>

        <select
          id="task-priority"
          name="priority"
          value={form.priority}
          onChange={handleChange}
          disabled={loading}
          className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 outline-none transition focus:border-gray-500 focus:ring-2 focus:ring-gray-200 disabled:cursor-not-allowed disabled:bg-gray-100"
        >
          <option value="LOW">
            Low
          </option>

          <option value="MEDIUM">
            Medium
          </option>

          <option value="HIGH">
            High
          </option>

          <option value="URGENT">
            Urgent
          </option>
        </select>
      </div>

      {/* =================================================
          DUE DATE
      ================================================= */}

      <div>
        <label
          htmlFor="task-due-date"
          className="mb-1 block text-sm font-medium text-gray-700"
        >
          Due Date
        </label>

        <input
          id="task-due-date"
          type="date"
          name="dueDate"
          value={form.dueDate}
          onChange={handleChange}
          min={today}
          disabled={loading}
          className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none transition focus:border-gray-500 focus:ring-2 focus:ring-gray-200 disabled:cursor-not-allowed disabled:bg-gray-100"
        />

        <p className="mt-1 text-xs text-gray-400">
          Due date cannot be in the past.
        </p>
      </div>

      {/* =================================================
          ASSIGNED TO
      ================================================= */}

      <div>
        <label
          htmlFor="task-assigned-to"
          className="mb-1 block text-sm font-medium text-gray-700"
        >
          Assign To
        </label>

        <select
          id="task-assigned-to"
          name="assignedTo"
          value={form.assignedTo}
          onChange={handleChange}
          disabled={loading}
          className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 outline-none transition focus:border-gray-500 focus:ring-2 focus:ring-gray-200 disabled:cursor-not-allowed disabled:bg-gray-100"
        >
          <option value="">
            Unassigned
          </option>

          {members.map((member) => {
            const memberId =
              typeof member === "object"
                ? member?._id ||
                  member?.id
                : member;

            const memberName =
              typeof member === "object"
                ? member?.name ||
                  member?.username ||
                  member?.email ||
                  "Member"
                : "Member";

            if (!memberId) {
              return null;
            }

            return (
              <option
                key={memberId}
                value={memberId}
              >
                {memberName}
              </option>
            );
          })}
        </select>

        {members.length === 0 && (
          <p className="mt-1 text-xs text-gray-400">
            No project members available for assignment.
          </p>
        )}
      </div>

      {/* =================================================
          ACTION BUTTONS
      ================================================= */}

      <div className="flex gap-3 pt-2">
        <button
          type="button"
          onClick={handleCancel}
          disabled={loading}
          className="flex-1 rounded-lg border border-gray-300 px-4 py-3 font-medium text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Cancel
        </button>

        <button
          type="submit"
          disabled={loading}
          className="flex-1 rounded-lg bg-gray-900 px-4 py-3 font-medium text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-gray-400 border-t-white" />
              Creating...
            </span>
          ) : (
            "Create Task"
          )}
        </button>
      </div>
    </form>
  );
};

export default TaskForm;

