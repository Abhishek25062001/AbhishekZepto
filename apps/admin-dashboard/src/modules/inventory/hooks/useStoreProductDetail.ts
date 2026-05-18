import { useQuery } from '@tanstack/react-query';

import { getAdminStoreProductById } from '../api/store-product.api';

export function useStoreProductDetail(storeProductId: string | undefined) {
  return useQuery({
    queryKey: ['admin-store-product', storeProductId],
    queryFn: () => getAdminStoreProductById(storeProductId as string),
    enabled: Boolean(storeProductId),
  });
}
