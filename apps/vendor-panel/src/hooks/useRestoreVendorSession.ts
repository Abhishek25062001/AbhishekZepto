import { useEffect, useState } from 'react';

import { clearVendorSession, loadVendorSession } from '../services/auth/session-storage.service';
import { useAuthStore } from '../store/auth.store';
import { logVendorAuthEvent } from '../utils/auth-event-logger';

export function useRestoreVendorSession() {
  const [isRestoringSession, setIsRestoringSession] = useState(true);
  const clearAuthSession = useAuthStore((state) => state.clearAuthSession);
  const setAuthSession = useAuthStore((state) => state.setAuthSession);

  useEffect(() => {
    const session = loadVendorSession();

    if (session?.accessToken && session.refreshToken && session.vendorUserId) {
      setAuthSession(session);
      logVendorAuthEvent('session_restore_success', {
        role: session.role,
        vendorUserId: session.vendorUserId,
      });
    } else if (session) {
      clearVendorSession();
      clearAuthSession();
      logVendorAuthEvent('session_restore_failure', {
        reason: 'partial_session',
      });
    }

    setIsRestoringSession(false);
  }, [clearAuthSession, setAuthSession]);

  return {
    isRestoringSession,
  };
}
