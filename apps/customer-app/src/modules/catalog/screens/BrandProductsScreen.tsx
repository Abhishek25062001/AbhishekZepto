import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RouteProp } from '@react-navigation/native';

import { ScreenWrapper, Text } from '../../../components/common';
import { spacing } from '../../../theme';
import { CatalogErrorState } from '../components/CatalogErrorState';
import { ProductGrid } from '../components/ProductGrid';
import { useCustomerProducts } from '../hooks/useCustomerProducts';
import { useCatalogFilterStore } from '../store/catalog-filter.store';
import type { CatalogStackParamList } from '../navigation/catalog-navigation.types';
import type { CustomerProduct } from '../types/customer-product.types';

export function BrandProductsScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<CatalogStackParamList>>();
  const route = useRoute<RouteProp<CatalogStackParamList, 'BrandProducts'>>();
  const { brandId, brandName } = route.params;
  const filterQuery = useCatalogFilterStore((state) => state.toListQuery());

  const productsQuery = useCustomerProducts({
    ...filterQuery,
    brandId,
  });

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
      {productsQuery.data?.pagination ? (
        <Text color="secondary" variant="small">
          {productsQuery.data.pagination.total} products
        </Text>
      ) : null}
      {productsQuery.isError ? (
        <CatalogErrorState onRetry={() => void productsQuery.refetch()} />
      ) : (
        <ProductGrid
          isLoading={productsQuery.isLoading}
          isRefreshing={productsQuery.isFetching}
          onPressProduct={openProduct}
          onRefresh={() => void productsQuery.refetch()}
          products={productsQuery.data?.items ?? []}
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
