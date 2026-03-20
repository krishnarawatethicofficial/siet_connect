import { Link } from "react-router-dom";
import { Home, ArrowLeft } from "lucide-react";
import useAuthStore from "../store/authStore.js";

const NotFoundPage = () => {
  const { user } = useAuthStore();

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-base-100">
      <div className="text-center max-w-md">
        <img src="/images/siet.webp" alt="SIET Logo" className="w-16 h-16 mx-auto mb-6 opacity-50" />
        <h1 className="text-6xl font-extrabold text-accent mb-2">404</h1>
        <h2 className="text-xl font-bold mb-2">😕 Page Not Found</h2>
        <p className="text-base-content/60 mb-8">
          🔍 The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="flex gap-3 justify-center">
          <Link to={user ? "/dashboard" : "/"} className="btn btn-accent rounded-xl gap-2">
            <Home size={16} aria-hidden="true" />
            {user ? "Dashboard" : "Home"}
          </Link>
          <button onClick={() => window.history.back()} className="btn btn-outline rounded-xl gap-2">
            <ArrowLeft size={16} aria-hidden="true" />
            Go Back
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;
