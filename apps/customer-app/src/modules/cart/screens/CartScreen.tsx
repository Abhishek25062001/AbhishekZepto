import React, { useCallback } from 'react';
import { Alert, FlatList, RefreshControl, StyleSheet, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { Button, Loader, ScreenWrapper } from '../../../components/common';
import type { MainStackParamList } from '../../../app/navigation.types';
import { spacing } from '../../../theme';
import { useLocationContext } from '../../addresses/hooks/useLocationContext';
import { CartEmptyState } from '../components/CartEmptyState';
import { CartErrorState } from '../components/CartErrorState';
import { CartLineItem } from '../components/CartLineItem';
import { CartPriceChangedBanner } from '../components/CartPriceChangedBanner';
import { CartSummaryFooter } from '../components/CartSummaryFooter';
import { useClearCart } from '../hooks/useClearCart';
import { useCustomerCart } from '../hooks/useCustomerCart';
import { useRecalculateCart } from '../hooks/useRecalculateCart';
import {
  getCustomerCartErrorMessage,
  isCartPriceChangedError,
} from '../utils/customer-cart-error-message.util';

export function CartScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<MainStackParamList>>();
  const { hasStore } = useLocationContext();
  const cartQuery = useCustomerCart({ validateOnFocus: true });
  const clearMutation = useClearCart();
  const recalculateMutation = useRecalculateCart();

  const handleRefreshPrices = () => {
    recalculateMutation.mutate(undefined, {
      onSuccess: () => {
        cartQuery.clearPriceChanged();
        void cartQuery.refetch();
      },
    });
  };

  const onRefresh = useCallback(() => {
    void cartQuery.refetch();
  }, [cartQuery]);

  const startShopping = () => {
    navigation.navigate('Home');
  };

  const proceedToCheckout = () => {
    navigation.navigate('Checkout');
  };

  const handleClearCart = () => {
    Alert.alert('Clear cart', 'Remove all items from your cart?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Clear',
        style: 'destructive',
        onPress: () => clearMutation.mutate(),
      },
    ]);
  };

  if (!hasStore) {
    return (
      <ScreenWrapper>
        <CartEmptyState onStartShopping={() => navigation.navigate('LocationGate')} />
      </ScreenWrapper>
    );
  }

  if (cartQuery.isLoading && !cartQuery.cart) {
    return (
      <ScreenWrapper>
        <Loader />
      </ScreenWrapper>
    );
  }

  if (cartQuery.isError && !isCartPriceChangedError(cartQuery.error)) {
    return (
      <ScreenWrapper>
        <CartErrorState
          message={getCustomerCartErrorMessage(cartQuery.error, 'Unable to load cart.')}
          onRetry={() => void cartQuery.refetch()}
        />
      </ScreenWrapper>
    );
  }

  const cart = cartQuery.cart;
  const hasItems = (cart?.items.length ?? 0) > 0;

  return (
    <ScreenWrapper scrollable={false}>
      <View style={styles.container}>
        {cartQuery.priceChanged ? (
          <CartPriceChangedBanner
            isRefreshing={recalculateMutation.isPending}
            onRefresh={handleRefreshPrices}
          />
        ) : null}
        {hasItems ? (
          <Button
            onPress={handleClearCart}
            title={clearMutation.isPending ? 'Clearing…' : 'Clear cart'}
            variant="ghost"
          />
        ) : null}
        <FlatList
          contentContainerStyle={styles.list}
          data={cart?.items ?? []}
          keyExtractor={(item) => item.id}
          ListEmptyComponent={<CartEmptyState onStartShopping={startShopping} />}
          ListFooterComponent={
            hasItems && cart ? (
              <CartSummaryFooter cart={cart} onCheckout={proceedToCheckout} />
            ) : null
          }
          refreshControl={
            <RefreshControl onRefresh={onRefresh} refreshing={cartQuery.isFetching} />
          }
          renderItem={({ item }) => <CartLineItem item={item} />}
        />
      </View>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  list: {
    flexGrow: 1,
    paddingBottom: spacing.lg,
  },
});
