"use client";

import { useEffect, useMemo } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { ShieldCheck } from "lucide-react";

/**
 * ProtectedRoute Component
 *
 * Route guard component for Next.js App Router.
 *
 * @param {Object} props
 * @param {React.ReactNode} props.children - Child components to render when authorized
 * @param {boolean} [props.requireAuth=true] - Whether the route requires authentication
 * @param {string[]} [props.allowedRoles=[]] - Allowed roles (e.g., ['admin', 'superadmin']). Empty array means any authenticated role.
 * @param {boolean} [props.guestOnly=false] - For public-only pages like /login, /register (redirects logged-in users away)
 * @param {string} [props.redirectTo] - Custom redirection URL
 * @param {React.ReactNode} [props.fallback] - Custom loading fallback component
 */
export default function ProtectedRoute({
  children,
  requireAuth = true,
  allowedRoles = [],
  guestOnly = false,
  redirectTo,
  fallback,
}) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, isAuthenticated, isLoading } = useAuth();

  // Determine user role
  const userRole = (user?.role || "member").toLowerCase();

  // Normalize allowed roles
  const normalizedAllowedRoles = useMemo(
    () => allowedRoles.map((r) => r.toLowerCase()),
    [allowedRoles]
  );

  const hasRequiredRole = useMemo(() => {
    if (normalizedAllowedRoles.length === 0) return true;
    return normalizedAllowedRoles.includes(userRole);
  }, [normalizedAllowedRoles, userRole]);

  useEffect(() => {
    if (isLoading) return;

    // 1. Guest-only route (e.g., /login, /register) -> redirect authenticated users to their dashboard
    if (guestOnly && isAuthenticated) {
      if (redirectTo) {
        router.replace(redirectTo);
      } else if (userRole === "admin") {
        router.replace("/admin/dashboard");
      } else {
        router.replace("/dashboard");
      }
      return;
    }

    // 2. Auth required but user is NOT authenticated -> redirect to login with callback URL
    if (requireAuth && !isAuthenticated) {
      const search = typeof window !== "undefined" ? window.location.search : "";
      const fullPath = search ? `${pathname}${search}` : pathname;

      const targetLogin = redirectTo || `/login?redirect=${encodeURIComponent(fullPath)}`;
      router.replace(targetLogin);
      return;
    }

    // 3. User is authenticated but lacks required role -> redirect to appropriate dashboard
    if (requireAuth && isAuthenticated && !hasRequiredRole) {
      const targetPath = redirectTo || (userRole === "admin" ? "/admin/dashboard" : "/dashboard");
      router.replace(targetPath);
      return;
    }
  }, [
    isLoading,
    isAuthenticated,
    userRole,
    hasRequiredRole,
    requireAuth,
    guestOnly,
    redirectTo,
    pathname,
    router,
  ]);

  // Loading spinner state while checking authentication session
  if (isLoading) {
    if (fallback) return fallback;

    return (
      <div className="min-h-[65vh] w-full flex flex-col items-center justify-center p-6 bg-slate-50/50">
        <div className="relative flex items-center justify-center mb-4">
          <div className="w-14 h-14 rounded-full border-4 border-emerald-100 border-t-emerald-600 animate-spin" />
          <div className="absolute inset-0 flex items-center justify-center text-emerald-600">
            <ShieldCheck className="w-6 h-6" />
          </div>
        </div>
        <h3 className="text-slate-700 font-semibold text-base mb-1">
          Verifying Session
        </h3>
        <p className="text-slate-400 text-xs text-center max-w-xs">
          Checking your access permissions, please wait a moment...
        </p>
      </div>
    );
  }

  // Prevent flashing protected content during unauthorized state transitions
  if (guestOnly && isAuthenticated) {
    return null;
  }

  if (requireAuth && (!isAuthenticated || !hasRequiredRole)) {
    return null;
  }

  return <>{children}</>;
}
