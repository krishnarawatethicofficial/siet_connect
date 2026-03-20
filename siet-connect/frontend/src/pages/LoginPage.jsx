import { useState } from "react";
import { Link } from "react-router-dom";
import { Mail, Lock, Eye, EyeOff, ArrowRight } from "lucide-react";
import toast from "react-hot-toast";
import useAuthStore from "../store/authStore.js";

const FEATURES = ["📚 Academics", "💼 Placements", "🏫 Campus"];

const LoginPage = () => {
  const [form, setForm] = useState({ email: "", password: "" });
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState("");
  const { login, isLoading } = useAuthStore();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!form.email || !form.password) {
      setError("Please fill in all fields");
      return;
    }
    try {
      await login(form);
      toast.success("Welcome back!");
    } catch (err) {
      setError(err?.response?.data?.message || "Sign-in failed. Please try again.");
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center relative bg-[#081212]">
      {/* Aurora Background */}
      <div className="aurora-bg" aria-hidden="true">
        <div className="aurora-orb aurora-orb-1" />
        <div className="aurora-orb aurora-orb-2" />
        <div className="aurora-orb aurora-orb-3" />
      </div>

      {/* Main Content */}
      <div className="relative z-10 w-full max-w-md px-6 flex flex-col items-center">
        {/* Branding Section */}
        <div className="flex flex-col items-center mb-10">
          {/* Logo with glow */}
          <div className="logo-glow mb-6">
            <div className="w-24 h-24 rounded-3xl bg-base-300/80 shadow-2xl flex items-center justify-center backdrop-blur-sm border border-white/10">
              <img
                src="/images/siet.webp"
                alt="SIET Panchkula Logo"
                className="w-14 h-14 object-contain"
              />
            </div>
          </div>

          {/* App Name */}
          <h1 className="text-3xl font-bold text-white tracking-tight font-serif">
            SIET Connect
          </h1>

          {/* Tagline */}
          <p className="text-gray-400 text-base mt-2 tracking-wide">
            ✨ Your campus, connected
          </p>

          {/* Feature Pills */}
          <div className="flex gap-2 mt-5">
            {FEATURES.map((f) => (
              <span key={f} className="feature-pill">{f}</span>
            ))}
          </div>
        </div>

        {/* Login Card */}
        <div className="auth-glass-card w-full p-6">
          <form onSubmit={handleSubmit} noValidate>
            {/* Email */}
            <div className="form-control mb-4">
              <label htmlFor="email" className="label">
                <span className="label-text font-medium flex items-center gap-1.5 text-gray-300">
                  <Mail size={14} aria-hidden="true" /> Email
                </span>
              </label>
              <input
                id="email"
                type="email"
                className="input input-bordered w-full rounded-xl bg-white/5 border-white/10 text-white placeholder:text-gray-500 focus:border-teal-400/50 focus:bg-white/8"
                placeholder="you@siet.ac.in"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                autoComplete="email"
                required
              />
            </div>

            {/* Password */}
            <div className="form-control mb-5">
              <label htmlFor="password" className="label">
                <span className="label-text font-medium flex items-center gap-1.5 text-gray-300">
                  <Lock size={14} aria-hidden="true" /> Password
                </span>
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPw ? "text" : "password"}
                  className="input input-bordered w-full rounded-xl pr-12 bg-white/5 border-white/10 text-white placeholder:text-gray-500 focus:border-teal-400/50 focus:bg-white/8"
                  placeholder="Enter your password"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  autoComplete="current-password"
                  required
                  minLength={6}
                />
                <button
                  type="button"
                  onClick={() => setShowPw(!showPw)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                  aria-label={showPw ? "Hide password" : "Show password"}
                >
                  {showPw ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Error Pill */}
            {error && (
              <div className="auth-error-pill mb-4">{error}</div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              className="btn w-full rounded-2xl h-14 text-base font-semibold bg-white text-gray-900 hover:bg-gray-100 border-none gap-2 shadow-lg shadow-white/10 transition-all"
              disabled={isLoading}
            >
              {isLoading ? (
                <span className="loading loading-spinner loading-sm" />
              ) : (
                <>
                  Sign In
                  <ArrowRight size={18} />
                </>
              )}
            </button>
          </form>

          <p className="text-center text-sm mt-5 text-gray-400">
            Don&apos;t have an account?{" "}
            <Link to="/signup" className="text-teal-400 font-semibold hover:underline">
              Sign Up
            </Link>
          </p>
        </div>

        {/* College account hint */}
        <p className="text-gray-500 text-xs mt-5 tracking-wide">
          Use your college email to sign in
        </p>

        {/* Version */}
        <p className="text-gray-600 text-[11px] mt-3 opacity-50">
          SIET Connect v1.0
        </p>
      </div>

      {/* Loading Overlay */}
      {isLoading && (
        <div className="auth-loading-overlay">
          <div className="flex flex-col items-center gap-4">
            <span className="loading loading-spinner loading-lg text-teal-400" />
            <p className="text-white font-medium text-sm">Signing in...</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default LoginPage;
