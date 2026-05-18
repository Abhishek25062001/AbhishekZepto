import React from 'react';
import { Pressable, ScrollView, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { Button, ScreenWrapper, Text } from '../../../components/common';
import { spacing } from '../../../theme';
import {
  CUSTOMER_AVAILABILITY_LABELS,
  CUSTOMER_AVAILABILITY_OPTIONS,
  CUSTOMER_CATALOG_SORT_LABELS,
  CUSTOMER_CATALOG_SORT_OPTIONS,
  CUSTOMER_FOOD_TYPE_LABELS,
  CUSTOMER_FOOD_TYPE_OPTIONS,
} from '../constants/customer-catalog.constants';
import { useCustomerCatalogFacets } from '../hooks/useCustomerCatalogFacets';
import { useCustomerBrands } from '../hooks/useCustomerBrands';
import {
  selectRootCategories,
  useCustomerCategories,
} from '../hooks/useCustomerCategories';
import { useCatalogFilterStore } from '../store/catalog-filter.store';
import type { CatalogStackParamList } from '../navigation/catalog-navigation.types';

export function CatalogFiltersScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<CatalogStackParamList>>();
  const filters = useCatalogFilterStore();
  const categoriesQuery = useCustomerCategories();
  const brandsQuery = useCustomerBrands();
  const facetsQuery = useCustomerCatalogFacets();
  const rootCategories = selectRootCategories(categoriesQuery.data ?? []);
  const categoryCounts = new Map(
    (facetsQuery.data?.categories ?? []).map((bucket) => [bucket.id, bucket.count]),
  );
  const brandCounts = new Map(
    (facetsQuery.data?.brands ?? []).map((bucket) => [bucket.id, bucket.count]),
  );

  return (
    <ScreenWrapper scrollable={false}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text variant="h2">Filters</Text>
        <Text variant="h3">Category</Text>
        {rootCategories.map((category) => (
          <Pressable
            key={category.id}
            onPress={() => filters.setCatalogFilter('categoryId', category.id)}
          >
            <Text variant="small">
              {category.name}
              {categoryCounts.has(category.id) ? ` (${categoryCounts.get(category.id)})` : ''}
            </Text>
          </Pressable>
        ))}
        <Text variant="h3">Brand</Text>
        {(brandsQuery.data ?? []).map((brand) => (
          <Pressable key={brand.id} onPress={() => filters.setCatalogFilter('brandId', brand.id)}>
            <Text variant="small">
              {brand.name}
              {brandCounts.has(brand.id) ? ` (${brandCounts.get(brand.id)})` : ''}
            </Text>
          </Pressable>
        ))}
        <Text variant="h3">Food type</Text>
        {CUSTOMER_FOOD_TYPE_OPTIONS.map((foodType) => (
          <Pressable key={foodType} onPress={() => filters.setCatalogFilter('foodType', foodType)}>
            <Text variant="small">{CUSTOMER_FOOD_TYPE_LABELS[foodType]}</Text>
          </Pressable>
        ))}
        <Text variant="h3">Availability</Text>
        {CUSTOMER_AVAILABILITY_OPTIONS.map((availability) => (
          <Pressable
            key={availability}
            onPress={() => filters.setCatalogFilter('availability', availability)}
          >
            <Text variant="small">{CUSTOMER_AVAILABILITY_LABELS[availability]}</Text>
          </Pressable>
        ))}
        <Text variant="h3">Sort by</Text>
        {CUSTOMER_CATALOG_SORT_OPTIONS.map((sortBy) => (
          <Pressable key={sortBy} onPress={() => filters.setCatalogFilter('sortBy', sortBy)}>
            <Text variant="small">{CUSTOMER_CATALOG_SORT_LABELS[sortBy]}</Text>
          </Pressable>
        ))}
        <Button
          onPress={() => navigation.goBack()}
          title="Apply"
        />
        <Button
          onPress={() => {
            filters.resetCatalogFilters();
          }}
          title="Clear"
          variant="secondary"
        />
      </ScrollView>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  content: {
    gap: spacing.sm,
    paddingBottom: spacing.xl,
  },
});
