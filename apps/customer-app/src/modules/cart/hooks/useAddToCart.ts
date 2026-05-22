import { useMutation, useQueryClient } from '@tanstack/react-query';

import { useLocationContext } from '../../addresses/hooks/useLocationContext';
import { addCartItem } from '../api/customer-cart.api';
import { cartQueryKeys } from '../utils/cart-query-keys.util';

export function useAddToCart() {
  const queryClient = useQueryClient();
  const { selectedStoreId } = useLocationContext();

  return useMutation({
    mutationFn: ({ variantId, quantity = 1 }: { variantId: string; quantity?: number }) => {
      if (!selectedStoreId) {
        throw new Error('No store selected');
      }

      return addCartItem({ storeId: selectedStoreId, variantId, quantity });
    },
    onSuccess: () => {
      if (selectedStoreId) {
        void queryClient.invalidateQueries({ queryKey: cartQueryKeys.byStore(selectedStoreId) });
      }
    },
  });
}
