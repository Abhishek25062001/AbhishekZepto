import { useEffect, useState } from 'react';

import { clearAdminSession, loadAdminSession } from '../services/auth/session-storage.service';
import { useAuthStore } from '../store/auth.store';
import { logAdminAuthEvent } from '../utils/auth-event-logger';

export function useRestoreAdminSession() {
  const [isRestoringSession, setIsRestoringSession] = useState(true);
  const clearAuthSession = useAuthStore((state) => state.clearAuthSession);
  const setAuthSession = useAuthStore((state) => state.setAuthSession);

  useEffect(() => {
    const session = loadAdminSession();

    if (session?.accessToken && session.refreshToken && session.adminId) {
      setAuthSession(session);
      logAdminAuthEvent('session_restore_success', {
        adminId: session.adminId,
        role: session.role,
      });
    } else if (session) {
      clearAdminSession();
      clearAuthSession();
      logAdminAuthEvent('session_restore_failure', {
        reason: 'partial_session',
      });
    }

    setIsRestoringSession(false);
  }, [clearAuthSession, setAuthSession]);

  return {
    isRestoringSession,
  };
}
