import { useQuery } from '@tanstack/react-query';

import { getAdminProductById } from '../api/product.api';

export function useProductDetail(productId: string | undefined) {
  return useQuery({
    queryKey: ['admin-product', productId],
    queryFn: () => getAdminProductById(productId!),
    enabled: Boolean(productId),
  });
}
