/* eslint-disable no-fallthrough */

import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  useNavigate,
} from "react-router-dom";

import {
  getAnalytics,
} from "../services/analyticsService";


// =====================================================
// ANALYTICS PAGE
// =====================================================

const Analytics = () => {

  const navigate = useNavigate();


  // =====================================================
  // STATE
  // =====================================================

  const [analytics, setAnalytics] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");


  // =====================================================
  // RECENT PROJECT FILTER / SORT
  // =====================================================

  const [projectSearch, setProjectSearch] =
    useState("");

  const [projectSort, setProjectSort] =
    useState("NEWEST");


  // =====================================================
  // RECENT TASK FILTER / SORT
  // =====================================================

  const [taskSearch, setTaskSearch] =
    useState("");

  // IMPORTANT:
  // This is the selected filter value.
  // It is NOT the analytics task-status object.
  const [taskStatusFilter, setTaskStatusFilter] =
    useState("ALL");

  const [taskPriority, setTaskPriority] =
    useState("ALL");

  const [taskSort, setTaskSort] =
    useState("NEWEST");


  // =====================================================
  // LOAD ANALYTICS
  // =====================================================

  useEffect(() => {

    const loadAnalytics = async () => {

      try {

        setLoading(true);
        setError("");

        const response =
          await getAnalytics();

        /*
         * Backend response:
         *
         * {
         *   success: true,
         *   analytics: {
         *     overview: {},
         *     taskStatus: {},
         *     statusDistribution: {},
         *     priorityDistribution: {},
         *     projectAnalytics: [],
         *     recentTasks: [],
         *     recentProjects: []
         *   }
         * }
         */

        setAnalytics(
          response?.analytics || {}
        );

      } catch (err) {

        console.error(
          "Analytics Error:",
          err
        );

        setError(
          err?.response?.data?.message ||
          err?.message ||
          "Unable to load analytics"
        );

      } finally {

        setLoading(false);

      }

    };

    loadAnalytics();

  }, []);


  // =====================================================
  // SAFE ANALYTICS DATA
  // =====================================================

  const overview =
    analytics?.overview || {};

  // IMPORTANT:
  // Renamed from taskStatus to taskStatusData
  // to avoid collision with taskStatusFilter state.
  const taskStatusData =
    analytics?.taskStatus || {};

  const priorityDistribution =
    analytics?.priorityDistribution || {};

  const projectAnalytics =
    Array.isArray(
      analytics?.projectAnalytics
    )
      ? analytics.projectAnalytics
      : [];

  const recentProjects =
    Array.isArray(
      analytics?.recentProjects
    )
      ? analytics.recentProjects
      : [];

  const recentTasks =
    Array.isArray(
      analytics?.recentTasks
    )
      ? analytics.recentTasks
      : [];


  // =====================================================
  // OVERVIEW STATS
  // =====================================================

  const totalProjects =
    Number(
      overview.totalProjects
    ) || 0;

  const totalTasks =
    Number(
      overview.totalTasks
    ) || 0;

  const completedTasks =
    Number(
      overview.completedTasks
    ) || 0;

  const overdueTasks =
    Number(
      overview.overdueTasks
    ) || 0;

  const myTasks =
    Number(
      overview.myTasks
    ) || 0;

  const myCompletedTasks =
    Number(
      overview.myCompletedTasks
    ) || 0;

  const myPendingTasks =
    Number(
      overview.myPendingTasks
    ) || 0;

  const completionPercentage =
    Math.min(
      Math.max(
        Number(
          overview.completionPercentage
        ) || 0,
        0
      ),
      100
    );


  // =====================================================
  // TASK STATUS
  // =====================================================

  const todoTasks =
    Number(
      taskStatusData.todo
    ) || 0;

  const inProgressTasks =
    Number(
      taskStatusData.inProgress
    ) || 0;

  const reviewTasks =
    Number(
      taskStatusData.review
    ) || 0;

  const doneTasks =
    Number(
      taskStatusData.completed
    ) || 0;


  // =====================================================
  // STATUS TOTAL
  // =====================================================

  const statusTotal =
    todoTasks +
    inProgressTasks +
    reviewTasks +
    doneTasks;


  // =====================================================
  // PROJECT SEARCH + SORT
  // =====================================================

  const filteredProjects =
    useMemo(() => {

      const searchText =
        projectSearch
          .trim()
          .toLowerCase();

      const result =
        recentProjects.filter(
          (project) => {

            const name =
              String(
                project?.name ||
                project?.title ||
                ""
              ).toLowerCase();

            const description =
              String(
                project?.description ||
                ""
              ).toLowerCase();

            const status =
              String(
                project?.status ||
                ""
              ).toLowerCase();

            return (
              !searchText ||
              name.includes(searchText) ||
              description.includes(searchText) ||
              status.includes(searchText)
            );

          }
        );


      return [...result].sort(
        (a, b) => {

          switch (projectSort) {

            case "OLDEST":

              return (
                new Date(
                  a?.createdAt || 0
                ) -
                new Date(
                  b?.createdAt || 0
                )
              );


            case "NAME_ASC":

              return String(
                a?.name ||
                a?.title ||
                ""
              ).localeCompare(
                String(
                  b?.name ||
                  b?.title ||
                  ""
                )
              );


            case "NAME_DESC":

              return String(
                b?.name ||
                b?.title ||
                ""
              ).localeCompare(
                String(
                  a?.name ||
                  a?.title ||
                  ""
                )
              );


            case "NEWEST":

            default:

              return (
                new Date(
                  b?.createdAt || 0
                ) -
                new Date(
                  a?.createdAt || 0
                )
              );

          }

        }
      );

    }, [
      recentProjects,
      projectSearch,
      projectSort,
    ]);


  // =====================================================
  // TASK SEARCH + FILTER + SORT
  // =====================================================

  const filteredTasks =
    useMemo(() => {

      const searchText =
        taskSearch
          .trim()
          .toLowerCase();


      const result =
        recentTasks.filter(
          (task) => {

            const title =
              String(
                task?.title ||
                ""
              ).toLowerCase();

            const description =
              String(
                task?.description ||
                ""
              ).toLowerCase();

            const projectName =
              String(
                task?.project?.name ||
                ""
              ).toLowerCase();

            const status =
              String(
                task?.status ||
                ""
              ).toUpperCase();

            const priority =
              String(
                task?.priority ||
                ""
              ).toUpperCase();


            const matchesSearch =
              !searchText ||
              title.includes(
                searchText
              ) ||
              description.includes(
                searchText
              ) ||
              projectName.includes(
                searchText
              );


            // IMPORTANT:
            // Use taskStatusFilter here,
            // because this is the selected dropdown value.
            const matchesStatus =
              taskStatusFilterValue(
                taskStatusFilter,
                status
              );


            const matchesPriority =
              taskPriority === "ALL" ||
              priority === taskPriority;


            return (
              matchesSearch &&
              matchesStatus &&
              matchesPriority
            );

          }
        );


      return [...result].sort(
        (a, b) => {

          switch (taskSort) {

            case "OLDEST":

              return (
                new Date(
                  a?.createdAt || 0
                ) -
                new Date(
                  b?.createdAt || 0
                )
              );


            case "DUE_ASC":

              return (
                new Date(
                  a?.dueDate ||
                  "9999-12-31"
                ) -
                new Date(
                  b?.dueDate ||
                  "9999-12-31"
                )
              );


            case "DUE_DESC":

              return (
                new Date(
                  b?.dueDate ||
                  "9999-12-31"
                ) -
                new Date(
                  a?.dueDate ||
                  "9999-12-31"
                )
              );


            case "PRIORITY":

              return (
                getPriorityWeight(
                  b?.priority
                ) -
                getPriorityWeight(
                  a?.priority
                )
              );


            case "NEWEST":

            default:

              return (
                new Date(
                  b?.createdAt || 0
                ) -
                new Date(
                  a?.createdAt || 0
                )
              );

          }

        }
      );

    }, [
      recentTasks,
      taskSearch,
      taskStatusFilter,
      taskPriority,
      taskSort,
    ]);


  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {

    return (

      <div className="flex min-h-screen items-center justify-center bg-gray-50">

        <div className="text-center">

          <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-4 border-gray-200 border-t-gray-900" />

          <p className="text-sm text-gray-500">
            Loading analytics...
          </p>

        </div>

      </div>

    );

  }


  // =====================================================
  // ERROR
  // =====================================================

  if (error) {

    return (

      <div className="flex min-h-screen items-center justify-center bg-gray-50 p-6">

        <div className="w-full max-w-md rounded-xl bg-white p-8 text-center shadow-sm">

          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-50">

            <span className="text-xl font-bold text-red-600">
              !
            </span>

          </div>


          <h2 className="mt-4 text-lg font-semibold text-gray-900">
            Unable to load analytics
          </h2>


          <p className="mt-2 text-sm text-red-500">
            {error}
          </p>


          <button
            type="button"
            onClick={() =>
              window.location.reload()
            }
            className="mt-5 rounded-lg bg-gray-900 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-gray-800"
          >
            Try Again
          </button>

        </div>

      </div>

    );

  }


  // =====================================================
  // RENDER
  // =====================================================

  return (

    <div className="min-h-screen bg-gray-50 p-6">

      <div className="mx-auto max-w-7xl">


        {/* =================================================
            HEADER
        ================================================= */}

        <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">

          <div>

            <h1 className="text-3xl font-bold text-gray-900">
              Analytics
            </h1>

            <p className="mt-1 text-gray-500">
              Track your projects and task performance.
            </p>

          </div>


          <button
            type="button"
            onClick={() =>
              navigate("/dashboard")
            }
            className="rounded-lg bg-gray-900 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-gray-800"
          >
            Dashboard
          </button>

        </div>


        {/* =================================================
            STAT CARDS
        ================================================= */}

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-5">

          <StatCard
            label="Total Projects"
            value={totalProjects}
          />

          <StatCard
            label="Total Tasks"
            value={totalTasks}
          />

          <StatCard
            label="My Tasks"
            value={myTasks}
          />

          <StatCard
            label="Completed"
            value={completedTasks}
            valueClass="text-green-600"
          />

          <StatCard
            label="Overdue"
            value={overdueTasks}
            valueClass="text-red-600"
          />

        </div>


        {/* =================================================
            MY TASK SUMMARY
        ================================================= */}

        <div className="mt-8 rounded-xl bg-white p-6 shadow-sm">

          <h2 className="text-xl font-semibold text-gray-900">
            My Workload
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            Your assigned task progress.
          </p>


          <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">

            <SummaryItem
              label="My Tasks"
              value={myTasks}
            />

            <SummaryItem
              label="My Completed"
              value={myCompletedTasks}
            />

            <SummaryItem
              label="My Pending"
              value={myPendingTasks}
            />

          </div>

        </div>


        {/* =================================================
            OVERALL COMPLETION
        ================================================= */}

        <div className="mt-8 rounded-xl bg-white p-6 shadow-sm">

          <div className="flex items-center justify-between gap-4">

            <div>

              <h2 className="text-lg font-semibold text-gray-900">
                Overall Completion
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                Percentage of completed tasks
              </p>

            </div>


            <span className="text-2xl font-bold text-gray-900">
              {completionPercentage}%
            </span>

          </div>


          <div className="mt-5 h-4 overflow-hidden rounded-full bg-gray-100">

            <div
              className="h-full rounded-full bg-green-500 transition-all duration-700"
              style={{
                width:
                  `${completionPercentage}%`,
              }}
            />

          </div>

        </div>


        {/* =================================================
            TASK STATUS + SUMMARY
        ================================================= */}

        <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-2">


          {/* TASK STATUS */}

          <div className="rounded-xl bg-white p-6 shadow-sm">

            <h2 className="text-xl font-semibold text-gray-900">
              Task Status
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Distribution of tasks by status
            </p>


            <div className="mt-6 space-y-5">

              <AnalyticsBar
                label="To Do"
                value={todoTasks}
                total={statusTotal}
              />

              <AnalyticsBar
                label="In Progress"
                value={inProgressTasks}
                total={statusTotal}
              />

              <AnalyticsBar
                label="Review"
                value={reviewTasks}
                total={statusTotal}
              />

              <AnalyticsBar
                label="Completed"
                value={doneTasks}
                total={statusTotal}
              />

            </div>

          </div>


          {/* TASK SUMMARY */}

          <div className="rounded-xl bg-white p-6 shadow-sm">

            <h2 className="text-xl font-semibold text-gray-900">
              Task Summary
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Current task distribution
            </p>


            <div className="mt-6 space-y-4">

              <AnalyticsNumber
                label="To Do"
                value={todoTasks}
              />

              <AnalyticsNumber
                label="In Progress"
                value={inProgressTasks}
              />

              <AnalyticsNumber
                label="Review"
                value={reviewTasks}
              />

              <AnalyticsNumber
                label="Completed"
                value={doneTasks}
              />

              <AnalyticsNumber
                label="Overdue"
                value={overdueTasks}
              />

            </div>

          </div>

        </div>


        {/* =================================================
            PRIORITY DISTRIBUTION
        ================================================= */}

        <div className="mt-8 rounded-xl bg-white p-6 shadow-sm">

          <h2 className="text-xl font-semibold text-gray-900">
            Priority Distribution
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            Tasks grouped by priority.
          </p>


          <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">

            <SummaryItem
              label="Low"
              value={
                Number(
                  priorityDistribution.LOW
                ) || 0
              }
            />

            <SummaryItem
              label="Medium"
              value={
                Number(
                  priorityDistribution.MEDIUM
                ) || 0
              }
            />

            <SummaryItem
              label="High"
              value={
                Number(
                  priorityDistribution.HIGH
                ) || 0
              }
            />

            <SummaryItem
              label="Urgent"
              value={
                Number(
                  priorityDistribution.URGENT
                ) || 0
              }
            />

          </div>

        </div>


        {/* =================================================
            PROJECT ANALYTICS
        ================================================= */}

        <div className="mt-8 rounded-xl bg-white p-6 shadow-sm">

          <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">

            <div>

              <h2 className="text-xl font-semibold text-gray-900">
                Project Analytics
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                Task performance for your projects.
              </p>

            </div>


            <button
              type="button"
              onClick={() =>
                navigate("/projects")
              }
              className="text-sm font-semibold text-gray-700 hover:text-gray-900"
            >
              View All
            </button>

          </div>


          {projectAnalytics.length === 0 ? (

            <EmptyState
              message="No project analytics available"
            />

          ) : (

            <div className="mt-5 grid gap-4 md:grid-cols-2 lg:grid-cols-3">

              {projectAnalytics.map(
                (project) => (

                  <div
                    key={project?._id}
                    className="rounded-lg border border-gray-100 p-5 transition hover:shadow-sm"
                  >

                    <h3 className="font-semibold text-gray-900">
                      {project?.name ||
                        "Untitled Project"}
                    </h3>


                    <div className="mt-3 flex flex-wrap gap-2">

                      {project?.status && (

                        <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700">

                          {formatProjectStatus(
                            project.status
                          )}

                        </span>

                      )}


                      {project?.priority && (

                        <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700">

                          {formatPriority(
                            project.priority
                          )}

                        </span>

                      )}

                    </div>


                    <div className="mt-5 space-y-3">

                      <ProjectMetric
                        label="Total Tasks"
                        value={
                          project?.totalTasks || 0
                        }
                      />

                      <ProjectMetric
                        label="Completed"
                        value={
                          project?.completedTasks || 0
                        }
                      />

                      <ProjectMetric
                        label="In Progress"
                        value={
                          project?.inProgressTasks || 0
                        }
                      />

                      <ProjectMetric
                        label="To Do"
                        value={
                          project?.todoTasks || 0
                        }
                      />

                      <ProjectMetric
                        label="Review"
                        value={
                          project?.reviewTasks || 0
                        }
                      />

                      <ProjectMetric
                        label="Overdue"
                        value={
                          project?.overdueTasks || 0
                        }
                      />

                    </div>


                    <div className="mt-5">

                      <div className="mb-2 flex items-center justify-between">

                        <span className="text-xs text-gray-500">
                          Completion
                        </span>

                        <span className="text-sm font-bold text-gray-900">

                          {
                            project?.completionPercentage ||
                            0
                          }%

                        </span>

                      </div>


                      <div className="h-2 rounded-full bg-gray-100">

                        <div
                          className="h-full rounded-full bg-green-500 transition-all"
                          style={{
                            width:
                              `${Math.min(
                                Number(
                                  project?.completionPercentage
                                ) || 0,
                                100
                              )}%`,
                          }}
                        />

                      </div>

                    </div>

                  </div>

                )
              )}

            </div>

          )}

        </div>


        {/* =================================================
            RECENT PROJECTS
        ================================================= */}

        <div className="mt-8 rounded-xl bg-white p-6 shadow-sm">

          <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">

            <div>

              <h2 className="text-xl font-semibold text-gray-900">
                Recent Projects
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                Search and sort your recent projects.
              </p>

            </div>


            <button
              type="button"
              onClick={() =>
                navigate("/projects")
              }
              className="text-sm font-semibold text-gray-700 hover:text-gray-900"
            >
              View All
            </button>

          </div>


          {/* PROJECT FILTER */}

          <div className="mt-5 grid gap-3 md:grid-cols-2">

            <input
              type="text"
              value={projectSearch}
              onChange={(e) =>
                setProjectSearch(
                  e.target.value
                )
              }
              placeholder="Search projects..."
              className="rounded-lg border border-gray-200 px-4 py-3 text-sm outline-none transition focus:border-gray-500 focus:ring-2 focus:ring-gray-200"
            />


            <select
              value={projectSort}
              onChange={(e) =>
                setProjectSort(
                  e.target.value
                )
              }
              className="rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-gray-500 focus:ring-2 focus:ring-gray-200"
            >

              <option value="NEWEST">
                Newest First
              </option>

              <option value="OLDEST">
                Oldest First
              </option>

              <option value="NAME_ASC">
                Name A-Z
              </option>

              <option value="NAME_DESC">
                Name Z-A
              </option>

            </select>

          </div>


          <p className="mt-4 text-sm text-gray-500">

            Showing{" "}

            <span className="font-semibold text-gray-900">
              {filteredProjects.length}
            </span>

            {" "}projects

          </p>


          {filteredProjects.length === 0 ? (

            <EmptyState
              message="No projects found"
            />

          ) : (

            <div className="mt-4 grid gap-4 md:grid-cols-2 lg:grid-cols-3">

              {filteredProjects
                .slice(0, 6)
                .map(
                  (project) => (

                    <div
                      key={project?._id}
                      className="rounded-lg border border-gray-100 p-4 transition hover:shadow-sm"
                    >

                      <h3 className="font-semibold text-gray-900">

                        {project?.name ||
                          project?.title ||
                          "Untitled Project"}

                      </h3>


                      <p className="mt-1 line-clamp-2 text-sm text-gray-500">

                        {project?.description ||
                          "No description"}

                      </p>


                      <div className="mt-3 flex flex-wrap gap-2">

                        {project?.status && (

                          <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700">

                            {formatProjectStatus(
                              project.status
                            )}

                          </span>

                        )}


                        {project?.priority && (

                          <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700">

                            {formatPriority(
                              project.priority
                            )}

                          </span>

                        )}

                      </div>

                    </div>

                  )
                )}

            </div>

          )}

        </div>


        {/* =================================================
            RECENT TASKS
        ================================================= */}

        <div className="mt-8 rounded-xl bg-white p-6 shadow-sm">

          <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">

            <div>

              <h2 className="text-xl font-semibold text-gray-900">
                Recent Tasks
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                Search, filter and sort your recent tasks.
              </p>

            </div>


            <button
              type="button"
              onClick={() =>
                navigate("/tasks")
              }
              className="text-sm font-semibold text-gray-700 hover:text-gray-900"
            >
              View All
            </button>

          </div>


          {/* TASK FILTERS */}

          <div className="mt-5 grid gap-3 md:grid-cols-2 lg:grid-cols-4">

            <input
              type="text"
              value={taskSearch}
              onChange={(e) =>
                setTaskSearch(
                  e.target.value
                )
              }
              placeholder="Search tasks..."
              className="rounded-lg border border-gray-200 px-4 py-3 text-sm outline-none transition focus:border-gray-500 focus:ring-2 focus:ring-gray-200"
            />


            <select
              value={taskStatusFilter}
              onChange={(e) =>
                setTaskStatusFilter(
                  e.target.value
                )
              }
              className="rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-gray-500 focus:ring-2 focus:ring-gray-200"
            >

              <option value="ALL">
                All Status
              </option>

              <option value="TODO">
                To Do
              </option>

              <option value="IN_PROGRESS">
                In Progress
              </option>

              <option value="REVIEW">
                Review
              </option>

              <option value="DONE">
                Done
              </option>

            </select>


            <select
              value={taskPriority}
              onChange={(e) =>
                setTaskPriority(
                  e.target.value
                )
              }
              className="rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-gray-500 focus:ring-2 focus:ring-gray-200"
            >

              <option value="ALL">
                All Priority
              </option>

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


            <select
              value={taskSort}
              onChange={(e) =>
                setTaskSort(
                  e.target.value
                )
              }
              className="rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-gray-500 focus:ring-2 focus:ring-gray-200"
            >

              <option value="NEWEST">
                Newest First
              </option>

              <option value="OLDEST">
                Oldest First
              </option>

              <option value="DUE_ASC">
                Due Date ↑
              </option>

              <option value="DUE_DESC">
                Due Date ↓
              </option>

              <option value="PRIORITY">
                Highest Priority
              </option>

            </select>

          </div>


          <p className="mt-4 text-sm text-gray-500">

            Showing{" "}

            <span className="font-semibold text-gray-900">
              {filteredTasks.length}
            </span>

            {" "}tasks

          </p>


          {filteredTasks.length === 0 ? (

            <EmptyState
              message="No tasks found"
            />

          ) : (

            <div className="mt-4 space-y-3">

              {filteredTasks
                .slice(0, 6)
                .map(
                  (task) => (

                    <button
                      key={task?._id}
                      type="button"
                      onClick={() =>
                        task?._id &&
                        navigate(
                          `/tasks/${task._id}`
                        )
                      }
                      className="flex w-full flex-col justify-between gap-3 rounded-lg border border-gray-100 p-4 text-left transition hover:bg-gray-50 hover:shadow-sm sm:flex-row sm:items-center"
                    >

                      <div className="min-w-0">

                        <h3 className="truncate font-semibold text-gray-900">

                          {task?.title ||
                            "Untitled Task"}

                        </h3>


                        <p className="mt-1 truncate text-sm text-gray-500">

                          {task?.project?.name ||
                            "Unknown Project"}

                        </p>

                      </div>


                      <div className="flex shrink-0 flex-wrap items-center gap-2">

                        {task?.status && (

                          <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700">

                            {formatStatus(
                              task.status
                            )}

                          </span>

                        )}


                        {task?.priority && (

                          <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700">

                            {formatPriority(
                              task.priority
                            )}

                          </span>

                        )}

                      </div>

                    </button>

                  )
                )}

            </div>

          )}

        </div>

      </div>

    </div>

  );

};


// =====================================================
// TASK STATUS FILTER HELPER
// =====================================================

const taskStatusFilterValue = (
  selectedStatus,
  actualStatus
) => {

  return (
    selectedStatus === "ALL" ||
    actualStatus === selectedStatus
  );

};


// =====================================================
// STAT CARD
// =====================================================

const StatCard = ({
  label,
  value,
  valueClass = "text-gray-900",
}) => {

  return (

    <div className="rounded-xl bg-white p-6 shadow-sm">

      <p className="text-sm text-gray-500">
        {label}
      </p>

      <h2
        className={`mt-2 text-3xl font-bold ${valueClass}`}
      >
        {value}
      </h2>

    </div>

  );

};


// =====================================================
// ANALYTICS BAR
// =====================================================

const AnalyticsBar = ({
  label,
  value,
  total,
}) => {

  const percentage =
    total > 0
      ? Math.min(
          (value / total) * 100,
          100
        )
      : 0;


  return (

    <div>

      <div className="mb-2 flex justify-between text-sm">

        <span className="text-gray-600">
          {label}
        </span>

        <span className="font-semibold text-gray-900">
          {value}
        </span>

      </div>


      <div className="h-2 rounded-full bg-gray-100">

        <div
          className="h-full rounded-full bg-blue-500 transition-all duration-500"
          style={{
            width:
              `${percentage}%`,
          }}
        />

      </div>

    </div>

  );

};


// =====================================================
// ANALYTICS NUMBER
// =====================================================

const AnalyticsNumber = ({
  label,
  value,
}) => {

  return (

    <div className="flex items-center justify-between rounded-lg border border-gray-100 p-4">

      <span className="text-gray-600">
        {label}
      </span>

      <span className="text-xl font-bold text-gray-900">
        {value}
      </span>

    </div>

  );

};


// =====================================================
// SUMMARY ITEM
// =====================================================

const SummaryItem = ({
  label,
  value,
}) => {

  return (

    <div className="rounded-lg bg-gray-50 p-5">

      <p className="text-sm text-gray-500">
        {label}
      </p>

      <p className="mt-2 text-2xl font-bold text-gray-900">
        {value}
      </p>

    </div>

  );

};


// =====================================================
// PROJECT METRIC
// =====================================================

const ProjectMetric = ({
  label,
  value,
}) => {

  return (

    <div className="flex items-center justify-between text-sm">

      <span className="text-gray-500">
        {label}
      </span>

      <span className="font-semibold text-gray-900">
        {value}
      </span>

    </div>

  );

};


// =====================================================
// EMPTY STATE
// =====================================================

const EmptyState = ({
  message,
}) => {

  return (

    <div className="mt-5 rounded-lg border border-dashed border-gray-200 bg-gray-50 p-8 text-center">

      <div className="text-2xl">
        🔍
      </div>

      <p className="mt-2 text-sm font-medium text-gray-700">
        {message}
      </p>

      <p className="mt-1 text-xs text-gray-500">
        Try changing your search or filters.
      </p>

    </div>

  );

};


// =====================================================
// PRIORITY WEIGHT
// =====================================================

const getPriorityWeight = (
  priority
) => {

  switch (
    String(
      priority || ""
    ).toUpperCase()
  ) {

    case "URGENT":
      return 4;

    case "HIGH":
      return 3;

    case "MEDIUM":
      return 2;

    case "LOW":
      return 1;

    default:
      return 0;

  }

};


// =====================================================
// STATUS FORMATTER
// =====================================================

const formatStatus = (
  status
) => {

  switch (
    String(
      status || ""
    ).toUpperCase()
  ) {

    case "TODO":
      return "To Do";

    case "IN_PROGRESS":
      return "In Progress";

    case "REVIEW":
      return "Review";

    case "DONE":
      return "Done";

    default:
      return status || "Unknown";

  }

};


// =====================================================
// PROJECT STATUS FORMATTER
// =====================================================

const formatProjectStatus = (
  status
) => {

  switch (
    String(
      status || ""
    ).toUpperCase()
  ) {

    case "PLANNING":
      return "Planning";

    case "IN_PROGRESS":
      return "In Progress";

    case "ON_HOLD":
      return "On Hold";

    case "COMPLETED":
      return "Completed";

    default:
      return status || "Unknown";

  }

};


// =====================================================
// PRIORITY FORMATTER
// =====================================================

const formatPriority = (
  priority
) => {

  if (!priority) {
    return "Unknown";
  }

  return (
    String(priority)
      .charAt(0)
      .toUpperCase() +
    String(priority)
      .slice(1)
      .toLowerCase()
  );

};


export default Analytics;
