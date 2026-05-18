import { useQuery } from '@tanstack/react-query';

import { useAuthStore } from '../../../store/auth.store';
import { getCustomerProductById } from '../api/customer-catalog.api';

export function useCustomerProductDetail(productId: string | undefined) {
  const cityId = useAuthStore((state) => state.cityId);

  return useQuery({
    queryKey: ['customer-catalog-product', productId, cityId],
    queryFn: () => getCustomerProductById(productId as string, cityId),
    enabled: Boolean(productId),
  });
}
