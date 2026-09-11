import React, {
  useEffect,
  useState,
} from "react";

// =====================================================
// EDIT USER MODAL
// =====================================================
//
// Props:
//
// isOpen   -> modal open/close
// user     -> selected user
// onClose  -> close modal
// onSave   -> receive updated user data
// loading  -> save loading state
//
// Example:
//
// <EditUserModal
//   isOpen={editModalOpen}
//   user={selectedUser}
//   onClose={() => setEditModalOpen(false)}
//   onSave={handleSaveUser}
//   loading={saving}
// />
//
// =====================================================

const EditUserModal = ({
  isOpen = false,
  user = null,
  onClose,
  onSave,
  loading = false,
}) => {

  // =====================================================
  // FORM STATE
  // =====================================================

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    role: "MEMBER",
    status: "ACTIVE",
  });


  // =====================================================
  // ERROR
  // =====================================================

  const [error, setError] = useState("");


  // =====================================================
  // LOAD USER INTO FORM
  // =====================================================

  useEffect(() => {

    if (!user) {
      return;
    }

    setFormData({
      name:
        user?.name ||
        user?.username ||
        "",

      email:
        user?.email ||
        "",

      phone:
        user?.phone ||
        user?.mobile ||
        "",

      role:
        String(
          user?.role ||
          "MEMBER"
        )
          .trim()
          .toUpperCase(),

      status:
        String(
          user?.status ||
          "ACTIVE"
        )
          .trim()
          .toUpperCase(),
    });

    setError("");

  }, [user]);


  // =====================================================
  // CLOSE MODAL
  // =====================================================

  const handleClose = () => {

    if (loading) {
      return;
    }

    setError("");

    if (typeof onClose === "function") {
      onClose();
    }
  };


  // =====================================================
  // HANDLE CHANGE
  // =====================================================

  const handleChange = (event) => {

    const {
      name,
      value,
    } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));

    if (error) {
      setError("");
    }
  };


  // =====================================================
  // HANDLE SUBMIT
  // =====================================================

  const handleSubmit = async (event) => {

    event.preventDefault();

    // ---------------------------------------------------
    // USER CHECK
    // ---------------------------------------------------

    if (!user) {
      setError(
        "No user selected."
      );

      return;
    }


    // ---------------------------------------------------
    // NAME VALIDATION
    // ---------------------------------------------------

    if (!formData.name.trim()) {

      setError(
        "User name is required."
      );

      return;
    }


    // ---------------------------------------------------
    // EMAIL VALIDATION
    // ---------------------------------------------------

    if (!formData.email.trim()) {

      setError(
        "Email is required."
      );

      return;
    }


    // ---------------------------------------------------
    // BASIC EMAIL VALIDATION
    // ---------------------------------------------------

    const emailRegex =
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (
      !emailRegex.test(
        formData.email.trim()
      )
    ) {

      setError(
        "Please enter a valid email address."
      );

      return;
    }


    // ---------------------------------------------------
    // PHONE VALIDATION
    // ---------------------------------------------------

    if (formData.phone.trim()) {

      const phoneRegex =
        /^[0-9+\-\s()]{7,20}$/;

      if (
        !phoneRegex.test(
          formData.phone.trim()
        )
      ) {

        setError(
          "Please enter a valid phone number."
        );

        return;
      }
    }


    // ---------------------------------------------------
    // UPDATED DATA
    // ---------------------------------------------------

    const updatedUser = {

      ...user,

      name:
        formData.name.trim(),

      email:
        formData.email.trim(),

      phone:
        formData.phone.trim(),

      role:
        formData.role,

      status:
        formData.status,

    };


    // ---------------------------------------------------
    // SAVE
    // ---------------------------------------------------

    try {

      if (typeof onSave === "function") {

        await onSave(
          updatedUser
        );

      }

    } catch (saveError) {

      console.error(
        "Edit User Error:",
        saveError
      );

      setError(
        saveError?.message ||
        "Unable to update user."
      );
    }
  };


  // =====================================================
  // DON'T RENDER
  // =====================================================

  if (!isOpen || !user) {
    return null;
  }


  // =====================================================
  // USER ID
  // =====================================================

  const userId =
    user?._id ||
    user?.id ||
    "Not available";


  // =====================================================
  // RENDER
  // =====================================================

  return (

    <div
      className="
        fixed
        inset-0
        z-50
        flex
        items-center
        justify-center
        bg-slate-900/50
        p-4
        backdrop-blur-sm
      "
      onMouseDown={(event) => {

        if (
          event.target ===
          event.currentTarget
        ) {
          handleClose();
        }

      }}
    >

      {/* =================================================
          MODAL
      ================================================= */}

      <div
        className="
          max-h-[90vh]
          w-full
          max-w-2xl
          overflow-y-auto
          rounded-2xl
          bg-white
          shadow-2xl
        "
        onMouseDown={(event) =>
          event.stopPropagation()
        }
      >

        {/* =================================================
            HEADER
        ================================================= */}

        <div
          className="
            flex
            items-start
            justify-between
            gap-4
            border-b
            border-slate-100
            px-6
            py-5
          "
        >

          <div>

            <h2
              className="
                text-xl
                font-bold
                text-slate-900
              "
            >
              Edit User
            </h2>

            <p
              className="
                mt-1
                text-sm
                text-slate-500
              "
            >
              Update user information and account settings.
            </p>

          </div>


          {/* CLOSE BUTTON */}

          <button
            type="button"
            onClick={handleClose}
            disabled={loading}
            aria-label="Close modal"
            className="
              flex
              h-9
              w-9
              shrink-0
              items-center
              justify-center
              rounded-lg
              text-xl
              text-slate-400
              transition
              hover:bg-slate-100
              hover:text-slate-700
              disabled:cursor-not-allowed
              disabled:opacity-50
            "
          >
            ×
          </button>

        </div>


        {/* =================================================
            USER ID
        ================================================= */}

        <div
          className="
            mx-6
            mt-5
            rounded-xl
            border
            border-slate-200
            bg-slate-50
            p-4
          "
        >

          <p
            className="
              text-[11px]
              font-semibold
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
          >
            {userId}
          </p>

        </div>


        {/* =================================================
            FORM
        ================================================= */}

        <form
          onSubmit={handleSubmit}
          className="p-6"
        >

          <div className="space-y-5">

            {/* =================================================
                NAME
            ================================================= */}

            <div>

              <label
                htmlFor="edit-user-name"
                className="
                  mb-2
                  block
                  text-sm
                  font-medium
                  text-slate-700
                "
              >
                Full Name{" "}

                <span className="text-red-500">
                  *
                </span>

              </label>

              <input
                id="edit-user-name"
                name="name"
                type="text"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter full name"
                maxLength={100}
                disabled={loading}
                className="
                  w-full
                  rounded-xl
                  border
                  border-slate-200
                  px-4
                  py-3
                  text-sm
                  text-slate-800
                  outline-none
                  transition
                  placeholder:text-slate-400
                  focus:border-slate-500
                  focus:ring-2
                  focus:ring-slate-200
                  disabled:cursor-not-allowed
                  disabled:bg-slate-50
                "
              />

            </div>


            {/* =================================================
                EMAIL
            ================================================= */}

            <div>

              <label
                htmlFor="edit-user-email"
                className="
                  mb-2
                  block
                  text-sm
                  font-medium
                  text-slate-700
                "
              >
                Email{" "}

                <span className="text-red-500">
                  *
                </span>

              </label>

              <input
                id="edit-user-email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter email"
                disabled={loading}
                className="
                  w-full
                  rounded-xl
                  border
                  border-slate-200
                  px-4
                  py-3
                  text-sm
                  text-slate-800
                  outline-none
                  transition
                  placeholder:text-slate-400
                  focus:border-slate-500
                  focus:ring-2
                  focus:ring-slate-200
                  disabled:cursor-not-allowed
                  disabled:bg-slate-50
                "
              />

            </div>


            {/* =================================================
                PHONE
            ================================================= */}

            <div>

              <label
                htmlFor="edit-user-phone"
                className="
                  mb-2
                  block
                  text-sm
                  font-medium
                  text-slate-700
                "
              >
                Phone
              </label>

              <input
                id="edit-user-phone"
                name="phone"
                type="tel"
                value={formData.phone}
                onChange={handleChange}
                placeholder="Enter phone number"
                disabled={loading}
                className="
                  w-full
                  rounded-xl
                  border
                  border-slate-200
                  px-4
                  py-3
                  text-sm
                  text-slate-800
                  outline-none
                  transition
                  placeholder:text-slate-400
                  focus:border-slate-500
                  focus:ring-2
                  focus:ring-slate-200
                  disabled:cursor-not-allowed
                  disabled:bg-slate-50
                "
              />

            </div>


            {/* =================================================
                ROLE + STATUS
            ================================================= */}

            <div
              className="
                grid
                gap-5
                md:grid-cols-2
              "
            >

              {/* ROLE */}

              <div>

                <label
                  htmlFor="edit-user-role"
                  className="
                    mb-2
                    block
                    text-sm
                    font-medium
                    text-slate-700
                  "
                >
                  Role
                </label>

                <select
                  id="edit-user-role"
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  disabled={loading}
                  className="
                    w-full
                    rounded-xl
                    border
                    border-slate-200
                    bg-white
                    px-4
                    py-3
                    text-sm
                    text-slate-800
                    outline-none
                    transition
                    focus:border-slate-500
                    focus:ring-2
                    focus:ring-slate-200
                    disabled:cursor-not-allowed
                    disabled:bg-slate-50
                  "
                >

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

                  <option value="USER">
                    User
                  </option>

                </select>

              </div>


              {/* STATUS */}

              <div>

                <label
                  htmlFor="edit-user-status"
                  className="
                    mb-2
                    block
                    text-sm
                    font-medium
                    text-slate-700
                  "
                >
                  Account Status
                </label>

                <select
                  id="edit-user-status"
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  disabled={loading}
                  className="
                    w-full
                    rounded-xl
                    border
                    border-slate-200
                    bg-white
                    px-4
                    py-3
                    text-sm
                    text-slate-800
                    outline-none
                    transition
                    focus:border-slate-500
                    focus:ring-2
                    focus:ring-slate-200
                    disabled:cursor-not-allowed
                    disabled:bg-slate-50
                  "
                >

                  <option value="ACTIVE">
                    Active
                  </option>

                  <option value="INACTIVE">
                    Inactive
                  </option>

                  <option value="SUSPENDED">
                    Suspended
                  </option>

                  <option value="BLOCKED">
                    Blocked
                  </option>

                </select>

              </div>

            </div>

          </div>


          {/* =================================================
              ERROR
          ================================================= */}

          {error && (

            <div
              className="
                mt-5
                rounded-xl
                border
                border-red-200
                bg-red-50
                p-4
              "
            >

              <div className="flex gap-3">

                <span className="text-red-600">
                  ⚠
                </span>

                <div>

                  <p
                    className="
                      text-sm
                      font-semibold
                      text-red-700
                    "
                  >
                    Unable to update user
                  </p>

                  <p
                    className="
                      mt-1
                      text-sm
                      text-red-600
                    "
                  >
                    {error}
                  </p>

                </div>

              </div>

            </div>

          )}


          {/* =================================================
              ACTIONS
          ================================================= */}

          <div
            className="
              mt-6
              flex
              flex-col-reverse
              gap-3
              border-t
              border-slate-100
              pt-5
              sm:flex-row
              sm:justify-end
            "
          >

            {/* CANCEL */}

            <button
              type="button"
              onClick={handleClose}
              disabled={loading}
              className="
                rounded-xl
                border
                border-slate-200
                bg-white
                px-5
                py-3
                text-sm
                font-semibold
                text-slate-700
                transition
                hover:bg-slate-50
                disabled:cursor-not-allowed
                disabled:opacity-50
              "
            >
              Cancel
            </button>


            {/* SAVE */}

            <button
              type="submit"
              disabled={loading}
              className="
                rounded-xl
                bg-slate-900
                px-6
                py-3
                text-sm
                font-semibold
                text-white
                transition
                hover:bg-slate-800
                disabled:cursor-not-allowed
                disabled:opacity-50
              "
            >

              {loading ? (

                <span className="flex items-center justify-center gap-2">

                  <span
                    className="
                      h-4
                      w-4
                      animate-spin
                      rounded-full
                      border-2
                      border-slate-400
                      border-t-white
                    "
                  />

                  Saving...

                </span>

              ) : (

                "Save Changes"

              )}

            </button>

          </div>

        </form>

      </div>

    </div>
  );
};


export default EditUserModal;