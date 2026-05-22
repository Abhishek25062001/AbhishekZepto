import React, { useCallback } from 'react';
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
import { CatalogListFooter } from './CatalogListFooter';

type ProductGridProps = {
  emptyVariant?: 'no_products' | 'no_search_results';
  hasNextPage?: boolean;
  isLoading?: boolean;
  isLoadingMore?: boolean;
  isRefreshing?: boolean;
  listFooterErrorMessage?: string | null;
  onEndReached?: () => void;
  onPressProduct: (product: CustomerProduct) => void;
  onRefresh?: () => void;
  onRetryLoadMore?: () => void;
  products: CustomerProduct[];
  showAddToCart?: boolean;
};

export function ProductGrid({
  emptyVariant = 'no_products',
  hasNextPage = false,
  isLoading = false,
  isLoadingMore = false,
  isRefreshing = false,
  listFooterErrorMessage,
  onEndReached,
  onPressProduct,
  onRefresh,
  onRetryLoadMore,
  products,
  showAddToCart = false,
}: ProductGridProps) {
  const renderItem: ListRenderItem<CustomerProduct> = ({ item }) => (
    <ProductCard onPress={onPressProduct} product={item} showAddToCart={showAddToCart} />
  );

  const handleEndReached = useCallback(() => {
    if (!hasNextPage || isLoadingMore) {
      return;
    }
    onEndReached?.();
  }, [hasNextPage, isLoadingMore, onEndReached]);

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
      ListFooterComponent={
        <CatalogListFooter
          errorMessage={listFooterErrorMessage}
          hasItems={products.length > 0}
          hasNextPage={hasNextPage}
          isLoadingMore={isLoadingMore}
          onRetry={onRetryLoadMore}
        />
      }
      numColumns={2}
      onEndReached={handleEndReached}
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
