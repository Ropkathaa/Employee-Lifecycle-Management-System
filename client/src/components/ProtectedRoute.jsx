import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

export default function ProtectedRoute({ children }) {
  const { candidate } = useAuth();
  if (!candidate) {
    return <Navigate to="/login" replace />;
  }
  return children;
}
