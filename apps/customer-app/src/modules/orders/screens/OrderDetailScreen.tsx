import React, { useMemo } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import type { RouteProp } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { Button, Loader, ScreenWrapper, Text } from '../../../components/common';
import type { MainStackParamList } from '../../../app/navigation.types';
import { spacing } from '../../../theme';
import { RealtimeConnectionBanner } from '../../realtime-order-experience/components/RealtimeConnectionBanner';
import { RealtimeOrderStatusToast } from '../../realtime-order-experience/components/RealtimeOrderStatusToast';
import { useRealtimeOrderEvents } from '../../realtime-order-experience/hooks/useRealtimeOrderEvents';
import { useRealtimeOrderRoom } from '../../realtime-order-experience/hooks/useRealtimeOrderRoom';
import { useRealtimeOrderStore } from '../../realtime-order-experience/store/realtime-order.store';
import { CUSTOMER_REALTIME_ORDER_STATUS } from '../../realtime-order-experience/types/realtime-order.types';
import type { CustomerRealtimeOrderStatus } from '../../realtime-order-experience/types/realtime-order.types';
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
import type { OrderStatus } from '../types/order.types';

type OrderDetailRouteProp = RouteProp<MainStackParamList, 'OrderDetail'>;

const mapRealtimeStatusToOrderStatus = (
  status: CustomerRealtimeOrderStatus,
): OrderStatus | null => {
  switch (status) {
    case CUSTOMER_REALTIME_ORDER_STATUS.CREATED:
      return 'placed';
    case CUSTOMER_REALTIME_ORDER_STATUS.ACCEPTED:
      return 'accepted';
    case CUSTOMER_REALTIME_ORDER_STATUS.PACKED:
      return 'packing';
    case CUSTOMER_REALTIME_ORDER_STATUS.READY_FOR_PICKUP:
      return 'ready_for_pickup';
    case CUSTOMER_REALTIME_ORDER_STATUS.OUT_FOR_DELIVERY:
      return 'shipped';
    case CUSTOMER_REALTIME_ORDER_STATUS.DELIVERED:
      return 'delivered';
    case CUSTOMER_REALTIME_ORDER_STATUS.CANCELLED:
      return 'cancelled';
    case CUSTOMER_REALTIME_ORDER_STATUS.FAILED:
      return 'failed';
    default:
      return null;
  }
};

export function OrderDetailScreen() {
  const route = useRoute<OrderDetailRouteProp>();
  const navigation = useNavigation<NativeStackNavigationProp<MainStackParamList>>();
  const orderId = route.params.orderId;
  useRealtimeOrderRoom(orderId);
  useRealtimeOrderEvents();
  const { order, isLoading, isError, errorMessage, refetch } = useOrderDetail(orderId);
  const lifecycle = useOrderLifecycle(orderId);
  const latestRealtimeOrderEvent = useRealtimeOrderStore((state) =>
    [...state.realtimeOrderEvents]
      .reverse()
      .find((event) => event.orderId === orderId),
  );
  const displayOrder = useMemo(() => {
    if (!order || !latestRealtimeOrderEvent) {
      return order;
    }

    const orderStatus = mapRealtimeStatusToOrderStatus(
      latestRealtimeOrderEvent.orderStatus,
    );
    return orderStatus ? { ...order, orderStatus } : order;
  }, [latestRealtimeOrderEvent, order]);

  if (isLoading) {
    return (
      <ScreenWrapper>
        <Loader />
      </ScreenWrapper>
    );
  }

  if (isError || !displayOrder) {
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
          <Text variant="h2">{displayOrder.orderNumber}</Text>
          <Text color="secondary" variant="small">
            Placed {new Date(displayOrder.placedAt).toLocaleString()}
          </Text>
        </View>

        <RealtimeConnectionBanner />

        <RealtimeOrderStatusToast orderId={orderId} />

        <OrderStatusSummary order={displayOrder} />

        {(displayOrder.orderStatus === 'shipped' ||
          displayOrder.orderStatus === 'delivered') && (
          <Button
            title="⚡ Track Live Delivery"
            variant="primary"
            onPress={() => navigation.navigate('DeliveryTracking', { orderId })}
          />
        )}

        <OrderCancellationNotice order={displayOrder} />

        <OrderCancelAction order={displayOrder} />

        <OrderAddressSnapshot address={displayOrder.addressSnapshot} />

        <View style={styles.section}>
          <Text variant="h3">Items</Text>
          {displayOrder.items.map((item) => (
            <OrderLineItem
              key={`${item.productId}-${item.variantId}-${item.storeProductId}`}
              item={item}
            />
          ))}
        </View>

        <OrderTotalsBreakdown
          deliveryFeeAmount={displayOrder.deliveryFeeAmount}
          discountAmount={displayOrder.discountAmount}
          grandTotal={displayOrder.grandTotal}
          subtotal={displayOrder.subtotal}
          taxAmount={displayOrder.taxAmount}
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
