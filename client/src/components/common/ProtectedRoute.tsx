import { ReactNode, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useLocation } from "wouter";
import { Loader2 } from "lucide-react";

interface ProtectedRouteProps {
  children: ReactNode;
  requiredRole?: string;
}

const ProtectedRoute = ({ children, requiredRole = "admin" }: ProtectedRouteProps) => {
  const { user, isLoading, isAuthenticated } = useAuth();
  const [, setLocation] = useLocation();

  useEffect(() => {
    // Agar loading complete ho gayi aur authenticated nahi hai
    if (!isLoading && !isAuthenticated) {
      console.log("🚫 ProtectedRoute: Not authenticated, redirecting to login");
      localStorage.removeItem("admin_token");
      localStorage.removeItem("admin_user");
      setLocation("/admin/login");
      return;
    }

    // Agar authenticated hai lekin role match nahi karta
    if (!isLoading && isAuthenticated && user?.role !== requiredRole) {
      console.log(`🚫 ProtectedRoute: User role ${user?.role} doesn't match required role ${requiredRole}`);
      setLocation("/admin/dashboard");
    }
  }, [isLoading, isAuthenticated, user, requiredRole, setLocation]);

  // Loading state
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

  // Agar authenticated hai aur role match karta hai
  if (isAuthenticated && user?.role === requiredRole) {
    return <>{children}</>;
  }

  // Default case: return null (redirect will happen via useEffect)
  return null;
};

export default ProtectedRoute;