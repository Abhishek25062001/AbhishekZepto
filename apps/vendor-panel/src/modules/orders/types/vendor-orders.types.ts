export type VendorOrderStatus =
  | 'placed'
  | 'accepted'
  | 'picking'
  | 'packing'
  | 'ready_for_pickup'
  | 'cancelled';

export type VendorOrderStoreStatus = 'pending_acceptance' | 'accepted' | 'rejected';

export type VendorOrderPaymentStatus = 'paid';

export type VendorOrderListQuery = {
  page?: number;
  limit?: number;
  status?: VendorOrderStatus;
  storeStatus?: VendorOrderStoreStatus;
  paymentStatus?: VendorOrderPaymentStatus;
};

export type VendorOrderHistoryFilters = Pick<
  VendorOrderListQuery,
  'limit' | 'page' | 'paymentStatus' | 'status' | 'storeStatus'
>;

export type VendorOrderListItem = {
  orderId: string;
  orderNumber: string;
  customerId: string;
  storeId: string;
  orderStatus: VendorOrderStatus;
  storeStatus: VendorOrderStoreStatus;
  pickerStatus: string | null;
  packingStatus: string | null;
  paymentStatus: VendorOrderPaymentStatus;
  grandTotal: number;
  currency: string;
  placedAt: string;
  createdAt: string;
  acceptedAt: string | null;
  itemCount: number;
  slaStatus: string | null;
  slaBreachedStage: string | null;
};

export type VendorOrderTimelineEvent = {
  event: string;
  fromStatus: VendorOrderStatus | null;
  toStatus: VendorOrderStatus | null;
  itemId?: string | null;
  quantity?: number | null;
  actorType: 'customer' | 'store' | 'admin' | 'system';
  actorRole: string | null;
  reason: string | null;
  createdAt: string;
};

export type VendorOrderDetail = VendorOrderListItem & {
  paymentId: string;
  checkoutSessionId: string;
  addressSnapshot: Record<string, unknown>;
  items: Array<{
    productId: string;
    variantId: string;
    storeProductId: string;
    quantity: number;
    unitPrice: number;
    lineTotal: number;
    productName: string | null;
    pickedQuantity: number;
    missingQuantity: number;
    pickingStatus: string;
  }>;
  subtotal: number;
  taxAmount: number;
  deliveryFeeAmount: number;
  discountAmount: number;
  assignedPickerId: string | null;
  readyForPickupAt: string | null;
  rejectedAt: string | null;
  rejectionReason: string | null;
  cancellationReason: string | null;
  cancelledAt: string | null;
  refundReviewRequired: boolean;
  inventoryConfirmed: boolean;
  updatedAt: string;
  timeline: VendorOrderTimelineEvent[];
};

export type VendorRejectOrderPayload = {
  reason: string;
};

export type VendorCancelOrderPayload = {
  reason: string;
};

export type VendorOrderAcceptanceResponse = {
  orderId: string;
  orderNumber: string;
  orderStatus: VendorOrderStatus;
  storeStatus: VendorOrderStoreStatus;
  acceptedAt: string | null;
  rejectedAt: string | null;
  rejectionReason: string | null;
  autoAcceptEnabled: boolean;
};

export type VendorOrderItemQuantityPayload = {
  quantity: number;
};

export type VendorOrderPickingResponse = {
  orderId: string;
  orderNumber: string;
  orderStatus: VendorOrderStatus;
  storeStatus: VendorOrderStoreStatus;
  pickerStatus: string | null;
  assignedPickerId: string | null;
};

export type VendorOrderPackingResponse = {
  orderId: string;
  orderNumber: string;
  orderStatus: VendorOrderStatus;
  storeStatus: VendorOrderStoreStatus;
  pickerStatus: string | null;
  packingStatus: string | null;
  readyForPickupAt: string | null;
};

export type VendorOrderCancellationResponse = {
  orderId: string;
  orderNumber: string;
  orderStatus: VendorOrderStatus;
  cancellationReason: string | null;
  cancelledAt: string | null;
  refundReviewRequired: boolean;
};
