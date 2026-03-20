import { useState } from "react";
import { Link } from "react-router-dom";
import { Mail, Lock, User, Layers, Hash, Eye, EyeOff, ArrowRight } from "lucide-react";
import toast from "react-hot-toast";
import useAuthStore from "../store/authStore.js";

const FEATURES = ["📚 Academics", "💼 Placements", "🏫 Campus"];

const SignupPage = () => {
  const [form, setForm] = useState({
    name: "", email: "", password: "", studentId: "",
    role: "student", branch: "CSE-AIML", semester: 1,
  });
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState("");
  const { signup, isLoading } = useAuthStore();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!form.name || !form.email || !form.password || !form.studentId) {
      setError("Please fill in all fields");
      return;
    }
    try {
      await signup(form);
      toast.success("Account created! 🎓");
    } catch (err) {
      setError("Signup failed. Try again.");
    }
  };

  const update = (key, val) => setForm({ ...form, [key]: val });

  return (
    <div className="min-h-screen flex flex-col items-center justify-center relative bg-[#081212]">
      {/* Aurora Background */}
      <div className="aurora-bg" aria-hidden="true">
        <div className="aurora-orb aurora-orb-1" />
        <div className="aurora-orb aurora-orb-2" />
        <div className="aurora-orb aurora-orb-3" />
      </div>

      {/* Main Content */}
      <div className="relative z-10 w-full max-w-md px-6 py-8 flex flex-col items-center">
        {/* Branding Section */}
        <div className="flex flex-col items-center mb-8">
          {/* Logo with glow */}
          <div className="logo-glow mb-5">
            <div className="w-20 h-20 rounded-3xl bg-base-300/80 shadow-2xl flex items-center justify-center backdrop-blur-sm border border-white/10">
              <img
                src="/images/siet.webp"
                alt="SIET Panchkula Logo"
                className="w-12 h-12 object-contain"
              />
            </div>
          </div>

          {/* App Name */}
          <h1 className="text-2xl font-bold text-white tracking-tight font-serif">
            🎓 Join SIET Connect
          </h1>

          {/* Tagline */}
          <p className="text-gray-400 text-sm mt-1.5 tracking-wide">
            ✨ Create your campus account
          </p>

          {/* Feature Pills */}
          <div className="flex gap-2 mt-4">
            {FEATURES.map((f) => (
              <span key={f} className="feature-pill">{f}</span>
            ))}
          </div>
        </div>

        {/* Signup Card */}
        <div className="auth-glass-card w-full p-6">
          <form onSubmit={handleSubmit} noValidate>
            {/* Name */}
            <div className="form-control mb-3">
              <label htmlFor="name" className="label py-1">
                <span className="label-text font-medium flex items-center gap-1.5 text-gray-300">
                  <User size={14} aria-hidden="true" /> Full Name <span className="text-rose-400">*</span>
                </span>
              </label>
              <input
                id="name"
                type="text"
                className="input input-bordered w-full rounded-xl bg-white/5 border-white/10 text-white placeholder:text-gray-500 focus:border-teal-400/50"
                placeholder="Your full name"
                value={form.name}
                onChange={(e) => update("name", e.target.value)}
                required
              />
            </div>

            {/* Student ID */}
            <div className="form-control mb-3">
              <label htmlFor="studentId" className="label py-1">
                <span className="label-text font-medium flex items-center gap-1.5 text-gray-300">
                  <Layers size={14} aria-hidden="true" /> Student / Employee ID <span className="text-rose-400">*</span>
                </span>
              </label>
              <input
                id="studentId"
                type="text"
                className="input input-bordered w-full rounded-xl bg-white/5 border-white/10 text-white placeholder:text-gray-500 focus:border-teal-400/50"
                placeholder="e.g. SIET2024001"
                value={form.studentId}
                onChange={(e) => update("studentId", e.target.value)}
                required
              />
            </div>

            {/* Email */}
            <div className="form-control mb-3">
              <label htmlFor="signup-email" className="label py-1">
                <span className="label-text font-medium flex items-center gap-1.5 text-gray-300">
                  <Mail size={14} aria-hidden="true" /> Email <span className="text-rose-400">*</span>
                </span>
              </label>
              <input
                id="signup-email"
                type="email"
                className="input input-bordered w-full rounded-xl bg-white/5 border-white/10 text-white placeholder:text-gray-500 focus:border-teal-400/50"
                placeholder="you@siet.ac.in"
                value={form.email}
                onChange={(e) => update("email", e.target.value)}
                required
              />
            </div>

            {/* Password */}
            <div className="form-control mb-3">
              <label htmlFor="signup-password" className="label py-1">
                <span className="label-text font-medium flex items-center gap-1.5 text-gray-300">
                  <Lock size={14} aria-hidden="true" /> Password <span className="text-rose-400">*</span>
                </span>
              </label>
              <div className="relative">
                <input
                  id="signup-password"
                  type={showPw ? "text" : "password"}
                  className="input input-bordered w-full rounded-xl pr-12 bg-white/5 border-white/10 text-white placeholder:text-gray-500 focus:border-teal-400/50"
                  placeholder="Any password"
                  value={form.password}
                  onChange={(e) => update("password", e.target.value)}
                  required
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

            {/* Role + Branch */}
            <div className="grid grid-cols-2 gap-3 mb-3">
              <div className="form-control">
                <label htmlFor="role" className="label py-1">
                  <span className="label-text font-medium text-gray-300">Role</span>
                </label>
                <select
                  id="role"
                  className="select select-bordered rounded-xl w-full bg-white/5 border-white/10 text-white"
                  value={form.role}
                  onChange={(e) => update("role", e.target.value)}
                >
                  <option value="student">Student</option>
                  <option value="faculty">Faculty</option>
                </select>
              </div>
              <div className="form-control">
                <label htmlFor="branch" className="label py-1">
                  <span className="label-text font-medium text-gray-300">Branch</span>
                </label>
                <select
                  id="branch"
                  className="select select-bordered rounded-xl w-full bg-white/5 border-white/10 text-white"
                  value={form.branch}
                  onChange={(e) => update("branch", e.target.value)}
                >
                  <option value="CSE-AIML">CSE (AI & ML)</option>
                  <option value="CSE-CS">CSE (Cyber Sec)</option>
                  <option value="RAE">Robotics & Auto</option>
                  <option value="general">General</option>
                </select>
              </div>
            </div>

            {/* Semester */}
            {form.role === "student" && (
              <div className="form-control mb-4">
                <label htmlFor="semester" className="label py-1">
                  <span className="label-text font-medium flex items-center gap-1.5 text-gray-300">
                    <Hash size={14} aria-hidden="true" /> Semester
                  </span>
                </label>
                <select
                  id="semester"
                  className="select select-bordered rounded-xl w-full bg-white/5 border-white/10 text-white"
                  value={form.semester}
                  onChange={(e) => update("semester", Number(e.target.value))}
                >
                  {[1,2,3,4,5,6,7,8].map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
            )}

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
                  Create Account
                  <ArrowRight size={18} />
                </>
              )}
            </button>
          </form>

          <p className="text-center text-sm mt-5 text-gray-400">
            Already have an account?{" "}
            <Link to="/login" className="text-teal-400 font-semibold hover:underline">
              Sign In
            </Link>
          </p>
        </div>

        {/* Version */}
        <p className="text-gray-600 text-[11px] mt-4 opacity-50">
          SIET Connect v1.0
        </p>
      </div>

      {/* Loading Overlay */}
      {isLoading && (
        <div className="auth-loading-overlay">
          <div className="flex flex-col items-center gap-4">
            <span className="loading loading-spinner loading-lg text-teal-400" />
            <p className="text-white font-medium text-sm">Creating your account...</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default SignupPage;
