import type { Types } from 'mongoose';
import type { CheckoutAddressSnapshot } from '../../checkout/types/checkout.types';
import type { OrderPaymentStatus } from '../constants/order-payment-status.constant';
import type { OrderItemPickingStatus } from '../constants/order-item-picking-status.constant';
import type { OrderPackingStatus } from '../constants/order-packing-status.constant';
import type { OrderPickerStatus } from '../constants/order-picker-status.constant';
import type { OrderSlaStage, OrderSlaStatus } from '../constants/order-sla.constant';
import type { OrderStatus } from '../constants/order-status.constant';
import type { OrderStoreStatus } from '../constants/order-store-status.constant';

export type OrderLineItem = {
  productId: Types.ObjectId;
  variantId: Types.ObjectId;
  storeProductId: Types.ObjectId;
  quantity: number;
  unitPrice: number;
  lineTotal: number;
  productName: string | null;
  pickedQuantity: number;
  missingQuantity: number;
  pickingStatus: OrderItemPickingStatus;
};

export type OrderTimelineEvent = {
  event: string;
  fromStatus: OrderStatus | null;
  toStatus: OrderStatus | null;
  itemId?: string | null;
  quantity?: number | null;
  actorId: Types.ObjectId | null;
  actorType: 'customer' | 'store' | 'admin' | 'system';
  actorRole: string | null;
  reason: string | null;
  createdAt: Date;
};

export type OrderCancellationActor = {
  actorId: Types.ObjectId | null;
  actorType: 'customer' | 'store' | 'admin' | 'system';
  actorRole: string | null;
};

export type OrderRecord = {
  orderNumber: string;
  customerId: Types.ObjectId;
  storeId: Types.ObjectId;
  checkoutSessionId: Types.ObjectId;
  paymentId: Types.ObjectId;
  cartId: Types.ObjectId;
  addressSnapshot: CheckoutAddressSnapshot;
  items: OrderLineItem[];
  subtotal: number;
  taxAmount: number;
  deliveryFeeAmount: number;
  discountAmount: number;
  grandTotal: number;
  currency: string;
  paymentStatus: OrderPaymentStatus;
  orderStatus: OrderStatus;
  storeStatus: OrderStoreStatus;
  pickerStatus: OrderPickerStatus | null;
  packingStatus: OrderPackingStatus | null;
  assignedPickerId: Types.ObjectId | null;
  readyForPickupAt: Date | null;
  acceptedAt: Date | null;
  rejectedAt: Date | null;
  rejectionReason: string | null;
  cancellationReason: string | null;
  cancelledAt: Date | null;
  cancelledBy: OrderCancellationActor | null;
  refundReviewRequired: boolean;
  slaStatus: OrderSlaStatus;
  slaBreachedStage: OrderSlaStage | null;
  timeline: OrderTimelineEvent[];
  inventoryConfirmed: boolean;
  placedAt: Date;
  createdAt: Date;
  updatedAt: Date;
};

export type PlaceOrderInput = {
  paymentId: string;
  idempotencyKey?: string;
};

export type PlaceOrderResponse = {
  orderId: string;
  orderNumber: string;
  orderStatus: OrderStatus;
  grandTotal: number;
  currency: string;
  placedAt: string;
};

export type OrderDetailResponse = PlaceOrderResponse & {
  paymentId: string;
  checkoutSessionId: string;
  storeId: string;
  addressSnapshot: CheckoutAddressSnapshot;
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
    pickingStatus: OrderItemPickingStatus;
  }>;
  subtotal: number;
  taxAmount: number;
  deliveryFeeAmount: number;
  discountAmount: number;
  paymentStatus: OrderPaymentStatus;
  storeStatus: OrderStoreStatus;
  pickerStatus: OrderPickerStatus | null;
  packingStatus: OrderPackingStatus | null;
  assignedPickerId: string | null;
  readyForPickupAt: string | null;
  acceptedAt: string | null;
  rejectedAt: string | null;
  rejectionReason: string | null;
  cancellationReason: string | null;
  cancelledAt: string | null;
  cancelledBy: {
    actorId: string | null;
    actorType: OrderCancellationActor['actorType'];
    actorRole: string | null;
  } | null;
  refundReviewRequired: boolean;
  inventoryConfirmed: boolean;
  slaStatus: OrderSlaStatus;
  slaBreachedStage: OrderSlaStage | null;
};

export type CustomerOrderStateResponse = {
  orderId: string;
  orderNumber: string;
  orderStatus: OrderStatus;
  storeStatus: OrderStoreStatus;
  pickerStatus: OrderPickerStatus | null;
  packingStatus: OrderPackingStatus | null;
  readyForPickupAt: string | null;
  acceptedAt: string | null;
  cancelledAt: string | null;
  cancellationReason: string | null;
  refundReviewRequired: boolean;
  canCustomerCancel: boolean;
};

export type CustomerOrderLifecycleEventResponse = {
  event: string;
  fromStatus: OrderTimelineEvent['fromStatus'];
  toStatus: OrderTimelineEvent['toStatus'];
  reason: string | null;
  createdAt: string;
};

export type CustomerOrderLifecycleResponse = CustomerOrderLifecycleEventResponse[];

export type OrderListItemResponse = {
  orderId: string;
  orderNumber: string;
  orderStatus: OrderStatus;
  storeStatus: OrderStoreStatus;
  pickerStatus: OrderPickerStatus | null;
  packingStatus: OrderPackingStatus | null;
  grandTotal: number;
  currency: string;
  placedAt: string;
  itemCount: number;
};

export type StoreOrderListItemResponse = OrderListItemResponse & {
  customerId: string;
  storeId: string;
  paymentStatus: OrderPaymentStatus;
  createdAt: string;
  acceptedAt: string | null;
  slaStatus: OrderSlaStatus;
  slaBreachedStage: OrderSlaStage | null;
};

export type AdminOrderListItemResponse = StoreOrderListItemResponse & {
  cityId: string | null;
};

export type StoreOrderDetailResponse = OrderDetailResponse & {
  customerId: string;
  itemCount: number;
  createdAt: string;
  updatedAt: string;
  timeline: Array<{
    event: string;
    fromStatus: OrderTimelineEvent['fromStatus'];
    toStatus: OrderTimelineEvent['toStatus'];
    itemId?: string | null;
    quantity?: number | null;
    actorType: OrderTimelineEvent['actorType'];
    actorRole: string | null;
    reason: string | null;
    createdAt: string;
  }>;
  slaStatus: OrderSlaStatus;
  slaBreachedStage: OrderSlaStage | null;
};

export type AdminOrderDetailResponse = StoreOrderDetailResponse & {
  cityId: string | null;
};

export type AdminOrderTimelineResponse = StoreOrderDetailResponse['timeline'];

export type ListOrdersQuery = {
  page?: number;
  limit?: number;
  status?: OrderStatus;
};

export type ListStoreOrdersQuery = {
  page?: number;
  limit?: number;
  status?: OrderStatus;
  storeStatus?: OrderStoreStatus;
  paymentStatus?: OrderPaymentStatus;
  slaStatus?: OrderSlaStatus;
  slaBreachedStage?: OrderSlaStage;
};

export type ListAdminOrdersQuery = ListStoreOrdersQuery & {
  storeId?: string;
  cityId?: string;
  customerId?: string;
  slaStatus?: OrderSlaStatus;
  slaBreachedStage?: OrderSlaStage;
  fromDate?: Date;
  toDate?: Date;
  sort?: 'createdAt_desc' | 'createdAt_asc' | 'status_asc' | 'status_desc' | 'sla_priority';
};

export type OrderAuditContext = {
  requestId: string | null;
  traceId: string | null;
};

export type StoreOrderActorContext = OrderAuditContext & {
  userId: string;
  role: string;
  storeId: string | null;
  vendorId?: string | null;
  ipAddress?: string | null;
  userAgent?: string | null;
};

export type AdminOrderActorContext = OrderAuditContext & {
  userId: string;
  role: string;
  ipAddress?: string | null;
  userAgent?: string | null;
};

export type RejectStoreOrderInput = {
  reason: string;
};

export type StoreOrderAcceptanceResponse = {
  orderId: string;
  orderNumber: string;
  orderStatus: OrderStatus;
  storeStatus: OrderStoreStatus;
  acceptedAt: string | null;
  rejectedAt: string | null;
  rejectionReason: string | null;
  autoAcceptEnabled: boolean;
};

export type StoreOrderPickingResponse = {
  orderId: string;
  orderNumber: string;
  orderStatus: OrderStatus;
  storeStatus: OrderStoreStatus;
  pickerStatus: OrderPickerStatus | null;
  assignedPickerId: string | null;
};

export type StoreOrderPackingResponse = {
  orderId: string;
  orderNumber: string;
  orderStatus: OrderStatus;
  storeStatus: OrderStoreStatus;
  pickerStatus: OrderPickerStatus | null;
  packingStatus: OrderPackingStatus | null;
  readyForPickupAt: string | null;
};

export type StoreOrderItemPickingInput = {
  quantity: number;
};

export type CancelOrderInput = {
  reason: string;
};

export type AdminOrderStatusUpdateInput = {
  status: OrderStatus;
  reason?: string;
};
