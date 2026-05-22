import { useMutation } from '@tanstack/react-query';

import { selectStoreForCustomer } from '../api/customer-address.api';
import { useLocationStore } from '../store/location.store';
import type { SelectStoreInput } from '../types/serviceability.types';

export function useSelectStore() {
  const setSelectedLocation = useLocationStore((state) => state.setSelectedLocation);

  return useMutation({
    mutationFn: (input: SelectStoreInput) => selectStoreForCustomer(input),
    onSuccess: async (result) => {
      await setSelectedLocation({
        addressId: result.addressId,
        storeId: result.storeId,
        storeName: result.storeName,
        cityId: result.cityId,
      });
    },
  });
}
