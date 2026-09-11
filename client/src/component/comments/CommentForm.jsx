
import { useState } from "react";

const CommentForm = ({
  onSubmit,
  loading = false,
  onCancel,
  initialValue = "",
  isEditing = false,
}) => {
  const [content, setContent] = useState(initialValue);
  const [error, setError] = useState("");

  // =====================================================
  // HANDLE CHANGE
  // =====================================================

  const handleChange = (e) => {
    setContent(e.target.value);

    if (error) {
      setError("");
    }
  };

  // =====================================================
  // HANDLE SUBMIT
  // =====================================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    const trimmedContent = content.trim();

    if (!trimmedContent) {
      setError("Comment cannot be empty");
      return;
    }

    if (trimmedContent.length > 2000) {
      setError("Comment cannot exceed 2000 characters");
      return;
    }

    try {
      setError("");

      await onSubmit(trimmedContent);

      // Reset only when creating a new comment
      if (!isEditing) {
        setContent("");
      }
    } catch (err) {
      console.error("Comment Submit Error:", err);

      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Unable to save comment"
      );
    }
  };

  // =====================================================
  // CANCEL
  // =====================================================

  const handleCancel = () => {
    setContent(initialValue);
    setError("");

    onCancel?.();
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm"
    >
      {/* HEADER */}

      <div className="mb-3">
        <h3 className="font-semibold text-gray-900">
          {isEditing ? "Edit Comment" : "Add Comment"}
        </h3>

        <p className="mt-1 text-xs text-gray-500">
          {isEditing
            ? "Update your comment."
            : "Share your thoughts with the project team."}
        </p>
      </div>

      {/* TEXTAREA */}

      <div>
        <textarea
          value={content}
          onChange={handleChange}
          placeholder="Write a comment..."
          rows={4}
          maxLength={2000}
          disabled={loading}
          className="w-full resize-y rounded-lg border border-gray-300 px-4 py-3 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-gray-500 focus:ring-2 focus:ring-gray-200 disabled:cursor-not-allowed disabled:bg-gray-50"
        />

        <div className="mt-1 flex items-center justify-between">
          <span className="text-xs text-red-500">
            {error}
          </span>

          <span className="text-xs text-gray-400">
            {content.length}/2000
          </span>
        </div>
      </div>

      {/* ACTION BUTTONS */}

      <div className="mt-4 flex justify-end gap-3">
        {isEditing && (
          <button
            type="button"
            onClick={handleCancel}
            disabled={loading}
            className="rounded-lg border border-gray-300 px-4 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Cancel
          </button>
        )}

        <button
          type="submit"
          disabled={loading || !content.trim()}
          className="rounded-lg bg-gray-900 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading
            ? isEditing
              ? "Updating..."
              : "Posting..."
            : isEditing
              ? "Update Comment"
              : "Post Comment"}
        </button>
      </div>
    </form>
  );
};

export default CommentForm;

