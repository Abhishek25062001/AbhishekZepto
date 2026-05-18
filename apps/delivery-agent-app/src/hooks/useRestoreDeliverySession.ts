import { useEffect, useState } from 'react';

import {
  hasPartialDeliverySession,
  isRestorableDeliverySession,
} from '../access-control/session-restore.util';
import {
  clearDeliverySession,
  loadDeliverySession,
} from '../services/auth/session-storage.service';
import { useAuthStore } from '../store/auth.store';
import { logDeliveryAuthEvent } from '../utils/auth-event-logger';

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

      if (session && isRestorableDeliverySession(session)) {
        setAuthSession(session);
        logDeliveryAuthEvent('session_restore_success', {
          deliveryAgentId: session.deliveryAgentId,
          role: session.role,
        });
      } else if (hasPartialDeliverySession(session)) {
        await clearDeliverySession();
        logDeliveryAuthEvent('session_restore_failure', {
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
