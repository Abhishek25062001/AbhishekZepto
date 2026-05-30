import React, { useCallback } from 'react';
import { RefreshControl, ScrollView, StyleSheet, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { Button, Loader, ScreenWrapper } from '../../../components/common';
import { isDevelopment } from '../../../config/env';
import type { MainStackParamList } from '../../../app/navigation.types';
import { useLocationContext } from '../../addresses/hooks/useLocationContext';
import type { CustomerCategory } from '../../catalog/types/customer-category.types';
import type { CustomerProduct } from '../../catalog/types/customer-product.types';
import { HomeCategoriesSection } from '../components/HomeCategoriesSection';
import { HomeEmptyState } from '../components/HomeEmptyState';
import { HomeErrorState } from '../components/HomeErrorState';
import { HomeFeaturedSection } from '../components/HomeFeaturedSection';
import { HomeLocationHeader } from '../components/HomeLocationHeader';
import { HomeServiceabilityBanner } from '../components/HomeServiceabilityBanner';
import { CartBottomBar } from '../../cart/components/CartBottomBar';
import { NotificationBell } from '../../notification-center/components/NotificationBell';
import { useCustomerHome } from '../hooks/useCustomerHome';
import { getCustomerHomeErrorMessage } from '../utils/customer-home-error-message.util';

export function CustomerHomeScreen() {
  const mainNavigation = useNavigation<NativeStackNavigationProp<MainStackParamList>>();
  const { hasStore, selectedStoreName } = useLocationContext();
  const homeQuery = useCustomerHome();

  const onRefresh = useCallback(() => {
    void homeQuery.refetch();
  }, [homeQuery]);

  const openCatalog = () => {
    mainNavigation.navigate('Catalog', { screen: 'CatalogHome' });
  };

  const openChangeLocation = () => {
    mainNavigation.navigate('Addresses', { screen: 'AddressList' });
  };

  const openCategory = (category: CustomerCategory) => {
    mainNavigation.navigate('Catalog', {
      screen: 'CategoryProducts',
      params: { categoryId: category.id, categoryName: category.name },
    } as never);
  };

  const openProduct = (product: CustomerProduct) => {
    mainNavigation.navigate('Catalog', {
      screen: 'ProductDetail',
      params: { productId: product.id },
    } as never);
  };

  if (!hasStore) {
    return (
      <ScreenWrapper>
        <HomeEmptyState />
        <Button onPress={openChangeLocation} title="Set delivery location" />
      </ScreenWrapper>
    );
  }

  if (homeQuery.isLoading && !homeQuery.data) {
    return (
      <ScreenWrapper>
        <Loader />
      </ScreenWrapper>
    );
  }

  if (homeQuery.isError) {
    return (
      <ScreenWrapper>
        <HomeErrorState
          message={getCustomerHomeErrorMessage(homeQuery.error, 'Unable to load home feed.')}
          onRetry={() => void homeQuery.refetch()}
        />
      </ScreenWrapper>
    );
  }

  const feed = homeQuery.data;

  return (
    <ScreenWrapper scrollable={false}>
      <View style={styles.container}>
        <ScrollView
          contentContainerStyle={styles.scroll}
          refreshControl={
            <RefreshControl onRefresh={onRefresh} refreshing={homeQuery.isFetching} />
          }
        >
          <HomeLocationHeader
            onChangeLocation={openChangeLocation}
            storeName={feed?.store.name ?? selectedStoreName ?? 'Store'}
          />
          <NotificationBell onPress={() => mainNavigation.navigate('NotificationCenter')} />
          {feed && !feed.serviceability.isServiceable && feed.serviceability.message ? (
            <HomeServiceabilityBanner message={feed.serviceability.message} />
          ) : null}
          {feed ? (
            <>
              <HomeCategoriesSection
                categories={feed.categories.items}
                onPressCategory={openCategory}
              />
              <HomeFeaturedSection
                onPressProduct={openProduct}
                products={feed.featuredProducts.items}
                showAddToCart
              />
            </>
          ) : null}
          <Button onPress={openCatalog} title="Browse all" variant="secondary" />
          {isDevelopment ? (
            <Button
              onPress={() => mainNavigation.navigate('Debug')}
              title="Open debug"
              variant="ghost"
            />
          ) : null}
        </ScrollView>
        <CartBottomBar />
      </View>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scroll: {
    paddingBottom: 96,
  },
});
