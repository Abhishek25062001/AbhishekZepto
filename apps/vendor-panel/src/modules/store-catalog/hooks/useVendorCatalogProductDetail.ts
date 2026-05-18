import { useQuery } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';

import { getVendorCatalogProductById } from '../api/vendor-catalog.api';

export function useVendorCatalogProductDetail() {
  const { productId } = useParams<{ productId: string }>();

  return useQuery({
    queryKey: ['vendor-catalog-product', productId],
    queryFn: () => getVendorCatalogProductById(productId!),
    enabled: Boolean(productId),
  });
}
