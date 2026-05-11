import React, { useState } from "react";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  ShieldCheck,
} from "lucide-react";

import { useNavigate } from "react-router-dom";

const Login = ({ setIsAuthenticated }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    setTimeout(() => {
      if (
        email === "user@example.com" &&
        password === "password123"
      ) {
        localStorage.setItem("isAuthenticated", "true");
        setIsAuthenticated(true);
        navigate("/");
      } else {
        setError("Invalid email or password");
      }

      setLoading(false);
    }, 1200);
  };

  return (
    <div className="relative flex items-center justify-center min-h-screen overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 px-4">
      
      {/* Background Glow */}
      <div className="absolute top-[-120px] left-[-100px] h-72 w-72 rounded-full bg-cyan-500/20 blur-3xl"></div>
      <div className="absolute bottom-[-120px] right-[-100px] h-72 w-72 rounded-full bg-blue-500/20 blur-3xl"></div>

      {/* Card */}
      <div className="relative w-full max-w-md rounded-3xl border border-white/10 bg-white/10 backdrop-blur-xl shadow-2xl p-8">
        
        {/* Logo */}
        <div className="flex items-center justify-center mb-6">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-cyan-500/20 border border-cyan-400/30">
            <ShieldCheck className="text-cyan-300" size={34} />
          </div>
        </div>

        {/* Heading */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white">
            Welcome Back
          </h1>

          <p className="mt-2 text-sm text-slate-300">
            Login to continue to your dashboard
          </p>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-5 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          
          {/* Email */}
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-300">
              Email Address
            </label>

            <div className="flex items-center rounded-xl border border-white/10 bg-white/5 px-4 transition-all focus-within:border-cyan-400 focus-within:ring-2 focus-within:ring-cyan-500/30">
              <Mail size={18} className="text-slate-400" />

              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full bg-transparent px-3 py-4 text-white placeholder:text-slate-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-300">
              Password
            </label>

            <div className="flex items-center rounded-xl border border-white/10 bg-white/5 px-4 transition-all focus-within:border-cyan-400 focus-within:ring-2 focus-within:ring-cyan-500/30">
              <Lock size={18} className="text-slate-400" />

              <input
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full bg-transparent px-3 py-4 text-white placeholder:text-slate-500 focus:outline-none"
              />

              <button
                type="button"
                onClick={() =>
                  setShowPassword(!showPassword)
                }
                className="text-slate-400 hover:text-white transition"
              >
                {showPassword ? (
                  <EyeOff size={18} />
                ) : (
                  <Eye size={18} />
                )}
              </button>
            </div>
          </div>

          {/* Credentials */}
          <div className="rounded-xl border border-cyan-500/20 bg-cyan-500/10 p-4 text-sm text-cyan-200">
            <p className="font-medium mb-1">
              Demo Credentials
            </p>

            <p>Email: user@example.com</p>
            <p>Password: password123</p>
          </div>

          {/* Button */}
          <button
            type="submit"
            disabled={loading}
            className="group relative flex w-full items-center justify-center overflow-hidden rounded-xl bg-cyan-500 py-4 text-sm font-semibold text-slate-900 transition-all duration-300 hover:bg-cyan-400 disabled:opacity-70"
          >
            <span className="absolute inset-0 bg-white/10 opacity-0 transition-opacity duration-300 group-hover:opacity-100"></span>

            {loading ? (
              <div className="h-5 w-5 animate-spin rounded-full border-2 border-slate-900 border-t-transparent"></div>
            ) : (
              "Sign In"
            )}
          </button>
        </form>

        {/* Footer */}
        <div className="mt-6 text-center text-sm text-slate-400">
          Don&apos;t have an account?{" "}
          <button
            onClick={() => navigate("/signup")}
            className="font-medium text-cyan-300 hover:text-cyan-200"
          >
            Create Account
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
