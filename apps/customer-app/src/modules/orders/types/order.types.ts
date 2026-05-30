export type OrderStatus =
  | 'placed'
  | 'accepted'
  | 'picking'
  | 'packing'
  | 'ready_for_pickup'
  | 'shipped'
  | 'delivered'
  | 'failed'
  | 'cancelled';


export type OrderPaymentStatus = 'paid';

export type OrderStoreStatus = 'pending_acceptance' | 'accepted' | 'rejected';

export type OrderPickerStatus = 'not_started' | 'picking' | 'completed' | null;

export type OrderPackingStatus = 'not_started' | 'packing' | 'packed' | 'ready_for_pickup' | null;

export type OrderItemPickingStatus = 'pending' | 'picked' | 'missing' | 'partial';

export type OrderCancellationActor = {
  actorId: string | null;
  actorType: 'customer' | 'store' | 'admin' | 'system';
  actorRole: string | null;
};

export type OrderTimelineEvent = {
  event: string;
  fromStatus: OrderStatus | null;
  toStatus: OrderStatus | null;
  itemId?: string | null;
  quantity?: number | null;
  actorType?: OrderCancellationActor['actorType'];
  actorRole?: string | null;
  reason: string | null;
  createdAt: string;
};

export type OrderAddressSnapshot = {
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

export type OrderLineItem = {
  productId: string;
  variantId: string;
  storeProductId: string;
  quantity: number;
  unitPrice: number;
  lineTotal: number;
  productName: string | null;
  pickedQuantity?: number;
  missingQuantity?: number;
  pickingStatus?: OrderItemPickingStatus;
};

export type OrderListItem = {
  orderId: string;
  orderNumber: string;
  orderStatus: OrderStatus;
  storeStatus?: OrderStoreStatus;
  pickerStatus?: OrderPickerStatus;
  packingStatus?: OrderPackingStatus;
  grandTotal: number;
  currency: string;
  placedAt: string;
  itemCount: number;
  cancelledAt?: string | null;
};

export type OrderDetail = {
  orderId: string;
  orderNumber: string;
  orderStatus: OrderStatus;
  grandTotal: number;
  currency: string;
  placedAt: string;
  paymentId: string;
  checkoutSessionId: string;
  storeId: string;
  addressSnapshot: OrderAddressSnapshot;
  items: OrderLineItem[];
  subtotal: number;
  taxAmount: number;
  deliveryFeeAmount: number;
  discountAmount: number;
  paymentStatus: OrderPaymentStatus;
  storeStatus: OrderStoreStatus;
  pickerStatus: OrderPickerStatus;
  packingStatus: OrderPackingStatus;
  assignedPickerId: string | null;
  readyForPickupAt: string | null;
  acceptedAt: string | null;
  rejectedAt: string | null;
  rejectionReason: string | null;
  cancellationReason: string | null;
  cancelledAt: string | null;
  cancelledBy: OrderCancellationActor | null;
  refundReviewRequired: boolean;
  timeline?: OrderTimelineEvent[];
  lifecycle?: OrderTimelineEvent[];
  inventoryConfirmed: boolean;
};

export type OrderState = {
  orderId: string;
  orderNumber: string;
  orderStatus: OrderStatus;
  storeStatus: OrderStoreStatus;
  pickerStatus: OrderPickerStatus;
  packingStatus: OrderPackingStatus;
  readyForPickupAt: string | null;
  acceptedAt: string | null;
  cancelledAt: string | null;
  cancellationReason: string | null;
  refundReviewRequired: boolean;
  canCustomerCancel: boolean;
};

export type CancelOrderInput = {
  reason: string;
};

export type OrderListQuery = {
  page?: number;
  limit?: number;
  status?: OrderStatus;
};

export type OrderSuccessScreenParams = {
  orderId: string;
};

export type OrderDetailScreenParams = {
  orderId: string;
};

export type CustomerRiderProfileSnapshot = {
  name: string;
  phone: string;
  vehicleType: string;
  vehicleNumber: string | null;
  profilePhotoUrl: string | null;
};

export type CustomerDeliveryTrackingResponse = {
  deliveryId: string;
  deliveryStatus: string;
  assignedAt: string | null;
  pickedUpAt: string | null;
  enRouteToCustomerAt: string | null;
  arrivedAtCustomerAt: string | null;
  completedAt: string | null;
  deliveredAt: string | null;
  failedAt: string | null;
  riderProfile: CustomerRiderProfileSnapshot | null;
} | null;

