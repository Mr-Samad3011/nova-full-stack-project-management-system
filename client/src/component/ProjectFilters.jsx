/* eslint-disable no-unused-vars */

import React from "react";


// =====================================================
// PROJECT FILTERS
// =====================================================

const ProjectFilters = ({
  search,
  setSearch,

  statusFilter,
  setStatusFilter,

  priorityFilter,
  setPriorityFilter,

  sortBy,
  setSortBy,

  onClear,
}) => {

  const hasFilters =
    search.trim() !== "" ||
    statusFilter !== "ALL" ||
    priorityFilter !== "ALL" ||
    sortBy !== "NEWEST";


  return (
    <div className="mb-6 rounded-2xl bg-white p-5 shadow-sm">

      {/* =================================================
          FILTER GRID
      ================================================= */}

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">


        {/* =================================================
            SEARCH
        ================================================= */}

        <div>

          <label
            htmlFor="project-search"
            className="mb-2 block text-sm font-medium text-slate-700"
          >
            Search
          </label>

          <input
            id="project-search"
            type="text"
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
            placeholder="Search projects..."
            className="w-full rounded-lg border border-slate-200 px-4 py-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
          />

        </div>


        {/* =================================================
            STATUS
        ================================================= */}

        <div>

          <label
            htmlFor="project-status"
            className="mb-2 block text-sm font-medium text-slate-700"
          >
            Status
          </label>

          <select
            id="project-status"
            value={statusFilter}
            onChange={(e) =>
              setStatusFilter(e.target.value)
            }
            className="w-full rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
          >

            <option value="ALL">
              All Status
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


        {/* =================================================
            PRIORITY
        ================================================= */}

        <div>

          <label
            htmlFor="project-priority"
            className="mb-2 block text-sm font-medium text-slate-700"
          >
            Priority
          </label>

          <select
            id="project-priority"
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
            SORT
        ================================================= */}

        <div>

          <label
            htmlFor="project-sort"
            className="mb-2 block text-sm font-medium text-slate-700"
          >
            Sort By
          </label>

          <select
            id="project-sort"
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

            <option value="NAME_ASC">
              Name A → Z
            </option>

            <option value="NAME_DESC">
              Name Z → A
            </option>

            <option value="DUE_DATE">
              Due Date
            </option>

          </select>

        </div>

      </div>


      {/* =================================================
          BOTTOM ACTIONS
      ================================================= */}

      {hasFilters && (

        <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-4">

          <p className="text-xs text-slate-500">
            Filters are currently active
          </p>

          <button
            type="button"
            onClick={onClear}
            className="rounded-lg px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-100 hover:text-slate-900"
          >
            Clear Filters
          </button>

        </div>

      )}

    </div>
  );
};


export default ProjectFilters;
