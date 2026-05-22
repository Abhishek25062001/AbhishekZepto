import { useMutation, useQueryClient } from '@tanstack/react-query';

import { useLocationContext } from '../../addresses/hooks/useLocationContext';
import { clearCustomerCart } from '../api/customer-cart.api';
import { cartQueryKeys } from '../utils/cart-query-keys.util';

export function useClearCart() {
  const queryClient = useQueryClient();
  const { selectedStoreId } = useLocationContext();

  return useMutation({
    mutationFn: () => {
      if (!selectedStoreId) {
        throw new Error('No store selected');
      }

      return clearCustomerCart(selectedStoreId);
    },
    onSuccess: () => {
      if (selectedStoreId) {
        void queryClient.invalidateQueries({ queryKey: cartQueryKeys.byStore(selectedStoreId) });
      }
    },
  });
}
