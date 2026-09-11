import { ReactNode, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useLocation } from "wouter";
import { Loader2 } from "lucide-react";

interface ProtectedRouteProps {
  children: ReactNode;
  requiredRole?: string;
}

const ProtectedRoute = ({
  children,
  requiredRole = "admin",
}: ProtectedRouteProps) => {
  const { user, isLoading, isAuthenticated } = useAuth();
  const [location, setLocation] = useLocation();

  useEffect(() => {
    if (isLoading) return;

    // Not authenticated → login
    if (!isAuthenticated) {
      console.log("🚫 Not authenticated → /admin/login");
      if (location !== "/admin/login") {
        setLocation("/admin/login");
      }
      return;
    }

    // Role check — only if role present
    const userRole = user?.role;
    if (requiredRole && userRole && userRole !== requiredRole) {
      console.log(`🚫 Role mismatch: ${userRole} !== ${requiredRole}`);
      setLocation("/admin/login");
    }
  }, [isLoading, isAuthenticated, user, requiredRole, setLocation, location]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-blue-500 animate-spin mx-auto mb-4" />
          <p className="text-gray-700 font-medium">Verifying access...</p>
          <p className="text-gray-500 text-sm mt-1">Please wait</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) return null;

  return <>{children}</>;
};

export default ProtectedRoute;