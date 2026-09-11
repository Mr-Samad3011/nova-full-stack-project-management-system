// const User = require("../models/User");
// const bcrypt = require("bcryptjs");
// const generateToken = require("../utils/generateToken");



// // ==========================================
// // REGISTER USER
// // ==========================================

// const registerUser = async (req, res) => {
//   try {
//     const {
//       name,
//       username,
//       email,
//       password,
//       confirmPassword,
//     } = req.body;

//     if (!name || !username || !email || !password) {
//       return res.status(400).json({
//         success: false,
//         message: "All required fields must be provided",
//       });
//     }

//     if (password !== confirmPassword) {
//       return res.status(400).json({
//         success: false,
//         message: "Passwords do not match",
//       });
//     }

//     if (password.length < 6) {
//       return res.status(400).json({
//         success: false,
//         message: "Password must contain at least 6 characters",
//       });
//     }

//     const existingUser = await User.findOne({
//       $or: [
//         {
//           email: email.toLowerCase(),
//         },
//         {
//           username: username.toLowerCase(),
//         },
//       ],
//     });

//     if (existingUser) {
//       return res.status(409).json({
//         success: false,
//         message: "Email or username already exists",
//       });
//     }

//     const hashedPassword = await bcrypt.hash(
//       password,
//       10
//     );

//     const user = await User.create({
//       name,
//       username: username.toLowerCase(),
//       email: email.toLowerCase(),
//       password: hashedPassword,
//     });

//     const token = generateToken(user._id);

//     return res.status(201).json({
//       success: true,
//       message: "User registered successfully",

//       user: {
//         id: user._id,
//         name: user.name,
//         username: user.username,
//         email: user.email,
//         role: user.role,
//       },

//       token,
//     });

//   } catch (error) {

//     console.error(
//       "Register Error:",
//       error
//     );

//     return res.status(500).json({
//       success: false,
//       message: "Server error during registration",
//     });
//   }
// };


// // ==========================================
// // LOGIN USER
// // ==========================================

// const loginUser = async (req, res) => {
//   try {

//     const {
//       identifier,
//       password,
//     } = req.body;


//     // Check input
//     if (!identifier || !password) {
//       return res.status(400).json({
//         success: false,
//         message:
//           "Username/email and password are required",
//       });
//     }


//     // Find user by username OR email
//     const user = await User.findOne({
//       $or: [
//         {
//           email: identifier.toLowerCase(),
//         },
//         {
//           username: identifier.toLowerCase(),
//         },
//       ],
//     });


//     // User not found
//     if (!user) {
//       return res.status(401).json({
//         success: false,
//         message: "Invalid credentials",
//       });
//     }


//     // Compare password
//     const passwordMatch =
//       await bcrypt.compare(
//         password,
//         user.password
//       );


//     // Wrong password
//     if (!passwordMatch) {
//       return res.status(401).json({
//         success: false,
//         message: "Invalid credentials",
//       });
//     }


//     // Generate JWT
//     const token =
//       generateToken(user._id);


//     // Response
//     return res.status(200).json({
//       success: true,
//       message: "Login successful",

//       user: {
//         id: user._id,
//         name: user.name,
//         username: user.username,
//         email: user.email,
//         role: user.role,
//       },

//       token,
//     });

//   } catch (error) {

//     console.error(
//       "Login Error:",
//       error
//     );

//     return res.status(500).json({
//       success: false,
//       message: "Server error during login",
//     });
//   }
// };


// const getMe = async (req, res) => {
//   return res.status(200).json({
//     success: true,
//     user: req.user,
//   });
// };

// // ==========================================
// // EXPORT
// // ==========================================

// module.exports = {
//   registerUser,
//   loginUser,getMe,
// };

const User = require("../models/User");
const bcrypt = require("bcryptjs");
const generateToken = require("../utils/generateToken");

// =====================================================
// HELPER — FORMAT USER
// =====================================================

const formatUser = (user) => {
  return {
    id: user._id.toString(),
    _id: user._id.toString(),

    name: user.name,
    username: user.username,
    email: user.email,

    phone: user.phone || "",

    role: user.role,

    avatar: user.avatar || "",
  };
};

// =====================================================
// REGISTER USER
// POST /api/auth/register
// =====================================================

const registerUser = async (req, res) => {
  try {
    const {
      name,
      username,
      email,
      phone,
      countryCode,
      fullPhone,
      password,
      confirmPassword,
    } = req.body;

    // =================================================
    // BASIC VALIDATION
    // =================================================

    if (
      !name ||
      !username ||
      !email ||
      !phone ||
      !password
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Name, username, email, phone and password are required",
      });
    }

    // =================================================
    // NORMALIZE INPUT
    // =================================================

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
      String(phone)
        .replace(/\D/g, "")
        .trim();

    // =================================================
    // PHONE VALIDATION
    // =================================================

    if (!/^\d{10}$/.test(normalizedPhone)) {
      return res.status(400).json({
        success: false,
        message:
          "Mobile number must contain exactly 10 digits",
      });
    }

    // =================================================
    // INDIA MOBILE VALIDATION
    // =================================================

    if (
      countryCode === "+91" &&
      !/^[6-9]\d{9}$/.test(normalizedPhone)
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Please enter a valid Indian mobile number starting with 6, 7, 8, or 9",
      });
    }

    // =================================================
    // PASSWORD VALIDATION
    // =================================================

    if (password !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "Passwords do not match",
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message:
          "Password must contain at least 6 characters",
      });
    }

    // =================================================
    // FULL PHONE
    // =================================================

    const normalizedCountryCode =
      String(countryCode || "+91").trim();

    const normalizedFullPhone =
      fullPhone ||
      `${normalizedCountryCode}${normalizedPhone}`;

    // =================================================
    // CHECK EXISTING USER
    // =================================================

    const existingUser =
      await User.findOne({
        $or: [
          {
            email: normalizedEmail,
          },
          {
            username: normalizedUsername,
          },
          {
            phone: normalizedFullPhone,
          },
        ],
      });

    if (existingUser) {

      let message =
        "Email, username or phone number already exists";

      if (
        existingUser.email ===
        normalizedEmail
      ) {
        message =
          "Email already exists";
      } else if (
        existingUser.username ===
        normalizedUsername
      ) {
        message =
          "Username already exists";
      } else if (
        existingUser.phone ===
        normalizedFullPhone
      ) {
        message =
          "Phone number already exists";
      }

      return res.status(409).json({
        success: false,
        message,
      });
    }

    // =================================================
    // HASH PASSWORD
    // =================================================

    const hashedPassword =
      await bcrypt.hash(password, 10);

    // =================================================
    // CREATE USER
    // =================================================

    const user = await User.create({

      name: normalizedName,

      username:
        normalizedUsername,

      email:
        normalizedEmail,

      password:
        hashedPassword,

      phone:
        normalizedFullPhone,

      // IMPORTANT:
      // Never accept role from req.body.
      //
      // User model default role = MEMBER.
    });

    // =================================================
    // GENERATE JWT
    // =================================================

    const token =
      generateToken(
        user._id,
        user.role
      );

    // =================================================
    // RESPONSE
    // =================================================

    return res.status(201).json({

      success: true,

      message:
        "User registered successfully",

      user:
        formatUser(user),

      token,
    });

  } catch (error) {

    console.error(
      "Register Error:",
      error
    );

    // =================================================
    // MONGOOSE DUPLICATE KEY
    // =================================================

    if (error.code === 11000) {

      const duplicateField =
        Object.keys(
          error.keyPattern || {}
        )[0];

      let message =
        "User already exists";

      if (
        duplicateField === "email"
      ) {
        message =
          "Email already exists";
      }

      if (
        duplicateField === "username"
      ) {
        message =
          "Username already exists";
      }

      if (
        duplicateField === "phone"
      ) {
        message =
          "Phone number already exists";
      }

      return res.status(409).json({
        success: false,
        message,
      });
    }

    return res.status(500).json({
      success: false,
      message:
        "Server error during registration",
    });
  }
};

// =====================================================
// LOGIN USER
// POST /api/auth/login
// =====================================================

const loginUser = async (req, res) => {
  try {

    const {
      identifier,
      password,
    } = req.body;

    // =================================================
    // VALIDATION
    // =================================================

    if (
      !identifier ||
      !password
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Username/email and password are required",
      });
    }

    // =================================================
    // NORMALIZE IDENTIFIER
    // =================================================

    const normalizedIdentifier =
      identifier
        .trim()
        .toLowerCase();

    // =================================================
    // FIND USER
    // =================================================

    const user =
      await User.findOne({
        $or: [
          {
            email:
              normalizedIdentifier,
          },
          {
            username:
              normalizedIdentifier,
          },
        ],
      });

    // =================================================
    // USER NOT FOUND
    // =================================================

    if (!user) {
      return res.status(401).json({
        success: false,
        message:
          "Invalid credentials",
      });
    }

    // =================================================
    // CHECK PASSWORD
    // =================================================

    const passwordMatch =
      await bcrypt.compare(
        password,
        user.password
      );

    if (!passwordMatch) {
      return res.status(401).json({
        success: false,
        message:
          "Invalid credentials",
      });
    }

    // =================================================
    // GENERATE JWT
    // =================================================

    const token =
      generateToken(
        user._id,
        user.role
      );

    // =================================================
    // RESPONSE
    // =================================================

    return res.status(200).json({

      success: true,

      message:
        "Login successful",

      user:
        formatUser(user),

      token,
    });

  } catch (error) {

    console.error(
      "Login Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Server error during login",
    });
  }
};

// =====================================================
// GET CURRENT USER
// GET /api/auth/me
// =====================================================

const getMe = async (req, res) => {
  try {

    if (!req.user) {
      return res.status(401).json({
        success: false,
        message:
          "Not authorized",
      });
    }

    return res.status(200).json({

      success: true,

      user:
        formatUser(req.user),
    });

  } catch (error) {

    console.error(
      "Get Me Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Server error while fetching current user",
    });
  }
};

// =====================================================
// EXPORT
// =====================================================

module.exports = {
  registerUser,
  loginUser,
  getMe,
};