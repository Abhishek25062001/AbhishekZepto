import { useEffect, useState } from 'react';

import { loadVendorSession } from '../services/auth/session-storage.service';
import { useAuthStore } from '../store/auth.store';

export function useRestoreVendorSession() {
  const [isRestoringSession, setIsRestoringSession] = useState(true);
  const setAuthSession = useAuthStore((state) => state.setAuthSession);

  useEffect(() => {
    const session = loadVendorSession();

    if (session) {
      setAuthSession(session);
    }

    setIsRestoringSession(false);
  }, [setAuthSession]);

  return {
    isRestoringSession,
  };
}
