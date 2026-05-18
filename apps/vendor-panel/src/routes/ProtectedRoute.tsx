import { useEffect } from 'react';
import type { PropsWithChildren } from 'react';
import { Navigate } from 'react-router-dom';

import { resolveVendorProtectedRoute } from '../access-control/protected-route.util';
import { clearVendorSession } from '../services/auth/session-storage.service';
import { useAuthStore } from '../store/auth.store';

export function ProtectedRoute({ children }: PropsWithChildren) {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const role = useAuthStore((state) => state.role);
  const vendorId = useAuthStore((state) => state.vendorId);
  const storeId = useAuthStore((state) => state.storeId);
  const clearAuthSession = useAuthStore((state) => state.clearAuthSession);

  const routeDecision = resolveVendorProtectedRoute({
    isAuthenticated,
    role,
    vendorId,
    storeId,
  });

  useEffect(() => {
    if (isAuthenticated && routeDecision === 'redirect-login') {
      clearVendorSession();
      clearAuthSession();
    }
  }, [clearAuthSession, isAuthenticated, routeDecision]);

  if (routeDecision === 'redirect-login') {
    return <Navigate to="/login" replace />;
  }

  return children;
}
