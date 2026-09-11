

import api from "./api";

// =====================================================
// GET DASHBOARD STATS
// =====================================================

export const getDashboardStats = async () => {
  try {
    // -------------------------------------------------
    // API REQUEST
    // -------------------------------------------------

    const response = await api.get("/dashboard/stats");

    // -------------------------------------------------
    // RAW PAYLOAD
    // -------------------------------------------------

    const payload = response?.data;

    // -------------------------------------------------
    // SUPPORT BOTH RESPONSE SHAPES
    //
    // Shape 1:
    // {
    //   success: true,
    //   data: {
    //     stats: {},
    //     recentProjects: [],
    //     recentTasks: []
    //   }
    // }
    //
    // Shape 2:
    // {
    //   stats: {},
    //   recentProjects: [],
    //   recentTasks: []
    // }
    // -------------------------------------------------

    const dashboard =
      payload?.data &&
      typeof payload.data === "object" &&
      !Array.isArray(payload.data)
        ? payload.data
        : payload;

    // -------------------------------------------------
    // NORMALIZED RESPONSE
    // -------------------------------------------------

    return {
      // ===============================================
      // STATS
      // ===============================================

      stats: {
        totalProjects:
          Number(dashboard?.stats?.totalProjects) || 0,

        totalTasks:
          Number(dashboard?.stats?.totalTasks) || 0,

        completedTasks:
          Number(dashboard?.stats?.completedTasks) || 0,

        overdueTasks:
          Number(dashboard?.stats?.overdueTasks) || 0,

        todoTasks:
          Number(dashboard?.stats?.todoTasks) || 0,

        inProgressTasks:
          Number(dashboard?.stats?.inProgressTasks) || 0,

        reviewTasks:
          Number(dashboard?.stats?.reviewTasks) || 0,

        myTasks:
          Number(dashboard?.stats?.myTasks) || 0,

        completionPercentage: Math.min(
          Math.max(
            Number(
              dashboard?.stats?.completionPercentage
            ) || 0,
            0
          ),
          100
        ),
      },

      // ===============================================
      // RECENT PROJECTS
      // ===============================================

      recentProjects: Array.isArray(
        dashboard?.recentProjects
      )
        ? dashboard.recentProjects
        : [],

      // ===============================================
      // RECENT TASKS
      // ===============================================

      recentTasks: Array.isArray(
        dashboard?.recentTasks
      )
        ? dashboard.recentTasks
        : [],
    };

  } catch (error) {
    // -------------------------------------------------
    // DEBUG INFORMATION
    // -------------------------------------------------

    console.error(
      "Dashboard API Error:",
      error
    );

    // Optional detailed backend error
    if (error?.response) {
      console.error(
        "Dashboard Status:",
        error.response.status
      );

      console.error(
        "Dashboard Server Message:",
        error.response.data?.message
      );
    }

    // -------------------------------------------------
    // IMPORTANT
    // -------------------------------------------------
    // Do NOT swallow the error.
    // Dashboard.jsx needs the original AxiosError
    // to handle 401 / 403 / other errors.
    // -------------------------------------------------

    throw error;
  }
};

