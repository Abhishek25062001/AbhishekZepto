import React, { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';

import { getCustomerProductById } from '../api/customer-catalog.api';
import { useAuthStore } from '../../../store/auth.store';
import { getRecentlyViewedProductIds } from '../utils/recently-viewed-products.util';
import { CatalogSectionHeader } from './CatalogSectionHeader';
import { CatalogHorizontalList } from './CatalogHorizontalList';
import { ProductCard } from './ProductCard';
import type { CustomerProduct } from '../types/customer-product.types';

type RecentlyViewedProductsProps = {
  onPressProduct: (product: CustomerProduct) => void;
};

export function RecentlyViewedProducts({ onPressProduct }: RecentlyViewedProductsProps) {
  const cityId = useAuthStore((state) => state.cityId);
  const [productIds, setProductIds] = useState<string[]>([]);

  useEffect(() => {
    void getRecentlyViewedProductIds().then(setProductIds);
  }, []);

  const { data: products = [] } = useQuery({
    queryKey: ['customer-recently-viewed', productIds, cityId],
    enabled: productIds.length > 0,
    queryFn: async () => {
      const results = await Promise.all(
        productIds.map((id) => getCustomerProductById(id, cityId).catch(() => null)),
      );
      return results.filter((product): product is CustomerProduct => product !== null);
    },
  });

  if (products.length === 0) {
    return null;
  }

  return (
    <>
      <CatalogSectionHeader title="Recently viewed" />
      <CatalogHorizontalList
        data={products}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <ProductCard onPress={onPressProduct} product={item} />
        )}
      />
    </>
  );
}
