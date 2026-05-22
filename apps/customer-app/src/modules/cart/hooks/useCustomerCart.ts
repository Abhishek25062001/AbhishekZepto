import { useCallback, useState } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { useQuery } from '@tanstack/react-query';

import { useLocationContext } from '../../addresses/hooks/useLocationContext';
import { getCustomerCart } from '../api/customer-cart.api';
import { cartQueryKeys } from '../utils/cart-query-keys.util';
import { createEmptyCart, getCartItemCount } from '../utils/cart-display.util';
import {
  isCartNotFoundError,
  isCartPriceChangedError,
} from '../utils/customer-cart-error-message.util';

type UseCustomerCartOptions = {
  validateOnFocus?: boolean;
};

export function useCustomerCart(options?: UseCustomerCartOptions) {
  const { selectedStoreId } = useLocationContext();
  const [priceChanged, setPriceChanged] = useState(false);

  const query = useQuery({
    queryKey: cartQueryKeys.byStore(selectedStoreId ?? ''),
    queryFn: async () => {
      try {
        return await getCustomerCart(selectedStoreId!);
      } catch (error) {
        if (isCartNotFoundError(error)) {
          return createEmptyCart(selectedStoreId!);
        }
        throw error;
      }
    },
    enabled: Boolean(selectedStoreId),
  });

  const cart = query.data;
  const itemCount = getCartItemCount(cart);

  const checkPriceDrift = useCallback(async () => {
    if (!selectedStoreId) {
      return;
    }

    try {
      await getCustomerCart(selectedStoreId, { validatePrices: true });
      setPriceChanged(false);
    } catch (error) {
      if (isCartPriceChangedError(error)) {
        setPriceChanged(true);
      }
    }
  }, [selectedStoreId]);

  useFocusEffect(
    useCallback(() => {
      if (options?.validateOnFocus) {
        void checkPriceDrift();
      }
    }, [checkPriceDrift, options?.validateOnFocus]),
  );

  const clearPriceChanged = useCallback(() => {
    setPriceChanged(false);
  }, []);

  return {
    ...query,
    cart,
    itemCount,
    grandTotal: cart?.grandTotal ?? 0,
    hasItems: itemCount > 0,
    priceChanged,
    clearPriceChanged,
    checkPriceDrift,
  };
}
