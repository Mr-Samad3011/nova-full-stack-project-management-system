/* eslint-disable preserve-caught-error */



import api from "./api";

// =====================================================
// TASK SERVICE
// RBAC:
// task:create
// task:read
// task:update
// task:delete
// =====================================================


// =====================================================
// CREATE TASK
// POST /api/tasks/project/:projectId
// Permission: task:create
// =====================================================


// =====================================================
// CREATE TASK
// POST /api/tasks/project/:projectId
// Permission: task:create
// =====================================================

export const createTask = async (projectId, taskData) => {
  if (!projectId) {
    throw new Error("Project ID is required");
  }

  if (!taskData || typeof taskData !== "object") {
    throw new Error("Task data is required");
  }

  if (!taskData.title?.trim()) {
    throw new Error("Task title is required");
  }

  try {
    const response = await api.post(
      `/tasks/project/${projectId}`,
      taskData
    );

    return response.data;
  } catch (error) {
    if (error.response?.status === 403) {
      throw new Error(
        error.response?.data?.message ||
          "You do not have permission to create tasks."
      );
    }

    throw error;
  }
};


// =====================================================
// GET PROJECT TASKS
// GET /api/tasks/project/:projectId
// Permission: task:read
// =====================================================

export const getProjectTasks = async (projectId) => {
  if (!projectId) {
    throw new Error("Project ID is required");
  }

  try {
    const response = await api.get(
      `/tasks/project/${projectId}`
    );

    return response.data;
  } catch (error) {
    if (error.response?.status === 403) {
      throw new Error(
        error.response?.data?.message ||
          "You do not have permission to view tasks."
      );
    }

    throw error;
  }
};


// =====================================================
// GET SINGLE TASK
// GET /api/tasks/:id
// Permission: task:read
// =====================================================

export const getTask = async (taskId) => {
  if (!taskId) {
    throw new Error("Task ID is required");
  }

  try {
    const response = await api.get(
      `/tasks/${taskId}`
    );

    return response.data;
  } catch (error) {
    if (error.response?.status === 403) {
      throw new Error(
        error.response?.data?.message ||
          "You do not have permission to view this task."
      );
    }

    throw error;
  }
};


// =====================================================
// UPDATE TASK
// PATCH /api/tasks/:id
// Permission: task:update
// =====================================================

export const updateTask = async (
  taskId,
  taskData
) => {
  if (!taskId) {
    throw new Error("Task ID is required");
  }

  if (!taskData || typeof taskData !== "object") {
    throw new Error("Task data is required");
  }

  try {
    // IMPORTANT:
    // Backend route is PATCH /api/tasks/:id
    const response = await api.patch(
      `/tasks/${taskId}`,
      taskData
    );

    return response.data;
  } catch (error) {
    if (error.response?.status === 403) {
      throw new Error(
        error.response?.data?.message ||
          "You do not have permission to update tasks."
      );
    }

    throw error;
  }
};


// =====================================================
// DELETE TASK
// DELETE /api/tasks/:id
// Permission: task:delete
// =====================================================

export const deleteTask = async (taskId) => {
  if (!taskId) {
    throw new Error("Task ID is required");
  }

  try {
    const response = await api.delete(
      `/tasks/${taskId}`
    );

    return response.data;
  } catch (error) {
    if (error.response?.status === 403) {
      throw new Error(
        error.response?.data?.message ||
          "You do not have permission to delete tasks."
      );
    }

    throw error;
  }
};


// =====================================================
// RBAC TASK PERMISSIONS
// =====================================================

export const TASK_PERMISSIONS = {
  CREATE: "task:create",
  READ: "task:read",
  UPDATE: "task:update",
  DELETE: "task:delete",
};


// =====================================================
// CHECK TASK PERMISSION
// =====================================================

export const hasTaskPermission = (
  permissions = [],
  permission
) => {
  if (!Array.isArray(permissions)) {
    return false;
  }

  if (!permission) {
    return false;
  }

  return permissions.includes(permission);
};


// =====================================================
// TASK PERMISSION CHECKS
// =====================================================

export const canCreateTask = (permissions = []) => {
  return hasTaskPermission(
    permissions,
    TASK_PERMISSIONS.CREATE
  );
};


export const canReadTask = (permissions = []) => {
  return hasTaskPermission(
    permissions,
    TASK_PERMISSIONS.READ
  );
};


export const canUpdateTask = (permissions = []) => {
  return hasTaskPermission(
    permissions,
    TASK_PERMISSIONS.UPDATE
  );
};


export const canDeleteTask = (permissions = []) => {
  return hasTaskPermission(
    permissions,
    TASK_PERMISSIONS.DELETE
  );
};

