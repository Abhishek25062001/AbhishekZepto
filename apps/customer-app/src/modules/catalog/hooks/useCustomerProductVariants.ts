import { useQuery } from '@tanstack/react-query';

import { useAuthStore } from '../../../store/auth.store';
import { getCustomerProductVariants } from '../api/customer-catalog.api';

export function useCustomerProductVariants(productId: string | undefined) {
  const cityId = useAuthStore((state) => state.cityId);

  return useQuery({
    queryKey: ['customer-catalog-variants', productId, cityId],
    queryFn: () => getCustomerProductVariants(productId as string, cityId),
    enabled: Boolean(productId),
  });
}
