import api from "./api";

// =====================================================
// CREATE PROJECT COMMENT
// POST /api/comments/project/:projectId
// =====================================================

export const createProjectComment = async (
  projectId,
  content
) => {
  const response = await api.post(
    `/comments/project/${projectId}`,
    {
      content,
    }
  );

  return response.data;
};

// =====================================================
// GET PROJECT COMMENTS
// GET /api/comments/project/:projectId
// =====================================================

export const getProjectComments = async (
  projectId
) => {
  const response = await api.get(
    `/comments/project/${projectId}`
  );

  return response.data;
};

// =====================================================
// UPDATE COMMENT
// PUT /api/comments/:id
// =====================================================

export const updateComment = async (
  commentId,
  content
) => {
  const response = await api.put(
    `/comments/${commentId}`,
    {
      content,
    }
  );

  return response.data;
};

// =====================================================
// DELETE COMMENT
// DELETE /api/comments/:id
// =====================================================

export const deleteComment = async (
  commentId
) => {
  const response = await api.delete(
    `/comments/${commentId}`
  );

  return response.data;
};