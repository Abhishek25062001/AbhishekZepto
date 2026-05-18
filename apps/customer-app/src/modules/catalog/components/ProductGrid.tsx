import React from 'react';
import {
  FlatList,
  RefreshControl,
  StyleSheet,
  type ListRenderItem,
} from 'react-native';

import type { CustomerProduct } from '../types/customer-product.types';
import { ProductCard } from './ProductCard';
import { ProductGridSkeleton } from './ProductGridSkeleton';
import { CatalogEmptyState } from './CatalogEmptyState';

type ProductGridProps = {
  emptyVariant?: 'no_products' | 'no_search_results';
  isLoading?: boolean;
  isRefreshing?: boolean;
  onEndReached?: () => void;
  onPressProduct: (product: CustomerProduct) => void;
  onRefresh?: () => void;
  products: CustomerProduct[];
};

export function ProductGrid({
  emptyVariant = 'no_products',
  isLoading = false,
  isRefreshing = false,
  onEndReached,
  onPressProduct,
  onRefresh,
  products,
}: ProductGridProps) {
  const renderItem: ListRenderItem<CustomerProduct> = ({ item }) => (
    <ProductCard onPress={onPressProduct} product={item} />
  );

  if (isLoading && products.length === 0) {
    return <ProductGridSkeleton />;
  }

  return (
    <FlatList
      columnWrapperStyle={styles.row}
      contentContainerStyle={styles.list}
      data={products}
      keyExtractor={(item) => item.id}
      ListEmptyComponent={<CatalogEmptyState variant={emptyVariant} />}
      numColumns={2}
      onEndReached={onEndReached}
      onEndReachedThreshold={0.4}
      refreshControl={
        onRefresh ? (
          <RefreshControl onRefresh={onRefresh} refreshing={isRefreshing} />
        ) : undefined
      }
      renderItem={renderItem}
    />
  );
}

const styles = StyleSheet.create({
  list: {
    flexGrow: 1,
    paddingBottom: 16,
  },
  row: {
    justifyContent: 'space-between',
  },
});
