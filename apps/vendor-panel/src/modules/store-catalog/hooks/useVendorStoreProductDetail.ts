import { useQuery } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';

import { getVendorStoreProductById } from '../api/vendor-store-product.api';

export function useVendorStoreProductDetail(storeProductId?: string) {
  const params = useParams<{ storeProductId: string }>();
  const id = storeProductId ?? params.storeProductId;

  return useQuery({
    queryKey: ['vendor-store-product', id],
    queryFn: () => getVendorStoreProductById(id!),
    enabled: Boolean(id),
  });
}
