// const User = require("../models/User");

// // =====================================================
// // SEARCH USERS
// // GET /api/users/search?q=keyword
// // =====================================================

// const searchUsers = async (req, res) => {
//   try {

//     // =================================================
//     // GET SEARCH QUERY
//     // =================================================

//     const { q } = req.query;

//     if (!q || q.trim().length < 2) {

//       return res.status(400).json({
//         success: false,
//         message:
//           "Search query must contain at least 2 characters",
//       });

//     }

//     // =================================================
//     // NORMALIZE SEARCH TERM
//     // =================================================

//     const searchTerm =
//       q.trim();

//     // =================================================
//     // SEARCH USERS
//     // =================================================

//     const users =
//       await User.find({

//         $or: [

//           {
//             username: {
//               $regex: searchTerm,
//               $options: "i",
//             },
//           },

//           {
//             email: {
//               $regex: searchTerm,
//               $options: "i",
//             },
//           },

//           {
//             name: {
//               $regex: searchTerm,
//               $options: "i",
//             },
//           },

//         ],

//       })

//         // =================================================
//         // RETURN ONLY SAFE FIELDS
//         // =================================================

//         .select(
//           "_id name username email role avatar"
//         )

//         // =================================================
//         // LIMIT RESULTS
//         // =================================================

//         .limit(10)

//         // =================================================
//         // SORT RESULTS
//         // =================================================

//         .sort({
//           name: 1,
//         });


//     // =================================================
//     // RESPONSE
//     // =================================================

//     return res.status(200).json({

//       success: true,

//       count: users.length,

//       users,

//     });

//   } catch (error) {

//     console.error(
//       "Search Users Error:",
//       error
//     );

//     return res.status(500).json({

//       success: false,

//       message:
//         "Server error while searching users",

//     });

//   }
// };


// // =====================================================
// // GET USER BY ID
// // GET /api/users/:id
// // =====================================================

// const getUserById = async (req, res) => {

//   try {

//     const { id } = req.params;

//     // =================================================
//     // VALIDATE ID
//     // =================================================

//     if (!id) {

//       return res.status(400).json({
//         success: false,
//         message: "User ID is required",
//       });

//     }

//     // =================================================
//     // FIND USER
//     // =================================================

//     const user =
//       await User.findById(id)
//         .select(
//           "_id name username email role avatar"
//         );

//     // =================================================
//     // USER NOT FOUND
//     // =================================================

//     if (!user) {

//       return res.status(404).json({
//         success: false,
//         message: "User not found",
//       });

//     }

//     // =================================================
//     // RESPONSE
//     // =================================================

//     return res.status(200).json({

//       success: true,

//       user,

//     });

//   } catch (error) {

//     console.error(
//       "Get User Error:",
//       error
//     );

//     return res.status(500).json({

//       success: false,

//       message:
//         "Server error while fetching user",

//     });

//   }
// };


// // =====================================================
// // EXPORT
// // =====================================================

// module.exports = {

//   searchUsers,

//   getUserById,

// };

const mongoose = require("mongoose");
const User = require("../models/User");

// =====================================================
// ALLOWED USER ROLES
// =====================================================

const ALLOWED_ROLES = [
  "OWNER",
  "ADMIN",
  "MANAGER",
  "MEMBER",
  "VIEWER",
];


// =====================================================
// SAFE USER FIELDS
// =====================================================

const SAFE_USER_FIELDS =
  "_id name username email phone role avatar createdAt updatedAt";


// =====================================================
// GET ALL USERS
// GET /api/users
// =====================================================

const getUsers = async (req, res) => {
  try {
    const users = await User.find({})
      .select(SAFE_USER_FIELDS)
      .sort({ name: 1 });

    return res.status(200).json({
      success: true,
      count: users.length,
      users,
    });
  } catch (error) {
    console.error("Get Users Error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error while fetching users",
    });
  }
};


// =====================================================
// SEARCH USERS
// GET /api/users/search?q=keyword
// =====================================================

const searchUsers = async (req, res) => {
  try {
    const { q } = req.query;

    if (!q || q.trim().length < 2) {
      return res.status(400).json({
        success: false,
        message:
          "Search query must contain at least 2 characters",
      });
    }

    const searchTerm = q.trim();

    const users = await User.find({
      $or: [
        {
          username: {
            $regex: searchTerm,
            $options: "i",
          },
        },
        {
          email: {
            $regex: searchTerm,
            $options: "i",
          },
        },
        {
          name: {
            $regex: searchTerm,
            $options: "i",
          },
        },
        {
          phone: {
            $regex: searchTerm,
            $options: "i",
          },
        },
      ],
    })
      .select(SAFE_USER_FIELDS)
      .limit(10)
      .sort({ name: 1 });

    return res.status(200).json({
      success: true,
      count: users.length,
      users,
    });
  } catch (error) {
    console.error("Search Users Error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error while searching users",
    });
  }
};


// =====================================================
// GET USER BY ID
// GET /api/users/:id
// =====================================================

const getUserById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "User ID is required",
      });
    }

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid user ID",
      });
    }

    const user = await User.findById(id)
      .select(SAFE_USER_FIELDS);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    return res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    console.error("Get User Error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error while fetching user",
    });
  }
};


// =====================================================
// UPDATE USER
// PATCH /api/users/:id
// =====================================================

const updateUser = async (req, res) => {
  try {
    const { id } = req.params;

    // -------------------------------------------------
    // VALIDATE ID
    // -------------------------------------------------

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "User ID is required",
      });
    }

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid user ID",
      });
    }

    // -------------------------------------------------
    // GET BODY
    // -------------------------------------------------

    const {
      name,
      username,
      email,
      phone,
      role,
    } = req.body;

    // -------------------------------------------------
    // VALIDATION
    // -------------------------------------------------

    if (!name || !String(name).trim()) {
      return res.status(400).json({
        success: false,
        message: "Name is required",
      });
    }

    if (!username || !String(username).trim()) {
      return res.status(400).json({
        success: false,
        message: "Username is required",
      });
    }

    if (!email || !String(email).trim()) {
      return res.status(400).json({
        success: false,
        message: "Email is required",
      });
    }

    if (!phone || !String(phone).trim()) {
      return res.status(400).json({
        success: false,
        message: "Phone is required",
      });
    }

    // -------------------------------------------------
    // NORMALIZE
    // -------------------------------------------------

    const normalizedName =
      String(name).trim();

    const normalizedUsername =
      String(username)
        .trim()
        .toLowerCase();

    const normalizedEmail =
      String(email)
        .trim()
        .toLowerCase();

    const normalizedPhone =
      String(phone).trim();

    const normalizedRole =
      String(role || "MEMBER")
        .trim()
        .toUpperCase();

    // -------------------------------------------------
    // VALID ROLE
    // -------------------------------------------------

    if (
      !ALLOWED_ROLES.includes(
        normalizedRole
      )
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid user role",
      });
    }

    // -------------------------------------------------
    // FIND USER
    // -------------------------------------------------

    const user =
      await User.findById(id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // -------------------------------------------------
    // DUPLICATE USERNAME
    // -------------------------------------------------

    const existingUsername =
      await User.findOne({
        username: normalizedUsername,
        _id: {
          $ne: id,
        },
      });

    if (existingUsername) {
      return res.status(400).json({
        success: false,
        message: "Username already exists",
      });
    }

    // -------------------------------------------------
    // DUPLICATE EMAIL
    // -------------------------------------------------

    const existingEmail =
      await User.findOne({
        email: normalizedEmail,
        _id: {
          $ne: id,
        },
      });

    if (existingEmail) {
      return res.status(400).json({
        success: false,
        message: "Email already exists",
      });
    }

    // -------------------------------------------------
    // DUPLICATE PHONE
    // -------------------------------------------------

    const existingPhone =
      await User.findOne({
        phone: normalizedPhone,
        _id: {
          $ne: id,
        },
      });

    if (existingPhone) {
      return res.status(400).json({
        success: false,
        message: "Phone number already exists",
      });
    }

    // -------------------------------------------------
    // UPDATE USER
    // -------------------------------------------------

    user.name =
      normalizedName;

    user.username =
      normalizedUsername;

    user.email =
      normalizedEmail;

    user.phone =
      normalizedPhone;

    user.role =
      normalizedRole;

    // -------------------------------------------------
    // SAVE
    // -------------------------------------------------

    await user.save();

    // -------------------------------------------------
    // GET UPDATED USER
    // -------------------------------------------------

    const updatedUser =
      await User.findById(id)
        .select(SAFE_USER_FIELDS);

    console.log(
      "User Updated Successfully:",
      updatedUser
    );

    return res.status(200).json({
      success: true,
      message: "User updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    console.error(
      "Update User Error:",
      error
    );

    // -------------------------------------------------
    // DUPLICATE KEY
    // -------------------------------------------------

    if (error.code === 11000) {
      const duplicateField =
        Object.keys(
          error.keyPattern || {}
        )[0];

      return res.status(400).json({
        success: false,
        message:
          `${duplicateField || "Field"} already exists`,
      });
    }

    // -------------------------------------------------
    // MONGOOSE VALIDATION
    // -------------------------------------------------

    if (
      error.name ===
      "ValidationError"
    ) {
      return res.status(400).json({
        success: false,
        message:
          Object.values(error.errors)
            .map(
              (item) =>
                item.message
            )
            .join(", "),
      });
    }

    return res.status(500).json({
      success: false,
      message:
        "Server error while updating user",
    });
  }
};


// =====================================================
// UPDATE USER ROLE
// PATCH /api/users/:id/role
// =====================================================

const updateUserRole = async (req, res) => {
  try {
    const { id } = req.params;
    const { role } = req.body;

    // -------------------------------------------------
    // VALIDATE ID
    // -------------------------------------------------

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "User ID is required",
      });
    }

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid user ID",
      });
    }

    // -------------------------------------------------
    // VALIDATE ROLE
    // -------------------------------------------------

    const normalizedRole =
      String(role || "")
        .trim()
        .toUpperCase();

    if (
      !ALLOWED_ROLES.includes(
        normalizedRole
      )
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid user role",
      });
    }

    // -------------------------------------------------
    // FIND USER
    // -------------------------------------------------

    const user =
      await User.findById(id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // -------------------------------------------------
    // UPDATE ROLE
    // -------------------------------------------------

    user.role =
      normalizedRole;

    await user.save();

    const updatedUser =
      await User.findById(id)
        .select(SAFE_USER_FIELDS);

    return res.status(200).json({
      success: true,
      message: "User role updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    console.error(
      "Update User Role Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Server error while updating user role",
    });
  }
};


// =====================================================
// DELETE USER
// DELETE /api/users/:id
// =====================================================

const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "User ID is required",
      });
    }

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid user ID",
      });
    }

    const user =
      await User.findById(id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    await User.findByIdAndDelete(id);

    return res.status(200).json({
      success: true,
      message: "User deleted successfully",
    });
  } catch (error) {
    console.error(
      "Delete User Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Server error while deleting user",
    });
  }
};


// =====================================================
// EXPORT
// =====================================================

module.exports = {
  getUsers,
  searchUsers,
  getUserById,
  updateUser,
  updateUserRole,
  deleteUser,
};