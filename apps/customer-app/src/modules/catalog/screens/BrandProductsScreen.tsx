import React, { useMemo } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RouteProp } from '@react-navigation/native';

import { ScreenWrapper, Text } from '../../../components/common';
import { spacing } from '../../../theme';
import { CatalogErrorState } from '../components/CatalogErrorState';
import { ProductGrid } from '../components/ProductGrid';
import { usePaginatedCustomerProducts } from '../hooks/usePaginatedCustomerProducts';
import { useCatalogFilterStore } from '../store/catalog-filter.store';
import type { CatalogStackParamList } from '../navigation/catalog-navigation.types';
import type { CustomerProduct } from '../types/customer-product.types';

export function BrandProductsScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<CatalogStackParamList>>();
  const route = useRoute<RouteProp<CatalogStackParamList, 'BrandProducts'>>();
  const { brandId, brandName } = route.params;

  const filterAvailability = useCatalogFilterStore((state) => state.availability);
  const filterSortBy = useCatalogFilterStore((state) => state.sortBy);
  const filterFoodType = useCatalogFilterStore((state) => state.foodType);
  const toListQuery = useCatalogFilterStore((state) => state.toListQuery);

  const listQuery = useMemo(
    () => ({
      ...toListQuery(),
      brandId,
    }),
    [brandId, filterAvailability, filterSortBy, filterFoodType, toListQuery],
  );

  const productsQuery = usePaginatedCustomerProducts(listQuery);

  const openProduct = (product: CustomerProduct) => {
    navigation.navigate('ProductDetail', { productId: product.id });
  };

  return (
    <ScreenWrapper scrollable={false}>
      <View style={styles.header}>
        <Text variant="h2">{brandName}</Text>
        <Pressable onPress={() => navigation.navigate('CatalogFilters')}>
          <Text color="secondary" variant="small">
            Filters
          </Text>
        </Pressable>
      </View>
      {productsQuery.pagination ? (
        <Text color="secondary" variant="small">
          {productsQuery.total} products
        </Text>
      ) : null}
      {productsQuery.isError ? (
        <CatalogErrorState onRetry={() => void productsQuery.refresh()} />
      ) : (
        <ProductGrid
          hasNextPage={productsQuery.hasNextPage}
          isLoading={productsQuery.isLoading}
          isLoadingMore={productsQuery.isLoadingMore}
          isRefreshing={productsQuery.isFetching && !productsQuery.isLoadingMore}
          onEndReached={productsQuery.loadMore}
          onPressProduct={openProduct}
          onRefresh={() => void productsQuery.refresh()}
          products={productsQuery.items}
          showAddToCart
        />
      )}
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  header: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.md,
  },
});
