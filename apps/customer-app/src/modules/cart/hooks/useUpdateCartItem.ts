import { useMutation, useQueryClient } from '@tanstack/react-query';

import { useLocationContext } from '../../addresses/hooks/useLocationContext';
import { updateCartItem } from '../api/customer-cart.api';
import { cartQueryKeys } from '../utils/cart-query-keys.util';

export function useUpdateCartItem() {
  const queryClient = useQueryClient();
  const { selectedStoreId } = useLocationContext();

  return useMutation({
    mutationFn: ({ itemId, quantity }: { itemId: string; quantity: number }) => {
      if (!selectedStoreId) {
        throw new Error('No store selected');
      }

      return updateCartItem({ storeId: selectedStoreId, itemId, quantity });
    },
    onSuccess: () => {
      if (selectedStoreId) {
        void queryClient.invalidateQueries({ queryKey: cartQueryKeys.byStore(selectedStoreId) });
      }
    },
  });
}
