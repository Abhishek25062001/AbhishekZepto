import { useMutation, useQueryClient } from '@tanstack/react-query';

import { useLocationContext } from '../../addresses/hooks/useLocationContext';
import { removeCartItem } from '../api/customer-cart.api';
import { cartQueryKeys } from '../utils/cart-query-keys.util';

export function useRemoveCartItem() {
  const queryClient = useQueryClient();
  const { selectedStoreId } = useLocationContext();

  return useMutation({
    mutationFn: (itemId: string) => {
      if (!selectedStoreId) {
        throw new Error('No store selected');
      }

      return removeCartItem(selectedStoreId, itemId);
    },
    onSuccess: () => {
      if (selectedStoreId) {
        void queryClient.invalidateQueries({ queryKey: cartQueryKeys.byStore(selectedStoreId) });
      }
    },
  });
}
