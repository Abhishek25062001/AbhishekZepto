import React, { useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { ScreenWrapper, Text } from '../../../components/common';
import { CustomerSearchBar } from '../components/CustomerSearchBar';
import { CatalogErrorState } from '../components/CatalogErrorState';
import { ProductGrid } from '../components/ProductGrid';
import { CUSTOMER_CATALOG_SEARCH_MIN_LENGTH } from '../constants/customer-catalog.constants';
import { usePaginatedCustomerCatalogSearch } from '../hooks/usePaginatedCustomerCatalogSearch';
import {
  selectRootCategories,
  useCustomerCategories,
} from '../hooks/useCustomerCategories';
import type { CatalogStackParamList } from '../navigation/catalog-navigation.types';
import type { CustomerProduct } from '../types/customer-product.types';

export function CatalogSearchScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<CatalogStackParamList>>();
  const [search, setSearch] = useState('');
  const searchQuery = usePaginatedCustomerCatalogSearch(search);
  const categoriesQuery = useCustomerCategories();
  const rootCategories = selectRootCategories(categoriesQuery.data ?? []);

  const openProduct = (product: CustomerProduct) => {
    navigation.navigate('ProductDetail', { productId: product.id });
  };

  const showResults = search.trim().length >= CUSTOMER_CATALOG_SEARCH_MIN_LENGTH;

  return (
    <ScreenWrapper scrollable={false}>
      <CustomerSearchBar autoFocus onChangeText={setSearch} value={search} />
      {!showResults ? (
        <>
          <Text variant="h3">Popular categories</Text>
          {rootCategories.slice(0, 6).map((category) => (
            <Text key={category.id} variant="small">
              {category.name}
            </Text>
          ))}
        </>
      ) : null}
      {showResults && searchQuery.isError ? (
        <CatalogErrorState onRetry={() => void searchQuery.refresh()} />
      ) : null}
      {showResults && !searchQuery.isError ? (
        <ProductGrid
          emptyVariant="no_search_results"
          hasNextPage={searchQuery.hasNextPage}
          isLoading={searchQuery.isLoading}
          isLoadingMore={searchQuery.isLoadingMore}
          isRefreshing={searchQuery.isFetching && !searchQuery.isLoadingMore}
          onEndReached={searchQuery.loadMore}
          onPressProduct={openProduct}
          onRefresh={() => void searchQuery.refresh()}
          products={searchQuery.items}
          showAddToCart
        />
      ) : null}
    </ScreenWrapper>
  );
}
