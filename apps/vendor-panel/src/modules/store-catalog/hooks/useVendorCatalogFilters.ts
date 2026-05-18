import { useQuery } from '@tanstack/react-query';

import {
  getVendorCatalogBrands,
  getVendorCatalogCategories,
  getVendorCatalogProductVariants,
} from '../api/vendor-catalog.api';

export function useVendorCatalogFilters() {
  const categoriesQuery = useQuery({
    queryKey: ['vendor-catalog-categories'],
    queryFn: getVendorCatalogCategories,
    staleTime: 5 * 60 * 1000,
  });

  const brandsQuery = useQuery({
    queryKey: ['vendor-catalog-brands'],
    queryFn: getVendorCatalogBrands,
    staleTime: 5 * 60 * 1000,
  });

  return {
    brands: brandsQuery.data ?? [],
    brandsQuery,
    categories: categoriesQuery.data ?? [],
    categoriesQuery,
  };
}

export function useVendorCatalogProductVariants(productId: string | undefined) {
  return useQuery({
    queryKey: ['vendor-catalog-variants', productId],
    queryFn: () => getVendorCatalogProductVariants(productId!),
    enabled: Boolean(productId),
    staleTime: 60 * 1000,
  });
}
