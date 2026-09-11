
import api from "./api";

// =====================================================
// GET ANALYTICS
// =====================================================
// Backend automatically applies RBAC:
//
// ADMIN  → All projects
// OWNER  → All projects
// MEMBER → Only projects where user is a member
// =====================================================

export const getAnalytics = async () => {
  try {
    const response = await api.get("/analytics");

    return response.data;
  } catch (error) {
    console.error(
      "Get Analytics Error:",
      error
    );

    throw error;
  }
};

