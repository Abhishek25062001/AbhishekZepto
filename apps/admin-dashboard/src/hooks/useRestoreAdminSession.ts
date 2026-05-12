import { useEffect, useState } from 'react';

import { loadAdminSession } from '../services/auth/session-storage.service';
import { useAuthStore } from '../store/auth.store';

export function useRestoreAdminSession() {
  const [isRestoringSession, setIsRestoringSession] = useState(true);
  const setAuthSession = useAuthStore((state) => state.setAuthSession);

  useEffect(() => {
    const session = loadAdminSession();

    if (session) {
      setAuthSession(session);
    }

    setIsRestoringSession(false);
  }, [setAuthSession]);

  return {
    isRestoringSession,
  };
}
