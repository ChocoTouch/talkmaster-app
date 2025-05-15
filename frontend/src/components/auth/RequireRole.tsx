import { Role } from "../../types/roles";
import { useAuth } from "../../context/AuthContext";
import { Navigate } from "react-router-dom";

export default function RequireRole({
  allowedRoles,
  children,
}: {
  allowedRoles: Role[];
  children: React.ReactNode;
}) {
  const { user, loading } = useAuth();

  if (loading) return null;

  if (!user) return <Navigate to="/public" replace />;
  if (!allowedRoles.includes(user.id_role)) return <Navigate to="/public" replace />;

  return <>{children}</>;
}