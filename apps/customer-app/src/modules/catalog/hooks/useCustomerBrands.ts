import { useQuery } from '@tanstack/react-query';

import { useAuthStore } from '../../../store/auth.store';
import { getCustomerBrands } from '../api/customer-catalog.api';

export function useCustomerBrands() {
  const cityId = useAuthStore((state) => state.cityId);

  return useQuery({
    queryKey: ['customer-catalog-brands', cityId],
    queryFn: () => getCustomerBrands(cityId),
  });
}
