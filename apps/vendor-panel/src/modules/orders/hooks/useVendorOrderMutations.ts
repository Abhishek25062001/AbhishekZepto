import { useMutation, useQueryClient } from '@tanstack/react-query';

import {
  acceptVendorOrder,
  cancelVendorOrder,
  completeVendorOrderPacking,
  completeVendorOrderPicking,
  markVendorOrderItemMissing,
  markVendorOrderItemPicked,
  markVendorOrderReadyForPickup,
  rejectVendorOrder,
  startVendorOrderPacking,
  startVendorOrderPicking,
} from '../api/vendor-orders.api';
import type {
  VendorCancelOrderPayload,
  VendorOrderItemQuantityPayload,
  VendorRejectOrderPayload,
} from '../types/vendor-orders.types';

export function useVendorOrderMutations() {
  const queryClient = useQueryClient();

  const invalidate = (orderId: string) => {
    void queryClient.invalidateQueries({ queryKey: ['vendor-incoming-orders'] });
    void queryClient.invalidateQueries({ queryKey: ['vendor-active-orders'] });
    void queryClient.invalidateQueries({ queryKey: ['vendor-order-history'] });
    void queryClient.invalidateQueries({ queryKey: ['vendor-order-detail', orderId] });
  };

  const acceptOrder = useMutation({
    mutationFn: ({ orderId }: { orderId: string }) => acceptVendorOrder(orderId),
    onSuccess: (_data, variables) => invalidate(variables.orderId),
  });

  const rejectOrder = useMutation({
    mutationFn: ({
      orderId,
      payload,
    }: {
      orderId: string;
      payload: VendorRejectOrderPayload;
    }) => rejectVendorOrder(orderId, payload),
    onSuccess: (_data, variables) => invalidate(variables.orderId),
  });

  const startPicking = useMutation({
    mutationFn: ({ orderId }: { orderId: string }) => startVendorOrderPicking(orderId),
    onSuccess: (_data, variables) => invalidate(variables.orderId),
  });

  const markItemPicked = useMutation({
    mutationFn: ({
      itemId,
      orderId,
      payload,
    }: {
      itemId: string;
      orderId: string;
      payload: VendorOrderItemQuantityPayload;
    }) => markVendorOrderItemPicked(orderId, itemId, payload),
    onSuccess: (_data, variables) => invalidate(variables.orderId),
  });

  const markItemMissing = useMutation({
    mutationFn: ({
      itemId,
      orderId,
      payload,
    }: {
      itemId: string;
      orderId: string;
      payload: VendorOrderItemQuantityPayload;
    }) => markVendorOrderItemMissing(orderId, itemId, payload),
    onSuccess: (_data, variables) => invalidate(variables.orderId),
  });

  const completePicking = useMutation({
    mutationFn: ({ orderId }: { orderId: string }) => completeVendorOrderPicking(orderId),
    onSuccess: (_data, variables) => invalidate(variables.orderId),
  });

  const startPacking = useMutation({
    mutationFn: ({ orderId }: { orderId: string }) => startVendorOrderPacking(orderId),
    onSuccess: (_data, variables) => invalidate(variables.orderId),
  });

  const completePacking = useMutation({
    mutationFn: ({ orderId }: { orderId: string }) => completeVendorOrderPacking(orderId),
    onSuccess: (_data, variables) => invalidate(variables.orderId),
  });

  const markReadyForPickup = useMutation({
    mutationFn: ({ orderId }: { orderId: string }) => markVendorOrderReadyForPickup(orderId),
    onSuccess: (_data, variables) => invalidate(variables.orderId),
  });

  const cancelOrder = useMutation({
    mutationFn: ({
      orderId,
      payload,
    }: {
      orderId: string;
      payload: VendorCancelOrderPayload;
    }) => cancelVendorOrder(orderId, payload),
    onSuccess: (_data, variables) => invalidate(variables.orderId),
  });

  return {
    acceptOrder,
    cancelOrder,
    completePacking,
    completePicking,
    markItemMissing,
    markItemPicked,
    markReadyForPickup,
    rejectOrder,
    startPacking,
    startPicking,
  };
}
