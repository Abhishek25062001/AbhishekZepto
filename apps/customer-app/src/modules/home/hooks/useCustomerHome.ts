import { useQuery } from '@tanstack/react-query';

import { useLocationContext } from '../../addresses/hooks/useLocationContext';
import { getCustomerHomeFeed } from '../api/customer-home.api';

export function useCustomerHome() {
  const { selectedStoreId, cityId } = useLocationContext();

  return useQuery({
    queryKey: ['customer-home', selectedStoreId, cityId],
    queryFn: () =>
      getCustomerHomeFeed({
        storeId: selectedStoreId!,
        ...(cityId ? { cityId } : {}),
      }),
    enabled: Boolean(selectedStoreId),
  });
}
