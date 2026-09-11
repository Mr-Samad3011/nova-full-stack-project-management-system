// const jwt = require("jsonwebtoken");
// const User = require("../models/User");

// const protect = async (req, res, next) => {
//   try {
//     const authHeader = req.headers.authorization;

//     if (
//       !authHeader ||
//       !authHeader.startsWith("Bearer ")
//     ) {
//       return res.status(401).json({
//         success: false,
//         message: "Not authorized. Token missing.",
//       });
//     }

//     const token = authHeader.split(" ")[1];

//     const decoded = jwt.verify(
//       token,
//       process.env.JWT_SECRET
//     );

//     const user = await User.findById(decoded.userId)
//       .select("-password");

//     if (!user) {
//       return res.status(401).json({
//         success: false,
//         message: "User no longer exists",
//       });
//     }

//     req.user = user;

//     next();
//   } catch (error) {
//     return res.status(401).json({
//       success: false,
//       message: "Invalid or expired token",
//     });
//   }
// };


// module.exports = {
//   protect,
// };


const jwt = require("jsonwebtoken");
const User = require("../models/User");

// =====================================================
// PROTECT — AUTHENTICATION
// =====================================================
// Checks whether the user has a valid JWT token.
// If valid, user information is attached to req.user.
// =====================================================

const protect = async (req, res, next) => {
  try {
    // -------------------------------------------------
    // GET AUTHORIZATION HEADER
    // -------------------------------------------------

    const authHeader =
      req.headers.authorization;

    // -------------------------------------------------
    // CHECK TOKEN
    // -------------------------------------------------

    if (
      !authHeader ||
      !authHeader.startsWith("Bearer ")
    ) {
      return res.status(401).json({
        success: false,
        message:
          "Not authorized. Token missing.",
      });
    }

    // -------------------------------------------------
    // EXTRACT TOKEN
    // -------------------------------------------------

    const token =
      authHeader.split(" ")[1];

    if (!token) {
      return res.status(401).json({
        success: false,
        message:
          "Not authorized. Token missing.",
      });
    }

    // -------------------------------------------------
    // VERIFY JWT
    // -------------------------------------------------

    const decoded =
      jwt.verify(
        token,
        process.env.JWT_SECRET
      );

    // -------------------------------------------------
    // FIND USER
    // -------------------------------------------------

    const user =
      await User.findById(
        decoded.userId
      ).select("-password");

    // -------------------------------------------------
    // USER NOT FOUND
    // -------------------------------------------------

    if (!user) {
      return res.status(401).json({
        success: false,
        message:
          "User no longer exists.",
      });
    }

    // -------------------------------------------------
    // ATTACH USER TO REQUEST
    // -------------------------------------------------

    req.user = user;

    next();

  } catch (error) {

    console.error(
      "Auth Middleware Error:",
      error
    );

    return res.status(401).json({
      success: false,
      message:
        "Invalid or expired token.",
    });
  }
};


// =====================================================
// AUTHORIZE — ROLE BASED AUTHORIZATION
// =====================================================
// Usage:
//
// authorize("OWNER")
// authorize("OWNER", "ADMIN")
// authorize("OWNER", "ADMIN", "MANAGER")
//
// protect must always come before authorize.
// =====================================================

const authorize = (...allowedRoles) => {
  return (req, res, next) => {
    console.log("\n========== AUTHORIZE DEBUG ==========");

    console.log("Request:", req.method, req.originalUrl);

    console.log("User exists:", !!req.user);

    console.log("User ID:", req.user?._id);

    console.log("Username:", req.user?.username);

    console.log("Email:", req.user?.email);

    console.log("Raw Role:", req.user?.role);

    console.log("Role Type:", typeof req.user?.role);

    console.log("Allowed Roles:", allowedRoles);

    console.log("====================================\n");

    // -------------------------------------------------
    // AUTHENTICATION
    // -------------------------------------------------

    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Not authorized.",
      });
    }

    // -------------------------------------------------
    // ROLES CONFIGURATION
    // -------------------------------------------------

    if (
      !Array.isArray(allowedRoles) ||
      allowedRoles.length === 0
    ) {
      return res.status(403).json({
        success: false,
        message: "No roles configured for this resource.",
      });
    }

    // -------------------------------------------------
    // CURRENT USER ROLE
    // -------------------------------------------------

    const userRole = String(
      req.user.role || ""
    )
      .trim()
      .toUpperCase();

    // -------------------------------------------------
    // NORMALIZE ALLOWED ROLES
    // -------------------------------------------------

    const normalizedRoles = allowedRoles.map(
      (role) =>
        String(role)
          .trim()
          .toUpperCase()
    );

    console.log("Normalized User Role:", userRole);

    console.log(
      "Normalized Allowed Roles:",
      normalizedRoles
    );

    // -------------------------------------------------
    // PERMISSION
    // -------------------------------------------------

    const hasPermission =
      normalizedRoles.includes(userRole);

    console.log(
      "Has Permission:",
      hasPermission
    );

    // -------------------------------------------------
    // DENIED
    // -------------------------------------------------

    if (!hasPermission) {
      return res.status(403).json({
        success: false,
        message: "Access denied. Invalid user role.",
        userRole,
        allowedRoles: normalizedRoles,
      });
    }

    // -------------------------------------------------
    // GRANTED
    // -------------------------------------------------

    next();
  };
};


// =====================================================
// EXPORT
// =====================================================

module.exports = {
  protect,
  authorize,
};

