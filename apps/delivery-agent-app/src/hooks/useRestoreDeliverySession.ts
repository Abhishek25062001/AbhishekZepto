import { useEffect, useState } from 'react';

import { loadDeliverySession } from '../services/auth/session-storage.service';
import { useAuthStore } from '../store/auth.store';

export function useRestoreDeliverySession() {
  const setAuthSession = useAuthStore((state) => state.setAuthSession);
  const [isRestoringSession, setIsRestoringSession] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const restoreSession = async () => {
      const session = await loadDeliverySession();

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

