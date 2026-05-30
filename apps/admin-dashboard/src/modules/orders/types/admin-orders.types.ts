import type { ApiPaginationMeta } from '../../../types/api.types';

export type AdminOrderStatus =
  | 'placed'
  | 'accepted'
  | 'picking'
  | 'packing'
  | 'ready_for_pickup'
  | 'shipped'
  | 'delivered'
  | 'failed'
  | 'cancelled';

export type AdminOrderStoreStatus = 'pending_acceptance' | 'accepted' | 'rejected';

export type AdminOrderPaymentStatus = 'paid';

export type AdminOrderPickerStatus = 'in_progress' | 'completed' | null;

export type AdminOrderPackingStatus = 'in_progress' | 'completed' | 'ready_for_pickup' | null;

export type AdminOrderTimelineEvent = {
  event: string;
  fromStatus: AdminOrderStatus | null;
  toStatus: AdminOrderStatus | null;
  itemId?: string | null;
  quantity?: number | null;
  actorType: 'customer' | 'store' | 'admin' | 'system';
  actorRole: string | null;
  reason: string | null;
  createdAt: string;
};

export type AdminOrderListItem = {
  orderId: string;
  orderNumber: string;
  customerId: string;
  storeId: string;
  cityId: string | null;
  orderStatus: AdminOrderStatus;
  storeStatus: AdminOrderStoreStatus;
  pickerStatus: AdminOrderPickerStatus;
  packingStatus: AdminOrderPackingStatus;
  paymentStatus: AdminOrderPaymentStatus;
  grandTotal: number;
  currency: string;
  placedAt: string;
  createdAt: string;
  acceptedAt: string | null;
  itemCount: number;
  slaStatus: string | null;
  slaBreachedStage: string | null;
};

export type AdminOrderDetail = AdminOrderListItem & {
  paymentId: string;
  checkoutSessionId: string;
  addressSnapshot: {
    label: string;
    line1: string;
    line2: string | null;
    landmark: string | null;
    city: string;
    state: string | null;
    postalCode: string | null;
    country: string;
    latitude: number;
    longitude: number;
  };
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
    pickingStatus: 'pending' | 'picked' | 'missing' | 'partial';
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
  cancelledBy: {
    actorId: string | null;
    actorType: 'customer' | 'store' | 'admin' | 'system';
    actorRole: string | null;
  } | null;
  refundReviewRequired: boolean;
  inventoryConfirmed: boolean;
  updatedAt: string;
  timeline: AdminOrderTimelineEvent[];
};

export type AdminOrderListQuery = {
  page?: number;
  limit?: number;
  status?: AdminOrderStatus;
  storeStatus?: AdminOrderStoreStatus;
  storeId?: string;
  cityId?: string;
  paymentStatus?: AdminOrderPaymentStatus;
  customerId?: string;
  slaStatus?: string;
  slaBreachedStage?: string;
  fromDate?: string;
  toDate?: string;
  sort?: 'createdAt_desc' | 'createdAt_asc' | 'status_asc' | 'status_desc' | 'sla_priority';
};

export type AdminOrderListResult = {
  items: AdminOrderListItem[];
  pagination: ApiPaginationMeta;
};

export type AdminOrderStatusUpdatePayload = {
  status: AdminOrderStatus;
  reason?: string;
};

export type AdminOrderCancellationPayload = {
  reason: string;
};
