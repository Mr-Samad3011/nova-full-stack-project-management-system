


import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { useAuth } from "../context/AuthContext";

const Login = () => {
  const navigate = useNavigate();

  const { login } = useAuth();

  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // =====================================================
  // HANDLE LOGIN
  // =====================================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");

    // -------------------------------------------------
    // FRONTEND VALIDATION
    // -------------------------------------------------

    const cleanIdentifier = identifier.trim();

    if (!cleanIdentifier) {
      setError("Username or email is required");
      return;
    }

    if (!password) {
      setError("Password is required");
      return;
    }

    setLoading(true);

    try {
      // -------------------------------------------------
      // LOGIN
      // -------------------------------------------------

      await login(
        cleanIdentifier,
        password
      );

      // -------------------------------------------------
      // REDIRECT
      // -------------------------------------------------

      navigate("/dashboard");

    } catch (error) {
      console.error(
        "Login Error:",
        error
      );

      setError(
        error.response?.data?.message ||
          error.message ||
          "Login failed. Please try again."
      );

    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center px-4">

      <div className="w-full max-w-md bg-white rounded-2xl p-8 shadow-xl">

        {/* =================================================
            HEADER
        ================================================= */}

        <div className="text-center">

          <h1 className="text-3xl font-bold text-slate-900">
            Welcome Back
          </h1>

          <p className="mt-2 text-slate-500">
            Login to your NOVA account
          </p>

        </div>


        {/* =================================================
            ERROR MESSAGE
        ================================================= */}

        {error && (
          <div
            className="mt-4 rounded-lg bg-red-100 border border-red-200 p-3 text-sm text-red-700"
            role="alert"
          >
            {error}
          </div>
        )}


        {/* =================================================
            LOGIN FORM
        ================================================= */}

        <form
          onSubmit={handleSubmit}
          className="mt-6 space-y-4"
        >

          {/* USERNAME / EMAIL */}

          <div>

            <label
              htmlFor="identifier"
              className="mb-1 block text-sm font-medium text-slate-700"
            >
              Username or Email
            </label>

            <input
              id="identifier"
              type="text"
              placeholder="Enter username or email"
              value={identifier}
              onChange={(e) =>
                setIdentifier(e.target.value)
              }
              autoComplete="username"
              disabled={loading}
              required
              className="w-full rounded-lg border border-slate-300 p-3 outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900 disabled:bg-slate-100"
            />

          </div>


          {/* PASSWORD */}

          <div>

            <label
              htmlFor="password"
              className="mb-1 block text-sm font-medium text-slate-700"
            >
              Password
            </label>

            <input
              id="password"
              type="password"
              placeholder="Enter password"
              value={password}
              onChange={(e) =>
                setPassword(e.target.value)
              }
              autoComplete="current-password"
              disabled={loading}
              required
              className="w-full rounded-lg border border-slate-300 p-3 outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900 disabled:bg-slate-100"
            />

          </div>


          {/* LOGIN BUTTON */}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-slate-900 py-3 font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
          >

            {loading ? (
              "Logging in..."
            ) : (
              "Login"
            )}

          </button>

        </form>


        {/* =================================================
            REGISTER LINK
        ================================================= */}

        <p className="mt-6 text-center text-sm text-slate-600">

          Don't have an account?{" "}

          <Link
            to="/register"
            className="font-semibold text-slate-900 hover:underline"
          >
            Register
          </Link>

        </p>

      </div>

    </div>
  );
};

export default Login;

