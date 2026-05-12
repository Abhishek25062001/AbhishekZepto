import { useEffect, useState } from 'react';

import { loadCustomerSession } from '../services/auth/session-storage.service';
import { useAuthStore } from '../store/auth.store';

export function useRestoreCustomerSession() {
  const setAuthSession = useAuthStore((state) => state.setAuthSession);
  const [isRestoringSession, setIsRestoringSession] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const restoreSession = async () => {
      const session = await loadCustomerSession();

      if (!isMounted) {
        return;
      }

      if (session) {
        setAuthSession(session);
      }

      setIsRestoringSession(false);
    };

    void restoreSession();

    return () => {
      isMounted = false;
    };
  }, [setAuthSession]);

  return {
    isRestoringSession,
  };
}

