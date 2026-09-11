/* eslint-disable react-hooks/set-state-in-effect */
import {
  useEffect,
  useMemo,
  useState,
} from "react";

import { useNavigate } from "react-router-dom";

import {
  getProjects,
  deleteProject,
  projectPermissions,
} from "../services/projectService";

// =====================================================
// TEAM PAGE
// =====================================================

const Team = () => {
  const navigate = useNavigate();

  // =====================================================
  // STATE
  // =====================================================

  const [projects, setProjects] = useState([]);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  const [search, setSearch] = useState("");

  const [statusFilter, setStatusFilter] = useState("ALL");

  const [deletingProjectId, setDeletingProjectId] =
    useState(null);

  // =====================================================
  // CURRENT USER ROLE
  // =====================================================

  const currentUserRole = useMemo(() => {
    try {
      const storedUser =
        localStorage.getItem("user");

      if (!storedUser) {
        return "MEMBER";
      }

      const user =
        JSON.parse(storedUser);

      return String(
        user?.role || "MEMBER"
      )
        .trim()
        .toUpperCase();
    } catch (err) {
      console.error(
        "Unable to read current user role:",
        err
      );

      return "MEMBER";
    }
  }, []);

  // =====================================================
  // RBAC PERMISSIONS
  // =====================================================

  const canView =
    projectPermissions.canView();

  const canCreate =
    projectPermissions.canCreate();

  const canUpdate =
    projectPermissions.canUpdate();

  const canDelete =
    projectPermissions.canDelete();

  const canManageMembers =
    projectPermissions.canManageMembers();

  // =====================================================
  // LOAD PROJECTS
  // =====================================================

  useEffect(() => {
    const loadProjects = async () => {
      try {
        setLoading(true);
        setError("");

        const response =
          await getProjects();

        // Backend:
        //
        // {
        //   success: true,
        //   count: 2,
        //   projects: []
        // }

        const projectList =
          Array.isArray(response?.projects)
            ? response.projects
            : Array.isArray(
                response?.data?.projects
              )
            ? response.data.projects
            : Array.isArray(response?.data)
            ? response.data
            : Array.isArray(response)
            ? response
            : [];

        setProjects(projectList);
      } catch (err) {
        console.error(
          "Team Projects Error:",
          err
        );

        setError(
          err?.response?.data?.message ||
            err?.message ||
            "Unable to load team information"
        );
      } finally {
        setLoading(false);
      }
    };

    if (canView) {
      loadProjects();
    } else {
      setLoading(false);
      setError(
        "You do not have permission to view team information."
      );
    }
  }, [canView]);

  // =====================================================
  // FILTER PROJECTS
  // =====================================================

  const filteredProjects = useMemo(() => {
    const searchText =
      search
        .trim()
        .toLowerCase();

    return projects.filter(
      (project) => {
        // ---------------------------------------------
        // STATUS
        // ---------------------------------------------

        const matchesStatus =
          statusFilter === "ALL" ||
          String(
            project?.status || ""
          ).toUpperCase() ===
            statusFilter;

        if (!matchesStatus) {
          return false;
        }

        // ---------------------------------------------
        // SEARCH
        // ---------------------------------------------

        if (!searchText) {
          return true;
        }

        const projectName =
          String(
            project?.name || ""
          ).toLowerCase();

        const description =
          String(
            project?.description || ""
          ).toLowerCase();

        const ownerName =
          getUserName(
            project?.owner
          ).toLowerCase();

        const ownerEmail =
          getUserEmail(
            project?.owner
          ).toLowerCase();

        const members =
          Array.isArray(
            project?.members
          )
            ? project.members
            : [];

        const memberMatch =
          members.some(
            (member) => {
              const memberName =
                getUserName(
                  member
                ).toLowerCase();

              const memberEmail =
                getUserEmail(
                  member
                ).toLowerCase();

              return (
                memberName.includes(
                  searchText
                ) ||
                memberEmail.includes(
                  searchText
                )
              );
            }
          );

        return (
          projectName.includes(
            searchText
          ) ||
          description.includes(
            searchText
          ) ||
          ownerName.includes(
            searchText
          ) ||
          ownerEmail.includes(
            searchText
          ) ||
          memberMatch
        );
      }
    );
  }, [
    projects,
    search,
    statusFilter,
  ]);

  // =====================================================
  // SUMMARY
  // =====================================================

  const totalProjects =
    projects.length;

  const totalMemberAssignments =
    projects.reduce(
      (total, project) => {
        const members =
          Array.isArray(
            project?.members
          )
            ? project.members
            : [];

        return (
          total +
          members.length
        );
      },
      0
    );

  // Owner + members
  const totalTeamAssignments =
    projects.reduce(
      (total, project) => {
        const members =
          Array.isArray(
            project?.members
          )
            ? project.members
            : [];

        return (
          total +
          members.length +
          1
        );
      },
      0
    );

  // =====================================================
  // UNIQUE TEAM MEMBERS
  // =====================================================

  const uniqueTeamMembers =
    useMemo(() => {
      const memberMap =
        new Map();

      projects.forEach(
        (project) => {
          // ---------------------------------------------
          // OWNER
          // ---------------------------------------------

          const owner =
            project?.owner;

          if (
            owner &&
            typeof owner === "object" &&
            owner?._id
          ) {
            memberMap.set(
              String(owner._id),
              owner
            );
          }

          // ---------------------------------------------
          // MEMBERS
          // ---------------------------------------------

          const members =
            Array.isArray(
              project?.members
            )
              ? project.members
              : [];

          members.forEach(
            (member) => {
              if (
                member &&
                typeof member === "object" &&
                member?._id
              ) {
                memberMap.set(
                  String(member._id),
                  member
                );
              }
            }
          );
        }
      );

      return Array.from(
        memberMap.values()
      );
    }, [projects]);

  const totalUniqueMembers =
    uniqueTeamMembers.length;

  // =====================================================
  // CLEAR FILTERS
  // =====================================================

  const clearFilters = () => {
    setSearch("");
    setStatusFilter("ALL");
  };

  // =====================================================
  // DELETE PROJECT
  // =====================================================

  const handleDeleteProject =
    async (project) => {
      if (!project?._id) {
        return;
      }

      if (!canDelete) {
        alert(
          "You do not have permission to delete projects."
        );

        return;
      }

      const confirmed =
        window.confirm(
          `Are you sure you want to delete "${project?.name || "this project"}"?`
        );

      if (!confirmed) {
        return;
      }

      try {
        setDeletingProjectId(
          project._id
        );

        await deleteProject(
          project._id
        );

        setProjects(
          (previousProjects) =>
            previousProjects.filter(
              (item) =>
                item?._id !==
                project._id
            )
        );
      } catch (err) {
        console.error(
          "Delete Project Error:",
          err
        );

        alert(
          err?.response?.data?.message ||
            err?.message ||
            "Unable to delete project."
        );
      } finally {
        setDeletingProjectId(
          null
        );
      }
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
            Loading team information...
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
      <div className="flex min-h-screen items-center justify-center bg-slate-50 p-6">
        <div className="w-full max-w-md rounded-2xl bg-white p-8 text-center shadow-sm">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-50">
            <span className="text-xl font-bold text-red-600">
              !
            </span>
          </div>

          <h2 className="mt-4 text-lg font-semibold text-slate-900">
            Unable to load team
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
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="text-3xl font-bold text-slate-900">
                Team
              </h1>

              <RoleBadge
                role={
                  currentUserRole
                }
              />
            </div>

            <p className="mt-1 text-slate-500">
              See who is working on each project.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">

            {/* CREATE PROJECT */}

            {canCreate && (
              <button
                type="button"
                onClick={() =>
                  navigate(
                    "/projects/create"
                  )
                }
                className="rounded-lg border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
              >
                + Create Project
              </button>
            )}

            {/* VIEW PROJECTS */}

            <button
              type="button"
              onClick={() =>
                navigate("/projects")
              }
              className="rounded-lg bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800"
            >
              View Projects
            </button>

          </div>
        </div>

        {/* =================================================
            RBAC INFORMATION
        ================================================= */}

        <div className="mb-8 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">

            <div>
              <p className="text-sm font-semibold text-slate-900">
                Your Team Permissions
              </p>

              <p className="mt-1 text-xs text-slate-500">
                Permissions are controlled by your current account role.
              </p>
            </div>

            <div className="flex flex-wrap gap-2">

              <PermissionBadge
                label="View"
                allowed={canView}
              />

              <PermissionBadge
                label="Create"
                allowed={canCreate}
              />

              <PermissionBadge
                label="Update"
                allowed={canUpdate}
              />

              <PermissionBadge
                label="Manage Members"
                allowed={canManageMembers}
              />

              <PermissionBadge
                label="Delete"
                allowed={canDelete}
              />

            </div>
          </div>
        </div>

        {/* =================================================
            SUMMARY CARDS
        ================================================= */}

        <div className="mb-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">

          {/* PROJECTS */}

          <div className="rounded-2xl bg-white p-6 shadow-sm">
            <p className="text-sm font-medium text-slate-500">
              Total Projects
            </p>

            <p className="mt-2 text-3xl font-bold text-slate-900">
              {totalProjects}
            </p>

            <p className="mt-1 text-xs text-slate-400">
              Projects you can access
            </p>
          </div>

          {/* UNIQUE MEMBERS */}

          <div className="rounded-2xl bg-white p-6 shadow-sm">
            <p className="text-sm font-medium text-slate-500">
              Team Members
            </p>

            <p className="mt-2 text-3xl font-bold text-blue-600">
              {totalUniqueMembers}
            </p>

            <p className="mt-1 text-xs text-slate-400">
              Unique users across projects
            </p>
          </div>

          {/* MEMBER ASSIGNMENTS */}

          <div className="rounded-2xl bg-white p-6 shadow-sm">
            <p className="text-sm font-medium text-slate-500">
              Member Assignments
            </p>

            <p className="mt-2 text-3xl font-bold text-purple-600">
              {totalMemberAssignments}
            </p>

            <p className="mt-1 text-xs text-slate-400">
              Member entries across projects
            </p>
          </div>

          {/* TOTAL ASSIGNMENTS */}

          <div className="rounded-2xl bg-white p-6 shadow-sm">
            <p className="text-sm font-medium text-slate-500">
              Total Assignments
            </p>

            <p className="mt-2 text-3xl font-bold text-green-600">
              {totalTeamAssignments}
            </p>

            <p className="mt-1 text-xs text-slate-400">
              Owners + members
            </p>
          </div>

        </div>

        {/* =================================================
            FILTERS
        ================================================= */}

        <div className="mb-6 rounded-2xl bg-white p-5 shadow-sm">

          <div className="grid gap-4 md:grid-cols-2">

            {/* SEARCH */}

            <input
              type="text"
              value={search}
              onChange={(e) =>
                setSearch(
                  e.target.value
                )
              }
              placeholder="Search project, owner, member or email..."
              className="rounded-lg border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
            />

            {/* STATUS */}

            <select
              value={statusFilter}
              onChange={(e) =>
                setStatusFilter(
                  e.target.value
                )
              }
              className="rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
            >
              <option value="ALL">
                All Project Status
              </option>

              <option value="PLANNING">
                Planning
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
            </select>
          </div>

          {/* CLEAR */}

          {(search ||
            statusFilter !==
              "ALL") && (
            <div className="mt-4 flex justify-end">
              <button
                type="button"
                onClick={
                  clearFilters
                }
                className="text-sm font-medium text-slate-600 hover:text-slate-900"
              >
                Clear Filters
              </button>
            </div>
          )}
        </div>

        {/* =================================================
            RESULT COUNT
        ================================================= */}

        <div className="mb-4">
          <p className="text-sm text-slate-500">
            Showing{" "}
            <span className="font-semibold text-slate-900">
              {filteredProjects.length}
            </span>{" "}
            of{" "}
            <span className="font-semibold text-slate-900">
              {projects.length}
            </span>{" "}
            projects
          </p>
        </div>

        {/* =================================================
            EMPTY
        ================================================= */}

        {filteredProjects.length ===
        0 ? (
          <div className="rounded-2xl bg-white p-12 text-center shadow-sm">

            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-slate-100 text-2xl">
              👥
            </div>

            <h2 className="mt-4 text-lg font-semibold text-slate-900">
              No projects found
            </h2>

            <p className="mt-2 text-sm text-slate-500">
              No projects match your current search or filter.
            </p>

            {(search ||
              statusFilter !==
                "ALL") && (
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
             PROJECT LIST
          ================================================= */

          <div className="grid gap-6 lg:grid-cols-2">

            {filteredProjects.map(
              (project) => {

                const members =
                  Array.isArray(
                    project?.members
                  )
                    ? project.members
                    : [];

                const owner =
                  project?.owner;

                // Owner + members
                const teamSize =
                  members.length + 1;

                const isDeleting =
                  deletingProjectId ===
                  project?._id;

                return (
                  <div
                    key={
                      project?._id
                    }
                    className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-slate-100"
                  >

                    {/* =================================================
                        PROJECT HEADER
                    ================================================= */}

                    <div className="border-b border-slate-100 p-6">

                      <div className="flex items-start justify-between gap-4">

                        <div className="min-w-0">

                          <button
                            type="button"
                            onClick={() =>
                              project?._id &&
                              navigate(
                                `/projects/${project._id}`
                              )
                            }
                            className="truncate text-left text-xl font-bold text-slate-900 hover:text-blue-600"
                          >
                            {project?.name ||
                              "Unnamed Project"}
                          </button>

                          <p className="mt-1 line-clamp-2 text-sm text-slate-500">
                            {project?.description ||
                              "No project description"}
                          </p>

                        </div>

                        {/* TEAM SIZE */}

                        <div className="shrink-0 rounded-xl bg-blue-50 px-4 py-2 text-center">

                          <p className="text-2xl font-bold text-blue-600">
                            {teamSize}
                          </p>

                          <p className="text-[11px] font-medium text-blue-600">
                            Team
                          </p>

                        </div>

                      </div>

                      {/* STATUS / PRIORITY */}

                      <div className="mt-4 flex flex-wrap gap-2">

                        <StatusBadge
                          status={
                            project?.status
                          }
                        />

                        <PriorityBadge
                          priority={
                            project?.priority
                          }
                        />

                      </div>

                    </div>

                    {/* =================================================
                        OWNER
                    ================================================= */}

                    <div className="border-b border-slate-100 p-6">

                      <div className="mb-3 flex items-center justify-between">

                        <h3 className="text-sm font-semibold text-slate-900">
                          Project Owner
                        </h3>

                        <span className="rounded-full bg-purple-50 px-3 py-1 text-xs font-semibold text-purple-700">
                          Owner
                        </span>

                      </div>

                      <UserRow
                        user={owner}
                        owner
                      />

                    </div>

                    {/* =================================================
                        MEMBERS
                    ================================================= */}

                    <div className="p-6">

                      <div className="mb-4 flex items-center justify-between">

                        <h3 className="text-sm font-semibold text-slate-900">
                          Team Members
                        </h3>

                        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
                          {members.length}{" "}
                          {members.length ===
                          1
                            ? "Member"
                            : "Members"}
                        </span>

                      </div>

                      {members.length ===
                      0 ? (
                        <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50 p-5 text-center">

                          <p className="text-sm font-medium text-slate-600">
                            No members added
                          </p>

                          <p className="mt-1 text-xs text-slate-400">
                            Only the project owner is currently assigned.
                          </p>

                        </div>
                      ) : (
                        <div className="space-y-3">

                          {members.map(
                            (member) => (
                              <UserRow
                                key={
                                  member?._id ||
                                  String(
                                    member
                                  )
                                }
                                user={
                                  member
                                }
                              />
                            )
                          )}

                        </div>
                      )}

                    </div>

                    {/* =================================================
                        PROJECT INFO
                    ================================================= */}

                    <div className="border-t border-slate-100 bg-slate-50 px-6 py-4">

                      <div className="grid grid-cols-2 gap-4">

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
                        RBAC ACTIONS
                    ================================================= */}

                    {(canUpdate ||
                      canManageMembers ||
                      canDelete) && (
                      <div className="border-t border-slate-200 bg-white px-6 py-4">

                        <div className="flex flex-wrap items-center justify-end gap-2">

                          {/* MANAGE MEMBERS */}

                          {canManageMembers && (
                            <button
                              type="button"
                              onClick={() =>
                                navigate(
                                  `/projects/${project._id}/team`
                                )
                              }
                              className="rounded-lg border border-blue-200 bg-blue-50 px-4 py-2 text-xs font-semibold text-blue-700 transition hover:bg-blue-100"
                            >
                              Manage Team
                            </button>
                          )}

                          {/* UPDATE */}

                          {canUpdate && (
                            <button
                              type="button"
                              onClick={() =>
                                navigate(
                                  `/projects/${project._id}/edit`
                                )
                              }
                              className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-700 transition hover:bg-slate-50"
                            >
                              Edit Project
                            </button>
                          )}

                          {/* DELETE */}

                          {canDelete && (
                            <button
                              type="button"
                              disabled={
                                isDeleting
                              }
                              onClick={() =>
                                handleDeleteProject(
                                  project
                                )
                              }
                              className="rounded-lg bg-red-600 px-4 py-2 text-xs font-semibold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
                            >
                              {isDeleting
                                ? "Deleting..."
                                : "Delete"}
                            </button>
                          )}

                        </div>

                      </div>
                    )}

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
// USER NAME
// =====================================================

const getUserName = (user) => {
  if (!user) {
    return "Unknown User";
  }

  if (
    typeof user ===
    "object"
  ) {
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
// USER EMAIL
// =====================================================

const getUserEmail = (user) => {
  if (
    !user ||
    typeof user !==
      "object"
  ) {
    return "";
  }

  return (
    user?.email ||
    ""
  );
};

// =====================================================
// USER ROW
// =====================================================

const UserRow = ({
  user,
  owner = false,
}) => {
  const name =
    getUserName(user);

  const email =
    getUserEmail(user);

  const initial =
    name
      .charAt(0)
      .toUpperCase();

  return (
    <div className="flex items-center gap-3 rounded-xl border border-slate-100 p-3">

      {/* AVATAR */}

      <div
        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full font-semibold ${
          owner
            ? "bg-purple-100 text-purple-700"
            : "bg-blue-100 text-blue-700"
        }`}
      >
        {initial}
      </div>

      {/* DETAILS */}

      <div className="min-w-0 flex-1">

        <p className="truncate text-sm font-semibold text-slate-900">
          {name}
        </p>

        {email && (
          <p className="truncate text-xs text-slate-500">
            {email}
          </p>
        )}

      </div>

      {owner && (
        <span className="text-xs font-medium text-purple-600">
          Owner
        </span>
      )}

    </div>
  );
};

// =====================================================
// ROLE BADGE
// =====================================================

const RoleBadge = ({
  role,
}) => {
  const roleMap = {
    OWNER: {
      label: "Owner",
      className:
        "bg-purple-100 text-purple-700",
    },

    ADMIN: {
      label: "Admin",
      className:
        "bg-red-100 text-red-700",
    },

    MANAGER: {
      label: "Manager",
      className:
        "bg-blue-100 text-blue-700",
    },

    MEMBER: {
      label: "Member",
      className:
        "bg-green-100 text-green-700",
    },

    VIEWER: {
      label: "Viewer",
      className:
        "bg-slate-100 text-slate-700",
    },
  };

  const current =
    roleMap[
      String(
        role || "MEMBER"
      ).toUpperCase()
    ] || {
      label: role || "Member",
      className:
        "bg-slate-100 text-slate-700",
    };

  return (
    <span
      className={`rounded-full px-3 py-1 text-xs font-semibold ${current.className}`}
    >
      {current.label}
    </span>
  );
};

// =====================================================
// PERMISSION BADGE
// =====================================================

const PermissionBadge = ({
  label,
  allowed,
}) => {
  return (
    <span
      className={`rounded-full px-3 py-1 text-xs font-semibold ${
        allowed
          ? "bg-green-50 text-green-700"
          : "bg-slate-100 text-slate-400"
      }`}
    >
      {allowed
        ? "✓"
        : "×"}{" "}
      {label}
    </span>
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
  };

  const current =
    statusMap[
      String(
        status || ""
      ).toUpperCase()
    ] || {
      label:
        status || "Unknown",
      className:
        "bg-slate-100 text-slate-600",
    };

  return (
    <span
      className={`rounded-full px-3 py-1 text-xs font-semibold ${current.className}`}
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

  const current =
    priorityMap[
      String(
        priority || ""
      ).toUpperCase()
    ] || {
      label:
        priority || "Unknown",
      className:
        "bg-slate-100 text-slate-600",
    };

  return (
    <span
      className={`rounded-full px-3 py-1 text-xs font-semibold ${current.className}`}
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
      <p className="text-xs text-slate-400">
        {label}
      </p>

      <p className="mt-1 text-sm font-medium text-slate-700">
        {formattedDate}
      </p>
    </div>
  );
};

// =====================================================
// EXPORT
// =====================================================

export default Team;

