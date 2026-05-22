import { useMutation, useQueryClient } from '@tanstack/react-query';

import { useLocationContext } from '../../addresses/hooks/useLocationContext';
import { initiateCheckout } from '../api/customer-checkout.api';
import type { InitiateCheckoutInput } from '../types/checkout.types';
import { checkoutQueryKeys } from '../utils/checkout-query-keys.util';
import {
  clearActiveCheckoutSessionId,
  setActiveCheckoutSessionId,
} from '../utils/checkout-session-storage.util';

export function useInitiateCheckout() {
  const queryClient = useQueryClient();
  const { selectedStoreId } = useLocationContext();

  return useMutation({
    mutationFn: (input: Omit<InitiateCheckoutInput, 'storeId'>) => {
      if (!selectedStoreId) {
        throw new Error('No store selected');
      }

      return initiateCheckout({
        ...input,
        storeId: selectedStoreId,
      });
    },
    onSuccess: (data) => {
      setActiveCheckoutSessionId(data.checkoutSessionId);
      void queryClient.invalidateQueries({
        queryKey: checkoutQueryKeys.summary(data.checkoutSessionId),
      });
    },
    onError: () => {
      clearActiveCheckoutSessionId();
    },
  });
}
