
/* eslint-disable react-hooks/set-state-in-effect */

import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  Link,
} from "react-router-dom";

import {
  getProjects,
  deleteProject,
} from "../services/projectService";

import { useAuth } from "../context/AuthContext";


// =====================================================
// RBAC CONFIGURATION
// =====================================================

const PROJECT_CREATE_ROLES = [
  "OWNER",
  "ADMIN",
  "MANAGER",
];

const PROJECT_DELETE_ROLES = [
  "OWNER",
  "ADMIN",
];


// =====================================================
// NORMALIZE ROLE
// =====================================================

const normalizeRole = (role) => {
  if (!role) {
    return "";
  }

  return String(role)
    .trim()
    .toUpperCase();
};


// =====================================================
// GET USER ROLE
// =====================================================

const getUserRole = (user, auth) => {
  // ---------------------------------------------------
  // 1. AuthContext direct role
  // ---------------------------------------------------

  const directAuthRoles = [
    auth?.role,
    auth?.userRole,
    auth?.currentUserRole,
    auth?.currentUser?.role,
    auth?.authUser?.role,
  ];

  for (const role of directAuthRoles) {
    const normalized = normalizeRole(role);

    if (normalized) {
      return normalized;
    }
  }


  // ---------------------------------------------------
  // 2. User direct role
  // ---------------------------------------------------

  const directUserRoles = [
    user?.role,
    user?.userRole,
    user?.memberRole,
    user?.currentUserRole,
  ];

  for (const role of directUserRoles) {
    const normalized = normalizeRole(role);

    if (normalized) {
      return normalized;
    }
  }


  // ---------------------------------------------------
  // 3. Nested user role
  // ---------------------------------------------------

  const nestedUserRoles = [
    user?.user?.role,
    user?.user?.userRole,
    user?.user?.memberRole,

    user?.data?.role,
    user?.data?.userRole,

    user?.data?.user?.role,
    user?.data?.user?.userRole,
  ];

  for (const role of nestedUserRoles) {
    const normalized = normalizeRole(role);

    if (normalized) {
      return normalized;
    }
  }


  // ---------------------------------------------------
  // 4. Department roles
  // ---------------------------------------------------

  if (Array.isArray(user?.departments)) {
    for (const department of user.departments) {
      const departmentRoles = [
        department?.role,
        department?.userRole,
        department?.memberRole,
        department?.user?.role,
        department?.user?.userRole,
        department?.member?.role,
        department?.member?.userRole,
        department?.membership?.role,
        department?.membership?.memberRole,
      ];

      for (const role of departmentRoles) {
        const normalized = normalizeRole(role);

        if (normalized) {
          return normalized;
        }
      }
    }
  }


  // ---------------------------------------------------
  // 5. Membership
  // ---------------------------------------------------

  if (Array.isArray(user?.memberships)) {
    for (const membership of user.memberships) {
      const membershipRoles = [
        membership?.role,
        membership?.userRole,
        membership?.memberRole,
      ];

      for (const role of membershipRoles) {
        const normalized = normalizeRole(role);

        if (normalized) {
          return normalized;
        }
      }
    }
  }


  // ---------------------------------------------------
  // 6. Roles array
  // ---------------------------------------------------

  if (Array.isArray(user?.roles)) {
    for (const role of user.roles) {
      const normalized = normalizeRole(
        typeof role === "object"
          ? role?.name || role?.role
          : role
      );

      if (normalized) {
        return normalized;
      }
    }
  }


  return "";
};


// =====================================================
// GET USER NAME
// =====================================================

const getUserName = (user) => {
  if (!user) {
    return "Unknown User";
  }

  if (typeof user === "object") {
    return (
      user?.name ||
      user?.username ||
      user?.email ||
      "Unknown User"
    );
  }

  return String(user);
};


// =====================================================
// PROJECTS PAGE
// =====================================================

const Projects = () => {

  // ===================================================
  // AUTH CONTEXT
  // ===================================================

  const auth = useAuth();


  // ===================================================
  // CURRENT USER
  // ===================================================

  const currentUser =
    auth?.user ||
    auth?.currentUser ||
    auth?.authUser ||
    auth?.data?.user ||
    null;


  // ===================================================
  // CURRENT USER ROLE
  // ===================================================

  const currentUserRole = useMemo(
    () => getUserRole(currentUser, auth),
    [currentUser, auth]
  );


  // ===================================================
  // RBAC PERMISSIONS
  // ===================================================

  const canCreateProject =
    PROJECT_CREATE_ROLES.includes(
      currentUserRole
    );

  const canDeleteProject =
    PROJECT_DELETE_ROLES.includes(
      currentUserRole
    );


  // ===================================================
  // DEBUG
  // ===================================================

  useEffect(() => {
    console.log(
      "========== PROJECT RBAC =========="
    );

    console.log(
      "AUTH OBJECT:",
      auth
    );

    console.log(
      "CURRENT USER:",
      currentUser
    );

    console.log(
      "CURRENT USER ROLE:",
      currentUserRole
    );

    console.log(
      "CREATE ROLES:",
      PROJECT_CREATE_ROLES
    );

    console.log(
      "CAN CREATE PROJECT:",
      canCreateProject
    );

    console.log(
      "DELETE ROLES:",
      PROJECT_DELETE_ROLES
    );

    console.log(
      "CAN DELETE PROJECT:",
      canDeleteProject
    );

    console.log(
      "=================================="
    );
  }, [
    auth,
    currentUser,
    currentUserRole,
    canCreateProject,
    canDeleteProject,
  ]);


  // ===================================================
  // STATE
  // ===================================================

  const [projects, setProjects] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const [deletingId, setDeletingId] =
    useState(null);


  // ===================================================
  // FILTER STATE
  // ===================================================

  const [search, setSearch] =
    useState("");

  const [statusFilter, setStatusFilter] =
    useState("ALL");

  const [priorityFilter, setPriorityFilter] =
    useState("ALL");


  // ===================================================
  // LOAD PROJECTS
  // ===================================================

  const loadProjects = async () => {

    try {

      setLoading(true);
      setError("");

      const response =
        await getProjects();

      const projectList =
        response?.projects ||
        response?.data?.projects ||
        response?.data ||
        (
          Array.isArray(response)
            ? response
            : []
        );

      setProjects(
        Array.isArray(projectList)
          ? projectList
          : []
      );

    } catch (err) {

      console.error(
        "Projects Error:",
        err
      );

      setError(
        err?.response?.data?.message ||
        err?.message ||
        "Failed to load projects"
      );

    } finally {

      setLoading(false);

    }

  };


  // ===================================================
  // INITIAL LOAD
  // ===================================================

  useEffect(() => {

    loadProjects();

  }, []);


  // ===================================================
  // DELETE PROJECT
  // ===================================================

  const handleDelete = async (
    projectId
  ) => {

    // -------------------------------------------------
    // FRONTEND RBAC CHECK
    // -------------------------------------------------

    if (!canDeleteProject) {

      window.alert(
        "You do not have permission to delete projects."
      );

      return;
    }


    if (!projectId) {
      return;
    }


    // -------------------------------------------------
    // CONFIRMATION
    // -------------------------------------------------

    const confirmed =
      window.confirm(
        "Are you sure you want to delete this project? This action cannot be undone."
      );


    if (!confirmed) {
      return;
    }


    // -------------------------------------------------
    // DELETE
    // -------------------------------------------------

    try {

      setDeletingId(projectId);

      await deleteProject(projectId);


      setProjects(
        (currentProjects) =>
          currentProjects.filter(
            (project) =>
              project?._id !== projectId
          )
      );

    } catch (err) {

      console.error(
        "Delete Project Error:",
        err
      );

      window.alert(
        err?.response?.data?.message ||
        err?.message ||
        "Failed to delete project"
      );

    } finally {

      setDeletingId(null);

    }

  };


  // ===================================================
  // FILTER PROJECTS
  // ===================================================

  const filteredProjects =
    useMemo(() => {

      const searchValue =
        search
          .trim()
          .toLowerCase();


      return projects.filter(
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
            ).toUpperCase();


          const priority =
            String(
              project?.priority ||
              ""
            ).toUpperCase();


          // -------------------------------------------
          // SEARCH
          // -------------------------------------------

          const matchesSearch =
            !searchValue ||
            name.includes(searchValue) ||
            description.includes(searchValue);


          // -------------------------------------------
          // STATUS
          // -------------------------------------------

          const matchesStatus =
            statusFilter === "ALL" ||
            status === statusFilter;


          // -------------------------------------------
          // PRIORITY
          // -------------------------------------------

          const matchesPriority =
            priorityFilter === "ALL" ||
            priority === priorityFilter;


          return (
            matchesSearch &&
            matchesStatus &&
            matchesPriority
          );

        }
      );

    }, [
      projects,
      search,
      statusFilter,
      priorityFilter,
    ]);


  // ===================================================
  // CLEAR FILTERS
  // ===================================================

  const clearFilters = () => {

    setSearch("");
    setStatusFilter("ALL");
    setPriorityFilter("ALL");

  };


  const hasActiveFilters =
    search.trim() !== "" ||
    statusFilter !== "ALL" ||
    priorityFilter !== "ALL";


  // ===================================================
  // PROJECT COUNTS
  // ===================================================

  const activeProjects =
    projects.filter(
      (project) =>
        String(
          project?.status || ""
        ).toUpperCase() ===
        "ACTIVE"
    ).length;


  const inProgressProjects =
    projects.filter(
      (project) =>
        String(
          project?.status || ""
        ).toUpperCase() ===
        "IN_PROGRESS"
    ).length;


  const completedProjects =
    projects.filter(
      (project) =>
        String(
          project?.status || ""
        ).toUpperCase() ===
        "COMPLETED"
    ).length;


  // ===================================================
  // LOADING
  // ===================================================

  if (loading) {

    return (

      <div className="flex min-h-screen items-center justify-center bg-slate-50">

        <div className="text-center">

          <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-slate-900" />

          <p className="text-sm text-slate-500">
            Loading projects...
          </p>

        </div>

      </div>

    );

  }


  // ===================================================
  // RENDER
  // ===================================================

  return (

    <div className="min-h-screen bg-slate-50 p-6">

      <div className="mx-auto max-w-7xl">


        {/* =================================================
            HEADER
        ================================================= */}

        <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">

          <div>

            <div className="flex items-center gap-3">

              <h1 className="text-3xl font-bold text-slate-900">
                Projects
              </h1>

              <span className="rounded-full bg-slate-200 px-3 py-1 text-xs font-semibold text-slate-600">
                {projects.length}
              </span>

            </div>

            <p className="mt-1 text-slate-500">
              Manage and track your NOVA projects.
            </p>

          </div>


          {/* =================================================
              HEADER ACTIONS
          ================================================= */}

          <div className="flex flex-wrap gap-3">

            <Link
              to="/dashboard"
              className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50"
            >
              <span>←</span>
              Dashboard
            </Link>


            {/* =================================================
                CREATE PROJECT
            ================================================= */}

            {canCreateProject && (

              <Link
                to="/projects/create"
                className="inline-flex items-center rounded-lg bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800"
              >
                + New Project
              </Link>

            )}

          </div>

        </div>


        {/* =================================================
            RBAC INFORMATION
        ================================================= */}

        {!canCreateProject && (

          <div className="mb-6 rounded-xl border border-blue-100 bg-blue-50 p-4">

            <div className="flex items-start gap-3">

              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blue-100">

                <span className="font-bold text-blue-600">
                  i
                </span>

              </div>

              <div>

                <p className="font-semibold text-blue-800">
                  Read-only project access
                </p>

                <p className="mt-1 text-sm text-blue-600">

                  Your role (
                  {currentUserRole || "UNKNOWN"}
                  ) can view projects but cannot create or delete them.

                </p>

              </div>

            </div>

          </div>

        )}


        {/* =================================================
            ERROR
        ================================================= */}

        {error && (

          <div className="mb-6 rounded-xl border border-red-100 bg-red-50 p-4">

            <div className="flex items-start gap-3">

              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-red-100">

                <span className="font-bold text-red-600">
                  !
                </span>

              </div>

              <div>

                <p className="font-semibold text-red-800">
                  Unable to load projects
                </p>

                <p className="mt-1 text-sm text-red-600">
                  {error}
                </p>

                <button
                  type="button"
                  onClick={loadProjects}
                  className="mt-3 text-sm font-semibold text-red-700 hover:text-red-900"
                >
                  Try Again
                </button>

              </div>

            </div>

          </div>

        )}


        {/* =================================================
            PROJECT SUMMARY
        ================================================= */}

        {projects.length > 0 && (

          <div className="mb-8 grid grid-cols-1 gap-5 sm:grid-cols-3">


            {/* TOTAL */}

            <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-100">

              <p className="text-sm font-medium text-slate-500">
                Total Projects
              </p>

              <p className="mt-2 text-3xl font-bold text-slate-900">
                {projects.length}
              </p>

              <p className="mt-1 text-xs text-slate-400">
                Projects you can access
              </p>

            </div>


            {/* ACTIVE */}

            <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-100">

              <p className="text-sm font-medium text-slate-500">
                Active / In Progress
              </p>

              <p className="mt-2 text-3xl font-bold text-blue-600">
                {activeProjects + inProgressProjects}
              </p>

              <p className="mt-1 text-xs text-slate-400">
                Currently active projects
              </p>

            </div>


            {/* COMPLETED */}

            <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-100">

              <p className="text-sm font-medium text-slate-500">
                Completed Projects
              </p>

              <p className="mt-2 text-3xl font-bold text-green-600">
                {completedProjects}
              </p>

              <p className="mt-1 text-xs text-slate-400">
                Successfully completed
              </p>

            </div>

          </div>

        )}


        {/* =================================================
            FILTER SECTION
        ================================================= */}

        {projects.length > 0 && (

          <div className="mb-8 rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-100">

            <div className="flex flex-col gap-4 lg:flex-row lg:items-end">


              {/* SEARCH */}

              <div className="flex-1">

                <label
                  htmlFor="project-search"
                  className="mb-2 block text-sm font-semibold text-slate-700"
                >
                  Search Projects
                </label>

                <div className="relative">

                  <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                    🔍
                  </span>

                  <input
                    id="project-search"
                    type="text"
                    value={search}
                    onChange={(event) =>
                      setSearch(
                        event.target.value
                      )
                    }
                    placeholder="Search by project name or description..."
                    className="w-full rounded-lg border border-slate-200 bg-white py-2.5 pl-10 pr-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-slate-400 focus:ring-2 focus:ring-slate-100"
                  />

                </div>

              </div>


              {/* STATUS */}

              <div className="w-full lg:w-52">

                <label
                  htmlFor="status-filter"
                  className="mb-2 block text-sm font-semibold text-slate-700"
                >
                  Status
                </label>

                <select
                  id="status-filter"
                  value={statusFilter}
                  onChange={(event) =>
                    setStatusFilter(
                      event.target.value
                    )
                  }
                  className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-700 outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-100"
                >

                  <option value="ALL">
                    All Status
                  </option>

                  <option value="PLANNING">
                    Planning
                  </option>

                  <option value="ACTIVE">
                    Active
                  </option>

                  <option value="IN_PROGRESS">
                    In Progress
                  </option>

                  <option value="ON_HOLD">
                    On Hold
                  </option>

                  <option value="COMPLETED">
                    Completed
                  </option>

                  <option value="ARCHIVED">
                    Archived
                  </option>

                </select>

              </div>


              {/* PRIORITY */}

              <div className="w-full lg:w-52">

                <label
                  htmlFor="priority-filter"
                  className="mb-2 block text-sm font-semibold text-slate-700"
                >
                  Priority
                </label>

                <select
                  id="priority-filter"
                  value={priorityFilter}
                  onChange={(event) =>
                    setPriorityFilter(
                      event.target.value
                    )
                  }
                  className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-700 outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-100"
                >

                  <option value="ALL">
                    All Priorities
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


              {/* CLEAR */}

              {hasActiveFilters && (

                <button
                  type="button"
                  onClick={clearFilters}
                  className="rounded-lg border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                >
                  Clear Filters
                </button>

              )}

            </div>


            {/* FILTER RESULT */}

            <div className="mt-4 flex flex-wrap items-center justify-between gap-2 border-t border-slate-100 pt-4">

              <p className="text-sm text-slate-500">

                Showing{" "}

                <span className="font-semibold text-slate-800">
                  {filteredProjects.length}
                </span>

                {" "}of{" "}

                <span className="font-semibold text-slate-800">
                  {projects.length}
                </span>

                {" "}projects

              </p>


              {hasActiveFilters && (

                <p className="text-xs font-medium text-blue-600">
                  Filters applied
                </p>

              )}

            </div>

          </div>

        )}


        {/* =================================================
            EMPTY / PROJECT GRID
        ================================================= */}

        {projects.length === 0 ? (

          <div className="rounded-2xl bg-white p-12 text-center shadow-sm ring-1 ring-slate-100">

            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-slate-100 text-3xl">
              📁
            </div>

            <h2 className="mt-5 text-xl font-semibold text-slate-900">
              No projects yet
            </h2>

            <p className="mx-auto mt-2 max-w-md text-sm text-slate-500">

              {canCreateProject
                ? "You don't have any projects yet. Create your first project to start managing tasks and team members."
                : "There are currently no projects available for your account."
              }

            </p>


            {canCreateProject && (

              <Link
                to="/projects/create"
                className="mt-6 inline-flex rounded-lg bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800"
              >
                + Create Project
              </Link>

            )}

          </div>

        ) : filteredProjects.length === 0 ? (

          <div className="rounded-2xl bg-white p-12 text-center shadow-sm ring-1 ring-slate-100">

            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-slate-100 text-3xl">
              🔍
            </div>

            <h2 className="mt-5 text-xl font-semibold text-slate-900">
              No matching projects
            </h2>

            <p className="mx-auto mt-2 max-w-md text-sm text-slate-500">
              No projects match your current search and filter settings.
            </p>

            <button
              type="button"
              onClick={clearFilters}
              className="mt-6 rounded-lg bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800"
            >
              Clear Filters
            </button>

          </div>

        ) : (

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">

            {filteredProjects.map(
              (project) => {

                const projectId =
                  project?._id;


                const members =
                  Array.isArray(
                    project?.members
                  )
                    ? project.members
                    : [];


                const teamSize =
                  members.length + 1;


                return (

                  <div
                    key={projectId}
                    className="flex flex-col overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-slate-100 transition duration-200 hover:-translate-y-1 hover:shadow-md"
                  >


                    {/* =================================================
                        CARD HEADER
                    ================================================= */}

                    <div className="border-b border-slate-100 p-6">

                      <div className="flex items-start justify-between gap-3">

                        <h2 className="min-w-0 flex-1 truncate text-xl font-bold text-slate-900">

                          {project?.name ||
                            project?.title ||
                            "Untitled Project"}

                        </h2>

                        <StatusBadge
                          status={
                            project?.status
                          }
                        />

                      </div>


                      <p className="mt-3 line-clamp-3 text-sm leading-6 text-slate-500">

                        {project?.description ||
                          "No project description available."}

                      </p>

                    </div>


                    {/* =================================================
                        PROJECT DETAILS
                    ================================================= */}

                    <div className="flex-1 p-6">

                      <div className="grid grid-cols-2 gap-4">


                        {/* PRIORITY */}

                        <div>

                          <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                            Priority
                          </p>

                          <div className="mt-2">

                            <PriorityBadge
                              priority={
                                project?.priority
                              }
                            />

                          </div>

                        </div>


                        {/* TEAM */}

                        <div>

                          <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                            Team
                          </p>

                          <p className="mt-2 text-sm font-semibold text-slate-800">

                            {teamSize}{" "}

                            {teamSize === 1
                              ? "Member"
                              : "Members"}

                          </p>

                        </div>

                      </div>


                      {/* OWNER */}

                      <div className="mt-5">

                        <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                          Project Owner
                        </p>

                        <div className="mt-2 flex items-center gap-2">

                          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-purple-100 text-xs font-bold text-purple-700">

                            {getUserName(
                              project?.owner
                            )
                              .charAt(0)
                              .toUpperCase()}

                          </div>

                          <div className="min-w-0">

                            <p className="truncate text-sm font-semibold text-slate-800">

                              {getUserName(
                                project?.owner
                              )}

                            </p>

                          </div>

                        </div>

                      </div>


                      {/* DATES */}

                      <div className="mt-5 grid grid-cols-2 gap-4">

                        <DateInfo
                          label="Start Date"
                          date={
                            project?.startDate
                          }
                        />

                        <DateInfo
                          label="Due Date"
                          date={
                            project?.dueDate
                          }
                        />

                      </div>

                    </div>


                    {/* =================================================
                        ACTIONS
                    ================================================= */}

                    <div className="border-t border-slate-100 bg-slate-50 p-5">

                      <div className="flex gap-3">

                        <Link
                          to={`/projects/${projectId}`}
                          className="flex-1 rounded-lg bg-slate-900 px-4 py-2.5 text-center text-sm font-semibold text-white transition hover:bg-slate-800"
                        >
                          View Project
                        </Link>


                        {/* DELETE */}

                        {canDeleteProject && (

                          <button
                            type="button"
                            disabled={
                              deletingId ===
                              projectId
                            }
                            onClick={() =>
                              handleDelete(
                                projectId
                              )
                            }
                            className="rounded-lg bg-red-50 px-4 py-2.5 text-sm font-semibold text-red-700 transition hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-50"
                          >

                            {deletingId ===
                            projectId
                              ? "Deleting..."
                              : "Delete"}

                          </button>

                        )}

                      </div>

                    </div>

                  </div>

                );

              }
            )}

          </div>

        )}

      </div>

    </div>

  );

};


// =====================================================
// STATUS BADGE
// =====================================================

const StatusBadge = ({
  status,
}) => {

  const statusMap = {

    PLANNING: {
      label: "Planning",
      className:
        "bg-slate-100 text-slate-700",
    },

    ACTIVE: {
      label: "Active",
      className:
        "bg-green-100 text-green-700",
    },

    IN_PROGRESS: {
      label: "In Progress",
      className:
        "bg-blue-100 text-blue-700",
    },

    ON_HOLD: {
      label: "On Hold",
      className:
        "bg-yellow-100 text-yellow-700",
    },

    COMPLETED: {
      label: "Completed",
      className:
        "bg-green-100 text-green-700",
    },

    ARCHIVED: {
      label: "Archived",
      className:
        "bg-slate-100 text-slate-600",
    },

  };


  const normalizedStatus =
    String(
      status || ""
    ).toUpperCase();


  const current =
    statusMap[
      normalizedStatus
    ] || {

      label:
        status || "Unknown",

      className:
        "bg-slate-100 text-slate-600",

    };


  return (

    <span
      className={`shrink-0 rounded-full px-3 py-1 text-xs font-semibold ${current.className}`}
    >
      {current.label}
    </span>

  );

};


// =====================================================
// PRIORITY BADGE
// =====================================================

const PriorityBadge = ({
  priority,
}) => {

  const priorityMap = {

    LOW: {
      label: "Low",
      className:
        "bg-green-50 text-green-700",
    },

    MEDIUM: {
      label: "Medium",
      className:
        "bg-blue-50 text-blue-700",
    },

    HIGH: {
      label: "High",
      className:
        "bg-orange-50 text-orange-700",
    },

    URGENT: {
      label: "Urgent",
      className:
        "bg-red-50 text-red-700",
    },

  };


  const normalizedPriority =
    String(
      priority || ""
    ).toUpperCase();


  const current =
    priorityMap[
      normalizedPriority
    ] || {

      label:
        priority || "Not specified",

      className:
        "bg-slate-100 text-slate-600",

    };


  return (

    <span
      className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${current.className}`}
    >
      {current.label}
    </span>

  );

};


// =====================================================
// DATE INFO
// =====================================================

const DateInfo = ({
  label,
  date,
}) => {

  let formattedDate =
    "Not set";


  if (date) {

    const parsedDate =
      new Date(date);


    if (
      !Number.isNaN(
        parsedDate.getTime()
      )
    ) {

      formattedDate =
        parsedDate.toLocaleDateString(
          "en-IN",
          {
            day: "2-digit",
            month: "short",
            year: "numeric",
          }
        );

    }

  }


  return (

    <div>

      <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
        {label}
      </p>

      <p className="mt-1 text-sm font-semibold text-slate-700">
        {formattedDate}
      </p>

    </div>

  );

};


export default Projects;