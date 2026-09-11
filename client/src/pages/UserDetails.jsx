
import {
  useEffect,
  useState,
} from "react";

import {
  useNavigate,
  useParams,
} from "react-router-dom";

import {
  getUserById,
  updateUser,
  deleteUser,
  USER_ROLES,
} from "../services/userService";

import {
  useAuth,
} from "../context/AuthContext";


// =====================================================
// USER DETAILS
// =====================================================

const UserDetails = () => {

  const navigate = useNavigate();

  const { id } = useParams();

  const {
    user: currentUser,
  } = useAuth();


  // =====================================================
  // CURRENT USER ROLE
  // =====================================================

  const currentUserRole =
    String(
      currentUser?.role || ""
    )
      .trim()
      .toUpperCase();


  // =====================================================
  // ADMIN / OWNER CHECK
  // =====================================================

  const isAdmin =
    ["OWNER", "ADMIN"].includes(
      currentUserRole
    );


  // =====================================================
  // STATE
  // =====================================================

  const [
    user,
    setUser,
  ] = useState(null);

  const [
    loading,
    setLoading,
  ] = useState(true);

  const [
    error,
    setError,
  ] = useState("");

  const [
    updating,
    setUpdating,
  ] = useState(false);

  const [
    deleting,
    setDeleting,
  ] = useState(false);

  const [
    successMessage,
    setSuccessMessage,
  ] = useState("");

  const [
    editMode,
    setEditMode,
  ] = useState(false);


  // =====================================================
  // EDIT FORM
  // =====================================================

  const [
    formData,
    setFormData,
  ] = useState({
    name: "",
    username: "",
    email: "",
    phone: "",
    role: "MEMBER",
  });


  // =====================================================
  // LOAD USER
  // =====================================================

  useEffect(() => {

    const loadUser = async () => {

      try {

        setLoading(true);

        setError("");

        const response =
          await getUserById(id);


        const userData =
          response?.user ||
          response?.data?.user ||
          response?.data ||
          response;


        if (!userData) {
          throw new Error(
            "User not found."
          );
        }


        setUser(userData);


        // =================================================
        // SET FORM
        // =================================================

        setFormData({
          name:
            userData?.name || "",

          username:
            userData?.username || "",

          email:
            userData?.email || "",

          phone:
            userData?.phone || "",

          role:
            String(
              userData?.role ||
              "MEMBER"
            ).toUpperCase(),
        });

      } catch (err) {

        console.error(
          "User Details Error:",
          err
        );

        setError(
          err?.response?.data?.message ||
          err?.message ||
          "Unable to load user details."
        );

      } finally {

        setLoading(false);

      }

    };


    if (id) {
      loadUser();
    }

  }, [id]);


  // =====================================================
  // HANDLE CHANGE
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


    setError("");

    setSuccessMessage("");

  };


  // =====================================================
  // UPDATE USER
  // =====================================================

  const handleUpdate = async (event) => {

    event.preventDefault();


    if (!isAdmin) {

      setError(
        "You do not have permission to update users."
      );

      return;
    }


    if (!user) {
      return;
    }


    const userId =
      user?._id;


    if (!userId) {

      setError(
        "User ID is missing."
      );

      return;
    }


    // =================================================
    // VALIDATION
    // =================================================

    if (!formData.name.trim()) {

      setError(
        "Name is required."
      );

      return;
    }


    if (!formData.username.trim()) {

      setError(
        "Username is required."
      );

      return;
    }


    if (!formData.email.trim()) {

      setError(
        "Email is required."
      );

      return;
    }


    if (!formData.phone.trim()) {

      setError(
        "Phone number is required."
      );

      return;
    }


    if (!formData.role) {

      setError(
        "Role is required."
      );

      return;
    }


    try {

      setUpdating(true);

      setError("");

      setSuccessMessage("");


      // =================================================
      // UPDATE DATA
      // =================================================

      const updateData = {

        name:
          formData.name.trim(),

        username:
          formData.username.trim().toLowerCase(),

        email:
          formData.email.trim().toLowerCase(),

        phone:
          formData.phone.trim(),

        role:
          String(
            formData.role
          )
            .trim()
            .toUpperCase(),
      };


      console.log(
        "Sending Update Data:",
        updateData
      );


      const response =
        await updateUser(
          userId,
          updateData
        );


      console.log(
        "Update API Response:",
        response
      );


      // =================================================
      // GET UPDATED USER FROM BACKEND
      // =================================================

      const updatedUser =
        response?.user ||
        response?.data?.user ||
        response?.data ||
        null;


      if (updatedUser) {

        setUser(updatedUser);

        setFormData({
          name:
            updatedUser?.name || "",

          username:
            updatedUser?.username || "",

          email:
            updatedUser?.email || "",

          phone:
            updatedUser?.phone || "",

          role:
            String(
              updatedUser?.role ||
              "MEMBER"
            ).toUpperCase(),
        });

      } else {

        // =================================================
        // FALLBACK
        // =================================================

        setUser(
          (previous) => ({
            ...previous,
            ...updateData,
          })
        );

      }


      // =================================================
      // SUCCESS
      // =================================================

      setSuccessMessage(
        response?.message ||
        "User updated successfully."
      );


      setEditMode(false);


      // =================================================
      // OPTIONAL: RELOAD FROM DATABASE
      // =================================================
      // This confirms that MongoDB actually contains
      // the updated values.
      // =================================================

      const freshResponse =
        await getUserById(userId);

      const freshUser =
        freshResponse?.user ||
        freshResponse?.data?.user ||
        freshResponse?.data ||
        freshResponse;


      if (freshUser) {

        setUser(freshUser);

        setFormData({
          name:
            freshUser?.name || "",

          username:
            freshUser?.username || "",

          email:
            freshUser?.email || "",

          phone:
            freshUser?.phone || "",

          role:
            String(
              freshUser?.role ||
              "MEMBER"
            ).toUpperCase(),
        });

      }

    } catch (err) {

      console.error(
        "Update User Error:",
        err
      );

      setError(
        err?.response?.data?.message ||
        err?.message ||
        "Unable to update user."
      );

    } finally {

      setUpdating(false);

    }

  };


  // =====================================================
  // DELETE USER
  // =====================================================

  const handleDelete = async () => {

    if (!isAdmin) {

      setError(
        "You do not have permission to delete users."
      );

      return;
    }


    if (!user?._id) {

      setError(
        "User ID is missing."
      );

      return;
    }


    if (
      String(user._id) ===
      String(currentUser?._id)
    ) {

      setError(
        "You cannot delete your own account."
      );

      return;
    }


    const confirmed =
      window.confirm(
        `Are you sure you want to delete ${
          user?.name ||
          user?.username ||
          user?.email ||
          "this user"
        }?`
      );


    if (!confirmed) {
      return;
    }


    try {

      setDeleting(true);

      setError("");


      await deleteUser(
        user._id
      );


      navigate(
        "/users",
        {
          replace: true,
        }
      );

    } catch (err) {

      console.error(
        "Delete User Error:",
        err
      );


      setError(
        err?.response?.data?.message ||
        err?.message ||
        "Unable to delete user."
      );

    } finally {

      setDeleting(false);

    }

  };


  // =====================================================
  // CANCEL EDIT
  // =====================================================

  const cancelEdit = () => {

    setFormData({

      name:
        user?.name || "",

      username:
        user?.username || "",

      email:
        user?.email || "",

      phone:
        user?.phone || "",

      role:
        String(
          user?.role ||
          "MEMBER"
        ).toUpperCase(),

    });


    setEditMode(false);

    setError("");

    setSuccessMessage("");

  };


  // =====================================================
  // ROLE CLASS
  // =====================================================

  const getRoleClass = (role) => {

    switch (
      String(role || "")
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
  // USER NAME
  // =====================================================

  const getUserName = () => {

    return (
      user?.name ||
      user?.username ||
      user?.email ||
      "Unknown User"
    );

  };


  // =====================================================
  // INITIAL
  // =====================================================

  const getUserInitial = () => {

    return getUserName()
      .charAt(0)
      .toUpperCase();

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
            Loading user...
          </p>

        </div>

      </div>

    );

  }


  // =====================================================
  // ERROR / NOT FOUND
  // =====================================================

  if (error && !user) {

    return (

      <div className="flex min-h-screen items-center justify-center bg-slate-50 p-6">

        <div className="w-full max-w-md rounded-2xl bg-white p-8 text-center shadow-sm">

          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-red-100 text-2xl font-bold text-red-600">
            !
          </div>

          <h2 className="mt-4 text-xl font-semibold text-slate-900">
            Unable to load user
          </h2>

          <p className="mt-2 text-sm text-red-600">
            {error}
          </p>

          <button
            type="button"
            onClick={() =>
              navigate("/users")
            }
            className="mt-6 rounded-lg bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white hover:bg-slate-800"
          >
            Back to Users
          </button>

        </div>

      </div>

    );

  }


  // =====================================================
  // MAIN
  // =====================================================

  return (

    <div className="min-h-screen bg-slate-50 p-6">

      <div className="mx-auto max-w-5xl">

        {/* =================================================
            HEADER
        ================================================= */}

        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

          <div>

            <button
              type="button"
              onClick={() =>
                navigate("/users")
              }
              className="mb-3 text-sm font-medium text-slate-500 hover:text-slate-900"
            >
              ← Back to Users
            </button>


            <div className="flex flex-wrap items-center gap-3">

              <h1 className="text-3xl font-bold text-slate-900">
                User Details
              </h1>


              <span
                className={`rounded-full px-3 py-1 text-xs font-semibold ${getRoleClass(
                  user?.role
                )}`}
              >
                {String(
                  user?.role ||
                  "UNKNOWN"
                ).toUpperCase()}
              </span>

            </div>


            <p className="mt-1 text-slate-500">
              View and manage user information.
            </p>

          </div>


          {/* =================================================
              ADMIN ACTIONS
          ================================================= */}

          {isAdmin && (

            <div className="flex flex-wrap gap-3">

              {!editMode && (

                <button
                  type="button"
                  onClick={() => {
                    setEditMode(true);
                    setError("");
                    setSuccessMessage("");
                  }}
                  className="rounded-lg bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white hover:bg-slate-800"
                >
                  Edit User
                </button>

              )}


              <button
                type="button"
                onClick={handleDelete}
                disabled={
                  deleting ||
                  String(user?._id) ===
                    String(currentUser?._id)
                }
                className="rounded-lg border border-red-200 bg-white px-5 py-2.5 text-sm font-semibold text-red-600 hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {deleting
                  ? "Deleting..."
                  : "Delete User"}
              </button>

            </div>

          )}

        </div>


        {/* =================================================
            ERROR
        ================================================= */}

        {error && (

          <div className="mb-5 rounded-xl border border-red-200 bg-red-50 p-4">

            <p className="text-sm font-medium text-red-700">
              {error}
            </p>

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

          </div>

        )}


        {/* =================================================
            PROFILE CARD
        ================================================= */}

        <div className="mb-6 rounded-2xl bg-white p-6 shadow-sm sm:p-8">

          <div className="flex flex-col gap-5 sm:flex-row sm:items-center">

            {user?.avatar ? (

              <img
                src={user.avatar}
                alt={getUserName()}
                className="h-20 w-20 shrink-0 rounded-full object-cover"
              />

            ) : (

              <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full bg-slate-900 text-2xl font-bold text-white">
                {getUserInitial()}
              </div>

            )}


            <div className="min-w-0">

              <h2 className="text-2xl font-bold text-slate-900">
                {getUserName()}
              </h2>


              <p className="mt-1 text-sm text-slate-500">
                @{user?.username || "unknown"}
              </p>


              <p className="mt-1 text-sm text-slate-500">
                {user?.email || "No email"}
              </p>


              <p className="mt-1 text-sm text-slate-500">
                {user?.phone || "No phone"}
              </p>


              <p className="mt-2 break-all text-xs text-slate-400">
                ID: {user?._id}
              </p>

            </div>

          </div>

        </div>


        {/* =================================================
            EDIT FORM
        ================================================= */}

        {editMode ? (

          <form
            onSubmit={handleUpdate}
            className="rounded-2xl bg-white p-6 shadow-sm sm:p-8"
          >

            <div className="mb-6">

              <h2 className="text-xl font-semibold text-slate-900">
                Edit User
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Update the user's account information and role.
              </p>

            </div>


            <div className="grid gap-5 md:grid-cols-2">


              {/* =================================================
                  NAME
              ================================================= */}

              <div>

                <label
                  htmlFor="user-name"
                  className="mb-2 block text-sm font-medium text-slate-700"
                >
                  Name
                </label>

                <input
                  id="user-name"
                  name="name"
                  type="text"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  minLength={2}
                  maxLength={50}
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
                />

              </div>


              {/* =================================================
                  USERNAME
              ================================================= */}

              <div>

                <label
                  htmlFor="user-username"
                  className="mb-2 block text-sm font-medium text-slate-700"
                >
                  Username
                </label>

                <input
                  id="user-username"
                  name="username"
                  type="text"
                  value={formData.username}
                  onChange={handleChange}
                  required
                  minLength={3}
                  maxLength={30}
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
                />

              </div>


              {/* =================================================
                  EMAIL
              ================================================= */}

              <div>

                <label
                  htmlFor="user-email"
                  className="mb-2 block text-sm font-medium text-slate-700"
                >
                  Email
                </label>

                <input
                  id="user-email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
                />

              </div>


              {/* =================================================
                  PHONE
              ================================================= */}

              <div>

                <label
                  htmlFor="user-phone"
                  className="mb-2 block text-sm font-medium text-slate-700"
                >
                  Phone
                </label>

                <input
                  id="user-phone"
                  name="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  maxLength={20}
                  placeholder="Enter phone number"
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
                />

              </div>


              {/* =================================================
                  ROLE
              ================================================= */}

              <div>

                <label
                  htmlFor="user-role"
                  className="mb-2 block text-sm font-medium text-slate-700"
                >
                  Role
                </label>

                <select
                  id="user-role"
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  required
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
                >

                  {Object.values(
                    USER_ROLES
                  ).map((role) => (

                    <option
                      key={role}
                      value={role}
                    >
                      {role}
                    </option>

                  ))}

                </select>

              </div>

            </div>


            {/* =================================================
                USER ID
            ================================================= */}

            <div className="mt-5">

              <label className="mb-2 block text-sm font-medium text-slate-700">
                User ID
              </label>

              <code className="block break-all rounded-xl bg-slate-100 px-4 py-3 text-xs text-slate-600">
                {user?._id || "Not available"}
              </code>

              <p className="mt-1 text-xs text-slate-400">
                User ID cannot be changed.
              </p>

            </div>


            {/* =================================================
                FORM ACTIONS
            ================================================= */}

            <div className="mt-6 flex justify-end gap-3 border-t border-slate-100 pt-6">

              <button
                type="button"
                onClick={cancelEdit}
                disabled={updating}
                className="rounded-xl border border-slate-200 px-5 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-50"
              >
                Cancel
              </button>


              <button
                type="submit"
                disabled={updating}
                className="rounded-xl bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {updating
                  ? "Saving..."
                  : "Save Changes"}
              </button>

            </div>

          </form>

        ) : (

          /* =================================================
             USER INFORMATION
          ================================================= */

          <div className="grid gap-6 lg:grid-cols-2">


            {/* =================================================
                BASIC INFORMATION
            ================================================= */}

            <div className="rounded-2xl bg-white p-6 shadow-sm">

              <h2 className="mb-5 text-lg font-semibold text-slate-900">
                Basic Information
              </h2>


              <div className="space-y-5">


                {/* NAME */}

                <div>

                  <p className="text-xs text-slate-400">
                    Full Name
                  </p>

                  <p className="mt-1 text-sm font-semibold text-slate-800">
                    {user?.name || "Not provided"}
                  </p>

                </div>


                {/* USERNAME */}

                <div>

                  <p className="text-xs text-slate-400">
                    Username
                  </p>

                  <p className="mt-1 text-sm font-semibold text-slate-800">
                    {user?.username || "Not provided"}
                  </p>

                </div>


                {/* EMAIL */}

                <div>

                  <p className="text-xs text-slate-400">
                    Email
                  </p>

                  <p className="mt-1 break-all text-sm font-semibold text-slate-800">
                    {user?.email || "Not provided"}
                  </p>

                </div>


                {/* PHONE */}

                <div>

                  <p className="text-xs text-slate-400">
                    Phone
                  </p>

                  <p className="mt-1 text-sm font-semibold text-slate-800">
                    {user?.phone || "Not provided"}
                  </p>

                </div>

              </div>

            </div>


            {/* =================================================
                ACCOUNT INFORMATION
            ================================================= */}

            <div className="rounded-2xl bg-white p-6 shadow-sm">

              <h2 className="mb-5 text-lg font-semibold text-slate-900">
                Account Information
              </h2>


              <div className="space-y-5">


                {/* USER ID */}

                <div>

                  <p className="text-xs text-slate-400">
                    User ID
                  </p>

                  <p className="mt-1 break-all text-sm font-semibold text-slate-800">
                    {user?._id || "Not available"}
                  </p>

                </div>


                {/* ROLE */}

                <div>

                  <p className="text-xs text-slate-400">
                    Role
                  </p>

                  <span
                    className={`mt-1 inline-block rounded-full px-3 py-1 text-xs font-semibold ${getRoleClass(
                      user?.role
                    )}`}
                  >
                    {String(
                      user?.role ||
                      "UNKNOWN"
                    ).toUpperCase()}
                  </span>

                </div>


                {/* CREATED */}

                <div>

                  <p className="text-xs text-slate-400">
                    Created At
                  </p>

                  <p className="mt-1 text-sm font-semibold text-slate-800">
                    {formatDate(
                      user?.createdAt
                    )}
                  </p>

                </div>


                {/* UPDATED */}

                <div>

                  <p className="text-xs text-slate-400">
                    Updated At
                  </p>

                  <p className="mt-1 text-sm font-semibold text-slate-800">
                    {formatDate(
                      user?.updatedAt
                    )}
                  </p>

                </div>

              </div>

            </div>

          </div>

        )}

      </div>

    </div>

  );

};


export default UserDetails;
