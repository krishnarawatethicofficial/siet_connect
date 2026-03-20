import { useEffect, lazy, Suspense } from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import useAuthStore from "./store/authStore.js";
import useAccessibilityStore from "./store/accessibilityStore.js";
import Navbar from "./components/Navbar.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import Spinner from "./components/Spinner.jsx";

// Lazy load pages for performance
const LandingPage = lazy(() => import("./pages/LandingPage.jsx"));
const LoginPage = lazy(() => import("./pages/LoginPage.jsx"));
const SignupPage = lazy(() => import("./pages/SignupPage.jsx"));
const DashboardPage = lazy(() => import("./pages/DashboardPage.jsx"));
const AcademicsPage = lazy(() => import("./pages/AcademicsPage.jsx"));
const PlacementsPage = lazy(() => import("./pages/PlacementsPage.jsx"));
const CampusPage = lazy(() => import("./pages/CampusPage.jsx"));
const ServicesPage = lazy(() => import("./pages/ServicesPage.jsx"));
const ProfilePage = lazy(() => import("./pages/ProfilePage.jsx"));
const AdminPage = lazy(() => import("./pages/AdminPage.jsx"));
const LeaderboardPage = lazy(() => import("./pages/LeaderboardPage.jsx"));
const NotFoundPage = lazy(() => import("./pages/NotFoundPage.jsx"));

// Scroll to top on route change
const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

const App = () => {
  const { checkAuth, user, isCheckingAuth } = useAuthStore();
  const { textSize, highContrast, wideSpacing, theme } = useAccessibilityStore();

  // Check auth on mount
  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  // Apply accessibility classes to body
  useEffect(() => {
    const html = document.documentElement;
    html.setAttribute("data-theme", theme);
    document.body.className = `text-size-${textSize} ${highContrast ? "high-contrast" : ""} ${wideSpacing ? "wide-spacing" : ""}`;
  }, [textSize, highContrast, wideSpacing, theme]);

  // Show spinner while initial auth check runs
  if (isCheckingAuth) {
    return (
      <div className="min-h-screen bg-base-100 flex items-center justify-center">
        <div className="text-center">
          <img src="/images/siet.webp" alt="SIET Logo" className="w-16 h-16 mx-auto mb-4 animate-pulse" />
          <p className="text-base-content/60 text-sm">Loading SIET Connect...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-base-100">
      <ScrollToTop />
      <Toaster
        position="top-center"
        toastOptions={{
          duration: 3000,
          style: { borderRadius: "12px", padding: "12px 16px", fontWeight: 500 },
        }}
      />

      {user && <Navbar />}

      <main id="main-content" role="main" tabIndex={-1}>
        <Suspense fallback={<Spinner size="lg" />}>
          <Routes>
            {/* Public routes */}
            <Route path="/" element={!user ? <LandingPage /> : <Navigate to="/dashboard" />} />
            <Route path="/login" element={!user ? <LoginPage /> : <Navigate to="/dashboard" />} />
            <Route path="/signup" element={!user ? <SignupPage /> : <Navigate to="/dashboard" />} />

            {/* Protected routes */}
            <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
            <Route path="/academics" element={<ProtectedRoute><AcademicsPage /></ProtectedRoute>} />
            <Route path="/academics/:tab" element={<ProtectedRoute><AcademicsPage /></ProtectedRoute>} />
            <Route path="/placements" element={<ProtectedRoute><PlacementsPage /></ProtectedRoute>} />
            <Route path="/placements/:tab" element={<ProtectedRoute><PlacementsPage /></ProtectedRoute>} />
            <Route path="/campus" element={<ProtectedRoute><CampusPage /></ProtectedRoute>} />
            <Route path="/campus/:tab" element={<ProtectedRoute><CampusPage /></ProtectedRoute>} />
            <Route path="/services" element={<ProtectedRoute><ServicesPage /></ProtectedRoute>} />
            <Route path="/services/:tab" element={<ProtectedRoute><ServicesPage /></ProtectedRoute>} />
            <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
            <Route path="/leaderboard" element={<ProtectedRoute><LeaderboardPage /></ProtectedRoute>} />

            {/* Admin only */}
            <Route path="/admin" element={<ProtectedRoute requiredRole="admin"><AdminPage /></ProtectedRoute>} />
            <Route path="/admin/:tab" element={<ProtectedRoute requiredRole="admin"><AdminPage /></ProtectedRoute>} />

            {/* 404 */}
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </Suspense>
      </main>
    </div>
  );
};

export default App;
