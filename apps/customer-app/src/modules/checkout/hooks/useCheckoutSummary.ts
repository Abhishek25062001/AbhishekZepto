import { useQuery } from '@tanstack/react-query';

import { getCheckoutSummary } from '../api/customer-checkout.api';
import { checkoutQueryKeys } from '../utils/checkout-query-keys.util';
import { getActiveCheckoutSessionId } from '../utils/checkout-session-storage.util';

export function useCheckoutSummary(enabled = true) {
  const checkoutSessionId = getActiveCheckoutSessionId();

  return useQuery({
    queryKey: checkoutQueryKeys.summary(checkoutSessionId ?? undefined),
    queryFn: () =>
      getCheckoutSummary(
        checkoutSessionId ? { checkoutSessionId } : undefined,
      ),
    enabled: enabled && Boolean(checkoutSessionId),
  });
}
