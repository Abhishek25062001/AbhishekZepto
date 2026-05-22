import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { useRoute } from '@react-navigation/native';
import type { RouteProp } from '@react-navigation/native';

import { Loader, ScreenWrapper, Text } from '../../../components/common';
import type { MainStackParamList } from '../../../app/navigation.types';
import { spacing } from '../../../theme';
import { OrderAddressSnapshot } from '../components/OrderAddressSnapshot';
import { OrderCancelAction } from '../components/OrderCancelAction';
import { OrderCancellationNotice } from '../components/OrderCancellationNotice';
import { OrderErrorState } from '../components/OrderErrorState';
import { OrderLifecycleTimeline } from '../components/OrderLifecycleTimeline';
import { OrderLineItem } from '../components/OrderLineItem';
import { OrderStatusSummary } from '../components/OrderStatusSummary';
import { OrderTotalsBreakdown } from '../components/OrderTotalsBreakdown';
import { useOrderDetail } from '../hooks/useOrderDetail';
import { useOrderLifecycle } from '../hooks/useOrderLifecycle';

type OrderDetailRouteProp = RouteProp<MainStackParamList, 'OrderDetail'>;

export function OrderDetailScreen() {
  const route = useRoute<OrderDetailRouteProp>();
  const orderId = route.params.orderId;
  const { order, isLoading, isError, errorMessage, refetch } = useOrderDetail(orderId);
  const lifecycle = useOrderLifecycle(orderId);

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
    <ScreenWrapper scrollable={false}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <Text variant="h2">{order.orderNumber}</Text>
          <Text color="secondary" variant="small">
            Placed {new Date(order.placedAt).toLocaleString()}
          </Text>
        </View>

        <OrderStatusSummary order={order} />

        <OrderCancellationNotice order={order} />

        <OrderCancelAction order={order} />

        <OrderAddressSnapshot address={order.addressSnapshot} />

        <View style={styles.section}>
          <Text variant="h3">Items</Text>
          {order.items.map((item) => (
            <OrderLineItem
              key={`${item.productId}-${item.variantId}-${item.storeProductId}`}
              item={item}
            />
          ))}
        </View>

        <OrderTotalsBreakdown
          deliveryFeeAmount={order.deliveryFeeAmount}
          discountAmount={order.discountAmount}
          grandTotal={order.grandTotal}
          subtotal={order.subtotal}
          taxAmount={order.taxAmount}
        />

        <OrderLifecycleTimeline
          errorMessage={lifecycle.errorMessage}
          events={lifecycle.events}
          isLoading={lifecycle.isLoading}
        />
      </ScrollView>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  content: {
    gap: spacing.lg,
    paddingBottom: spacing.xl,
  },
  header: {
    gap: spacing.xs,
  },
  section: {
    gap: spacing.sm,
  },
});
