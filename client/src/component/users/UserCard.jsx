import React from "react";

// =====================================================
// USER CARD
// =====================================================
// Responsive user card
//
// Props:
// user       -> user object
// onView     -> view details callback
// onEdit     -> edit callback
// onDelete   -> delete callback
//
// Example:
// <UserCard
//   user={user}
//   onView={handleView}
//   onEdit={handleEdit}
//   onDelete={handleDelete}
// />
// =====================================================

const UserCard = ({
  user,
  onView,
  onEdit,
  onDelete,
}) => {

  // =====================================================
  // SAFETY
  // =====================================================

  if (!user) {
    return null;
  }


  // =====================================================
  // USER INFORMATION
  // =====================================================

  const userId =
    user?._id ||
    user?.id ||
    "";

  const name =
    user?.name ||
    user?.username ||
    "Unknown User";

  const email =
    user?.email ||
    "No email available";

  const phone =
    user?.phone ||
    user?.mobile ||
    "No phone available";

  const role =
    String(
      user?.role ||
      "USER"
    )
      .trim()
      .toUpperCase();

  const status =
    String(
      user?.status ||
      "ACTIVE"
    )
      .trim()
      .toUpperCase();


  // =====================================================
  // ROLE CLASS
  // =====================================================

  const getRoleClass = (role) => {

    switch (role) {

      case "OWNER":
        return "bg-purple-100 text-purple-700";

      case "ADMIN":
        return "bg-red-100 text-red-700";

      case "MANAGER":
        return "bg-blue-100 text-blue-700";

      case "MEMBER":
        return "bg-green-100 text-green-700";

      case "VIEWER":
        return "bg-yellow-100 text-yellow-700";

      case "USER":
        return "bg-slate-100 text-slate-700";

      default:
        return "bg-gray-100 text-gray-700";
    }
  };


  // =====================================================
  // STATUS CLASS
  // =====================================================

  const getStatusClass = (status) => {

    switch (status) {

      case "ACTIVE":
        return "bg-green-100 text-green-700";

      case "INACTIVE":
        return "bg-gray-100 text-gray-600";

      case "SUSPENDED":
        return "bg-orange-100 text-orange-700";

      case "BLOCKED":
        return "bg-red-100 text-red-700";

      default:
        return "bg-gray-100 text-gray-600";
    }
  };


  // =====================================================
  // INITIALS
  // =====================================================

  const getInitials = (value) => {

    if (!value) {
      return "U";
    }

    const words =
      String(value)
        .trim()
        .split(/\s+/);

    if (words.length >= 2) {

      return (
        words[0].charAt(0) +
        words[1].charAt(0)
      )
        .toUpperCase();
    }

    return words[0]
      .substring(0, 2)
      .toUpperCase();
  };


  // =====================================================
  // DATE FORMAT
  // =====================================================

  const formatDate = (date) => {

    if (!date) {
      return "Not available";
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
  // CREATED DATE
  // =====================================================

  const createdAt =
    formatDate(
      user?.createdAt
    );


  // =====================================================
  // LAST LOGIN
  // =====================================================

  const lastLogin =
    formatDate(
      user?.lastLogin ||
      user?.lastLoginAt
    );


  // =====================================================
  // HANDLE VIEW
  // =====================================================

  const handleView = () => {

    if (typeof onView === "function") {
      onView(user);
    }
  };


  // =====================================================
  // HANDLE EDIT
  // =====================================================

  const handleEdit = () => {

    if (typeof onEdit === "function") {
      onEdit(user);
    }
  };


  // =====================================================
  // HANDLE DELETE
  // =====================================================

  const handleDelete = () => {

    if (typeof onDelete === "function") {
      onDelete(user);
    }
  };


  // =====================================================
  // RENDER
  // =====================================================

  return (

    <div
      className="
        group
        rounded-2xl
        border
        border-slate-200
        bg-white
        p-5
        shadow-sm
        transition
        duration-200
        hover:-translate-y-0.5
        hover:shadow-md
      "
    >

      {/* =================================================
          HEADER
      ================================================= */}

      <div className="flex items-start justify-between gap-4">

        {/* USER */}
        <div className="flex min-w-0 items-center gap-3">

          {/* AVATAR */}

          <div
            className="
              flex
              h-12
              w-12
              shrink-0
              items-center
              justify-center
              rounded-full
              bg-slate-900
              text-sm
              font-bold
              text-white
            "
          >
            {getInitials(name)}
          </div>


          {/* NAME + EMAIL */}

          <div className="min-w-0">

            <h3
              className="
                truncate
                text-base
                font-semibold
                text-slate-900
              "
              title={name}
            >
              {name}
            </h3>

            <p
              className="
                truncate
                text-sm
                text-slate-500
              "
              title={email}
            >
              {email}
            </p>

          </div>

        </div>


        {/* STATUS */}

        <span
          className={`
            shrink-0
            rounded-full
            px-2.5
            py-1
            text-xs
            font-semibold
            ${getStatusClass(status)}
          `}
        >
          {status}
        </span>

      </div>


      {/* =================================================
          ROLE
      ================================================= */}

      <div className="mt-5 flex flex-wrap gap-2">

        <span
          className={`
            rounded-full
            px-3
            py-1
            text-xs
            font-semibold
            ${getRoleClass(role)}
          `}
        >
          {role}
        </span>


        {user?.department && (

          <span
            className="
              rounded-full
              bg-slate-100
              px-3
              py-1
              text-xs
              font-medium
              text-slate-600
            "
          >
            {user.department}
          </span>

        )}

      </div>


      {/* =================================================
          USER DETAILS
      ================================================= */}

      <div className="mt-5 space-y-3">

        {/* USER ID */}

        <div
          className="
            rounded-xl
            bg-slate-50
            p-3
          "
        >

          <p
            className="
              text-[11px]
              font-medium
              uppercase
              tracking-wide
              text-slate-400
            "
          >
            User ID
          </p>

          <p
            className="
              mt-1
              break-all
              font-mono
              text-xs
              text-slate-700
            "
            title={userId}
          >
            {userId || "Not available"}
          </p>

        </div>


        {/* PHONE */}

        <div className="flex items-center justify-between gap-4">

          <span className="text-xs text-slate-400">
            Phone
          </span>

          <span
            className="
              truncate
              text-sm
              font-medium
              text-slate-700
            "
          >
            {phone}
          </span>

        </div>


        {/* CREATED */}

        <div className="flex items-center justify-between gap-4">

          <span className="text-xs text-slate-400">
            Created
          </span>

          <span
            className="
              text-sm
              font-medium
              text-slate-700
            "
          >
            {createdAt}
          </span>

        </div>


        {/* LAST LOGIN */}

        {user?.lastLogin ||
        user?.lastLoginAt ? (

          <div
            className="
              flex
              items-center
              justify-between
              gap-4
            "
          >

            <span className="text-xs text-slate-400">
              Last Login
            </span>

            <span
              className="
                text-sm
                font-medium
                text-slate-700
              "
            >
              {lastLogin}
            </span>

          </div>

        ) : null}

      </div>


      {/* =================================================
          ACTIONS
      ================================================= */}

      <div
        className="
          mt-6
          grid
          grid-cols-3
          gap-2
          border-t
          border-slate-100
          pt-4
        "
      >

        {/* VIEW */}

        <button
          type="button"
          onClick={handleView}
          className="
            rounded-lg
            border
            border-slate-200
            bg-white
            px-3
            py-2
            text-xs
            font-semibold
            text-slate-700
            transition
            hover:bg-slate-50
            hover:text-slate-900
            focus:outline-none
            focus:ring-2
            focus:ring-slate-200
          "
        >
          View
        </button>


        {/* EDIT */}

        <button
          type="button"
          onClick={handleEdit}
          className="
            rounded-lg
            bg-slate-900
            px-3
            py-2
            text-xs
            font-semibold
            text-white
            transition
            hover:bg-slate-800
            focus:outline-none
            focus:ring-2
            focus:ring-slate-300
          "
        >
          Edit
        </button>


        {/* DELETE */}

        <button
          type="button"
          onClick={handleDelete}
          className="
            rounded-lg
            border
            border-red-200
            bg-red-50
            px-3
            py-2
            text-xs
            font-semibold
            text-red-600
            transition
            hover:bg-red-100
            focus:outline-none
            focus:ring-2
            focus:ring-red-200
          "
        >
          Delete
        </button>

      </div>

    </div>

  );
};


export default UserCard;