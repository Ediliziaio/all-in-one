import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

interface ProtectedRouteProps {
  requiredRole?: "student" | "admin";
}

export function ProtectedRoute({ requiredRole }: ProtectedRouteProps) {
  const { session, profile, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  if (!session) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (requiredRole && profile?.role !== requiredRole) {
    // Admin che prova ad andare su /studente → redirect admin
    if (profile?.role === "admin") return <Navigate to="/admin" replace />;
    // Studente che prova ad andare su /admin → redirect studente
    return <Navigate to="/studente" replace />;
  }

  return <Outlet />;
}
