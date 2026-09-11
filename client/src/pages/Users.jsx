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
  getUsers,
  updateUser,
  deleteUser,
} from "../services/userService";

import {
  useAuth,
} from "../context/AuthContext";

import UserTable from "../component/users/UserTable";
import EditUserModal from "../component/users/EditUserModal";


// =====================================================
// USERS PAGE
// ADMIN ONLY
// =====================================================

const Users = () => {

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
  // ADMIN CHECK
  // =====================================================
  // Only ADMIN can manage users.
  //
  // OWNER is NOT included here because you requested:
  // "admin login rahe tabhi users route kaam kare"
  // =====================================================

  const canManageUsers =
    currentUserRole === "ADMIN";


  // =====================================================
  // USERS STATE
  // =====================================================

  const [
    users,
    setUsers,
  ] = useState([]);


  // =====================================================
  // LOADING
  // =====================================================

  const [
    loading,
    setLoading,
  ] = useState(true);


  // =====================================================
  // ERROR
  // =====================================================

  const [
    error,
    setError,
  ] = useState("");


  // =====================================================
  // SEARCH
  // =====================================================

  const [
    search,
    setSearch,
  ] = useState("");


  // =====================================================
  // ROLE FILTER
  // =====================================================

  const [
    roleFilter,
    setRoleFilter,
  ] = useState("ALL");


  // =====================================================
  // EDIT USER
  // =====================================================

  const [
    editingUser,
    setEditingUser,
  ] = useState(null);


  // =====================================================
  // UPDATE FORM
  // =====================================================

  const [
    editForm,
    setEditForm,
  ] = useState({
    name: "",
    email: "",
    role: "MEMBER",
  });


  // =====================================================
  // UPDATING
  // =====================================================

  const [
    updating,
    setUpdating,
  ] = useState(false);


  // =====================================================
  // UPDATE ERROR
  // =====================================================

  const [
    updateError,
    setUpdateError,
  ] = useState("");


  // =====================================================
  // DELETE STATE
  // =====================================================

  const [
    deletingId,
    setDeletingId,
  ] = useState(null);


  // =====================================================
  // GET USER ID
  // =====================================================

  const getUserId = (user) => {

    return (
      user?._id ||
      user?.id ||
      ""
    );

  };


  // =====================================================
  // GET USER NAME
  // =====================================================

  const getUserName = (user) => {

    return (
      user?.name ||
      user?.username ||
      user?.email ||
      "Unknown User"
    );

  };


  // =====================================================
  // LOAD USERS
  // =====================================================

  const loadUsers = async () => {

    try {

      setLoading(true);
      setError("");

      const response =
        await getUsers();

      // -------------------------------------------------
      // SUPPORT DIFFERENT API RESPONSE STRUCTURES
      // -------------------------------------------------

      const userList =
        Array.isArray(response?.users)
          ? response.users
          : Array.isArray(response?.data?.users)
          ? response.data.users
          : Array.isArray(response?.data)
          ? response.data
          : Array.isArray(response)
          ? response
          : [];

      setUsers(userList);

    } catch (err) {

      console.error(
        "Users Load Error:",
        err
      );

      setError(
        err?.response?.data?.message ||
        err?.message ||
        "Unable to load users."
      );

    } finally {

      setLoading(false);

    }

  };


  // =====================================================
  // INITIAL LOAD
  // =====================================================

  useEffect(() => {

    if (!canManageUsers) {

      setLoading(false);

      return;

    }

    loadUsers();

  }, [canManageUsers]);


  // =====================================================
  // FILTER USERS
  // =====================================================

  const filteredUsers = useMemo(() => {

    const searchText =
      search
        .trim()
        .toLowerCase();


    return users.filter((user) => {

      const name =
        String(
          user?.name ||
          ""
        ).toLowerCase();


      const username =
        String(
          user?.username ||
          ""
        ).toLowerCase();


      const email =
        String(
          user?.email ||
          ""
        ).toLowerCase();


      const userId =
        String(
          getUserId(user)
        ).toLowerCase();


      const role =
        String(
          user?.role ||
          ""
        )
          .trim()
          .toUpperCase();


      // -------------------------------------------------
      // SEARCH
      // -------------------------------------------------

      const matchesSearch =
        !searchText ||
        name.includes(searchText) ||
        username.includes(searchText) ||
        email.includes(searchText) ||
        userId.includes(searchText);


      // -------------------------------------------------
      // ROLE
      // -------------------------------------------------

      const matchesRole =
        roleFilter === "ALL" ||
        role === roleFilter;


      return (
        matchesSearch &&
        matchesRole
      );

    });

  }, [
    users,
    search,
    roleFilter,
  ]);


  // =====================================================
  // OPEN EDIT MODAL
  // =====================================================

  const openEditModal = (user) => {

    setEditingUser(user);

    setUpdateError("");

    setEditForm({
      name:
        user?.name ||
        user?.username ||
        "",

      email:
        user?.email ||
        "",

      role:
        String(
          user?.role ||
          "MEMBER"
        )
          .trim()
          .toUpperCase(),
    });

  };


  // =====================================================
  // CLOSE EDIT MODAL
  // =====================================================

  const closeEditModal = () => {

    if (updating) {
      return;
    }

    setEditingUser(null);

    setUpdateError("");

  };


  // =====================================================
  // EDIT FORM CHANGE
  // =====================================================

  const handleEditChange = (event) => {

    const {
      name,
      value,
    } = event.target;


    setEditForm((previous) => ({
      ...previous,
      [name]: value,
    }));


    if (updateError) {
      setUpdateError("");
    }

  };


  // =====================================================
  // UPDATE USER
  // =====================================================

  const handleUpdateUser = async (event) => {

    event.preventDefault();


    if (!editingUser) {
      return;
    }


    const userId =
      getUserId(editingUser);


    if (!userId) {

      setUpdateError(
        "User ID is missing."
      );

      return;

    }


    if (!editForm.name.trim()) {

      setUpdateError(
        "Name is required."
      );

      return;

    }


    if (!editForm.email.trim()) {

      setUpdateError(
        "Email is required."
      );

      return;

    }


    try {

      setUpdating(true);

      setUpdateError("");


      const updateData = {

        name:
          editForm.name.trim(),

        email:
          editForm.email.trim(),

        role:
          editForm.role,

      };


      const response =
        await updateUser(
          userId,
          updateData
        );


      console.log(
        "User Updated:",
        response
      );


      // -------------------------------------------------
      // UPDATE LOCAL STATE
      // -------------------------------------------------
      // No need to reload the complete list.
      // -------------------------------------------------

      const updatedUser =
        response?.user ||
        response?.data?.user ||
        response?.data;


      if (updatedUser) {

        setUsers((previous) =>
          previous.map((user) => {

            const currentId =
              getUserId(user);

            return String(currentId) ===
              String(userId)
              ? {
                  ...user,
                  ...updatedUser,
                }
              : user;

          })
        );

      } else {

        // ------------------------------------------------
        // FALLBACK
        // ------------------------------------------------

        await loadUsers();

      }


      closeEditModal();

    } catch (err) {

      console.error(
        "Update User Error:",
        err
      );


      setUpdateError(
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

  const handleDeleteUser = async (user) => {

    const userId =
      getUserId(user);


    if (!userId) {

      alert(
        "User ID is missing."
      );

      return;

    }


    // -------------------------------------------------
    // PREVENT SELF DELETE
    // -------------------------------------------------

    const currentUserId =
      getUserId(currentUser);


    if (
      String(currentUserId) ===
      String(userId)
    ) {

      alert(
        "You cannot delete your own account."
      );

      return;

    }


    // -------------------------------------------------
    // CONFIRMATION
    // -------------------------------------------------

    const confirmed =
      window.confirm(
        `Are you sure you want to delete ${getUserName(
          user
        )}?`
      );


    if (!confirmed) {
      return;
    }


    try {

      setDeletingId(userId);


      await deleteUser(
        userId
      );


      // -------------------------------------------------
      // REMOVE FROM UI
      // -------------------------------------------------

      setUsers((previous) =>
        previous.filter(
          (item) =>
            String(
              getUserId(item)
            ) !==
            String(userId)
        )
      );

    } catch (err) {

      console.error(
        "Delete User Error:",
        err
      );


      alert(
        err?.response?.data?.message ||
        err?.message ||
        "Unable to delete user."
      );

    } finally {

      setDeletingId(null);

    }

  };


  // =====================================================
  // VIEW USER DETAILS
  // =====================================================

  const handleViewUser = (user) => {

    const userId =
      getUserId(user);


    if (!userId) {
      return;
    }


    navigate(
      `/users/${userId}`
    );

  };


  // =====================================================
  // ACCESS DENIED
  // =====================================================

  if (!canManageUsers) {

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
            Only administrators can manage users.
          </p>


          <p className="mt-3 text-xs text-slate-400">

            Current role:{" "}

            <span className="font-semibold text-slate-700">
              {currentUserRole || "UNKNOWN"}
            </span>

          </p>


          <button
            type="button"
            onClick={() =>
              navigate("/dashboard")
            }
            className="mt-6 rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white hover:bg-slate-800"
          >
            Back to Dashboard
          </button>

        </div>

      </div>

    );

  }


  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {

    return (

      <div className="flex min-h-screen items-center justify-center bg-slate-50">

        <div className="text-center">

          <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-slate-900" />

          <p className="text-sm text-slate-500">
            Loading users...
          </p>

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

        <div className="mb-8">

          <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">

            <div>

              <div className="flex items-center gap-3">

                <h1 className="text-3xl font-bold text-slate-900">
                  User Management
                </h1>


                <span className="rounded-full bg-red-100 px-3 py-1 text-xs font-semibold text-red-700">
                  ADMIN
                </span>

              </div>


              <p className="mt-1 text-slate-500">
                Manage users, roles, accounts and access.
              </p>

            </div>


            <div className="rounded-xl bg-white px-5 py-3 shadow-sm">

              <p className="text-xs text-slate-400">
                Total Users
              </p>


              <p className="text-2xl font-bold text-slate-900">
                {users.length}
              </p>

            </div>

          </div>

        </div>


        {/* =================================================
            ERROR
        ================================================= */}

        {error && (

          <div className="mb-6 rounded-xl border border-red-200 bg-red-50 p-4">

            <p className="text-sm font-medium text-red-700">
              {error}
            </p>


            <button
              type="button"
              onClick={loadUsers}
              className="mt-3 rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700"
            >
              Try Again
            </button>

          </div>

        )}


        {/* =================================================
            FILTERS
        ================================================= */}

        <div className="mb-6 rounded-2xl bg-white p-5 shadow-sm">

          <div className="grid gap-4 md:grid-cols-2">


            {/* SEARCH */}

            <div>

              <label
                htmlFor="user-search"
                className="mb-2 block text-sm font-medium text-slate-700"
              >
                Search Users
              </label>


              <input
                id="user-search"
                type="text"
                value={search}
                onChange={(event) =>
                  setSearch(
                    event.target.value
                  )
                }
                placeholder="Name, username, email or User ID..."
                className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
              />

            </div>


            {/* ROLE */}

            <div>

              <label
                htmlFor="role-filter"
                className="mb-2 block text-sm font-medium text-slate-700"
              >
                Role
              </label>


              <select
                id="role-filter"
                value={roleFilter}
                onChange={(event) =>
                  setRoleFilter(
                    event.target.value
                  )
                }
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
              >

                <option value="ALL">
                  All Roles
                </option>

                <option value="OWNER">
                  Owner
                </option>

                <option value="ADMIN">
                  Admin
                </option>

                <option value="MANAGER">
                  Manager
                </option>

                <option value="MEMBER">
                  Member
                </option>

                <option value="VIEWER">
                  Viewer
                </option>

              </select>

            </div>

          </div>

        </div>


        {/* =================================================
            USER COUNT
        ================================================= */}

        <div className="mb-4">

          <p className="text-sm text-slate-500">

            Showing{" "}

            <span className="font-semibold text-slate-900">
              {filteredUsers.length}
            </span>

            {" "}of{" "}

            <span className="font-semibold text-slate-900">
              {users.length}
            </span>

            {" "}users

          </p>

        </div>


        {/* =================================================
            USER TABLE COMPONENT
        ================================================= */}

        <UserTable
          users={filteredUsers}
          currentUser={currentUser}
          deletingId={deletingId}
          onEdit={openEditModal}
          onDelete={handleDeleteUser}
          onView={handleViewUser}
        />

      </div>


      {/* =================================================
          EDIT USER MODAL
      ================================================= */}

      {editingUser && (

        <EditUserModal
          user={editingUser}
          form={editForm}
          updating={updating}
          error={updateError}
          onChange={handleEditChange}
          onSubmit={handleUpdateUser}
          onClose={closeEditModal}
          getUserId={getUserId}
        />

      )}

    </div>

  );

};


export default Users;
