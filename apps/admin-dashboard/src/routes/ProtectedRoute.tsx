import { useEffect } from 'react';
import type { PropsWithChildren } from 'react';
import { Navigate } from 'react-router-dom';

import { resolveAdminProtectedRoute } from '../access-control/protected-route.util';
import { clearAdminSession } from '../services/auth/session-storage.service';
import { useAuthStore } from '../store/auth.store';

export function ProtectedRoute({ children }: PropsWithChildren) {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const role = useAuthStore((state) => state.role);
  const clearAuthSession = useAuthStore((state) => state.clearAuthSession);

  const routeDecision = resolveAdminProtectedRoute({
    isAuthenticated,
    role,
  });

  useEffect(() => {
    if (isAuthenticated && routeDecision === 'redirect-login') {
      clearAdminSession();
      clearAuthSession();
    }
  }, [clearAuthSession, isAuthenticated, routeDecision]);

  if (routeDecision === 'redirect-login') {
    return <Navigate to="/login" replace />;
  }

  return children;
}
