

import api from "./api";

// =====================================================
// ROLE CONSTANTS
// =====================================================

const ROLES = {
  OWNER: "OWNER",
  ADMIN: "ADMIN",
  MANAGER: "MANAGER",
  MEMBER: "MEMBER",
  VIEWER: "VIEWER",
};

// =====================================================
// NORMALIZE ROLE
// =====================================================

const normalizeRole = (role) => {
  return String(role || ROLES.MEMBER)
    .trim()
    .toUpperCase();
};

// =====================================================
// GET STORED USER
// =====================================================
//
// AuthContext should store the logged-in user in
// localStorage as "user".
//
// We also support "nova_user" as fallback.
//

const getStoredUser = () => {
  const storageKeys = [
    "user",
    "nova_user",
  ];

  for (const key of storageKeys) {
    try {
      const storedUser =
        localStorage.getItem(key);

      if (!storedUser) {
        continue;
      }

      const parsedUser =
        JSON.parse(storedUser);

      if (
        parsedUser &&
        typeof parsedUser === "object"
      ) {
        return parsedUser;
      }

    } catch (error) {
      console.error(
        `Unable to parse localStorage "${key}":`,
        error
      );
    }
  }

  return null;
};

// =====================================================
// GET CURRENT USER ROLE
// =====================================================

const getCurrentUserRole = () => {
  const user =
    getStoredUser();

  if (!user) {
    console.warn(
      "========== PROJECT RBAC DEBUG =========="
    );

    console.warn(
      "No stored user found."
    );

    console.warn(
      "Expected localStorage key: user"
    );

    console.warn(
      "========================================="
    );

    return ROLES.MEMBER;
  }

  // ---------------------------------------------------
  // Support normal user object
  // ---------------------------------------------------

  let role =
    user?.role;

  // ---------------------------------------------------
  // Support nested user object
  // ---------------------------------------------------

  if (!role) {
    role =
      user?.user?.role;
  }

  // ---------------------------------------------------
  // Support permissions.role if used by backend
  // ---------------------------------------------------

  if (!role) {
    role =
      user?.permissions?.role;
  }

  const normalizedRole =
    normalizeRole(role);

  // ---------------------------------------------------
  // DEBUG
  // ---------------------------------------------------

  console.log(
    "========== PROJECT RBAC DEBUG =========="
  );

  console.log(
    "Stored User:",
    user
  );

  console.log(
    "Raw Role:",
    role
  );

  console.log(
    "Normalized Role:",
    normalizedRole
  );

  console.log(
    "========================================="

  );

  return normalizedRole;
};

// =====================================================
// GET CURRENT USER ID
// =====================================================

const getCurrentUserId = () => {
  const user =
    getStoredUser();

  return (
    user?.id ||
    user?._id ||
    user?.user?.id ||
    user?.user?._id ||
    null
  );
};

// =====================================================
// ROLE CHECK
// =====================================================

const hasRole = (...allowedRoles) => {
  const currentRole =
    getCurrentUserRole();

  const normalizedAllowedRoles =
    allowedRoles.map(
      normalizeRole
    );

  const allowed =
    normalizedAllowedRoles.includes(
      currentRole
    );

  console.log(
    "========== ROLE CHECK =========="
  );

  console.log(
    "Current Role:",
    currentRole
  );

  console.log(
    "Allowed Roles:",
    normalizedAllowedRoles
  );

  console.log(
    "Permission:",
    allowed
  );

  console.log(
    "================================"
  );

  return allowed;
};

// =====================================================
// AUTHENTICATION CHECK
// =====================================================

const isAuthenticated = () => {
  const token =
    localStorage.getItem(
      "nova_token"
    );

  return Boolean(token);
};

// =====================================================
// PERMISSION ERROR
// =====================================================

const throwPermissionError = (
  message =
    "You do not have permission to perform this action."
) => {
  const error =
    new Error(message);

  error.code =
    "CLIENT_RBAC_DENIED";

  error.status =
    403;

  throw error;
};

// =====================================================
// CREATE PROJECT
// POST /api/projects
// =====================================================
//
// OWNER, ADMIN, MANAGER
//

export const createProject =
  async (projectData) => {

    if (
      !isAuthenticated()
    ) {
      throwPermissionError(
        "You must be logged in to create a project."
      );
    }

    if (
      !hasRole(
        ROLES.OWNER,
        ROLES.ADMIN,
        ROLES.MANAGER
      )
    ) {
      throwPermissionError(
        "Only OWNER, ADMIN, or MANAGER can create projects."
      );
    }

    const response =
      await api.post(
        "/projects",
        projectData
      );

    return response.data;
  };

// =====================================================
// GET ALL PROJECTS
// GET /api/projects
// =====================================================
//
// OWNER, ADMIN, MANAGER, MEMBER, VIEWER
//

export const getProjects =
  async () => {

    if (
      !isAuthenticated()
    ) {
      throwPermissionError(
        "You must be logged in to view projects."
      );
    }

    if (
      !hasRole(
        ROLES.OWNER,
        ROLES.ADMIN,
        ROLES.MANAGER,
        ROLES.MEMBER,
        ROLES.VIEWER
      )
    ) {
      throwPermissionError(
        "You do not have permission to view projects."
      );
    }

    const response =
      await api.get(
        "/projects"
      );

    return response.data;
  };

// =====================================================
// GET SINGLE PROJECT
// GET /api/projects/:id
// =====================================================
//
// OWNER, ADMIN, MANAGER, MEMBER, VIEWER
//

export const getProject =
  async (projectId) => {

    if (!projectId) {
      throw new Error(
        "Project ID is required."
      );
    }

    if (
      !isAuthenticated()
    ) {
      throwPermissionError(
        "You must be logged in to view this project."
      );
    }

    if (
      !hasRole(
        ROLES.OWNER,
        ROLES.ADMIN,
        ROLES.MANAGER,
        ROLES.MEMBER,
        ROLES.VIEWER
      )
    ) {
      throwPermissionError(
        "You do not have permission to view this project."
      );
    }

    const response =
      await api.get(
        `/projects/${projectId}`
      );

    return response.data;
  };

// =====================================================
// UPDATE PROJECT
// PUT /api/projects/:id
// =====================================================
//
// OWNER, ADMIN, MANAGER
//

export const updateProject =
  async (
    projectId,
    projectData
  ) => {

    if (!projectId) {
      throw new Error(
        "Project ID is required."
      );
    }

    if (
      !isAuthenticated()
    ) {
      throwPermissionError(
        "You must be logged in to update projects."
      );
    }

    if (
      !hasRole(
        ROLES.OWNER,
        ROLES.ADMIN,
        ROLES.MANAGER
      )
    ) {
      throwPermissionError(
        "Only OWNER, ADMIN, or MANAGER can update projects."
      );
    }

    const response =
      await api.put(
        `/projects/${projectId}`,
        projectData
      );

    return response.data;
  };

// =====================================================
// DELETE PROJECT
// DELETE /api/projects/:id
// =====================================================
//
// OWNER, ADMIN
//

export const deleteProject =
  async (projectId) => {

    if (!projectId) {
      throw new Error(
        "Project ID is required."
      );
    }

    if (
      !isAuthenticated()
    ) {
      throwPermissionError(
        "You must be logged in to delete projects."
      );
    }

    if (
      !hasRole(
        ROLES.OWNER,
        ROLES.ADMIN
      )
    ) {
      throwPermissionError(
        "Only OWNER or ADMIN can delete projects."
      );
    }

    const response =
      await api.delete(
        `/projects/${projectId}`
      );

    return response.data;
  };

// =====================================================
// ADD PROJECT MEMBER
// POST /api/projects/:id/members
// =====================================================
//
// OWNER, ADMIN, MANAGER
//

export const addProjectMember =
  async (
    projectId,
    userId
  ) => {

    if (!projectId) {
      throw new Error(
        "Project ID is required."
      );
    }

    if (!userId) {
      throw new Error(
        "User ID is required."
      );
    }

    if (
      !isAuthenticated()
    ) {
      throwPermissionError(
        "You must be logged in to add project members."
      );
    }

    // -------------------------------------------------
    // IMPORTANT ROLE CHECK
    // -------------------------------------------------

    if (
      !hasRole(
        ROLES.OWNER,
        ROLES.ADMIN,
        ROLES.MANAGER
      )
    ) {
      throwPermissionError(
        "Only OWNER, ADMIN, or MANAGER can add project members."
      );
    }

    // -------------------------------------------------
    // API REQUEST
    // -------------------------------------------------

    const response =
      await api.post(
        `/projects/${projectId}/members`,
        {
          userId,
        }
      );

    return response.data;
  };

// =====================================================
// REMOVE PROJECT MEMBER
// DELETE /api/projects/:id/members
// =====================================================
//
// OWNER, ADMIN, MANAGER
//

export const removeProjectMember =
  async (
    projectId,
    userId
  ) => {

    if (!projectId) {
      throw new Error(
        "Project ID is required."
      );
    }

    if (!userId) {
      throw new Error(
        "User ID is required."
      );
    }

    if (
      !isAuthenticated()
    ) {
      throwPermissionError(
        "You must be logged in to remove project members."
      );
    }

    // -------------------------------------------------
    // IMPORTANT ROLE CHECK
    // -------------------------------------------------

    if (
      !hasRole(
        ROLES.OWNER,
        ROLES.ADMIN,
        ROLES.MANAGER
      )
    ) {
      throwPermissionError(
        "Only OWNER, ADMIN, or MANAGER can remove project members."
      );
    }

    // -------------------------------------------------
    // API REQUEST
    // -------------------------------------------------

    const response =
      await api.delete(
        `/projects/${projectId}/members`,
        {
          data: {
            userId,
          },
        }
      );

    return response.data;
  };

// =====================================================
// PROJECT PERMISSIONS
// =====================================================

export const projectPermissions = {

  // ---------------------------------------------------
  // VIEW PROJECT
  // ---------------------------------------------------

  canView: () =>
    hasRole(
      ROLES.OWNER,
      ROLES.ADMIN,
      ROLES.MANAGER,
      ROLES.MEMBER,
      ROLES.VIEWER
    ),

  // ---------------------------------------------------
  // CREATE PROJECT
  // ---------------------------------------------------

  canCreate: () =>
    hasRole(
      ROLES.OWNER,
      ROLES.ADMIN,
      ROLES.MANAGER
    ),

  // ---------------------------------------------------
  // UPDATE PROJECT
  // ---------------------------------------------------

  canUpdate: () =>
    hasRole(
      ROLES.OWNER,
      ROLES.ADMIN,
      ROLES.MANAGER
    ),

  // ---------------------------------------------------
  // DELETE PROJECT
  // ---------------------------------------------------

  canDelete: () =>
    hasRole(
      ROLES.OWNER,
      ROLES.ADMIN
    ),

  // ---------------------------------------------------
  // ADD / REMOVE MEMBERS
  // ---------------------------------------------------

  canManageMembers: () =>
    hasRole(
      ROLES.OWNER,
      ROLES.ADMIN,
      ROLES.MANAGER
    ),

  // ---------------------------------------------------
  // ROLE SPECIFIC HELPERS
  // ---------------------------------------------------

  isOwner: () =>
    hasRole(
      ROLES.OWNER
    ),

  isAdmin: () =>
    hasRole(
      ROLES.ADMIN
    ),

  isManager: () =>
    hasRole(
      ROLES.MANAGER
    ),

  isMember: () =>
    hasRole(
      ROLES.MEMBER
    ),

  isViewer: () =>
    hasRole(
      ROLES.VIEWER
    ),

  // ---------------------------------------------------
  // CURRENT USER
  // ---------------------------------------------------

  getCurrentUserId: () =>
    getCurrentUserId(),

  getCurrentUserRole: () =>
    getCurrentUserRole(),

};

// =====================================================
// EXPORT RBAC HELPERS
// =====================================================

export {
  normalizeRole,
  getCurrentUserRole,
  getCurrentUserId,
  hasRole,
  isAuthenticated,
};