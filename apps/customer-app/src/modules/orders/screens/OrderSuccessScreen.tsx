import React from 'react';
import { StyleSheet, View } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RouteProp } from '@react-navigation/native';

import { Button, Loader, ScreenWrapper, Text } from '../../../components/common';
import type { MainStackParamList } from '../../../app/navigation.types';
import { spacing } from '../../../theme';
import { OrderErrorState } from '../components/OrderErrorState';
import { useOrderDetail } from '../hooks/useOrderDetail';
import {
  getOrderStatusDescription,
  getOrderStatusLabel,
  isCancelledOrderStatus,
} from '../utils/order-status-label.util';
import { formatCartGrandTotal } from '../../cart/utils/cart-price.util';

type OrderSuccessRouteProp = RouteProp<MainStackParamList, 'OrderSuccess'>;

export function OrderSuccessScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<MainStackParamList>>();
  const route = useRoute<OrderSuccessRouteProp>();
  const orderId = route.params.orderId;
  const { order, isLoading, isError, errorMessage, refetch } = useOrderDetail(orderId);

  if (isLoading) {
    return (
      <ScreenWrapper>
        <Loader />
      </ScreenWrapper>
    );
  }

  if (isError || !order) {
    return (
      <ScreenWrapper>
        <OrderErrorState
          message={errorMessage ?? 'Order not found.'}
          onRetry={() => {
            void refetch();
          }}
        />
      </ScreenWrapper>
    );
  }

  return (
    <ScreenWrapper>
      <View style={styles.content}>
        <Text variant="h2">{isCancelledOrderStatus(order.orderStatus) ? 'Order cancelled' : 'Order confirmed'}</Text>
        <Text color="secondary" variant="small">
          {getOrderStatusDescription(order.orderStatus)}
        </Text>
        <View style={styles.summary}>
          <Text variant="small">Order number</Text>
          <Text variant="h3">{order.orderNumber}</Text>
          <Text color="secondary" variant="small">
            {getOrderStatusLabel(order.orderStatus)}
          </Text>
          <Text variant="h3">{formatCartGrandTotal(order.grandTotal)}</Text>
        </View>
        <Button
          onPress={() => navigation.navigate('OrderDetail', { orderId: order.orderId })}
          title="View order details"
        />
        <Button
          onPress={() => navigation.navigate('Home')}
          title="Continue shopping"
          variant="secondary"
        />
      </View>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  content: {
    gap: spacing.md,
    paddingTop: spacing.lg,
  },
  summary: {
    gap: spacing.xs,
    paddingVertical: spacing.md,
  },
});
