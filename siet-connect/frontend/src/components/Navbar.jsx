import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  Home, BookOpen, Briefcase, Building2, FileText, User, Shield,
  Trophy, LogOut, Menu, X, Sun, Moon,
  Eye, ALargeSmall, Space, Settings,
} from "lucide-react";
import { useState, useEffect } from "react";
import useAuthStore from "../store/authStore.js";
import useAccessibilityStore from "../store/accessibilityStore.js";

const navItems = [
  { path: "/dashboard", label: "Dashboard", icon: Home },
  { path: "/academics", label: "Academics", icon: BookOpen },
  { path: "/placements", label: "Placements", icon: Briefcase },
  { path: "/campus", label: "Campus", icon: Building2 },
  { path: "/services", label: "Services", icon: FileText },
  { path: "/leaderboard", label: "Leaderboard", icon: Trophy },
];

const Navbar = () => {
  const { user, logout } = useAuthStore();
  const { textSize, setTextSize, highContrast, toggleHighContrast, wideSpacing, toggleWideSpacing, theme, toggleTheme } = useAccessibilityStore();
  const location = useLocation();
  const navigate = useNavigate();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [a11yOpen, setA11yOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  // Close drawer on route change
  useEffect(() => {
    setDrawerOpen(false);
  }, [location.pathname]);

  return (
    <>
      {/* Skip to main content — first focusable element */}
      <a href="#main-content" className="skip-link" aria-label="Skip to main content">
        Skip to Main Content
      </a>

      <nav className="navbar bg-base-200 shadow-lg sticky top-0 z-50 no-print" role="navigation" aria-label="Main navigation">
        <div className="max-w-5xl mx-auto w-full flex items-center justify-between px-2">
          {/* Logo */}
          <Link to="/dashboard" className="flex items-center gap-2 font-bold text-lg" aria-label="SIET Connect home">
            <img src="/images/siet.webp" alt="SIET Panchkula Logo" className="w-9 h-9 rounded-xl object-contain" />
            <span className="hidden sm:inline">SIET Connect</span>
          </Link>

          {/* Desktop nav links */}
          <div className="hidden lg:flex items-center gap-1">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`btn btn-ghost btn-sm gap-1.5 transition-all duration-200 ${
                  location.pathname === item.path ? "bg-accent/20 text-accent" : ""
                }`}
                aria-current={location.pathname === item.path ? "page" : undefined}
              >
                <item.icon size={16} aria-hidden="true" />
                {item.label}
              </Link>
            ))}
            {user?.role === "admin" && (
              <Link
                to="/admin"
                className={`btn btn-ghost btn-sm gap-1.5 transition-all duration-200 ${
                  location.pathname === "/admin" ? "bg-accent/20 text-accent" : ""
                }`}
              >
                <Shield size={16} aria-hidden="true" />
                Admin
              </Link>
            )}
          </div>

          {/* Right side actions */}
          <div className="flex items-center gap-1">
            {/* Accessibility toggle */}
            <button
              onClick={() => setA11yOpen(!a11yOpen)}
              className="btn btn-ghost btn-sm btn-circle"
              aria-label="Accessibility options"
              aria-expanded={a11yOpen}
            >
              <Settings size={18} />
            </button>

            {/* Theme toggle */}
            <button onClick={toggleTheme} className="btn btn-ghost btn-sm btn-circle" aria-label={`Switch to ${theme === "night" ? "light" : "dark"} mode`}>
              {theme === "night" ? <Sun size={18} /> : <Moon size={18} />}
            </button>

            {/* Profile */}
            <Link to="/profile" className="btn btn-ghost btn-sm btn-circle" aria-label="Profile">
              <User size={18} />
            </Link>

            {/* Logout */}
            <button onClick={handleLogout} className="btn btn-ghost btn-sm btn-circle text-error" aria-label="Logout">
              <LogOut size={18} />
            </button>

            {/* Mobile menu toggle */}
            <button
              onClick={() => setDrawerOpen(!drawerOpen)}
              className="btn btn-ghost btn-sm btn-circle lg:hidden"
              aria-label="Toggle menu"
              aria-expanded={drawerOpen}
            >
              {drawerOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Accessibility Options Panel */}
        {a11yOpen && (
          <div className="absolute top-full left-0 right-0 bg-base-200 border-t border-base-300 p-4 shadow-lg z-40" role="region" aria-label="Accessibility options">
            <div className="max-w-5xl mx-auto flex flex-wrap gap-4 items-center">
              {/* Text Size */}
              <div className="flex items-center gap-2" role="group" aria-label="Text size">
                <ALargeSmall size={16} aria-hidden="true" />
                <span className="text-sm font-medium">Text:</span>
                {["small", "medium", "large"].map((size) => (
                  <button
                    key={size}
                    onClick={() => setTextSize(size)}
                    className={`btn btn-xs ${textSize === size ? "btn-accent" : "btn-ghost"}`}
                    aria-pressed={textSize === size}
                  >
                    {size.charAt(0).toUpperCase() + size.slice(1)}
                  </button>
                ))}
              </div>

              {/* High Contrast */}
              <button
                onClick={toggleHighContrast}
                className={`btn btn-xs gap-1 ${highContrast ? "btn-accent" : "btn-ghost"}`}
                aria-pressed={highContrast}
              >
                <Eye size={14} aria-hidden="true" />
                High Contrast
              </button>

              {/* Wide Spacing */}
              <button
                onClick={toggleWideSpacing}
                className={`btn btn-xs gap-1 ${wideSpacing ? "btn-accent" : "btn-ghost"}`}
                aria-pressed={wideSpacing}
              >
                <Space size={14} aria-hidden="true" />
                Wide Spacing
              </button>
            </div>
          </div>
        )}
      </nav>

      {/* Mobile drawer */}
      {drawerOpen && (
        <div className="fixed inset-0 z-40 lg:hidden" role="dialog" aria-label="Navigation menu">
          <div className="fixed inset-0 bg-black/50" onClick={() => setDrawerOpen(false)} aria-hidden="true" />
          <div className="fixed top-0 left-0 bottom-0 w-64 sm:w-72 bg-base-200 shadow-2xl p-4 sm:p-6 overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <span className="font-bold text-lg">Menu</span>
              <button onClick={() => setDrawerOpen(false)} className="btn btn-ghost btn-sm btn-circle" aria-label="Close menu">
                <X size={20} />
              </button>
            </div>
            <div className="flex flex-col gap-1">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`btn btn-ghost justify-start gap-3 transition-all duration-200 ${
                    location.pathname === item.path ? "bg-accent/20 text-accent" : ""
                  }`}
                  aria-current={location.pathname === item.path ? "page" : undefined}
                >
                  <item.icon size={18} aria-hidden="true" />
                  {item.label}
                </Link>
              ))}
              {user?.role === "admin" && (
                <Link
                  to="/admin"
                  className={`btn btn-ghost justify-start gap-3 ${
                    location.pathname === "/admin" ? "bg-accent/20 text-accent" : ""
                  }`}
                >
                  <Shield size={18} aria-hidden="true" />
                  Admin Panel
                </Link>
              )}
              <Link to="/profile" className="btn btn-ghost justify-start gap-3">
                <User size={18} aria-hidden="true" />
                Profile
              </Link>
              <div className="divider my-2" />
              <button onClick={handleLogout} className="btn btn-ghost justify-start gap-3 text-error">
                <LogOut size={18} aria-hidden="true" />
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;
