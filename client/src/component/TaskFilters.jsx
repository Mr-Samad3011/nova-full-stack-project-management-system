
// eslint-disable-next-line no-unused-vars
import React from "react";


// =====================================================
// TASK FILTERS
// =====================================================

const TaskFilters = ({
  search,
  setSearch,

  statusFilter,
  setStatusFilter,

  priorityFilter,
  setPriorityFilter,

  projectFilter,
  setProjectFilter,

  sortBy,
  setSortBy,

  projects = [],

  onClear,
}) => {

  const hasFilters =
    search.trim() !== "" ||
    statusFilter !== "ALL" ||
    priorityFilter !== "ALL" ||
    projectFilter !== "ALL" ||
    sortBy !== "NEWEST";


  return (
    <div className="mb-6 rounded-2xl bg-white p-5 shadow-sm">

      {/* =================================================
          FILTER GRID
      ================================================= */}

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">


        {/* =================================================
            SEARCH
        ================================================= */}

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
              setSearch(e.target.value)
            }
            placeholder="Search tasks, projects, users..."
            className="w-full rounded-lg border border-slate-200 px-4 py-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
          />

        </div>


        {/* =================================================
            STATUS
        ================================================= */}

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
              setStatusFilter(e.target.value)
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


        {/* =================================================
            PRIORITY
        ================================================= */}

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
              setPriorityFilter(e.target.value)
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


        {/* =================================================
            PROJECT
        ================================================= */}

        <div>

          <label
            htmlFor="task-project"
            className="mb-2 block text-sm font-medium text-slate-700"
          >
            Project
          </label>

          <select
            id="task-project"
            value={projectFilter}
            onChange={(e) =>
              setProjectFilter(e.target.value)
            }
            className="w-full rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
          >

            <option value="ALL">
              All Projects
            </option>

            {projects.map((project) => (

              <option
                key={project._id}
                value={project._id}
              >
                {project.name}
              </option>

            ))}

          </select>

        </div>

      </div>


      {/* =================================================
          SORT
      ================================================= */}

      <div className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">

        <div className="w-full sm:max-w-xs">

          <label
            htmlFor="task-sort"
            className="mb-2 block text-sm font-medium text-slate-700"
          >
            Sort By
          </label>

          <select
            id="task-sort"
            value={sortBy}
            onChange={(e) =>
              setSortBy(e.target.value)
            }
            className="w-full rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
          >

            <option value="NEWEST">
              Newest First
            </option>

            <option value="OLDEST">
              Oldest First
            </option>

            <option value="TITLE_ASC">
              Title A → Z
            </option>

            <option value="TITLE_DESC">
              Title Z → A
            </option>

            <option value="DUE_DATE">
              Due Date
            </option>

          </select>

        </div>


        {/* =================================================
            CLEAR FILTERS
        ================================================= */}

        {hasFilters && (

          <button
            type="button"
            onClick={onClear}
            className="rounded-lg px-4 py-2.5 text-sm font-medium text-slate-600 transition hover:bg-slate-100 hover:text-slate-900"
          >
            Clear Filters
          </button>

        )}

      </div>

    </div>
  );
};


export default TaskFilters;
