

import api from "./api";

// =====================================================
// USER SERVICE
// ADMIN USER MANAGEMENT
// =====================================================

// =====================================================
// SEARCH USERS
// GET /api/users/search?q=
// =====================================================

export const searchUsers = async (query = "") => {
  const response = await api.get("/users/search", {
    params: {
      q: query,
    },
  });

  return response.data;
};


// =====================================================
// GET ALL USERS
// GET /api/users
// ADMIN ONLY
// =====================================================

export const getUsers = async () => {
  const response = await api.get("/users");

  return response.data;
};


// =====================================================
// GET SINGLE USER
// GET /api/users/:id
// =====================================================

export const getUserById = async (userId) => {
  if (!userId) {
    throw new Error("User ID is required");
  }

  const response = await api.get(`/users/${userId}`);

  return response.data;
};


// =====================================================
// UPDATE USER
// PATCH /api/users/:id
// ADMIN ONLY
// =====================================================

export const updateUser = async (userId, userData) => {
  if (!userId) {
    throw new Error("User ID is required");
  }

  if (!userData || typeof userData !== "object") {
    throw new Error("User data is required");
  }

  const response = await api.patch(
    `/users/${userId}`,
    userData
  );

  return response.data;
};


// =====================================================
// DELETE USER
// DELETE /api/users/:id
// ADMIN ONLY
// =====================================================

export const deleteUser = async (userId) => {
  if (!userId) {
    throw new Error("User ID is required");
  }

  const response = await api.delete(
    `/users/${userId}`
  );

  return response.data;
};


// =====================================================
// UPDATE USER ROLE
// PATCH /api/users/:id/role
// ADMIN ONLY
// =====================================================

export const updateUserRole = async (
  userId,
  role
) => {
  if (!userId) {
    throw new Error("User ID is required");
  }

  if (!role) {
    throw new Error("User role is required");
  }

  const response = await api.patch(
    `/users/${userId}/role`,
    {
      role,
    }
  );

  return response.data;
};


// =====================================================
// USER PERMISSIONS
// =====================================================

export const USER_ROLES = {
  OWNER: "OWNER",
  ADMIN: "ADMIN",
  MANAGER: "MANAGER",
  MEMBER: "MEMBER",
  VIEWER: "VIEWER",
};


// =====================================================
// ROLE CHECK
// =====================================================

export const isValidUserRole = (role) => {
  return Object.values(USER_ROLES).includes(
    String(role || "").toUpperCase()
  );
};