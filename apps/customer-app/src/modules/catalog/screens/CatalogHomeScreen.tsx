import React, { useCallback } from 'react';
import { RefreshControl, ScrollView, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { Loader, ScreenWrapper, Text } from '../../../components/common';
import { useAuthStore } from '../../../store/auth.store';
import { BrandCard } from '../components/BrandCard';
import { CatalogErrorState } from '../components/CatalogErrorState';
import { CatalogHorizontalList } from '../components/CatalogHorizontalList';
import { CatalogListSkeleton } from '../components/CatalogListSkeleton';
import { CatalogSectionHeader } from '../components/CatalogSectionHeader';
import { CategoryCard } from '../components/CategoryCard';
import { CustomerSearchBar } from '../components/CustomerSearchBar';
import { ProductCard } from '../components/ProductCard';
import { RecentlyViewedProducts } from '../components/RecentlyViewedProducts';
import { ServiceabilityPlaceholderBanner } from '../components/ServiceabilityPlaceholderBanner';
import { selectRootCategories, useCustomerCategories } from '../hooks/useCustomerCategories';
import { useCustomerBrands } from '../hooks/useCustomerBrands';
import { useCustomerFeaturedProducts } from '../hooks/useCustomerFeaturedProducts';
import type { CatalogStackParamList } from '../navigation/catalog-navigation.types';
import type { CustomerBrand } from '../types/customer-brand.types';
import type { CustomerCategory } from '../types/customer-category.types';
import type { CustomerProduct } from '../types/customer-product.types';

export function CatalogHomeScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<CatalogStackParamList>>();
  const cityId = useAuthStore((state) => state.cityId);
  const [search, setSearch] = React.useState('');

  const categoriesQuery = useCustomerCategories();
  const brandsQuery = useCustomerBrands();
  const featuredQuery = useCustomerFeaturedProducts();

  const onRefresh = useCallback(() => {
    void categoriesQuery.refetch();
    void brandsQuery.refetch();
    void featuredQuery.refetch();
  }, [brandsQuery, categoriesQuery, featuredQuery]);

  const isRefreshing =
    categoriesQuery.isFetching || brandsQuery.isFetching || featuredQuery.isFetching;

  const rootCategories = selectRootCategories(categoriesQuery.data ?? []);

  const openCategory = (category: CustomerCategory) => {
    navigation.navigate('CategoryProducts', {
      categoryId: category.id,
      categoryName: category.name,
    });
  };

  const openBrand = (brand: CustomerBrand) => {
    navigation.navigate('BrandProducts', {
      brandId: brand.id,
      brandName: brand.name,
    });
  };

  const openProduct = (product: CustomerProduct) => {
    navigation.navigate('ProductDetail', { productId: product.id });
  };

  return (
    <ScreenWrapper scrollable={false}>
      <ScrollView
        contentContainerStyle={styles.scroll}
        refreshControl={<RefreshControl onRefresh={onRefresh} refreshing={isRefreshing} />}
      >
        <Text variant="h2">Catalog</Text>
        {!cityId ? <ServiceabilityPlaceholderBanner /> : null}
        <CustomerSearchBar
          onChangeText={setSearch}
          onSubmit={() => navigation.navigate('CatalogSearch')}
          value={search}
        />
        <CatalogSectionHeader
          actionLabel="Search"
          onActionPress={() => navigation.navigate('CatalogSearch')}
          title="Categories"
        />
        {categoriesQuery.isLoading ? <CatalogListSkeleton /> : null}
        {categoriesQuery.isError ? (
          <CatalogErrorState onRetry={() => void categoriesQuery.refetch()} />
        ) : (
          <CatalogHorizontalList
            data={rootCategories}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => <CategoryCard category={item} onPress={openCategory} />}
          />
        )}
        <CatalogSectionHeader title="Featured products" />
        {featuredQuery.isLoading ? <CatalogListSkeleton /> : null}
        {featuredQuery.isError ? (
          <CatalogErrorState onRetry={() => void featuredQuery.refetch()} />
        ) : (
          <CatalogHorizontalList
            data={featuredQuery.data?.items ?? []}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => <ProductCard onPress={openProduct} product={item} />}
          />
        )}
        <CatalogSectionHeader title="Browse by brand" />
        {brandsQuery.isLoading ? <Loader /> : null}
        {brandsQuery.isError ? (
          <CatalogErrorState onRetry={() => void brandsQuery.refetch()} />
        ) : (
          <CatalogHorizontalList
            data={brandsQuery.data ?? []}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => <BrandCard brand={item} onPress={openBrand} />}
          />
        )}
        <RecentlyViewedProducts onPressProduct={openProduct} />
      </ScrollView>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  scroll: {
    paddingBottom: 24,
  },
});
