
import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  useNavigate,
} from "react-router-dom";

import {
  getProjectTasks,
} from "../services/taskService";

import {
  getProjects,
} from "../services/projectService";

import SortSelect from "../component/SortSelect";

import { useAuth } from "../context/AuthContext";
// eslint-disable-next-line no-unused-vars
import CreateTask from "./CreateTask"
// =====================================================
// TASKS PAGE
// =====================================================

const Tasks = () => {

  const navigate = useNavigate();


  // =====================================================
  // CURRENT USER
  // =====================================================

  /*
    IMPORTANT:
    Change this according to your existing auth system.

    If user is stored as:
      localStorage.setItem("user", JSON.stringify(user))

    this will work directly.
  */

    const { user: currentUser } = useAuth();
//   const currentUser = useMemo(() => {

//     try {

//       const storedUser =
//         localStorage.getItem("user");

//       return storedUser
//         ? JSON.parse(storedUser)
//         : null;

//     } catch (error) {

//       console.error(
//         "Failed to parse current user:",
//         error
//       );

//       return null;

//     }

//   }, []);


  // =====================================================
  // CURRENT USER ROLE
  // =====================================================

 const currentUserRole =
    String(
      currentUser?.role || ""
    )
      .trim()
      .toUpperCase();


  console.log(
    "========== TASKS RBAC =========="
  );

  console.log(
    "Current User:",
    currentUser
  );

  console.log(
    "Current User Role:",
    currentUserRole
  );



  // =====================================================
  // RBAC PERMISSIONS
  // =====================================================

  const permissions = useMemo(() => {

    return {

      // -------------------------------------------------
      // VIEW TASKS
      // -------------------------------------------------

      canViewTasks:
        [
          "OWNER",
          "ADMIN",
          "MANAGER",
          "MEMBER",
          "VIEWER",
        ].includes(currentUserRole),


      // -------------------------------------------------
      // CREATE TASK
      // -------------------------------------------------

      canCreateTask:
        [
          "OWNER",
          "ADMIN",
          "MANAGER",
        ].includes(currentUserRole),


      // -------------------------------------------------
      // UPDATE ANY TASK
      // -------------------------------------------------

      canUpdateAnyTask:
        [
          "OWNER",
          "ADMIN",
          "MANAGER",
        ].includes(currentUserRole),


      // -------------------------------------------------
      // DELETE TASK
      // -------------------------------------------------

      canDeleteTask:
        [
          "OWNER",
          "ADMIN",
        ].includes(currentUserRole),

    };

  }, [currentUserRole]);


  // =====================================================
  // STATE
  // =====================================================

  const [tasks, setTasks] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const [search, setSearch] =
    useState("");

  const [statusFilter, setStatusFilter] =
    useState("ALL");

  const [priorityFilter, setPriorityFilter] =
    useState("ALL");

  const [sortBy, setSortBy] =
    useState("NEWEST");


  // =====================================================
  // SORT OPTIONS
  // =====================================================

  const sortOptions = [
    {
      value: "NEWEST",
      label: "Newest First",
    },
    {
      value: "OLDEST",
      label: "Oldest First",
    },
    {
      value: "TITLE_ASC",
      label: "Title A → Z",
    },
    {
      value: "TITLE_DESC",
      label: "Title Z → A",
    },
    {
      value: "DUE_DATE_ASC",
      label: "Due Date ↑",
    },
    {
      value: "DUE_DATE_DESC",
      label: "Due Date ↓",
    },
    {
      value: "PRIORITY_HIGH",
      label: "Highest Priority",
    },
  ];


  // =====================================================
  // LOAD ALL PROJECT TASKS
  // =====================================================

  useEffect(() => {

    const loadTasks = async () => {

      try {

        setLoading(true);
        setError("");


        // -------------------------------------------------
        // RBAC CHECK
        // -------------------------------------------------

        if (!permissions.canViewTasks) {

          setError(
            "You do not have permission to view tasks."
          );

          return;

        }


        // -------------------------------------------------
        // GET ALL PROJECTS
        // -------------------------------------------------

        const projectResponse =
          await getProjects();


        const projects =
          Array.isArray(
            projectResponse?.projects
          )
            ? projectResponse.projects
            : Array.isArray(
                projectResponse?.data
              )
            ? projectResponse.data
            : Array.isArray(
                projectResponse
              )
            ? projectResponse
            : [];


        // -------------------------------------------------
        // NO PROJECTS
        // -------------------------------------------------

        if (projects.length === 0) {

          setTasks([]);

          return;

        }


        // -------------------------------------------------
        // GET TASKS FOR EVERY PROJECT
        // -------------------------------------------------

        const taskResponses =
          await Promise.all(

            projects.map(
              async (project) => {

                try {

                  if (!project?._id) {

                    return [];

                  }


                  const response =
                    await getProjectTasks(
                      project._id
                    );


                  const projectTasks =
                    Array.isArray(
                      response?.tasks
                    )
                      ? response.tasks
                      : [];


                  // ---------------------------------------
                  // ADD PROJECT INFORMATION
                  // ---------------------------------------

                  return projectTasks.map(
                    (task) => ({

                      ...task,

                      project:
                        task?.project &&
                        typeof task.project ===
                          "object"
                          ? task.project
                          : {

                              _id:
                                project._id,

                              name:
                                project?.name ||
                                project?.title ||
                                "Unknown Project",

                            },

                    })
                  );

                } catch (projectError) {

                  console.error(
                    `Failed to load tasks for project ${project?._id}:`,
                    projectError
                  );

                  return [];

                }

              }
            )

          );


        // -------------------------------------------------
        // COMBINE TASKS
        // -------------------------------------------------

        const allTasks =
          taskResponses.flat();


        setTasks(allTasks);

      } catch (err) {

        console.error(
          "Tasks Error:",
          err
        );


        setError(
          err?.response?.data?.message ||
          err?.message ||
          "Unable to load tasks"
        );

      } finally {

        setLoading(false);

      }

    };


    loadTasks();

  }, [permissions.canViewTasks]);


  // =====================================================
  // FORMAT DATE
  // =====================================================

  const formatDate = (date) => {

    if (!date) {

      return "No due date";

    }


    const parsedDate =
      new Date(date);


    if (
      Number.isNaN(
        parsedDate.getTime()
      )
    ) {

      return "Invalid date";

    }


    return parsedDate.toLocaleDateString(
      "en-IN",
      {
        day: "numeric",
        month: "short",
        year: "numeric",
      }
    );

  };


  // =====================================================
  // CHECK OVERDUE
  // =====================================================

  const isOverdue = (task) => {

    if (!task?.dueDate) {

      return false;

    }


    const status =
      String(
        task?.status || ""
      ).toUpperCase();


    if (status === "DONE") {

      return false;

    }


    const dueDate =
      new Date(task.dueDate);


    if (
      Number.isNaN(
        dueDate.getTime()
      )
    ) {

      return false;

    }


    return dueDate < new Date();

  };


  // =====================================================
  // STATUS CLASS
  // =====================================================

  const getStatusClass = (status) => {

    switch (
      String(status || "")
        .toUpperCase()
    ) {

      case "TODO":

        return "bg-gray-100 text-gray-700";

      case "IN_PROGRESS":

        return "bg-blue-100 text-blue-700";

      case "REVIEW":

        return "bg-yellow-100 text-yellow-700";

      case "DONE":

        return "bg-green-100 text-green-700";

      default:

        return "bg-gray-100 text-gray-600";

    }

  };


  // =====================================================
  // STATUS LABEL
  // =====================================================

  const getStatusLabel = (status) => {

    switch (
      String(status || "")
        .toUpperCase()
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
  // PRIORITY CLASS
  // =====================================================

  const getPriorityClass = (priority) => {

    switch (
      String(priority || "")
        .toUpperCase()
    ) {

      case "LOW":

        return "bg-gray-100 text-gray-700";

      case "MEDIUM":

        return "bg-blue-100 text-blue-700";

      case "HIGH":

        return "bg-orange-100 text-orange-700";

      case "URGENT":

        return "bg-red-100 text-red-700";

      default:

        return "bg-gray-100 text-gray-600";

    }

  };


  // =====================================================
  // PRIORITY LABEL
  // =====================================================

  const getPriorityLabel = (priority) => {

    switch (
      String(priority || "")
        .toUpperCase()
    ) {

      case "LOW":

        return "Low";

      case "MEDIUM":

        return "Medium";

      case "HIGH":

        return "High";

      case "URGENT":

        return "Urgent";

      default:

        return priority || "Unknown";

    }

  };


  // =====================================================
  // ASSIGNED USER
  // =====================================================

  const getAssignedUser = (assignedTo) => {

    if (!assignedTo) {

      return "Unassigned";

    }


    if (
      typeof assignedTo ===
      "object"
    ) {

      return (
        assignedTo?.name ||
        assignedTo?.username ||
        assignedTo?.email ||
        "Unknown User"
      );

    }


    return String(assignedTo);

  };


  // =====================================================
  // PROJECT NAME
  // =====================================================

  const getProjectName = (project) => {

    if (!project) {

      return "Unknown Project";

    }


    if (
      typeof project ===
      "object"
    ) {

      return (
        project?.name ||
        project?.title ||
        "Unknown Project"
      );

    }


    return String(project);

  };


  // =====================================================
  // FILTER + SORT TASKS
  // =====================================================

  const filteredTasks = useMemo(() => {

    const searchText =
      search
        .trim()
        .toLowerCase();


    const result =
      tasks.filter((task) => {

        const title =
          String(
            task?.title || ""
          ).toLowerCase();


        const description =
          String(
            task?.description || ""
          ).toLowerCase();


        const projectName =
          String(
            getProjectName(
              task?.project
            )
          ).toLowerCase();


        const assignedUser =
          String(
            getAssignedUser(
              task?.assignedTo
            )
          ).toLowerCase();


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
          ) ||
          assignedUser.includes(
            searchText
          );


        const matchesStatus =
          statusFilter === "ALL" ||
          String(
            task?.status || ""
          ).toUpperCase() ===
            statusFilter;


        const matchesPriority =
          priorityFilter === "ALL" ||
          String(
            task?.priority || ""
          ).toUpperCase() ===
            priorityFilter;


        return (
          matchesSearch &&
          matchesStatus &&
          matchesPriority
        );

      });


    return [...result].sort(
      (a, b) => {

        switch (sortBy) {

          case "NEWEST": {

            const dateA =
              new Date(
                a?.createdAt || 0
              ).getTime();

            const dateB =
              new Date(
                b?.createdAt || 0
              ).getTime();

            return dateB - dateA;

          }


          case "OLDEST": {

            const dateA =
              new Date(
                a?.createdAt || 0
              ).getTime();

            const dateB =
              new Date(
                b?.createdAt || 0
              ).getTime();

            return dateA - dateB;

          }


          case "TITLE_ASC":

            return String(
              a?.title || ""
            ).localeCompare(
              String(
                b?.title || ""
              )
            );


          case "TITLE_DESC":

            return String(
              b?.title || ""
            ).localeCompare(
              String(
                a?.title || ""
              )
            );


          case "DUE_DATE_ASC": {

            const dateA =
              a?.dueDate
                ? new Date(
                    a.dueDate
                  ).getTime()
                : Infinity;

            const dateB =
              b?.dueDate
                ? new Date(
                    b.dueDate
                  ).getTime()
                : Infinity;

            return dateA - dateB;

          }


          case "DUE_DATE_DESC": {

            const dateA =
              a?.dueDate
                ? new Date(
                    a.dueDate
                  ).getTime()
                : 0;

            const dateB =
              b?.dueDate
                ? new Date(
                    b.dueDate
                  ).getTime()
                : 0;

            return dateB - dateA;

          }


          case "PRIORITY_HIGH": {

            const priorityRank = {

              URGENT: 4,
              HIGH: 3,
              MEDIUM: 2,
              LOW: 1,

            };


            const priorityA =
              priorityRank[
                String(
                  a?.priority || ""
                ).toUpperCase()
              ] || 0;


            const priorityB =
              priorityRank[
                String(
                  b?.priority || ""
                ).toUpperCase()
              ] || 0;


            return (
              priorityB -
              priorityA
            );

          }


          default:

            return 0;

        }

      }
    );

  }, [
    tasks,
    search,
    statusFilter,
    priorityFilter,
    sortBy,
  ]);


  // =====================================================
  // CLEAR FILTERS
  // =====================================================

  const clearFilters = () => {

    setSearch("");

    setStatusFilter("ALL");

    setPriorityFilter("ALL");

    setSortBy("NEWEST");

  };


  // =====================================================
  // OPEN TASK
  // =====================================================

  const openTask = (task) => {

    if (!task?._id) {

      return;

    }


    /*
      VIEWER:
      Can open/read task details.

      MEMBER:
      Can open task details.

      MANAGER / ADMIN / OWNER:
      Can open task details.
    */

    if (!permissions.canViewTasks) {

      return;

    }


    navigate(
      `/tasks/${task._id}`
    );

  };


  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {

    return (

      <div className="flex min-h-screen items-center justify-center bg-slate-50">

        <div className="text-center">

          <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-slate-900" />

          <p className="text-sm text-slate-500">
            Loading tasks...
          </p>

        </div>

      </div>

    );

  }


  // =====================================================
  // RBAC DENIED
  // =====================================================

  if (!permissions.canViewTasks) {

    return (

      <div className="flex min-h-screen items-center justify-center bg-slate-50 p-6">

        <div className="w-full max-w-md rounded-2xl bg-white p-8 text-center shadow-sm">

          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-red-100 text-2xl text-red-600">
            🔒
          </div>

          <h2 className="mt-4 text-xl font-semibold text-slate-900">
            Access Denied
          </h2>

          <p className="mt-2 text-sm text-slate-500">
            Your role does not have permission
            to view tasks.
          </p>

          <p className="mt-3 text-xs text-slate-400">
            Current role:{" "}
            <span className="font-semibold">
              {currentUserRole || "UNKNOWN"}
            </span>
          </p>

          <button
            type="button"
            onClick={() =>
              navigate("/dashboard")
            }
            className="mt-6 rounded-lg bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800"
          >
            Back to Dashboard
          </button>

        </div>

      </div>

    );

  }


  // =====================================================
  // ERROR
  // =====================================================

  if (error) {

    return (

      <div className="flex min-h-screen items-center justify-center bg-slate-50 p-6">

        <div className="w-full max-w-md rounded-2xl bg-white p-8 text-center shadow-sm">

          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-100 text-xl text-red-600">
            !
          </div>

          <h2 className="mt-4 text-lg font-semibold text-slate-900">
            Unable to load tasks
          </h2>

          <p className="mt-2 text-sm text-red-600">
            {error}
          </p>

          <button
            type="button"
            onClick={() =>
              window.location.reload()
            }
            className="mt-5 rounded-lg bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800"
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

    <div className="min-h-screen bg-slate-50 p-6">

      <div className="mx-auto max-w-7xl">


        {/* =================================================
            HEADER
        ================================================= */}

        <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-center">

          <div>

            <div className="flex items-center gap-3">

              <h1 className="text-3xl font-bold text-slate-900">
                Tasks
              </h1>

              <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
                {currentUserRole || "USER"}
              </span>

            </div>

            <p className="mt-1 text-slate-500">
              Manage and track all your project tasks.
            </p>

          </div>


          <div className="flex gap-3">

            {/* -------------------------------------------------
                CREATE TASK
            ------------------------------------------------- */}

            {permissions.canCreateTask && (

              <button
                type="button"
                onClick={() =>
                  navigate("/tasks/create")
                }
                className="rounded-lg bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800"
              >
                + Create Task
              </button>

            )}


            {/* -------------------------------------------------
                VIEW PROJECTS
            ------------------------------------------------- */}

            <button
              type="button"
              onClick={() =>
                navigate("/projects")
              }
              className="rounded-lg border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
            >
              View Projects
            </button>

          </div>

        </div>


        {/* =================================================
            ROLE INFORMATION
        ================================================= */}

        <div className="mb-6 rounded-xl border border-slate-200 bg-white px-5 py-4">

          <div className="flex flex-wrap items-center gap-3">

            <span className="text-sm font-medium text-slate-600">
              Your permissions:
            </span>

            <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
              View Tasks
            </span>


            {permissions.canCreateTask && (

              <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700">
                Create Tasks
              </span>

            )}


            {permissions.canUpdateAnyTask && (

              <span className="rounded-full bg-yellow-100 px-3 py-1 text-xs font-semibold text-yellow-700">
                Manage Tasks
              </span>

            )}


            {permissions.canDeleteTask && (

              <span className="rounded-full bg-red-100 px-3 py-1 text-xs font-semibold text-red-700">
                Delete Tasks
              </span>

            )}

          </div>

        </div>


        {/* =================================================
            FILTERS + SORT
        ================================================= */}

        <div className="mb-6 rounded-2xl bg-white p-5 shadow-sm">

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">


            {/* SEARCH */}

            <div className="lg:col-span-2">

              <label
                htmlFor="task-search"
                className="mb-2 block text-sm font-medium text-slate-700"
              >
                Search
              </label>

              <input
                id="task-search"
                type="text"
                value={search}
                onChange={(e) =>
                  setSearch(
                    e.target.value
                  )
                }
                placeholder="Search tasks, projects, users..."
                className="w-full rounded-lg border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
              />

            </div>


            {/* STATUS */}

            <div>

              <label
                htmlFor="task-status"
                className="mb-2 block text-sm font-medium text-slate-700"
              >
                Status
              </label>

              <select
                id="task-status"
                value={statusFilter}
                onChange={(e) =>
                  setStatusFilter(
                    e.target.value
                  )
                }
                className="w-full rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
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

            </div>


            {/* PRIORITY */}

            <div>

              <label
                htmlFor="task-priority"
                className="mb-2 block text-sm font-medium text-slate-700"
              >
                Priority
              </label>

              <select
                id="task-priority"
                value={priorityFilter}
                onChange={(e) =>
                  setPriorityFilter(
                    e.target.value
                  )
                }
                className="w-full rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
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

            </div>

          </div>


          {/* =================================================
              SORT
          ================================================= */}

          <div className="mt-4 grid gap-4 sm:grid-cols-2">

            <SortSelect
              value={sortBy}
              onChange={setSortBy}
              options={sortOptions}
              id="task-sort"
              label="Sort Tasks"
            />


            {/* CLEAR */}

            <div className="flex items-end justify-end">

              {(search ||
                statusFilter !== "ALL" ||
                priorityFilter !== "ALL" ||
                sortBy !== "NEWEST") && (

                <button
                  type="button"
                  onClick={
                    clearFilters
                  }
                  className="rounded-lg border border-slate-200 px-4 py-3 text-sm font-medium text-slate-600 transition hover:bg-slate-50 hover:text-slate-900"
                >
                  Clear Filters
                </button>

              )}

            </div>

          </div>

        </div>


        {/* =================================================
            TASK COUNT
        ================================================= */}

        <div className="mb-4 flex items-center justify-between">

          <p className="text-sm text-slate-500">

            Showing{" "}

            <span className="font-semibold text-slate-900">
              {filteredTasks.length}
            </span>

            {" "}of{" "}

            <span className="font-semibold text-slate-900">
              {tasks.length}
            </span>

            {" "}tasks

          </p>

        </div>


        {/* =================================================
            EMPTY
        ================================================= */}

        {filteredTasks.length === 0 ? (

          <div className="rounded-2xl bg-white p-12 text-center shadow-sm">

            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-slate-100 text-2xl">
              ✓
            </div>

            <h2 className="mt-4 text-lg font-semibold text-slate-900">
              No tasks found
            </h2>

            <p className="mt-2 text-sm text-slate-500">
              There are no tasks matching your filters.
            </p>

            {(search ||
              statusFilter !== "ALL" ||
              priorityFilter !== "ALL") && (

              <button
                type="button"
                onClick={
                  clearFilters
                }
                className="mt-5 rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800"
              >
                Clear Filters
              </button>

            )}

          </div>

        ) : (

          /* =================================================
             TASK LIST
          ================================================= */

          <div className="space-y-4">

            {filteredTasks.map(
              (task) => {

                const overdue =
                  isOverdue(task);


                const projectName =
                  getProjectName(
                    task?.project
                  );


                const assignedUser =
                  getAssignedUser(
                    task?.assignedTo
                  );


                return (

                  <button
                    key={task?._id}
                    type="button"
                    onClick={() =>
                      openTask(task)
                    }
                    className="w-full rounded-2xl bg-white p-5 text-left shadow-sm transition hover:-translate-y-0.5 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-slate-300"
                  >

                    <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">


                      {/* =================================================
                          TASK INFO
                      ================================================= */}

                      <div className="min-w-0 flex-1">

                        <div className="flex flex-wrap items-center gap-2">

                          <h2 className="break-words text-lg font-semibold text-slate-900">
                            {task?.title ||
                              "Untitled Task"}
                          </h2>


                          {overdue && (

                            <span className="rounded-full bg-red-100 px-2.5 py-1 text-xs font-semibold text-red-700">
                              Overdue
                            </span>

                          )}

                        </div>


                        <p className="mt-2 line-clamp-2 text-sm text-slate-500">
                          {task?.description ||
                            "No description provided."}
                        </p>


                        {/* TAGS */}

                        <div className="mt-4 flex flex-wrap gap-2 text-xs">


                          {/* PROJECT */}

                          <span className="rounded-full bg-slate-100 px-3 py-1 font-medium text-slate-600">

                            Project:{" "}

                            {projectName}

                          </span>


                          {/* STATUS */}

                          <span
                            className={`rounded-full px-3 py-1 font-semibold ${getStatusClass(
                              task?.status
                            )}`}
                          >
                            {getStatusLabel(
                              task?.status
                            )}
                          </span>


                          {/* PRIORITY */}

                          <span
                            className={`rounded-full px-3 py-1 font-semibold ${getPriorityClass(
                              task?.priority
                            )}`}
                          >
                            {getPriorityLabel(
                              task?.priority
                            )}
                          </span>

                        </div>

                      </div>


                      {/* =================================================
                          DETAILS
                      ================================================= */}

                      <div className="grid shrink-0 gap-3 sm:grid-cols-2 lg:w-72">


                        {/* DUE DATE */}

                        <div className="rounded-lg bg-slate-50 p-3">

                          <p className="text-xs text-slate-400">
                            Due Date
                          </p>


                          <p
                            className={`mt-1 text-sm font-semibold ${
                              overdue
                                ? "text-red-600"
                                : "text-slate-800"
                            }`}
                          >
                            {formatDate(
                              task?.dueDate
                            )}
                          </p>

                        </div>


                        {/* ASSIGNED USER */}

                        <div className="rounded-lg bg-slate-50 p-3">

                          <p className="text-xs text-slate-400">
                            Assigned To
                          </p>


                          <p className="mt-1 truncate text-sm font-semibold text-slate-800">
                            {assignedUser}
                          </p>

                        </div>

                      </div>

                    </div>

                  </button>

                );

              }
            )}

          </div>

        )}

      </div>

    </div>

  );

};


export default Tasks;

