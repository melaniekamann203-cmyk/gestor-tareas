import { Navigate } from "react-router-dom";
import type { ReactNode } from "react";
import { useAuth } from "../hooks/useAuth";

export function PrivateRoute({ children }: { children: ReactNode }) {
  const { user, loading } = useAuth();

  if (loading) return <p className="status">Cargando...</p>;
  if (!user) return <Navigate to="/login" replace />;

  return <>{children}</>;
}