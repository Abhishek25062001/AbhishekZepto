import { useMutation, useQueryClient } from '@tanstack/react-query';

import { cancelCheckout } from '../api/customer-checkout.api';
import { checkoutQueryKeys } from '../utils/checkout-query-keys.util';
import {
  clearActiveCheckoutSessionId,
  getActiveCheckoutSessionId,
} from '../utils/checkout-session-storage.util';

export function useCancelCheckout() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (reason?: string) => {
      const checkoutSessionId = getActiveCheckoutSessionId();

      if (!checkoutSessionId) {
        throw new Error('No active checkout session');
      }

      return cancelCheckout({ checkoutSessionId, reason });
    },
    onSuccess: () => {
      clearActiveCheckoutSessionId();
      void queryClient.invalidateQueries({ queryKey: checkoutQueryKeys.summary() });
    },
  });
}
