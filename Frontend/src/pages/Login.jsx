import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";

// Globe Icon for Navbar
const Globe = ({ size = 24, className = "text-green-600" }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <circle cx="12" cy="12" r="10" />
    <path d="M2 12h20" />
    <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" />
  </svg>
);

// Custom Navbar for Login
const LoginNavbar = () => (
  <div className="w-full py-3 px-6 shadow-md flex items-center justify-between bg-white fixed top-0 z-50 font-sans">
    <div className="flex items-center space-x-2">
      <Globe size={28} className="text-green-600" />
      <span className="text-2xl font-bold text-black tracking-wide">
        ARANYA
      </span>
    </div>
    <div className="flex items-center space-x-4">
      <NavLink
        to="/help"
        className="text-gray-700 font-medium px-3 py-1 rounded-lg hover:bg-green-50 hover:text-green-600 transition duration-300"
      >
        Help
      </NavLink>
      <NavLink
        to="/"
        className="bg-green-600 text-white px-4 py-1 rounded-lg hover:bg-green-700 transition duration-300 font-medium"
      >
        Home
      </NavLink>
    </div>
  </div>
);

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-gray-50 to-green-100 flex flex-col items-center justify-center font-sans">
      <LoginNavbar />

      <div className="w-full max-w-md mt-20 bg-white p-10 rounded-3xl shadow-2xl transform transition-all duration-500 hover:scale-105">
        <h2 className="text-3xl font-extrabold text-gray-900 mb-6 text-center tracking-tight">
          Sign in into your account
        </h2>

        {error && (
          <div className="p-3 mb-4 text-sm text-red-700 bg-red-100 rounded transition-opacity duration-500">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-5 py-3 border border-gray-300 rounded-2xl shadow-sm focus:ring-2 focus:ring-green-500 focus:border-green-500 transition duration-300 text-gray-700 font-medium placeholder-gray-400"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-5 py-3 border border-gray-300 rounded-2xl shadow-sm focus:ring-2 focus:ring-green-500 focus:border-green-500 transition duration-300 text-gray-700 font-medium placeholder-gray-400"
          />
          <div className="flex justify-end">
            <NavLink
              to="/forgot-password"
              className="text-green-600 font-medium hover:underline transition duration-300 text-sm"
            >
              Forgot Password?
            </NavLink>
          </div>
          <button
            type="submit"
            className="w-full py-3 bg-green-600 text-white font-semibold rounded-2xl shadow-lg hover:bg-green-700 transform hover:scale-[1.02] transition duration-300"
          >
            Sign In
          </button>
        </form>

        <p className="mt-6 text-center text-gray-600 text-sm">
          Don't have an account?{" "}
          <NavLink
            to="/signup"
            className="text-green-600 font-semibold hover:underline transition duration-300"
          >
            Sign Up
          </NavLink>
        </p>
      </div>
    </div>
  );
};

export default Login;
