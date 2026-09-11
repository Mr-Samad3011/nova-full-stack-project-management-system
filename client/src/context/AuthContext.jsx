/* eslint-disable react-hooks/set-state-in-effect */

/* eslint-disable react-refresh/only-export-components */

import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import api from "../services/api";

const AuthContext = createContext();

// =====================================================
// AUTH PROVIDER
// =====================================================

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // =====================================================
  // GET CURRENT USER
  // =====================================================

  useEffect(() => {
    const token =
      localStorage.getItem("nova_token");

    // No token = user is not logged in
    if (!token) {
      setUser(null);
      setLoading(false);
      return;
    }

    const getCurrentUser = async () => {
      try {
        const response =
          await api.get("/auth/me");

        if (
  response.data?.success &&
  response.data?.user
) {
  const currentUser =
    response.data.user;

  localStorage.setItem(
    "user",
    JSON.stringify(currentUser)
  );

  setUser(currentUser);
} else {
          throw new Error(
            "Invalid user response"
          );
        }
      } catch (error) {
        console.error(
          "Get Current User Error:",
          error
        );

        // Token invalid / expired
        localStorage.removeItem(
          "nova_token"
        );

        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    getCurrentUser();
  }, []);

  // =====================================================
  // REGISTER
  // =====================================================

  const register = async (formData) => {
    try {
      const response =
        await api.post(
          "/auth/register",
          formData
        );

      const { token, user } =
        response.data;

      if (!token || !user) {
        throw new Error(
          "Invalid registration response"
        );
      }

      // Save JWT
      localStorage.setItem(
        "nova_token",
        token
      );

      // Save logged-in user
      setUser(user);

      return response.data;

    } catch (error) {
      console.error(
        "Register Context Error:",
        error
      );

      throw error;
    }
  };

  // =====================================================
  // LOGIN
  // =====================================================

  const login = async (
    identifier,
    password
  ) => {
    try {
      const response =
        await api.post(
          "/auth/login",
          {
            identifier: identifier.trim(),
            password,
          }
        );

      const { token, user } =
        response.data;

      if (!token || !user) {
        throw new Error(
          "Invalid login response"
        );
      }

      // -------------------------------------------------
      // SAVE JWT
      // -------------------------------------------------

      localStorage.setItem(
        "nova_token",
        token
      );

      // -------------------------------------------------
      // SAVE CURRENT USER
      // -------------------------------------------------

      setUser(user);

      // -------------------------------------------------
      // ROLE DEBUG
      // -------------------------------------------------

      console.log(
        "========== LOGIN SUCCESS =========="
      );

      console.log("User:", user);
      console.log("User ID:", user.id);
      console.log("Username:", user.username);
      console.log("Email:", user.email);
      console.log("Role:", user.role);

      console.log(
        "==================================="
      );

      return response.data;

    } catch (error) {
      console.error(
        "Login Context Error:",
        error
      );

      throw error;
    }
  };

  // =====================================================
  // LOGOUT
  // =====================================================

  const logout = () => {
    localStorage.removeItem(
      "nova_token"
    );

    setUser(null);
  };

  // =====================================================
  // ROLE HELPERS
  // =====================================================

  const hasRole = (...roles) => {
    if (!user?.role) {
      return false;
    }

    const currentRole =
      String(user.role).toUpperCase();

    return roles.some(
      (role) =>
        String(role).toUpperCase() ===
        currentRole
    );
  };

  const isOwner = () =>
    hasRole("OWNER");

  const isAdmin = () =>
    hasRole("ADMIN");

  const isManager = () =>
    hasRole("MANAGER");

  const isMember = () =>
    hasRole("MEMBER");

  const isViewer = () =>
    hasRole("VIEWER");

  // =====================================================
  // AUTH CONTEXT
  // =====================================================

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,

        register,
        login,
        logout,

        // Role helpers
        hasRole,
        isOwner,
        isAdmin,
        isManager,
        isMember,
        isViewer,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// =====================================================
// USE AUTH
// =====================================================

export const useAuth = () => {
  return useContext(AuthContext);
};

