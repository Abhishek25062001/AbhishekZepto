import { useEffect, useState } from 'react';

import {
  hasPartialCustomerSession,
  isRestorableCustomerSession,
} from '../access-control/session-restore.util';
import {
  clearCustomerSession,
  loadCustomerSession,
} from '../services/auth/session-storage.service';
import { useAuthStore } from '../store/auth.store';
import { logCustomerAuthEvent } from '../utils/auth-event-logger';

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

      if (session && isRestorableCustomerSession(session)) {
        setAuthSession(session);
        logCustomerAuthEvent('session_restore_success', {
          customerId: session.customerId,
          role: session.role,
        });
      } else if (hasPartialCustomerSession(session)) {
        await clearCustomerSession();
        logCustomerAuthEvent('session_restore_failure', {
          reason: 'partial_session',
        });
      }

      // Refresh-token validation during restore is intentionally deferred.
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
