
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { useAuth } from "../context/AuthContext";


// =====================================================
// COUNTRY CODES
// =====================================================

const COUNTRY_CODES = [
  {
    code: "+91",
    country: "India",
    flag: "🇮🇳",
    digits: 10,
  },
  {
    code: "+1",
    country: "USA / Canada",
    flag: "🇺🇸",
    digits: 10,
  },
  {
    code: "+44",
    country: "UK",
    flag: "🇬🇧",
    digits: 10,
  },
  {
    code: "+61",
    country: "Australia",
    flag: "🇦🇺",
    digits: 9,
  },
  {
    code: "+971",
    country: "UAE",
    flag: "🇦🇪",
    digits: 9,
  },
  {
    code: "+966",
    country: "Saudi Arabia",
    flag: "🇸🇦",
    digits: 9,
  },
];


// =====================================================
// REGISTER
// =====================================================

const Register = () => {
  const navigate = useNavigate();

  const auth = useAuth();

  const register = auth?.register;


  // =====================================================
  // FORM DATA
  // =====================================================

  const [formData, setFormData] = useState({
    name: "",
    username: "",
    email: "",
    countryCode: "+91",
    phone: "",
    password: "",
    confirmPassword: "",
  });


  // =====================================================
  // STATE
  // =====================================================

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);


  // =====================================================
  // SELECTED COUNTRY
  // =====================================================

  const selectedCountry =
    COUNTRY_CODES.find(
      (country) =>
        country.code === formData.countryCode
    ) || COUNTRY_CODES[0];


  // =====================================================
  // HANDLE CHANGE
  // =====================================================

  const handleChange = (event) => {
    const {
      name,
      value,
    } = event.target;


    // =================================================
    // PHONE
    // =================================================

    if (name === "phone") {
      const onlyNumbers =
        value.replace(/\D/g, "");

      const maxDigits =
        selectedCountry.digits;

      const limitedNumber =
        onlyNumbers.slice(
          0,
          maxDigits
        );

      setFormData((previous) => ({
        ...previous,
        phone: limitedNumber,
      }));

      setError("");

      return;
    }


    // =================================================
    // COUNTRY CODE
    // =================================================

    if (name === "countryCode") {
      setFormData((previous) => ({
        ...previous,
        countryCode: value,
        phone: "",
      }));

      setError("");

      return;
    }


    // =================================================
    // OTHER FIELDS
    // =================================================

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));

    setError("");
  };


  // =====================================================
  // HANDLE REGISTER
  // =====================================================

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");


    // =================================================
    // CHECK AUTH CONTEXT
    // =================================================

    if (typeof register !== "function") {
      console.error(
        "Register function is missing from AuthContext."
      );

      setError(
        "Registration service is not available. Please refresh the page."
      );

      return;
    }


    // =================================================
    // NORMALIZE
    // =================================================

    const name =
      formData.name.trim();

    const username =
      formData.username
        .trim()
        .toLowerCase();

    const email =
      formData.email
        .trim()
        .toLowerCase();

    const phone =
      formData.phone.trim();

    const countryCode =
      formData.countryCode;

    const password =
      formData.password;

    const confirmPassword =
      formData.confirmPassword;


    // =================================================
    // REQUIRED
    // =================================================

    if (
      !name ||
      !username ||
      !email ||
      !phone ||
      !password ||
      !confirmPassword
    ) {
      setError(
        "Please fill in all required fields."
      );

      return;
    }


    // =================================================
    // PHONE DIGIT VALIDATION
    // =================================================

    if (!/^\d+$/.test(phone)) {
      setError(
        "Mobile number must contain only digits."
      );

      return;
    }


    // =================================================
    // PHONE LENGTH
    // =================================================

    if (
      phone.length !==
      selectedCountry.digits
    ) {
      setError(
        `Mobile number must contain exactly ${selectedCountry.digits} digits.`
      );

      return;
    }


    // =================================================
    // INDIA MOBILE VALIDATION
    // =================================================

    if (
      countryCode === "+91" &&
      !/^[6-9]\d{9}$/.test(phone)
    ) {
      setError(
        "Please enter a valid Indian mobile number starting with 6, 7, 8, or 9."
      );

      return;
    }


    // =================================================
    // PASSWORD LENGTH
    // =================================================

    if (password.length < 6) {
      setError(
        "Password must contain at least 6 characters."
      );

      return;
    }


    // =================================================
    // PASSWORD MATCH
    // =================================================

    if (
      password !==
      confirmPassword
    ) {
      setError(
        "Passwords do not match."
      );

      return;
    }


    // =================================================
    // FULL PHONE
    // =================================================

    const fullPhone =
      `${countryCode}${phone}`;


    console.log(
      "Register Phone:",
      fullPhone
    );


    // =================================================
    // REGISTER
    // =================================================

    try {
      setLoading(true);

      const registerData = {
        name,
        username,
        email,

        countryCode,

        phone,

        fullPhone,

        password,

        confirmPassword,
      };


      console.log(
        "Register Data:",
        registerData
      );


      await register(
        registerData
      );


      // =================================================
      // SUCCESS
      // =================================================

      navigate(
        "/dashboard",
        {
          replace: true,
        }
      );

    } catch (error) {
      console.error(
        "Register Page Error:",
        error
      );


      // =================================================
      // BACKEND ERROR
      // =================================================

      const backendMessage =
        error?.response?.data?.message;


      if (backendMessage) {
        setError(
          backendMessage
        );
      } else if (
        error?.message ===
        "Network Error"
      ) {
        setError(
          "Unable to connect to the server. Please make sure the backend is running."
        );
      } else {
        setError(
          error?.message ||
            "Registration failed. Please try again."
        );
      }

    } finally {
      setLoading(false);
    }
  };


  // =====================================================
  // UI
  // =====================================================

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-950 px-4 py-8">

      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-xl">


        {/* =================================================
            HEADER
        ================================================= */}

        <h1 className="text-3xl font-bold text-slate-900">
          Create Account
        </h1>

        <p className="mt-2 text-slate-500">
          Join NOVA today
        </p>


        {/* =================================================
            ERROR
        ================================================= */}

        {error && (
          <div
            role="alert"
            className="mt-4 rounded-lg border border-red-200 bg-red-100 p-3 text-sm text-red-700"
          >
            {error}
          </div>
        )}


        {/* =================================================
            FORM
        ================================================= */}

        <form
          onSubmit={handleSubmit}
          className="mt-6 space-y-4"
        >


          {/* =================================================
              NAME
          ================================================= */}

          <div>
            <label
              htmlFor="name"
              className="mb-1 block text-sm font-medium text-slate-700"
            >
              Full Name
            </label>

            <input
              id="name"
              type="text"
              name="name"
              placeholder="Enter your full name"
              value={formData.name}
              onChange={handleChange}
              autoComplete="name"
              required
              disabled={loading}
              minLength={2}
              maxLength={50}
              className="w-full rounded-lg border border-slate-300 p-3 outline-none transition focus:border-slate-900 focus:ring-1 focus:ring-slate-900 disabled:bg-slate-100"
            />
          </div>


          {/* =================================================
              USERNAME
          ================================================= */}

          <div>
            <label
              htmlFor="username"
              className="mb-1 block text-sm font-medium text-slate-700"
            >
              Username
            </label>

            <input
              id="username"
              type="text"
              name="username"
              placeholder="Choose a username"
              value={formData.username}
              onChange={handleChange}
              autoComplete="username"
              required
              disabled={loading}
              minLength={3}
              maxLength={30}
              className="w-full rounded-lg border border-slate-300 p-3 outline-none transition focus:border-slate-900 focus:ring-1 focus:ring-slate-900 disabled:bg-slate-100"
            />
          </div>


          {/* =================================================
              EMAIL
          ================================================= */}

          <div>
            <label
              htmlFor="email"
              className="mb-1 block text-sm font-medium text-slate-700"
            >
              Email
            </label>

            <input
              id="email"
              type="email"
              name="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
              autoComplete="email"
              required
              disabled={loading}
              className="w-full rounded-lg border border-slate-300 p-3 outline-none transition focus:border-slate-900 focus:ring-1 focus:ring-slate-900 disabled:bg-slate-100"
            />
          </div>


          {/* =================================================
              PHONE
          ================================================= */}

        {/* =================================================
    PHONE
================================================= */}

<div>
  <label
    htmlFor="phone"
    className="mb-1 block text-sm font-medium text-slate-700"
  >
    Mobile Number
  </label>

  <div className="flex gap-2">

    {/* COUNTRY CODE */}

    <select
      id="countryCode"
      name="countryCode"
      value={formData.countryCode}
      onChange={handleChange}
      disabled={loading}
      className="w-[130px] shrink-0 rounded-lg border border-slate-300 bg-white px-2 py-3 text-sm outline-none transition focus:border-slate-900 focus:ring-1 focus:ring-slate-900 disabled:bg-slate-100"
    >
      {COUNTRY_CODES.map((country) => (
        <option
          key={country.code}
          value={country.code}
        >
          {country.flag} {country.code}
        </option>
      ))}
    </select>

    {/* PHONE NUMBER */}

    <input
      id="phone"
      type="tel"
      name="phone"
      placeholder={`${selectedCountry.digits} digit mobile number`}
      value={formData.phone}
      onChange={handleChange}
      autoComplete="tel-national"
      inputMode="numeric"
      pattern={`[0-9]{${selectedCountry.digits}}`}
      maxLength={selectedCountry.digits}
      minLength={selectedCountry.digits}
      required
      disabled={loading}
      className="min-w-0 flex-1 rounded-lg border border-slate-300 p-3 outline-none transition focus:border-slate-900 focus:ring-1 focus:ring-slate-900 disabled:bg-slate-100"
    />
  </div>

  {/* PHONE HELP */}

  <p className="mt-1 text-xs text-slate-400">
    {selectedCountry.flag} {selectedCountry.country}{" "}
    {selectedCountry.digits} digits

    {formData.countryCode === "+91" &&
      " • Indian mobile must start with 6–9"}
  </p>
</div>

          {/* =================================================
              PASSWORD
          ================================================= */}

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
              name="password"
              placeholder="Minimum 6 characters"
              value={formData.password}
              onChange={handleChange}
              autoComplete="new-password"
              minLength={6}
              required
              disabled={loading}
              className="w-full rounded-lg border border-slate-300 p-3 outline-none transition focus:border-slate-900 focus:ring-1 focus:ring-slate-900 disabled:bg-slate-100"
            />

          </div>


          {/* =================================================
              CONFIRM PASSWORD
          ================================================= */}

          <div>

            <label
              htmlFor="confirmPassword"
              className="mb-1 block text-sm font-medium text-slate-700"
            >
              Confirm Password
            </label>

            <input
              id="confirmPassword"
              type="password"
              name="confirmPassword"
              placeholder="Re-enter your password"
              value={formData.confirmPassword}
              onChange={handleChange}
              autoComplete="new-password"
              minLength={6}
              required
              disabled={loading}
              className="w-full rounded-lg border border-slate-300 p-3 outline-none transition focus:border-slate-900 focus:ring-1 focus:ring-slate-900 disabled:bg-slate-100"
            />

          </div>


          {/* =================================================
              SUBMIT
          ================================================= */}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-slate-900 py-3 font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading
              ? "Creating Account..."
              : "Create Account"}
          </button>

        </form>


        {/* =================================================
            LOGIN
        ================================================= */}

        <p className="mt-6 text-center text-sm text-slate-600">

          Already have an account?{" "}

          <Link
            to="/login"
            className="font-semibold text-slate-900 hover:underline"
          >
            Login
          </Link>

        </p>

      </div>

    </div>
  );
};


export default Register;
