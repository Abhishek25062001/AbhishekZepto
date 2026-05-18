import React, { useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { ScreenWrapper, Text } from '../../../components/common';
import { CustomerSearchBar } from '../components/CustomerSearchBar';
import { CatalogEmptyState } from '../components/CatalogEmptyState';
import { CatalogErrorState } from '../components/CatalogErrorState';
import { ProductGrid } from '../components/ProductGrid';
import { CUSTOMER_CATALOG_SEARCH_MIN_LENGTH } from '../constants/customer-catalog.constants';
import { useCustomerCatalogSearch } from '../hooks/useCustomerCatalogSearch';
import {
  selectRootCategories,
  useCustomerCategories,
} from '../hooks/useCustomerCategories';
import type { CatalogStackParamList } from '../navigation/catalog-navigation.types';
import type { CustomerProduct } from '../types/customer-product.types';

export function CatalogSearchScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<CatalogStackParamList>>();
  const [search, setSearch] = useState('');
  const searchQuery = useCustomerCatalogSearch(search);
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
      {showResults && searchQuery.isLoading ? <Text variant="small">Searching...</Text> : null}
      {showResults && searchQuery.isError ? (
        <CatalogErrorState onRetry={() => void searchQuery.refetch()} />
      ) : null}
      {showResults && !searchQuery.isLoading && !searchQuery.isError ? (
        <ProductGrid
          emptyVariant="no_search_results"
          onPressProduct={openProduct}
          products={searchQuery.data?.items ?? []}
        />
      ) : null}
      {showResults &&
      !searchQuery.isLoading &&
      !searchQuery.isError &&
      (searchQuery.data?.items.length ?? 0) === 0 ? (
        <CatalogEmptyState variant="no_search_results" />
      ) : null}
    </ScreenWrapper>
  );
}
