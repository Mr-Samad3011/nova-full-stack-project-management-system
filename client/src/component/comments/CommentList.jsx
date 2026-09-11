/* eslint-disable no-unused-vars */

import React from "react";
import CommentItem from "./CommentItem";

const CommentList = ({
  comments = [],
  loading = false,
  error = "",
  currentUser,
  onEdit,
  onDelete,
}) => {
  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {
    return (
      <div className="rounded-xl border border-gray-200 bg-white p-6">
        <div className="flex items-center justify-center py-6">

          <div className="h-7 w-7 animate-spin rounded-full border-4 border-gray-200 border-t-gray-900" />

          <span className="ml-3 text-sm text-gray-500">
            Loading comments...
          </span>

        </div>
      </div>
    );
  }

  // =====================================================
  // ERROR
  // =====================================================

  if (error) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 p-4">
        <p className="text-sm font-medium text-red-600">
          {error}
        </p>
      </div>
    );
  }

  // =====================================================
  // EMPTY
  // =====================================================

  if (
    !Array.isArray(comments) ||
    comments.length === 0
  ) {
    return (
      <div className="rounded-xl border border-dashed border-gray-300 bg-white p-8 text-center">

        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-gray-100 text-xl">
          💬
        </div>

        <h3 className="mt-3 text-sm font-semibold text-gray-900">
          No comments yet
        </h3>

        <p className="mt-1 text-sm text-gray-500">
          Be the first person to comment.
        </p>

      </div>
    );
  }

  // =====================================================
  // RENDER
  // =====================================================

  return (
    <div className="space-y-4">

      <div className="flex items-center justify-between">

        <div>
          <h3 className="text-lg font-bold text-gray-900">
            Comments
          </h3>

          <p className="text-sm text-gray-500">
            {comments.length}{" "}
            {comments.length === 1
              ? "comment"
              : "comments"}
          </p>
        </div>

      </div>

      <div className="space-y-3">

        {comments.map((comment) => {

          const commentId =
            comment?._id ||
            comment?.id;

          return (
            <CommentItem
              key={commentId}
              comment={comment}
              currentUser={currentUser}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          );
        })}

      </div>

    </div>
  );
};

export default CommentList;