import { useEffect, useState, type ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { checkAdminSession } from "../services/adminService";

interface ProtectedRouteProps {
  children: ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const token = localStorage.getItem("token");
  const [isChecking, setIsChecking] = useState(Boolean(token));
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    if (!token) return;

    checkAdminSession()
      .then(setIsAuthenticated)
      .finally(() => setIsChecking(false));
  }, [token]);

  if (isChecking) {
    return <p>Verificando sesión...</p>;
  }

  if (!token || !isAuthenticated) {
    return <Navigate to="/admin/login" replace />;
  }

  return <>{children}</>;
} 