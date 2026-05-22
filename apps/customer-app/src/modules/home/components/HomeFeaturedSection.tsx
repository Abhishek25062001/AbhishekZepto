import React from 'react';

import { Text } from '../../../components/common';
import { CatalogHorizontalList } from '../../catalog/components/CatalogHorizontalList';
import { CatalogSectionHeader } from '../../catalog/components/CatalogSectionHeader';
import { ProductCard } from '../../catalog/components/ProductCard';
import type { CustomerProduct } from '../../catalog/types/customer-product.types';

type HomeFeaturedSectionProps = {
  onPressProduct: (product: CustomerProduct) => void;
  products: CustomerProduct[];
  showAddToCart?: boolean;
};

export function HomeFeaturedSection({
  onPressProduct,
  products,
  showAddToCart = false,
}: HomeFeaturedSectionProps) {
  if (products.length === 0) {
    return <Text color="secondary" variant="small">No featured products right now.</Text>;
  }

  return (
    <>
      <CatalogSectionHeader title="Featured" />
      <CatalogHorizontalList
        data={products}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <ProductCard onPress={onPressProduct} product={item} showAddToCart={showAddToCart} />
        )}
      />
    </>
  );
}
