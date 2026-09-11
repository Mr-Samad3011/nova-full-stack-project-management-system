import {
  useEffect,
  useState,
} from "react";

import {
  useNavigate,
  useParams,
} from "react-router-dom";

import {
  getTask,
  updateTask,
  deleteTask,
} from "../services/taskService";

import TaskColumn from "../component/TaskColumn";


const TaskDetails = () => {

  const { id } = useParams();

  const navigate = useNavigate();


  // =====================================================
  // STATE
  // =====================================================

  const [task, setTask] = useState(null);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");


  // =====================================================
  // LOAD SINGLE TASK
  // =====================================================

  useEffect(() => {

    const loadTask = async () => {

      if (!id) {

        setError("Task ID is missing");

        setLoading(false);

        return;

      }


      try {

        setLoading(true);

        setError("");


        // =================================================
        // DIRECTLY FETCH SINGLE TASK
        // GET /api/tasks/:id
        // =================================================

        const response = await getTask(id);


        // =================================================
        // NORMALIZE RESPONSE
        // =================================================

        const taskData =
          response?.task ||
          response?.data?.task ||
          response?.data ||
          null;


        if (!taskData) {

          throw new Error(
            "Task not found"
          );

        }


        // =================================================
        // SET TASK
        // =================================================

        setTask(taskData);

      } catch (err) {

        console.error(
          "Task Details Error:",
          err
        );


        setError(
          err?.response?.data?.message ||
          err?.message ||
          "Unable to load task"
        );


        setTask(null);

      } finally {

        setLoading(false);

      }

    };


    loadTask();

  }, [id]);


  // =====================================================
  // FORMAT DATE
  // =====================================================

  const formatDate = (date) => {

    if (!date) {

      return "Not set";

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
        month: "long",
        year: "numeric",
      }
    );

  };


  // =====================================================
  // STATUS LABEL
  // =====================================================

  const getStatusLabel = (status) => {

    switch (
      String(status || "").toUpperCase()
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
  // PRIORITY LABEL
  // =====================================================

  const getPriorityLabel = (priority) => {

    if (!priority) {

      return "Not set";

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


  // =====================================================
  // STATUS CHANGE
  // =====================================================

  const handleStatusChange = async (
    taskId,
    newStatus
  ) => {

    try {

      setError("");


      const response = await updateTask(
        taskId,
        {
          status: newStatus,
        }
      );


      // =================================================
      // GET UPDATED TASK FROM RESPONSE
      // =================================================

      const updatedTask =
        response?.task ||
        response?.data?.task ||
        response?.data ||
        null;


      if (updatedTask) {

        setTask(updatedTask);

      } else {

        // =================================================
        // FALLBACK LOCAL UPDATE
        // =================================================

        setTask((previousTask) => {

          if (!previousTask) {

            return previousTask;

          }


          return {
            ...previousTask,
            status: newStatus,
          };

        });

      }

    } catch (err) {

      console.error(
        "Status Update Error:",
        err
      );


      setError(
        err?.response?.data?.message ||
        err?.message ||
        "Unable to update task status"
      );

    }

  };


  // =====================================================
  // DELETE TASK
  // =====================================================

  const handleDelete = async (taskId) => {

    const confirmed =
      window.confirm(
        "Are you sure you want to delete this task?"
      );


    if (!confirmed) {

      return;

    }


    try {

      setError("");


      await deleteTask(taskId);


      // =================================================
      // AFTER DELETE
      // =================================================

      if (task?.project?._id) {

        navigate(
          `/projects/${task.project._id}`
        );

      } else {

        navigate("/tasks");

      }

    } catch (err) {

      console.error(
        "Delete Task Error:",
        err
      );


      setError(
        err?.response?.data?.message ||
        err?.message ||
        "Unable to delete task"
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

          <p className="text-slate-500">
            Loading task...
          </p>

        </div>

      </div>
    );

  }


  // =====================================================
  // ERROR / TASK NOT FOUND
  // =====================================================

  if (error || !task) {

    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 p-6">

        <div className="w-full max-w-md rounded-2xl bg-white p-8 text-center shadow-sm">

          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-50">

            <span className="text-xl text-red-600">
              !
            </span>

          </div>


          <h2 className="mt-4 text-xl font-bold text-slate-900">
            Unable to load task
          </h2>


          <p className="mt-2 text-sm text-red-600">
            {error || "Task not found"}
          </p>


          <div className="mt-6 flex flex-wrap justify-center gap-3">

            <button
              type="button"
              onClick={() => navigate(-1)}
              className="rounded-lg border border-slate-300 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
            >
              Go Back
            </button>


            <button
              type="button"
              onClick={() =>
                navigate("/tasks")
              }
              className="rounded-lg bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white hover:bg-slate-800"
            >
              Tasks
            </button>

          </div>

        </div>

      </div>
    );

  }


  // =====================================================
  // TASK DETAILS
  // =====================================================

  return (

    <div className="min-h-screen bg-slate-50 p-6">

      <div className="mx-auto max-w-6xl">


        {/* =================================================
            BACK BUTTON
        ================================================= */}

        <button
          type="button"
          onClick={() => navigate(-1)}
          className="mb-6 text-sm font-medium text-slate-600 hover:text-slate-900"
        >
          ← Back
        </button>


        {/* =================================================
            TASK DETAILS CARD
        ================================================= */}

        <div className="rounded-2xl bg-white p-8 shadow-sm">


          {/* =================================================
              HEADER
          ================================================= */}

          <div className="border-b border-slate-100 pb-6">

            <div className="flex flex-wrap items-center gap-3">

              <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
                Task
              </span>


              {task.status && (

                <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-600">

                  {getStatusLabel(
                    task.status
                  )}

                </span>

              )}

            </div>


            <h1 className="mt-4 text-3xl font-bold text-slate-900">

              {task.title ||
                "Untitled Task"}

            </h1>


            {/* PROJECT */}

            <p className="mt-3 text-sm text-slate-500">

              Project:{" "}

              <span className="font-medium text-slate-700">

                {task.project?.name ||
                  task.project?.title ||
                  "Unknown Project"}

              </span>

            </p>

          </div>


          {/* =================================================
              DESCRIPTION
          ================================================= */}

          <div className="py-6">

            <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-400">
              Description
            </h2>


            <div className="mt-3 rounded-xl bg-slate-50 p-5">

              <p className="whitespace-pre-wrap leading-7 text-slate-700">

                {task.description ||
                  "No description provided."}

              </p>

            </div>

          </div>


          {/* =================================================
              TASK DETAILS
          ================================================= */}

          <div className="border-t border-slate-100 pt-6">

            <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-slate-400">
              Task Details
            </h2>


            <div className="grid gap-4 sm:grid-cols-2">


              {/* STATUS */}

              <div className="rounded-xl bg-slate-50 p-4">

                <p className="text-xs text-slate-400">
                  Status
                </p>

                <p className="mt-1 font-semibold text-slate-900">

                  {getStatusLabel(
                    task.status
                  )}

                </p>

              </div>


              {/* PRIORITY */}

              <div className="rounded-xl bg-slate-50 p-4">

                <p className="text-xs text-slate-400">
                  Priority
                </p>

                <p className="mt-1 font-semibold text-slate-900">

                  {getPriorityLabel(
                    task.priority
                  )}

                </p>

              </div>


              {/* DUE DATE */}

              <div className="rounded-xl bg-slate-50 p-4">

                <p className="text-xs text-slate-400">
                  Due Date
                </p>

                <p className="mt-1 font-semibold text-slate-900">

                  {formatDate(
                    task.dueDate
                  )}

                </p>

              </div>


              {/* ASSIGNED TO */}

              <div className="rounded-xl bg-slate-50 p-4">

                <p className="text-xs text-slate-400">
                  Assigned To
                </p>

                <p className="mt-1 font-semibold text-slate-900">

                  {task.assignedTo?.name ||
                    task.assignedTo?.username ||
                    task.assignedTo?.email ||
                    "Unassigned"}

                </p>

              </div>


              {/* CREATED BY */}

              <div className="rounded-xl bg-slate-50 p-4">

                <p className="text-xs text-slate-400">
                  Created By
                </p>

                <p className="mt-1 font-semibold text-slate-900">

                  {task.createdBy?.name ||
                    task.createdBy?.username ||
                    task.createdBy?.email ||
                    "Unknown"}

                </p>

              </div>


              {/* CREATED DATE */}

              <div className="rounded-xl bg-slate-50 p-4">

                <p className="text-xs text-slate-400">
                  Created
                </p>

                <p className="mt-1 font-semibold text-slate-900">

                  {formatDate(
                    task.createdAt
                  )}

                </p>

              </div>


              {/* UPDATED DATE */}

              {task.updatedAt && (

                <div className="rounded-xl bg-slate-50 p-4">

                  <p className="text-xs text-slate-400">
                    Last Updated
                  </p>

                  <p className="mt-1 font-semibold text-slate-900">

                    {formatDate(
                      task.updatedAt
                    )}

                  </p>

                </div>

              )}

            </div>

          </div>


          {/* =================================================
              PROJECT ACTION
          ================================================= */}

          {task.project?._id && (

            <div className="mt-6 border-t border-slate-100 pt-6">

              <button
                type="button"
                onClick={() =>
                  navigate(
                    `/projects/${task.project._id}`
                  )
                }
                className="rounded-lg border border-slate-300 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
              >
                View Project
              </button>

            </div>

          )}

        </div>


        {/* =====================================================
            TASK COLUMN
        ===================================================== */}

        <div className="mt-8">

          <div className="mb-4">

            <h2 className="text-xl font-bold text-slate-900">
              Task Board
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Current task status and task actions.
            </p>

          </div>


          <div className="max-w-md">

            <TaskColumn
              title={getStatusLabel(task.status)}
              status={task.status}
              tasks={[task]}
              loading={false}
              error=""
              onStatusChange={
                handleStatusChange
              }
              onDelete={
                handleDelete
              }
            />

          </div>

        </div>


      </div>

    </div>

  );

};


export default TaskDetails;
