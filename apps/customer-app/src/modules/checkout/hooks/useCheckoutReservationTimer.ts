import { useEffect, useState } from 'react';

import {
  computeCheckoutReservationTimer,
  type CheckoutReservationTimerState,
} from '../utils/checkout-reservation-timer.util';

export function useCheckoutReservationTimer(
  expiresAt: string | null,
  onExpired?: () => void,
): CheckoutReservationTimerState {
  const [state, setState] = useState(() => computeCheckoutReservationTimer(expiresAt));

  useEffect(() => {
    const update = () => {
      const next = computeCheckoutReservationTimer(expiresAt);

      setState((previous) => {
        if (!previous.isExpired && next.isExpired) {
          onExpired?.();
        }

        return next;
      });
    };

    update();
    const intervalId = setInterval(update, 1000);

    return () => clearInterval(intervalId);
  }, [expiresAt, onExpired]);

  return state;
}
