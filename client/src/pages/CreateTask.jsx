/* eslint-disable react-hooks/set-state-in-effect */

import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  useNavigate,
} from "react-router-dom";

import {
  getProjects,
} from "../services/projectService";

import {
  createTask,
} from "../services/taskService";

import {
  useAuth,
} from "../context/AuthContext";

import {
  searchUsers,
} from "../services/userService";


// =====================================================
// CREATE TASK PAGE
// =====================================================

const CreateTask = () => {

  const navigate = useNavigate();

  const {
    user: currentUser,
  } = useAuth();


  // =====================================================
  // CURRENT USER ROLE
  // =====================================================

  const currentUserRole = useMemo(() => {

    return String(
      currentUser?.role || ""
    )
      .trim()
      .toUpperCase();

  }, [currentUser]);


  // =====================================================
  // RBAC
  // =====================================================

  const canCreateTask = [
    "OWNER",
    "ADMIN",
    "MANAGER",
  ].includes(currentUserRole);


  // =====================================================
  // PROJECT STATE
  // =====================================================

  const [
    projects,
    setProjects,
  ] = useState([]);

  const [
    projectsLoading,
    setProjectsLoading,
  ] = useState(true);

  const [
    projectsError,
    setProjectsError,
  ] = useState("");


  // =====================================================
  // FORM STATE
  // =====================================================

  const [
    formData,
    setFormData,
  ] = useState({

    projectId: "",

    title: "",

    description: "",

    status: "TODO",

    priority: "MEDIUM",

    dueDate: "",

    assignedTo: "",

  });


  const [userSearch, setUserSearch] = useState("");

const [users, setUsers] = useState([]);

const [usersLoading, setUsersLoading] = useState(false);

const [usersError, setUsersError] = useState("");

const [showUserDropdown, setShowUserDropdown] = useState(false);

const [selectedUser, setSelectedUser] = useState(null);

  // =====================================================
  // SUBMIT STATE
  // =====================================================

  const [
    submitting,
    setSubmitting,
  ] = useState(false);

  const [
    submitError,
    setSubmitError,
  ] = useState("");

  const [
    successMessage,
    setSuccessMessage,
  ] = useState("");


  // =====================================================
  // LOAD PROJECTS
  // =====================================================

  useEffect(() => {

    const loadProjects = async () => {

      try {

        setProjectsLoading(true);

        setProjectsError("");


        const response =
          await getProjects();


        const projectList =
          Array.isArray(
            response?.projects
          )
            ? response.projects

            : Array.isArray(
                response?.data
              )
            ? response.data

            : Array.isArray(
                response
              )
            ? response

            : [];


        setProjects(
          projectList
        );


      } catch (error) {

        console.error(
          "Create Task - Projects Error:",
          error
        );


        setProjectsError(
          error?.response?.data?.message ||
          error?.message ||
          "Unable to load projects."
        );


      } finally {

        setProjectsLoading(false);

      }

    };


    if (canCreateTask) {

      loadProjects();

    } else {

      setProjectsLoading(false);

    }

  }, [canCreateTask]);

  useEffect(() => {
  const loadUsers = async () => {
    const query = userSearch.trim();

    if (!query) {
      setUsers([]);
      return;
    }

    try {
      setUsersLoading(true);
      setUsersError("");

      const response = await searchUsers(query);

      const userList =
        Array.isArray(response?.users)
          ? response.users
          : Array.isArray(response?.data)
          ? response.data
          : Array.isArray(response)
          ? response
          : [];

      setUsers(userList);
    } catch (error) {
      console.error(
        "Create Task - User Search Error:",
        error
      );

      setUsersError(
        error?.response?.data?.message ||
        error?.message ||
        "Unable to search users."
      );

      setUsers([]);
    } finally {
      setUsersLoading(false);
    }
  };

  const timer = setTimeout(() => {
    loadUsers();
  }, 300);

  return () => clearTimeout(timer);
}, [userSearch]);

  // =====================================================
  // HANDLE INPUT
  // =====================================================

  const handleChange = (event) => {

    const {
      name,
      value,
    } = event.target;


    setFormData(
      (previous) => ({
        ...previous,
        [name]: value,
      })
    );


    // Clear errors when user starts editing
    if (submitError) {

      setSubmitError("");

    }

    if (successMessage) {

      setSuccessMessage("");

    }

  };


  // =====================================================
  // HANDLE SUBMIT
  // =====================================================

  const handleSubmit = async (event) => {

    event.preventDefault();


    // ---------------------------------------------------
    // RBAC
    // ---------------------------------------------------

    if (!canCreateTask) {

      setSubmitError(
        "You do not have permission to create tasks."
      );

      return;

    }


    // ---------------------------------------------------
    // PROJECT VALIDATION
    // ---------------------------------------------------

    if (!formData.projectId) {

      setSubmitError(
        "Please select a project."
      );

      return;

    }


    // ---------------------------------------------------
    // TITLE VALIDATION
    // ---------------------------------------------------

    if (!formData.title.trim()) {

      setSubmitError(
        "Task title is required."
      );

      return;

    }


    // ---------------------------------------------------
    // SUBMIT
    // ---------------------------------------------------

    try {

      setSubmitting(true);

      setSubmitError("");

      setSuccessMessage("");


      // -------------------------------------------------
      // TASK DATA
      // -------------------------------------------------

      const taskData = {

        title:
          formData.title.trim(),

        description:
          formData.description.trim(),

        status:
          formData.status,

        priority:
          formData.priority,

      };


      // -------------------------------------------------
      // OPTIONAL DUE DATE
      // -------------------------------------------------

      if (formData.dueDate) {

        taskData.dueDate =
          formData.dueDate;

      }


      // -------------------------------------------------
      // OPTIONAL ASSIGNED USER
      // -------------------------------------------------

      /*
        IMPORTANT:

        assignedTo tabhi bhej rahe hain
        jab user ne value enter ki hai.

        Agar aapke backend mein assignedTo
        MongoDB ObjectId expect karta hai,
        to yahan valid user ID deni hogi.
      */

      if (formData.assignedTo.trim()) {

        taskData.assignedTo =
          formData.assignedTo.trim();

      }


      // -------------------------------------------------
      // CREATE TASK
      // -------------------------------------------------

      const response =
        await createTask(
          formData.projectId,
          taskData
        );


      console.log(
        "Task Created:",
        response
      );


      setSuccessMessage(
        "Task created successfully."
      );


      // -------------------------------------------------
      // REDIRECT
      // -------------------------------------------------

      setTimeout(() => {

        navigate("/tasks");

      }, 700);


    } catch (error) {

      console.error(
        "Create Task Error:",
        error
      );


      setSubmitError(
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        error?.message ||
        "Unable to create task."
      );


    } finally {

      setSubmitting(false);

    }

  };


  // =====================================================
  // RBAC DENIED
  // =====================================================

  if (!canCreateTask) {

    return (

      <div className="flex min-h-screen items-center justify-center bg-slate-50 p-6">

        <div className="w-full max-w-md rounded-2xl bg-white p-8 text-center shadow-sm">

          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-red-100 text-2xl">

            🔒

          </div>


          <h2 className="mt-4 text-xl font-semibold text-slate-900">

            Access Denied

          </h2>


          <p className="mt-2 text-sm text-slate-500">

            Your role does not have permission
            to create tasks.

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
              navigate("/tasks")
            }
            className="mt-6 rounded-lg bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800"
          >

            Back to Tasks

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

      <div className="mx-auto max-w-4xl">


        {/* =================================================
            HEADER
        ================================================= */}

        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

          <div>

            <div className="flex items-center gap-3">

              <h1 className="text-3xl font-bold text-slate-900">

                Create Task

              </h1>


              <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700">

                {currentUserRole}

              </span>

            </div>


            <p className="mt-1 text-slate-500">

              Select a project and create a new task.

            </p>

          </div>


          <button
            type="button"
            onClick={() =>
              navigate("/tasks")
            }
            className="rounded-lg border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
          >

            ← Back to Tasks

          </button>

        </div>


        {/* =================================================
            MAIN CARD
        ================================================= */}

        <form
          onSubmit={handleSubmit}
          className="rounded-2xl bg-white p-6 shadow-sm sm:p-8"
        >


          {/* =================================================
              STEP 1 - PROJECT
          ================================================= */}

          <div className="mb-8">

            <div className="mb-4">

              <div className="flex items-center gap-3">

                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-900 text-sm font-bold text-white">

                  1

                </span>


                <div>

                  <h2 className="text-lg font-semibold text-slate-900">

                    Select Project

                  </h2>


                  <p className="text-sm text-slate-500">

                    Choose the project where this task belongs.

                  </p>

                </div>

              </div>

            </div>


            {projectsLoading ? (

              <div className="rounded-xl border border-slate-200 bg-slate-50 p-5">

                <div className="flex items-center gap-3">

                  <div className="h-5 w-5 animate-spin rounded-full border-2 border-slate-300 border-t-slate-900" />

                  <span className="text-sm text-slate-500">

                    Loading projects...

                  </span>

                </div>

              </div>

            ) : projectsError ? (

              <div className="rounded-xl border border-red-200 bg-red-50 p-5">

                <p className="text-sm font-medium text-red-700">

                  {projectsError}

                </p>


                <button
                  type="button"
                  onClick={() =>
                    window.location.reload()
                  }
                  className="mt-3 rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700"
                >

                  Try Again

                </button>

              </div>

            ) : projects.length === 0 ? (

              <div className="rounded-xl border border-yellow-200 bg-yellow-50 p-5">

                <p className="text-sm font-medium text-yellow-800">

                  No projects are available.

                </p>


                <p className="mt-1 text-xs text-yellow-700">

                  Create a project first before creating a task.

                </p>


                <button
                  type="button"
                  onClick={() =>
                    navigate("/projects/create")
                  }
                  className="mt-4 rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800"
                >

                  Create Project

                </button>

              </div>

            ) : (

              <div>

                <label
                  htmlFor="projectId"
                  className="mb-2 block text-sm font-medium text-slate-700"
                >

                  Project <span className="text-red-500">*</span>

                </label>


                <select
                  id="projectId"
                  name="projectId"
                  value={formData.projectId}
                  onChange={handleChange}
                  required
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-800 outline-none transition focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
                >

                  <option value="">

                    -- Select Project --

                  </option>


                  {projects.map(
                    (project) => {

                      const projectId =
                        project?._id;


                      const projectName =
                        project?.name ||
                        project?.title ||
                        "Untitled Project";


                      if (!projectId) {

                        return null;

                      }


                      return (

                        <option
                          key={projectId}
                          value={projectId}
                        >

                          {projectName}

                        </option>

                      );

                    }
                  )}

                </select>


                {formData.projectId && (

                  <div className="mt-3 rounded-lg bg-slate-50 px-4 py-3">

                    <p className="text-xs text-slate-400">

                      Selected Project

                    </p>


                    <p className="mt-1 text-sm font-semibold text-slate-800">

                      {projects.find(
                        (project) =>
                          project?._id ===
                          formData.projectId
                      )?.name ||
                        projects.find(
                          (project) =>
                            project?._id ===
                            formData.projectId
                        )?.title ||
                        "Selected Project"}

                    </p>

                  </div>

                )}

              </div>

            )}

          </div>


          {/* =================================================
              DIVIDER
          ================================================= */}

          <div className="mb-8 border-t border-slate-100" />


          {/* =================================================
              STEP 2 - TASK DETAILS
          ================================================= */}

          <div className="mb-8">

            <div className="mb-5">

              <div className="flex items-center gap-3">

                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-900 text-sm font-bold text-white">

                  2

                </span>


                <div>

                  <h2 className="text-lg font-semibold text-slate-900">

                    Task Details

                  </h2>


                  <p className="text-sm text-slate-500">

                    Enter the information for your task.

                  </p>

                </div>

              </div>

            </div>


            <div className="space-y-5">


              {/* =================================================
                  TITLE
              ================================================= */}

              <div>

                <label
                  htmlFor="title"
                  className="mb-2 block text-sm font-medium text-slate-700"
                >

                  Task Title{" "}

                  <span className="text-red-500">

                    *

                  </span>

                </label>


                <input
                  id="title"
                  name="title"
                  type="text"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="Enter task title"
                  maxLength={150}
                  required
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
                />


                <p className="mt-1 text-right text-xs text-slate-400">

                  {formData.title.length}/150

                </p>

              </div>


              {/* =================================================
                  DESCRIPTION
              ================================================= */}

              <div>

                <label
                  htmlFor="description"
                  className="mb-2 block text-sm font-medium text-slate-700"
                >

                  Description

                </label>


                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Describe what needs to be done..."
                  rows={5}
                  maxLength={2000}
                  className="w-full resize-none rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
                />


                <p className="mt-1 text-right text-xs text-slate-400">

                  {formData.description.length}/2000

                </p>

              </div>


              {/* =================================================
                  STATUS + PRIORITY
              ================================================= */}

              <div className="grid gap-5 md:grid-cols-2">


                {/* STATUS */}

                <div>

                  <label
                    htmlFor="status"
                    className="mb-2 block text-sm font-medium text-slate-700"
                  >

                    Status

                  </label>


                  <select
                    id="status"
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-800 outline-none transition focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
                  >

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
                    htmlFor="priority"
                    className="mb-2 block text-sm font-medium text-slate-700"
                  >

                    Priority

                  </label>


                  <select
                    id="priority"
                    name="priority"
                    value={formData.priority}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-800 outline-none transition focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
                  >

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
                  DUE DATE + ASSIGNED TO
              ================================================= */}

              <div className="grid gap-5 md:grid-cols-2">


                {/* DUE DATE */}

                <div>

                  <label
                    htmlFor="dueDate"
                    className="mb-2 block text-sm font-medium text-slate-700"
                  >

                    Due Date

                  </label>


                  <input
                    id="dueDate"
                    name="dueDate"
                    type="date"
                    value={formData.dueDate}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-800 outline-none transition focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
                  />

                </div>


                {/* ASSIGNED TO */}

                <div className="relative">
  <label
    htmlFor="assignedToSearch"
    className="mb-2 block text-sm font-medium text-slate-700"
  >
    Assigned To
  </label>

  {/* SEARCH INPUT */}
  <input
    id="assignedToSearch"
    type="text"
    value={
      selectedUser
        ? selectedUser.name ||
          selectedUser.username ||
          selectedUser.email ||
          ""
        : userSearch
    }
    onChange={(event) => {
      const value = event.target.value;

      setSelectedUser(null);

      setFormData((previous) => ({
        ...previous,
        assignedTo: "",
      }));

      setUserSearch(value);
      setShowUserDropdown(true);
    }}
    onFocus={() => {
      if (!selectedUser) {
        setShowUserDropdown(true);
      }
    }}
    placeholder="Search team member..."
    autoComplete="off"
    className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
  />

  {/* DROPDOWN */}
  {showUserDropdown && userSearch.trim() && (
    <div className="absolute left-0 right-0 top-full z-50 mt-2 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-lg">

      {/* LOADING */}
      {usersLoading && (
        <div className="flex items-center gap-3 px-4 py-4">
          <div className="h-4 w-4 animate-spin rounded-full border-2 border-slate-300 border-t-slate-900" />

          <span className="text-sm text-slate-500">
            Searching users...
          </span>
        </div>
      )}

      {/* ERROR */}
      {!usersLoading && usersError && (
        <div className="px-4 py-4 text-sm text-red-600">
          {usersError}
        </div>
      )}

      {/* NO USERS */}
      {!usersLoading &&
        !usersError &&
        users.length === 0 && (
          <div className="px-4 py-4">
            <p className="text-sm font-medium text-slate-700">
              No users found
            </p>

            <p className="mt-1 text-xs text-slate-400">
              Try another name, username or email.
            </p>
          </div>
        )}

      {/* USERS */}
      {!usersLoading &&
        !usersError &&
        users.length > 0 && (
          <div className="max-h-64 overflow-y-auto">

            {users.map((user) => {
              const userId = user?._id;

              const userName =
                user?.name ||
                user?.username ||
                "Unknown User";

              const userEmail =
                user?.email || "";

              if (!userId) {
                return null;
              }

              return (
                <button
                  key={userId}
                  type="button"
                  onClick={() => {
                    setSelectedUser(user);

                    setFormData((previous) => ({
                      ...previous,
                      assignedTo: userId,
                    }));

                    setUserSearch(userName);

                    setShowUserDropdown(false);

                    setSubmitError("");
                  }}
                  className="flex w-full items-center gap-3 px-4 py-3 text-left transition hover:bg-slate-50"
                >

                  {/* AVATAR */}
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-slate-100 text-sm font-semibold text-slate-700">
                    {userName
                      .charAt(0)
                      .toUpperCase()}
                  </div>

                  {/* USER INFO */}
                  <div className="min-w-0 flex-1">

                    <p className="truncate text-sm font-semibold text-slate-800">
                      {userName}
                    </p>

                    {userEmail && (
                      <p className="truncate text-xs text-slate-400">
                        {userEmail}
                      </p>
                    )}

                  </div>

                </button>
              );
            })}

          </div>
        )}
    </div>
  )}

  {/* SELECTED USER */}
  {selectedUser && (
    <div className="mt-3 flex items-center justify-between rounded-lg bg-green-50 px-4 py-3">

      <div className="flex min-w-0 items-center gap-3">

        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-green-100 text-xs font-bold text-green-700">
          {(
            selectedUser?.name ||
            selectedUser?.username ||
            "U"
          )
            .charAt(0)
            .toUpperCase()}
        </div>

        <div className="min-w-0">

          <p className="truncate text-sm font-semibold text-green-800">
            {selectedUser?.name ||
              selectedUser?.username ||
              "Selected User"}
          </p>

          {selectedUser?.email && (
            <p className="truncate text-xs text-green-600">
              {selectedUser.email}
            </p>
          )}

        </div>

      </div>

      {/* REMOVE */}
      <button
        type="button"
        onClick={() => {
          setSelectedUser(null);

          setUserSearch("");

          setFormData((previous) => ({
            ...previous,
            assignedTo: "",
          }));

          setShowUserDropdown(false);
        }}
        className="ml-3 text-xs font-semibold text-red-600 hover:text-red-700"
      >
        Remove
      </button>

    </div>
  )}

  <p className="mt-1 text-xs text-slate-400">
    Search by name, username or email. Leave empty if unassigned.
  </p>
</div>

              </div>

            </div>

          </div>


          {/* =================================================
              ERROR
          ================================================= */}

          {submitError && (

            <div className="mb-5 rounded-xl border border-red-200 bg-red-50 p-4">

              <div className="flex gap-3">

                <span className="text-red-600">

                  ⚠

                </span>


                <div>

                  <p className="text-sm font-semibold text-red-700">

                    Unable to create task

                  </p>


                  <p className="mt-1 text-sm text-red-600">

                    {submitError}

                  </p>

                </div>

              </div>

            </div>

          )}


          {/* =================================================
              SUCCESS
          ================================================= */}

          {successMessage && (

            <div className="mb-5 rounded-xl border border-green-200 bg-green-50 p-4">

              <p className="text-sm font-semibold text-green-700">

                ✓ {successMessage}

              </p>


              <p className="mt-1 text-xs text-green-600">

                Redirecting to tasks...

              </p>

            </div>

          )}


          {/* =================================================
              ACTIONS
          ================================================= */}

          <div className="flex flex-col-reverse gap-3 border-t border-slate-100 pt-6 sm:flex-row sm:justify-end">

            <button
              type="button"
              onClick={() =>
                navigate("/tasks")
              }
              disabled={submitting}
              className="rounded-xl border border-slate-200 bg-white px-6 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
            >

              Cancel

            </button>


            <button
              type="submit"
              disabled={
                submitting ||
                projectsLoading ||
                projects.length === 0
              }
              className="rounded-xl bg-slate-900 px-6 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
            >

              {submitting ? (

                <span className="flex items-center justify-center gap-2">

                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-slate-400 border-t-white" />

                  Creating Task...

                </span>

              ) : (

                "Create Task"

              )}

            </button>

          </div>

        </form>

      </div>

    </div>

  );

};


export default CreateTask;

