/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable no-unused-vars */

import React, {
  useEffect,
  useState,
} from "react";

// =====================================================
// HELPER
// =====================================================

const getId = (value) => {
  if (!value) return null;

  // MongoDB ObjectId / string
  if (
    typeof value === "string" ||
    typeof value === "number"
  ) {
    return value.toString();
  }

  // Object with _id
  if (value._id) {
    return value._id.toString();
  }

  // Object with id
  if (value.id) {
    return value.id.toString();
  }

  return null;
};

// =====================================================
// COMMENT ITEM
// =====================================================

const CommentItem = ({
  comment,
  currentUser,
  onDelete,
  onEdit,
  loading = false,
}) => {
  // =====================================================
  // SAFETY
  // =====================================================

  if (!comment) {
    return null;
  }

  // =====================================================
  // EDIT STATE
  // =====================================================

  const [isEditing, setIsEditing] =
    useState(false);

  const [editContent, setEditContent] =
    useState(comment.content || "");

  const [editError, setEditError] =
    useState("");

  // =====================================================
  // UPDATE LOCAL CONTENT
  // =====================================================

  useEffect(() => {
    setEditContent(
      comment.content || ""
    );
  }, [comment.content]);

  // =====================================================
  // AUTHOR
  // =====================================================

  const author =
    typeof comment.createdBy === "object" &&
    comment.createdBy !== null
      ? comment.createdBy
      : typeof comment.user === "object" &&
        comment.user !== null
      ? comment.user
      : null;

  // =====================================================
  // AUTHOR NAME
  // =====================================================

  const authorName =
    author?.name ||
    author?.username ||
    author?.email ||
    "Unknown User";

  // =====================================================
  // AUTHOR EMAIL
  // =====================================================

  const authorEmail =
    author?.email || "";

  // =====================================================
  // AUTHOR ID
  // =====================================================

  let authorId = null;

  if (author) {
    authorId =
      getId(author);
  }

  // If createdBy is directly an ID
  if (!authorId) {
    authorId =
      getId(comment.createdBy);
  }

  // If user is directly an ID
  if (!authorId) {
    authorId =
      getId(comment.user);
  }

  // =====================================================
  // CURRENT USER ID
  // =====================================================

  const currentUserId =
    getId(currentUser);

  // =====================================================
  // OWNER CHECK
  // =====================================================

  const isOwner =
    Boolean(currentUserId) &&
    Boolean(authorId) &&
    currentUserId === authorId;

  // =====================================================
  // DATE
  // =====================================================

  const commentDate =
    comment.createdAt
      ? new Date(comment.createdAt)
      : null;

  const validDate =
    commentDate &&
    !Number.isNaN(
      commentDate.getTime()
    );

  const formattedDate = validDate
    ? commentDate.toLocaleDateString(
        undefined,
        {
          day: "numeric",
          month: "short",
          year: "numeric",
        }
      )
    : "";

  const formattedTime = validDate
    ? commentDate.toLocaleTimeString(
        undefined,
        {
          hour: "2-digit",
          minute: "2-digit",
        }
      )
    : "";

  // =====================================================
  // EDITED
  // =====================================================

  const isEdited =
    Boolean(
      comment.updatedAt &&
        comment.createdAt &&
        new Date(
          comment.updatedAt
        ).getTime() >
          new Date(
            comment.createdAt
          ).getTime()
    );

  // =====================================================
  // DEBUG
  // =====================================================

  console.log(
    "========== COMMENT PERMISSION DEBUG =========="
  );

  console.log(
    "Comment:",
    comment
  );

  console.log(
    "Current User:",
    currentUser
  );

  console.log(
    "Author:",
    author
  );

  console.log(
    "Author ID:",
    authorId
  );

  console.log(
    "Current User ID:",
    currentUserId
  );

  console.log(
    "Is Owner:",
    isOwner
  );

  console.log(
    "=============================================="
  );

  // =====================================================
  // DELETE
  // =====================================================

  const handleDelete = () => {
    if (!onDelete) {
      return;
    }

    const confirmed =
      window.confirm(
        "Are you sure you want to delete this comment?"
      );

    if (!confirmed) {
      return;
    }

    onDelete(comment._id);
  };

  // =====================================================
  // START EDIT
  // =====================================================

  const handleStartEdit = () => {
    setEditContent(
      comment.content || ""
    );

    setEditError("");

    setIsEditing(true);
  };

  // =====================================================
  // CANCEL EDIT
  // =====================================================

  const handleCancelEdit = () => {
    setEditContent(
      comment.content || ""
    );

    setEditError("");

    setIsEditing(false);
  };

  // =====================================================
  // SAVE EDIT
  // =====================================================

  const handleSaveEdit = async () => {
    const trimmedContent =
      editContent.trim();

    // Empty
    if (!trimmedContent) {
      setEditError(
        "Comment cannot be empty"
      );

      return;
    }

    // Maximum length
    if (
      trimmedContent.length > 2000
    ) {
      setEditError(
        "Comment cannot exceed 2000 characters"
      );

      return;
    }

    // No edit handler
    if (!onEdit) {
      setEditError(
        "Edit functionality is unavailable"
      );

      return;
    }

    try {
      setEditError("");

      await onEdit(
        comment._id,
        trimmedContent
      );

      setIsEditing(false);
    } catch (error) {
      console.error(
        "Edit Comment Error:",
        error
      );

      setEditError(
        error?.response?.data?.message ||
          error?.message ||
          "Unable to update comment"
      );
    }
  };

  // =====================================================
  // RENDER
  // =====================================================

  return (
    <article className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">

      {/* =================================================
          HEADER
      ================================================= */}

      <div className="flex items-start justify-between gap-3">

        {/* USER INFORMATION */}

        <div className="flex min-w-0 items-center gap-3">

          {/* AVATAR */}

          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gray-900 text-sm font-semibold uppercase text-white">
            {authorName
              .charAt(0)
              .toUpperCase()}
          </div>

          {/* USER */}

          <div className="min-w-0">

            <p className="truncate font-semibold text-gray-900">
              {authorName}
            </p>

            {authorEmail && (
              <p className="truncate text-xs text-gray-500">
                {authorEmail}
              </p>
            )}

          </div>

        </div>

        {/* =================================================
            ACTIONS
        ================================================= */}

        {isOwner &&
          !isEditing && (
            <div className="flex shrink-0 items-center gap-1">

              {/* EDIT */}

              {onEdit && (
                <button
                  type="button"
                  onClick={
                    handleStartEdit
                  }
                  disabled={loading}
                  className="rounded-lg px-2.5 py-1.5 text-xs font-medium text-gray-600 transition hover:bg-gray-100 hover:text-gray-900 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Edit
                </button>
              )}

              {/* DELETE */}

              {onDelete && (
                <button
                  type="button"
                  onClick={
                    handleDelete
                  }
                  disabled={loading}
                  className="rounded-lg px-2.5 py-1.5 text-xs font-medium text-red-600 transition hover:bg-red-50 hover:text-red-700 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Delete
                </button>
              )}

            </div>
          )}

      </div>

      {/* =================================================
          EDIT MODE
      ================================================= */}

      {isEditing ? (
        <div className="mt-4">

          {/* TEXTAREA */}

          <textarea
            value={editContent}
            onChange={(e) => {
              setEditContent(
                e.target.value
              );

              if (editError) {
                setEditError("");
              }
            }}
            rows={4}
            maxLength={2000}
            disabled={loading}
            autoFocus
            className="w-full resize-y rounded-lg border border-gray-300 px-4 py-3 text-sm text-gray-900 outline-none transition focus:border-gray-500 focus:ring-2 focus:ring-gray-200 disabled:bg-gray-50"
          />

          {/* ERROR + COUNTER */}

          <div className="mt-1 flex justify-between gap-3">

            <span className="text-xs text-red-500">
              {editError}
            </span>

            <span className="shrink-0 text-xs text-gray-400">
              {editContent.length}/2000
            </span>

          </div>

          {/* BUTTONS */}

          <div className="mt-3 flex justify-end gap-2">

            {/* CANCEL */}

            <button
              type="button"
              onClick={
                handleCancelEdit
              }
              disabled={loading}
              className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Cancel
            </button>

            {/* SAVE */}

            <button
              type="button"
              onClick={
                handleSaveEdit
              }
              disabled={
                loading ||
                !editContent.trim()
              }
              className="rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading
                ? "Updating..."
                : "Save Changes"}
            </button>

          </div>

        </div>
      ) : (
        <>
          {/* =================================================
              COMMENT CONTENT
          ================================================= */}

          <div className="mt-4">

            <p className="whitespace-pre-wrap break-words text-sm leading-6 text-gray-700">
              {comment.content ||
                "No comment content"}
            </p>

          </div>

          {/* =================================================
              FOOTER
          ================================================= */}

          {(formattedDate ||
            isEdited) && (
            <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-gray-400">

              {/* DATE */}

              {formattedDate && (
                <span>
                  {formattedDate}

                  {formattedTime &&
                    ` at ${formattedTime}`}
                </span>
              )}

              {/* EDITED */}

              {isEdited && (
                <span className="rounded-full bg-gray-100 px-2 py-0.5">
                  Edited
                </span>
              )}

            </div>
          )}
        </>
      )}

    </article>
  );
};

export default CommentItem;
