import type { DeliveryStatus } from '../../delivery/types/delivery-assignment.types';
import type { OrderStatus } from '../../orders/constants/order-status.constant';
import type { OrderPaymentStatus } from '../../orders/constants/order-payment-status.constant';
import type { OrderStoreStatus } from '../../orders/constants/order-store-status.constant';

export type ControlTowerQuery = {
  cityId?: string;
};

export type ControlTowerOrder = {
  orderId: string;
  orderNumber: string;
  customerId: string;
  storeId: string;
  cityId: string | null;
  orderStatus: OrderStatus;
  storeStatus: OrderStoreStatus;
  pickerStatus: string | null;
  packingStatus: string | null;
  paymentStatus: OrderPaymentStatus;
  grandTotal: number;
  currency: string;
  placedAt: string;
  createdAt: string;
  acceptedAt: string | null;
  itemCount: number;
  slaStatus: string | null;
  slaBreachedStage: string | null;
  updatedAt: string;
};

export type ControlTowerDeliveryLocation = {
  deliveryId: string;
  orderId: string;
  cityId: string;
  deliveryAgentId: string | null;
  deliveryStatus: DeliveryStatus;
  latitude: number | null;
  longitude: number | null;
  heading: number | null;
  speed: number | null;
  updatedAt: string;
};

export type ControlTowerSlaBreach = {
  eventName: 'admin.delivery_sla_breach_created';
  breachId: string;
  orderId: string;
  assignmentId: string | null;
  deliveryId: string | null;
  cityId: string | null;
  breachType: string;
  escalationLevel: string | null;
  breachedAt: string;
  emittedAt: string | null;
  eventId: string | null;
};

export type ControlTowerSnapshot = {
  activeOrdersCount: number;
  assignedRidersCount: number;
  outForDeliveryCount: number;
  delayedOrdersCount: number;
  openSlaBreachesCount: number;
  activeOrders: ControlTowerOrder[];
  activeDeliveries: ControlTowerDeliveryLocation[];
  openSlaBreaches: ControlTowerSlaBreach[];
};
