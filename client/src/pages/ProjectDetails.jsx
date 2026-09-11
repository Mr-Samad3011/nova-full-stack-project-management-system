/* eslint-disable react-hooks/set-state-in-effect */
import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import { useAuth } from "../context/AuthContext";

import {
  useNavigate,
  useParams,
} from "react-router-dom";

import {
  getProject,
  addProjectMember,
  removeProjectMember,
} from "../services/projectService";

import {
  getProjectTasks,
  createTask,
  updateTask,
  deleteTask,
} from "../services/taskService";

import {
  searchUsers,
} from "../services/userService";

import TaskForm from "../component/TaskForm";
import TaskColumn from "../component/TaskColumn";

import CommentForm from "../component/comments/CommentForm";
import CommentList from "../component/comments/CommentList";

import {
  getProjectComments,
  createProjectComment,
  updateComment,
  deleteComment,
} from "../services/commentService";


/* =====================================================
   PROJECT DETAILS
===================================================== */

const ProjectDetails = () => {

  const { projectId } = useParams();

  const navigate = useNavigate();

  /*
    IMPORTANT:
    Authentication-related information comes
    from AuthContext only.
  */
  const {
    user: currentUser,
  } = useAuth();


  /* =====================================================
     PROJECT STATE
  ===================================================== */

  const [project, setProject] = useState(null);

  const [tasks, setTasks] = useState([]);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");


  /* =====================================================
     TASK STATE
  ===================================================== */

  const [showTaskForm, setShowTaskForm] = useState(false);

  const [taskLoading, setTaskLoading] = useState(false);


  /* =====================================================
     MEMBER STATE
  ===================================================== */

  const [showMemberForm, setShowMemberForm] = useState(false);

  const [userSearch, setUserSearch] = useState("");

  const [users, setUsers] = useState([]);

  const [memberLoading, setMemberLoading] = useState(false);


  /* =====================================================
     COMMENT STATE
  ===================================================== */

  const [comments, setComments] = useState([]);

  const [commentLoading, setCommentLoading] = useState(false);

  const [commentError, setCommentError] = useState("");

  const [editingComment, setEditingComment] = useState(null);


  /* =====================================================
     ID HELPER
  ===================================================== */

  const getId = (value) => {

    if (!value) {
      return null;
    }

    if (typeof value === "object") {

      return (
        value?._id ||
        value?.id ||
        value?.user?._id ||
        value?.user?.id ||
        null
      );

    }

    return value;
  };


  /* =====================================================
     CURRENT USER
  ===================================================== */

  /*
    currentUser is obtained ONLY from useAuth().
  */

  const currentUserId = useMemo(
    () => getId(currentUser),
    [currentUser]
  );


  /* =====================================================
     GLOBAL USER ROLE
  ===================================================== */

  /*
    Global role comes ONLY from AuthContext.

    Expected roles:

    OWNER
    ADMIN
    MEMBER
    VIEWER
    MANAGER
  */

  const globalUserRole = useMemo(
    () =>
      String(
        currentUser?.role || ""
      ).toUpperCase(),
    [currentUser]
  );


  /* =====================================================
     PROJECT OWNER ID
  ===================================================== */

  const projectOwnerId = useMemo(
    () => getId(project?.owner),
    [project]
  );


  /* =====================================================
     PROJECT MEMBERS
  ===================================================== */

  const members = useMemo(
    () =>
      Array.isArray(project?.members)
        ? project.members
        : [],
    [project]
  );


  /* =====================================================
     FIND CURRENT PROJECT MEMBER
  ===================================================== */

  const currentProjectMember = useMemo(() => {

    if (!currentUserId) {
      return null;
    }

    return (
      members.find((member) => {

        const memberUserId = getId(member);

        return (
          String(memberUserId) ===
          String(currentUserId)
        );

      }) || null
    );

  }, [
    members,
    currentUserId,
  ]);


  /* =====================================================
     PROJECT ROLE
  ===================================================== */

  /*
    ROLE PRIORITY:

    1. GLOBAL ADMIN
    2. PROJECT OWNER
    3. PROJECT MEMBER ROLE
    4. GLOBAL USER ROLE
    5. VIEWER

    ADMIN is global and therefore does not need
    to exist inside project.members.
  */

  const projectRole = useMemo(() => {

    if (globalUserRole === "ADMIN") {
      return "ADMIN";
    }

    if (
      projectOwnerId &&
      currentUserId &&
      String(projectOwnerId) ===
        String(currentUserId)
    ) {
      return "OWNER";
    }

    return String(
      currentProjectMember?.role ||
      currentProjectMember?.projectRole ||
      globalUserRole ||
      "VIEWER"
    ).toUpperCase();

  }, [
    globalUserRole,
    projectOwnerId,
    currentUserId,
    currentProjectMember,
  ]);


  /* =====================================================
     RBAC FLAGS
  ===================================================== */

  const isOwner =
    projectRole === "OWNER";

  const isAdmin =
    globalUserRole === "ADMIN" ||
    projectRole === "ADMIN";

  const isMember =
    projectRole === "MEMBER";

  const isManager =
    projectRole === "MANAGER";

  const isViewer =
    projectRole === "VIEWER";


  /* =====================================================
     MEMBER PERMISSIONS
  ===================================================== */

  const canManageMembers =
    isOwner ||
    isAdmin||isManager;


  /* =====================================================
     TASK PERMISSIONS
  ===================================================== */

  const canCreateTask =
    isOwner ||
    isAdmin ||
    isMember ||
    isManager;

  const canUpdateTask =
    isOwner ||
    isAdmin ||
    isMember ||
    isManager;

  const canDeleteTask =
    isOwner ||
    isAdmin;


  /* =====================================================
     COMMENT PERMISSIONS
  ===================================================== */

  /*
    OWNER  -> COMMENT
    ADMIN  -> COMMENT
    MANAGER -> COMMENT
    MEMBER -> COMMENT
    VIEWER -> VIEW ONLY
  */

  const canComment =
    isOwner ||
    isAdmin ||
    isMember ||
    isManager;


  /*
    OWNER / ADMIN can manage
    any project comment.
  */

  const canManageAnyComment =
    isOwner ||
    isAdmin;


  /* =====================================================
     LOAD PROJECT + TASKS
  ===================================================== */

  const loadData = useCallback(
    async () => {

      if (!projectId) {

        setError(
          "Project ID is missing"
        );

        setLoading(false);

        return;
      }

      try {

        setLoading(true);
        setError("");

        const [
          projectResponse,
          taskResponse,
        ] = await Promise.all([

          getProject(projectId),

          getProjectTasks(projectId),

        ]);


        /* -----------------------------------------------
           PROJECT RESPONSE
        ------------------------------------------------ */

        const projectData =
          projectResponse?.project ||
          projectResponse?.data?.project ||
          projectResponse?.data ||
          projectResponse;


        /* -----------------------------------------------
           TASK RESPONSE
        ------------------------------------------------ */

        const taskData =
          taskResponse?.tasks ||
          taskResponse?.data?.tasks ||
          taskResponse?.data ||
          [];


        /* -----------------------------------------------
           SET PROJECT
        ------------------------------------------------ */

        if (projectData) {

          setProject({

            ...projectData,

            members:
              Array.isArray(
                projectData.members
              )
                ? projectData.members
                : [],

          });

        } else {

          setProject(null);

        }


        /* -----------------------------------------------
           SET TASKS
        ------------------------------------------------ */

        setTasks(
          Array.isArray(taskData)
            ? taskData
            : []
        );

      } catch (err) {

        console.error(
          "Project Details Error:",
          err
        );

        setError(
          err?.response?.data?.message ||
          err?.message ||
          "Unable to load project"
        );

      } finally {

        setLoading(false);

      }

    },
    [projectId]
  );


  /* =====================================================
     INITIAL LOAD
  ===================================================== */

  useEffect(() => {

    loadData();

  }, [loadData]);


  /* =====================================================
     SEARCH USERS
  ===================================================== */

  const handleSearchUsers = async (value) => {

    setUserSearch(value);

    if (!value.trim()) {

      setUsers([]);

      return;
    }

    if (!canManageMembers) {

      setUsers([]);

      return;
    }

    try {

      const response =
        await searchUsers(
          value.trim()
        );

      const userList =
        response?.users ||
        response?.data?.users ||
        response?.data ||
        [];

      setUsers(
        Array.isArray(userList)
          ? userList
          : []
      );

    } catch (err) {

      console.error(
        "User Search Error:",
        err
      );

      setUsers([]);

    }

  };


  /* =====================================================
     ADD MEMBER
  ===================================================== */

  const handleAddMember = async (userId) => {

    if (!userId) {
      return;
    }

    if (!canManageMembers) {

      alert(
        "You do not have permission to add project members."
      );

      return;
    }

    try {

      setMemberLoading(true);

      const response =
        await addProjectMember(
          projectId,
          userId
        );

      const updatedProject =
        response?.project ||
        response?.data?.project;

      if (updatedProject) {

        setProject({

          ...updatedProject,

          members:
            Array.isArray(
              updatedProject.members
            )
              ? updatedProject.members
              : [],

        });

      } else {

        await loadData();

      }

      setUsers([]);

      setUserSearch("");

      setShowMemberForm(false);

    } catch (err) {

      console.error(
        "Add Member Error:",
        err
      );

      alert(
        err?.response?.data?.message ||
        err?.message ||
        "Unable to add member"
      );

    } finally {

      setMemberLoading(false);

    }

  };


  /* =====================================================
     REMOVE MEMBER
  ===================================================== */

  const handleRemoveMember = async (userId) => {

    if (!userId) {
      return;
    }

    if (!canManageMembers) {

      alert(
        "You do not have permission to remove project members."
      );

      return;
    }

    const confirmed =
      window.confirm(
        "Remove this member from the project?"
      );

    if (!confirmed) {
      return;
    }

    try {

      setMemberLoading(true);

      const response =
        await removeProjectMember(
          projectId,
          userId
        );

      const updatedProject =
        response?.project ||
        response?.data?.project;

      if (updatedProject) {

        setProject({

          ...updatedProject,

          members:
            Array.isArray(
              updatedProject.members
            )
              ? updatedProject.members
              : [],

        });

      } else {

        await loadData();

      }

    } catch (err) {

      console.error(
        "Remove Member Error:",
        err
      );

      alert(
        err?.response?.data?.message ||
        err?.message ||
        "Unable to remove member"
      );

    } finally {

      setMemberLoading(false);

    }

  };


  /* =====================================================
     CREATE TASK
  ===================================================== */

  const handleCreateTask = async (taskData) => {

    if (!projectId) {
      return;
    }

    if (!canCreateTask) {

      alert(
        "You do not have permission to create tasks."
      );

      return;
    }

    try {

      setTaskLoading(true);

      const response =
        await createTask(
          projectId,
          taskData
        );

      const newTask =
        response?.task ||
        response?.data?.task;

      if (!newTask) {

        throw new Error(
          "Invalid task response from server"
        );

      }

      setTasks((previous) => [

        newTask,

        ...previous,

      ]);

      setShowTaskForm(false);

    } catch (err) {

      console.error(
        "Create Task Error:",
        err
      );

      alert(
        err?.response?.data?.message ||
        err?.message ||
        "Unable to create task"
      );

      throw err;

    } finally {

      setTaskLoading(false);

    }

  };


  /* =====================================================
     UPDATE TASK STATUS
  ===================================================== */

  const handleStatusChange = async (
    taskId,
    newStatus
  ) => {

    if (
      !taskId ||
      !newStatus
    ) {
      return;
    }

    if (!canUpdateTask) {

      alert(
        "You do not have permission to update tasks."
      );

      return;
    }

    const previousTask =
      tasks.find(
        (task) =>
          String(task?._id) ===
          String(taskId)
      );


    /* -----------------------------------------------
       OPTIMISTIC UPDATE
    ------------------------------------------------ */

    setTasks((previous) =>
      previous.map((task) =>
        String(task?._id) ===
        String(taskId)
          ? {
              ...task,
              status: newStatus,
            }
          : task
      )
    );


    try {

      const response =
        await updateTask(
          taskId,
          {
            status: newStatus,
          }
        );

      const updatedTask =
        response?.task ||
        response?.data?.task;

      if (updatedTask) {

        setTasks((previous) =>
          previous.map((task) =>
            String(task?._id) ===
            String(taskId)
              ? updatedTask
              : task
          )
        );

      }

    } catch (err) {

      console.error(
        "Update Task Error:",
        err
      );


      /* -------------------------------------------
         ROLLBACK
      -------------------------------------------- */

      if (previousTask) {

        setTasks((previous) =>
          previous.map((task) =>
            String(task?._id) ===
            String(taskId)
              ? previousTask
              : task
          )
        );

      }

      alert(
        err?.response?.data?.message ||
        err?.message ||
        "Unable to update task"
      );

    }

  };


  /* =====================================================
     LOAD COMMENTS
  ===================================================== */

  const loadComments = useCallback(
    async () => {

      if (!projectId) {
        return;
      }

      try {

        setCommentLoading(true);

        setCommentError("");

        const response =
          await getProjectComments(
            projectId
          );

        const commentData =
          response?.comments ||
          response?.data?.comments ||
          response?.data ||
          [];

        setComments(
          Array.isArray(commentData)
            ? commentData
            : []
        );

      } catch (err) {

        console.error(
          "Get Comments Error:",
          err
        );

        setCommentError(
          err?.response?.data?.message ||
          err?.message ||
          "Unable to load comments"
        );

      } finally {

        setCommentLoading(false);

      }

    },
    [projectId]
  );


  /* =====================================================
     INITIAL COMMENTS LOAD
  ===================================================== */

  useEffect(() => {

    loadComments();

  }, [loadComments]);


  /* =====================================================
     CREATE COMMENT
  ===================================================== */

  const handleCreateComment = async (content) => {

    if (!projectId) {

      throw new Error(
        "Project ID is missing"
      );

    }

    if (!canComment) {

      const error =
        new Error(
          "You do not have permission to create comments."
        );

      setCommentError(
        error.message
      );

      throw error;
    }

    try {

      setCommentLoading(true);

      setCommentError("");

      await createProjectComment(
        projectId,
        content
      );

      await loadComments();

    } catch (err) {

      console.error(
        "Create Comment Error:",
        err
      );

      setCommentError(
        err?.response?.data?.message ||
        err?.message ||
        "Unable to create comment"
      );

      throw err;

    } finally {

      setCommentLoading(false);

    }

  };


  /* =====================================================
     FIND COMMENT
  ===================================================== */

  const findComment = (commentId) => {

    return comments.find(
      (comment) =>
        String(comment?._id) ===
        String(commentId)
    );

  };


  /* =====================================================
     CHECK COMMENT OWNER
  ===================================================== */

  const isCommentOwner = (comment) => {

    if (
      !comment ||
      !currentUserId
    ) {
      return false;
    }

    const commentUserId =
      getId(
        comment?.user ||
        comment?.author ||
        comment?.createdBy
      );

    return (
      String(commentUserId) ===
      String(currentUserId)
    );

  };


  /* =====================================================
     CAN EDIT COMMENT
  ===================================================== */

  const canEditComment = (comment) => {

    /*
      Only the comment creator can edit
      their own comment.

      ADMIN cannot edit another user's
      comment.
    */

    return (
      canComment &&
      isCommentOwner(comment)
    );

  };


  /* =====================================================
     CAN DELETE COMMENT
  ===================================================== */

  const canDeleteComment = (comment) => {

    /*
      OWNER / ADMIN
      -> delete any comment

      COMMENT CREATOR
      -> delete own comment
    */

    return (
      canManageAnyComment ||
      (
        canComment &&
        isCommentOwner(comment)
      )
    );

  };


  /* =====================================================
     UPDATE COMMENT
  ===================================================== */

  const handleUpdateComment = async (
    commentId,
    content
  ) => {

    if (!commentId) {

      throw new Error(
        "Comment ID is missing"
      );

    }

    const comment =
      findComment(commentId);

    if (!comment) {

      throw new Error(
        "Comment not found"
      );

    }

    if (
      !canEditComment(comment)
    ) {

      const error =
        new Error(
          "You can only edit your own comments."
        );

      setCommentError(
        error.message
      );

      throw error;
    }

    try {

      setCommentLoading(true);

      setCommentError("");

      await updateComment(
        commentId,
        content
      );

      setEditingComment(null);

      await loadComments();

    } catch (err) {

      console.error(
        "Update Comment Error:",
        err
      );

      setCommentError(
        err?.response?.data?.message ||
        err?.message ||
        "Unable to update comment"
      );

      throw err;

    } finally {

      setCommentLoading(false);

    }

  };


  /* =====================================================
     DELETE COMMENT
  ===================================================== */

  const handleDeleteComment = async (
    commentId
  ) => {

    if (!commentId) {
      return;
    }

    const comment =
      findComment(commentId);

    if (!comment) {

      setCommentError(
        "Comment not found"
      );

      return;
    }

    if (
      !canDeleteComment(comment)
    ) {

      setCommentError(
        "You do not have permission to delete this comment."
      );

      return;
    }

    const confirmed =
      window.confirm(
        "Are you sure you want to delete this comment?"
      );

    if (!confirmed) {
      return;
    }

    try {

      setCommentLoading(true);

      setCommentError("");

      await deleteComment(
        commentId
      );

      await loadComments();

    } catch (err) {

      console.error(
        "Delete Comment Error:",
        err
      );

      setCommentError(
        err?.response?.data?.message ||
        err?.message ||
        "Unable to delete comment"
      );

    } finally {

      setCommentLoading(false);

    }

  };


  /* =====================================================
     START COMMENT EDIT
  ===================================================== */

  const handleStartCommentEdit = (comment) => {

    if (!comment) {
      return;
    }

    if (
      !canEditComment(comment)
    ) {

      setCommentError(
        "You can only edit your own comments."
      );

      return;
    }

    setCommentError("");

    setEditingComment(comment);

  };


  /* =====================================================
     DELETE TASK
  ===================================================== */

  const handleDeleteTask = async (taskId) => {

    if (!taskId) {
      return;
    }

    if (!canDeleteTask) {

      alert(
        "You do not have permission to delete tasks."
      );

      return;
    }

    const confirmed =
      window.confirm(
        "Are you sure you want to delete this task?"
      );

    if (!confirmed) {
      return;
    }

    try {

      await deleteTask(taskId);

      setTasks((previous) =>
        previous.filter(
          (task) =>
            String(task?._id) !==
            String(taskId)
        )
      );

    } catch (err) {

      console.error(
        "Delete Task Error:",
        err
      );

      alert(
        err?.response?.data?.message ||
        err?.message ||
        "Unable to delete task"
      );

    }

  };


  /* =====================================================
     LOADING
  ===================================================== */

  if (loading) {

    return (

      <div className="flex min-h-screen items-center justify-center bg-gray-50">

        <div className="text-center">

          <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-4 border-gray-200 border-t-gray-900" />

          <p className="text-gray-500">
            Loading project...
          </p>

        </div>

      </div>

    );

  }


  /* =====================================================
     ERROR
  ===================================================== */

  if (error) {

    return (

      <div className="flex min-h-screen items-center justify-center bg-gray-50 p-6">

        <div className="w-full max-w-md rounded-2xl bg-white p-8 text-center shadow-sm">

          <h2 className="text-xl font-bold text-gray-900">
            Unable to load project
          </h2>

          <p className="mt-2 text-red-500">
            {error}
          </p>

          <div className="mt-6 flex flex-wrap justify-center gap-3">

            <button
              type="button"
              onClick={loadData}
              className="rounded-lg bg-gray-900 px-5 py-2.5 font-medium text-white hover:bg-gray-800"
            >
              Retry
            </button>

            <button
              type="button"
              onClick={() =>
                navigate("/projects")
              }
              className="rounded-lg border border-gray-300 bg-white px-5 py-2.5 font-medium text-gray-700 hover:bg-gray-50"
            >
              Projects
            </button>

            <button
              type="button"
              onClick={() =>
                navigate("/dashboard")
              }
              className="rounded-lg border border-gray-300 bg-white px-5 py-2.5 font-medium text-gray-700 hover:bg-gray-50"
            >
              Dashboard
            </button>

          </div>

        </div>

      </div>

    );

  }


  /* =====================================================
     PROJECT NOT FOUND
  ===================================================== */

  if (!project) {

    return (

      <div className="flex min-h-screen items-center justify-center bg-gray-50 p-6">

        <div className="text-center">

          <h2 className="text-xl font-bold text-gray-900">
            Project not found
          </h2>

          <button
            type="button"
            onClick={() =>
              navigate("/projects")
            }
            className="mt-4 rounded-lg bg-gray-900 px-5 py-2.5 text-white"
          >
            Back to Projects
          </button>

        </div>

      </div>

    );

  }


  /* =====================================================
     TASK GROUPS
  ===================================================== */

  const todoTasks =
    tasks.filter(
      (task) =>
        task.status === "TODO"
    );

  const inProgressTasks =
    tasks.filter(
      (task) =>
        task.status === "IN_PROGRESS"
    );

  const reviewTasks =
    tasks.filter(
      (task) =>
        task.status === "REVIEW"
    );

  const doneTasks =
    tasks.filter(
      (task) =>
        task.status === "DONE"
    );


  /* =====================================================
     RENDER
  ===================================================== */

  return (

    <div className="min-h-screen bg-gray-50 p-6">

      <div className="mx-auto max-w-7xl">


        {/* =================================================
            NAVIGATION
        ================================================= */}

        <div className="mb-5 flex flex-wrap items-center gap-3">

          <button
            type="button"
            onClick={() =>
              navigate("/dashboard")
            }
            className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100"
          >
            ← Dashboard
          </button>

          <button
            type="button"
            onClick={() =>
              navigate("/projects")
            }
            className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100"
          >
            Projects
          </button>

        </div>


        {/* =================================================
            PROJECT HEADER
        ================================================= */}

        <div className="rounded-2xl bg-white p-6 shadow-sm">

          <div className="flex flex-col justify-between gap-5 md:flex-row">

            <div>

              <div className="flex flex-wrap items-center gap-3">

                <h1 className="text-3xl font-bold text-gray-900">
                  {project.name}
                </h1>

                {project.status && (

                  <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-700">
                    {project.status}
                  </span>

                )}

                <span className="rounded-full bg-purple-100 px-3 py-1 text-xs font-semibold text-purple-700">
                  {projectRole}
                </span>

              </div>

              <p className="mt-2 max-w-3xl text-gray-500">
                {project.description ||
                  "No project description available."}
              </p>

            </div>


            {/* ADD TASK */}

            {canCreateTask && (

              <button
                type="button"
                onClick={() =>
                  setShowTaskForm(true)
                }
                className="h-fit rounded-lg bg-gray-900 px-5 py-3 font-medium text-white hover:bg-gray-800"
              >
                + Add Task
              </button>

            )}

          </div>


          {/* =================================================
              PROJECT META
          ================================================= */}

          <div className="mt-6 flex flex-wrap gap-6 text-sm text-gray-500">

            {project.owner && (

              <span>

                Owner:{" "}

                <strong className="text-gray-900">
                  {project.owner.name ||
                    project.owner.username ||
                    project.owner.email ||
                    "Unknown"}
                </strong>

              </span>

            )}

            <span>

              Role:{" "}

              <strong className="text-gray-900">
                {projectRole}
              </strong>

            </span>

            {project.priority && (

              <span>

                Priority:{" "}

                <strong className="text-gray-900">
                  {project.priority}
                </strong>

              </span>

            )}

            {project.dueDate && (

              <span>

                Due Date:{" "}

                <strong className="text-gray-900">

                  {new Date(
                    project.dueDate
                  ).toLocaleDateString()}

                </strong>

              </span>

            )}

            <span>

              Tasks:{" "}

              <strong className="text-gray-900">
                {tasks.length}
              </strong>

            </span>

            <span>

              Members:{" "}

              <strong className="text-gray-900">
                {members.length}
              </strong>

            </span>

          </div>

        </div>


        {/* =================================================
            TEAM MEMBERS
        ================================================= */}

        <div className="mt-8 rounded-2xl bg-white p-6 shadow-sm">

          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">

            <div>

              <h2 className="text-xl font-bold text-gray-900">
                Team Members
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                Manage people working on this project.
              </p>

            </div>


            {/* ADD MEMBER */}

            {canManageMembers && (

              <button
                type="button"
                onClick={() =>
                  setShowMemberForm(
                    (previous) =>
                      !previous
                  )
                }
                className="rounded-lg bg-gray-900 px-4 py-2.5 text-sm font-medium text-white hover:bg-gray-800"
              >
                {showMemberForm
                  ? "Cancel"
                  : "+ Add Member"}
              </button>

            )}

          </div>


          {/* =================================================
              ADD MEMBER FORM
          ================================================= */}

          {showMemberForm &&
            canManageMembers && (

              <div className="mt-5 rounded-xl bg-gray-50 p-4">

                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Search User
                </label>

                <input
                  type="text"
                  value={userSearch}
                  onChange={(e) =>
                    handleSearchUsers(
                      e.target.value
                    )
                  }
                  placeholder="Search by name, username or email..."
                  className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 outline-none focus:ring-2 focus:ring-gray-200"
                />


                {users.length > 0 && (

                  <div className="mt-2 overflow-hidden rounded-lg border border-gray-200 bg-white">

                    {users.map((user) => {

                      const userId =
                        user?._id ||
                        user?.id;

                      const userName =
                        user?.name ||
                        user?.username ||
                        user?.email ||
                        "Unknown User";

                      return (

                        <button
                          key={userId}
                          type="button"
                          onClick={() =>
                            handleAddMember(
                              userId
                            )
                          }
                          disabled={
                            memberLoading
                          }
                          className="flex w-full items-center justify-between border-b border-gray-100 p-4 text-left last:border-b-0 hover:bg-gray-50 disabled:opacity-50"
                        >

                          <div>

                            <p className="font-medium text-gray-900">
                              {userName}
                            </p>

                            {user?.username && (

                              <p className="text-sm text-gray-500">
                                @{user.username}
                              </p>

                            )}

                            {user?.email && (

                              <p className="text-xs text-gray-400">
                                {user.email}
                              </p>

                            )}

                          </div>

                          <span className="text-sm font-medium text-blue-600">

                            {memberLoading
                              ? "Adding..."
                              : "Add"}

                          </span>

                        </button>

                      );

                    })}

                  </div>

                )}


                {userSearch.trim() &&
                  users.length === 0 && (

                    <p className="mt-3 text-sm text-gray-500">
                      No users found.
                    </p>

                  )}

              </div>

            )}


          {/* =================================================
              MEMBERS LIST
          ================================================= */}

          <div className="mt-5 space-y-3">

            {members.length === 0 ? (

              <div className="rounded-xl border border-dashed border-gray-300 p-6 text-center">

                <p className="text-sm text-gray-500">
                  No additional members yet.
                </p>

              </div>

            ) : (

              members.map((member) => {

                const memberId =
                  getId(member);

                const memberUser =
                  member?.user ||
                  member;

                const memberName =
                  memberUser?.name ||
                  memberUser?.username ||
                  memberUser?.email ||
                  "Unknown User";

                const memberRole =
                  String(
                    member?.role ||
                    member?.projectRole ||
                    "MEMBER"
                  ).toUpperCase();

                return (

                  <div
                    key={memberId}
                    className="flex flex-col gap-3 rounded-xl border border-gray-200 bg-white p-4 sm:flex-row sm:items-center sm:justify-between"
                  >

                    <div>

                      <div className="flex flex-wrap items-center gap-2">

                        <p className="font-medium text-gray-900">
                          {memberName}
                        </p>

                        <span className="rounded-full bg-blue-50 px-2.5 py-1 text-xs font-semibold text-blue-700">
                          {memberRole}
                        </span>

                      </div>

                      {memberUser?.email && (

                        <p className="text-sm text-gray-500">
                          {memberUser.email}
                        </p>

                      )}

                    </div>


                    {/* REMOVE */}

                    {canManageMembers && (

                      <button
                        type="button"
                        onClick={() =>
                          handleRemoveMember(
                            memberId
                          )
                        }
                        disabled={
                          memberLoading
                        }
                        className="rounded-lg bg-red-50 px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-100 disabled:opacity-50"
                      >

                        {memberLoading
                          ? "Processing..."
                          : "Remove"}

                      </button>

                    )}

                  </div>

                );

              })

            )}

          </div>

        </div>


        {/* =================================================
            TASK BOARD
        ================================================= */}

        <div className="mt-8">

          <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">

            <div>

              <h2 className="text-2xl font-bold text-gray-900">
                Task Board
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                Manage tasks and track project progress.
              </p>

            </div>

            <span className="w-fit rounded-full bg-white px-4 py-2 text-sm font-semibold text-gray-600 shadow-sm">
              {tasks.length} tasks
            </span>

          </div>


          {tasks.length === 0 ? (

            <div className="rounded-2xl border border-dashed border-gray-300 bg-white p-12 text-center shadow-sm">

              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-gray-100 text-2xl">
                ✓
              </div>

              <h3 className="mt-4 text-lg font-semibold text-gray-900">
                No tasks yet
              </h3>

              <p className="mt-2 text-sm text-gray-500">
                Create the first task for this project.
              </p>

              {canCreateTask && (

                <button
                  type="button"
                  onClick={() =>
                    setShowTaskForm(true)
                  }
                  className="mt-5 rounded-lg bg-gray-900 px-5 py-2.5 text-sm font-medium text-white hover:bg-gray-800"
                >
                  + Create Task
                </button>

              )}

            </div>

          ) : (

            <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">

              <TaskColumn
                title="To Do"
                count={todoTasks.length}
                tasks={todoTasks}
                onStatusChange={
                  canUpdateTask
                    ? handleStatusChange
                    : undefined
                }
                onDelete={
                  canDeleteTask
                    ? handleDeleteTask
                    : undefined
                }
              />

              <TaskColumn
                title="In Progress"
                count={
                  inProgressTasks.length
                }
                tasks={inProgressTasks}
                onStatusChange={
                  canUpdateTask
                    ? handleStatusChange
                    : undefined
                }
                onDelete={
                  canDeleteTask
                    ? handleDeleteTask
                    : undefined
                }
              />

              <TaskColumn
                title="Review"
                count={
                  reviewTasks.length
                }
                tasks={reviewTasks}
                onStatusChange={
                  canUpdateTask
                    ? handleStatusChange
                    : undefined
                }
                onDelete={
                  canDeleteTask
                    ? handleDeleteTask
                    : undefined
                }
              />

              <TaskColumn
                title="Done"
                count={
                  doneTasks.length
                }
                tasks={doneTasks}
                onStatusChange={
                  canUpdateTask
                    ? handleStatusChange
                    : undefined
                }
                onDelete={
                  canDeleteTask
                    ? handleDeleteTask
                    : undefined
                }
              />

            </div>

          )}

        </div>


        {/* =================================================
            COMMENTS
        ================================================= */}

        <div className="mt-8 rounded-2xl bg-white p-6 shadow-sm">

          <div className="mb-5">

            <div className="flex flex-wrap items-center gap-3">

              <h2 className="text-xl font-bold text-gray-900">
                Comments
              </h2>

              <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-600">
                {comments.length}
              </span>

            </div>

            <p className="mt-1 text-sm text-gray-500">
              Discuss this project with your team members.
            </p>

          </div>


          {/* =================================================
              COMMENT FORM
          ================================================= */}

          {canComment && (

            editingComment ? (

              <CommentForm
                key={editingComment._id}
                initialValue={
                  editingComment.content
                }
                isEditing={true}
                loading={
                  commentLoading
                }
                onSubmit={(content) =>
                  handleUpdateComment(
                    editingComment._id,
                    content
                  )
                }
                onCancel={() => {

                  setEditingComment(null);

                  setCommentError("");

                }}
              />

            ) : (

              <CommentForm
                onSubmit={
                  handleCreateComment
                }
                loading={
                  commentLoading
                }
              />

            )

          )}


          {/* =================================================
              VIEWER MESSAGE
          ================================================= */}

          {isViewer && (

            <div className="mb-5 rounded-lg border border-blue-100 bg-blue-50 p-4">

              <p className="text-sm text-blue-700">
                You have view-only access to this project.
              </p>

            </div>

          )}


          {/* =================================================
              COMMENT ERROR
          ================================================= */}

          {commentError && (

            <div className="mt-4 rounded-lg border border-red-100 bg-red-50 p-3">

              <p className="text-sm text-red-600">
                {commentError}
              </p>

            </div>

          )}


          {/* =================================================
              COMMENT LIST
          ================================================= */}

          <div className="mt-6">

            <CommentList
              comments={comments}
              loading={commentLoading}
              error=""
              currentUser={currentUser}
              projectRole={projectRole}
              canComment={canComment}
              canManageAnyComment={
                canManageAnyComment
              }
              canEditComment={
                canEditComment
              }
              canDeleteComment={
                canDeleteComment
              }
              onEdit={
                handleStartCommentEdit
              }
              onDelete={
                handleDeleteComment
              }
            />

          </div>

        </div>

      </div>


      {/* =====================================================
          CREATE TASK MODAL
      ===================================================== */}

      {showTaskForm &&
        canCreateTask && (

          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
            onMouseDown={(e) => {

              if (
                e.target ===
                e.currentTarget
              ) {

                if (!taskLoading) {

                  setShowTaskForm(
                    false
                  );

                }

              }

            }}
          >

            <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-white p-6 shadow-xl">


              {/* MODAL HEADER */}

              <div className="mb-5 flex items-center justify-between">

                <div>

                  <h2 className="text-xl font-bold text-gray-900">
                    Create New Task
                  </h2>

                  <p className="mt-1 text-sm text-gray-500">
                    Add a task to this project.
                  </p>

                </div>


                <button
                  type="button"
                  onClick={() => {

                    if (!taskLoading) {

                      setShowTaskForm(
                        false
                      );

                    }

                  }}
                  disabled={
                    taskLoading
                  }
                  className="rounded-lg px-2 py-1 text-2xl text-gray-400 hover:bg-gray-100 hover:text-gray-700 disabled:cursor-not-allowed disabled:opacity-50"
                  aria-label="Close task form"
                >
                  ×
                </button>

              </div>


              {/* TASK FORM */}

              <TaskForm
                project={project}
                onSubmit={
                  handleCreateTask
                }
                onCancel={() => {

                  if (!taskLoading) {

                    setShowTaskForm(
                      false
                    );

                  }

                }}
                loading={
                  taskLoading
                }
              />

            </div>

          </div>

        )}

    </div>

  );

};


export default ProjectDetails;
