import { Navigate } from "react-router-dom";
import useAuthStore from "../store/authStore.js";
import Spinner from "./Spinner.jsx";

const ProtectedRoute = ({ children, requiredRole }) => {
  const { user, isCheckingAuth } = useAuthStore();

  if (isCheckingAuth) return <Spinner size="lg" />;
  if (!user) return <Navigate to="/login" replace />;
  if (requiredRole && user.role !== requiredRole) return <Navigate to="/dashboard" replace />;

  return children;
};

export default ProtectedRoute;
