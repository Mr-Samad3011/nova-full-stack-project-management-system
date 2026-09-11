
import React from "react";


// =====================================================
// USER TABLE
// =====================================================

const UserTable = ({
  users = [],
  loading = false,
  onView,
  onEdit,
  onDelete,
  currentUser,
}) => {

  // =====================================================
  // ROLE CLASS
  // =====================================================

  const getRoleClass = (role) => {

    switch (
      String(role || "")
        .trim()
        .toUpperCase()
    ) {

      case "OWNER":
        return "bg-purple-100 text-purple-700";

      case "ADMIN":
        return "bg-red-100 text-red-700";

      case "MANAGER":
        return "bg-blue-100 text-blue-700";

      case "MEMBER":
        return "bg-green-100 text-green-700";

      case "VIEWER":
        return "bg-gray-100 text-gray-700";

      default:
        return "bg-gray-100 text-gray-600";
    }
  };


  // =====================================================
  // FORMAT DATE
  // =====================================================

  const formatDate = (date) => {

    if (!date) {
      return "—";
    }

    const parsedDate = new Date(date);

    if (
      Number.isNaN(
        parsedDate.getTime()
      )
    ) {
      return "—";
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
  // GET INITIAL
  // =====================================================

  const getInitial = (user) => {

    return (
      user?.name ||
      user?.email ||
      "U"
    )
      .charAt(0)
      .toUpperCase();
  };


  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {

    return (

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">

        <div className="flex min-h-60 items-center justify-center">

          <div className="text-center">

            <div className="mx-auto mb-4 h-9 w-9 animate-spin rounded-full border-4 border-slate-200 border-t-slate-900" />

            <p className="text-sm text-slate-500">
              Loading users...
            </p>

          </div>

        </div>

      </div>
    );
  }


  // =====================================================
  // EMPTY
  // =====================================================

  if (!users.length) {

    return (

      <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center">

        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-slate-100 text-2xl">
          👤
        </div>

        <h3 className="mt-4 text-lg font-semibold text-slate-900">
          No users found
        </h3>

        <p className="mt-2 text-sm text-slate-500">
          There are no users matching your search.
        </p>

      </div>
    );
  }


  // =====================================================
  // TABLE
  // =====================================================

  return (

    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

      {/* =================================================
          DESKTOP TABLE
      ================================================= */}

      <div className="hidden overflow-x-auto lg:block">

        <table className="w-full text-left">

          {/* =================================================
              TABLE HEADER
          ================================================= */}

          <thead className="border-b border-slate-200 bg-slate-50">

            <tr>

              <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-slate-500">
                User
              </th>

              <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-slate-500">
                User ID
              </th>

              <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-slate-500">
                Role
              </th>

              <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-slate-500">
                Phone
              </th>

              <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-slate-500">
                Created
              </th>

              <th className="px-5 py-4 text-right text-xs font-semibold uppercase tracking-wide text-slate-500">
                Actions
              </th>

            </tr>

          </thead>


          {/* =================================================
              TABLE BODY
          ================================================= */}

          <tbody className="divide-y divide-slate-100">

            {users.map((user) => {

              const isCurrentUser =
                String(user?._id) ===
                String(currentUser?._id);

              return (

                <tr
                  key={user?._id}
                  className="transition hover:bg-slate-50"
                >

                  {/* =================================================
                      USER
                  ================================================= */}

                  <td className="px-5 py-4">

                    <div className="flex items-center gap-3">

                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-slate-900 text-sm font-bold text-white">

                        {getInitial(user)}

                      </div>


                      <div className="min-w-0">

                        <div className="flex items-center gap-2">

                          <p className="truncate text-sm font-semibold text-slate-900">

                            {user?.name ||
                              "Unnamed User"}

                          </p>

                          {isCurrentUser && (

                            <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-semibold text-slate-500">
                              YOU
                            </span>

                          )}

                        </div>

                        <p className="max-w-55 truncate text-xs text-slate-500">

                          {user?.email ||
                            "No email"}

                        </p>

                      </div>

                    </div>

                  </td>


                  {/* =================================================
                      USER ID
                  ================================================= */}

                  <td className="px-5 py-4">

                    <p
                      title={user?._id}
                      className="max-w-32 truncate font-mono text-xs text-slate-500"
                    >
                      {user?._id || "—"}
                    </p>

                  </td>


                  {/* =================================================
                      ROLE
                  ================================================= */}

                  <td className="px-5 py-4">

                    <span
                      className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${getRoleClass(
                        user?.role
                      )}`}
                    >

                      {String(
                        user?.role ||
                        "UNKNOWN"
                      ).toUpperCase()}

                    </span>

                  </td>


                  {/* =================================================
                      PHONE
                  ================================================= */}

                  <td className="px-5 py-4">

                    <span className="text-sm text-slate-600">

                      {user?.phone ||
                        "—"}

                    </span>

                  </td>


                  {/* =================================================
                      CREATED
                  ================================================= */}

                  <td className="px-5 py-4">

                    <span className="text-sm text-slate-600">

                      {formatDate(
                        user?.createdAt
                      )}

                    </span>

                  </td>


                  {/* =================================================
                      ACTIONS
                  ================================================= */}

                  <td className="px-5 py-4">

                    <div className="flex justify-end gap-2">

                      {/* VIEW */}

                      <button
                        type="button"
                        onClick={() =>
                          onView?.(user)
                        }
                        className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 transition hover:bg-slate-50"
                      >
                        View
                      </button>


                      {/* EDIT */}

                      <button
                        type="button"
                        onClick={() =>
                          onEdit?.(user)
                        }
                        className="rounded-lg border border-blue-200 bg-blue-50 px-3 py-2 text-xs font-semibold text-blue-700 transition hover:bg-blue-100"
                      >
                        Edit
                      </button>


                      {/* DELETE */}

                      <button
                        type="button"
                        disabled={isCurrentUser}
                        onClick={() =>
                          onDelete?.(user)
                        }
                        title={
                          isCurrentUser
                            ? "You cannot delete your own account"
                            : "Delete user"
                        }
                        className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs font-semibold text-red-600 transition hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-40"
                      >
                        Delete
                      </button>

                    </div>

                  </td>

                </tr>

              );

            })}

          </tbody>

        </table>

      </div>


      {/* =================================================
          MOBILE / TABLET CARDS
      ================================================= */}

      <div className="divide-y divide-slate-100 lg:hidden">

        {users.map((user) => {

          const isCurrentUser =
            String(user?._id) ===
            String(currentUser?._id);

          return (

            <div
              key={user?._id}
              className="p-5"
            >

              {/* =================================================
                  USER HEADER
              ================================================= */}

              <div className="flex items-start justify-between gap-4">

                <div className="flex min-w-0 items-center gap-3">

                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-slate-900 text-sm font-bold text-white">

                    {getInitial(user)}

                  </div>


                  <div className="min-w-0">

                    <div className="flex flex-wrap items-center gap-2">

                      <h3 className="truncate text-sm font-semibold text-slate-900">

                        {user?.name ||
                          "Unnamed User"}

                      </h3>

                      {isCurrentUser && (

                        <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-semibold text-slate-500">
                          YOU
                        </span>

                      )}

                    </div>

                    <p className="truncate text-xs text-slate-500">

                      {user?.email ||
                        "No email"}

                    </p>

                  </div>

                </div>


                {/* ROLE */}

                <span
                  className={`shrink-0 rounded-full px-3 py-1 text-xs font-semibold ${getRoleClass(
                    user?.role
                  )}`}
                >

                  {String(
                    user?.role ||
                    "UNKNOWN"
                  ).toUpperCase()}

                </span>

              </div>


              {/* =================================================
                  USER INFORMATION
              ================================================= */}

              <div className="mt-5 grid grid-cols-2 gap-3">

                <div className="rounded-xl bg-slate-50 p-3">

                  <p className="text-[11px] font-medium text-slate-400">
                    User ID
                  </p>

                  <p
                    title={user?._id}
                    className="mt-1 truncate font-mono text-xs text-slate-700"
                  >
                    {user?._id || "—"}
                  </p>

                </div>


                <div className="rounded-xl bg-slate-50 p-3">

                  <p className="text-[11px] font-medium text-slate-400">
                    Phone
                  </p>

                  <p className="mt-1 truncate text-xs font-semibold text-slate-700">
                    {user?.phone || "—"}
                  </p>

                </div>


                <div className="rounded-xl bg-slate-50 p-3">

                  <p className="text-[11px] font-medium text-slate-400">
                    Created
                  </p>

                  <p className="mt-1 text-xs font-semibold text-slate-700">
                    {formatDate(
                      user?.createdAt
                    )}
                  </p>

                </div>

              </div>


              {/* =================================================
                  ACTIONS
              ================================================= */}

              <div className="mt-4 grid grid-cols-3 gap-2">

                <button
                  type="button"
                  onClick={() =>
                    onView?.(user)
                  }
                  className="rounded-lg border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                >
                  View
                </button>


                <button
                  type="button"
                  onClick={() =>
                    onEdit?.(user)
                  }
                  className="rounded-lg border border-blue-200 bg-blue-50 px-3 py-2 text-xs font-semibold text-blue-700 hover:bg-blue-100"
                >
                  Edit
                </button>


                <button
                  type="button"
                  disabled={isCurrentUser}
                  onClick={() =>
                    onDelete?.(user)
                  }
                  className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs font-semibold text-red-600 hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Delete
                </button>

              </div>

            </div>

          );

        })}

      </div>

    </div>

  );

};


export default UserTable;