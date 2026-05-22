import { useEffect } from 'react';

import { useAuthStore } from '../../../store/auth.store';
import { useLocationStore } from '../store/location.store';

export function useLocationContext() {
  const cityIdFromAuth = useAuthStore((state) => state.cityId);
  const selectedAddressId = useLocationStore((state) => state.selectedAddressId);
  const selectedStoreId = useLocationStore((state) => state.selectedStoreId);
  const selectedStoreName = useLocationStore((state) => state.selectedStoreName);
  const cityIdFromLocation = useLocationStore((state) => state.cityId);
  const isHydrated = useLocationStore((state) => state.isHydrated);
  const hydrateLocation = useLocationStore((state) => state.hydrateLocation);

  useEffect(() => {
    if (!isHydrated) {
      void hydrateLocation();
    }
  }, [hydrateLocation, isHydrated]);

  return {
    selectedAddressId,
    selectedStoreId,
    selectedStoreName,
    cityId: cityIdFromLocation ?? cityIdFromAuth,
    hasStore: Boolean(selectedStoreId),
    isHydrated,
  };
}
