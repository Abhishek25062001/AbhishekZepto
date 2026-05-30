import type { OrderRealtimeEventName } from '../constants/order-realtime-events.constant';

export type OrderRealtimePayload = {
  orderId: string;
  customerId: string;
  storeId: string;
  vendorId: string | null;
  cityId: string | null;
  orderStatus: string;
  paymentStatus: string | null;
  totalAmount: number | null;
  updatedAt: string | null;
  eventSource: 'order' | 'delivery' | 'system';
};

export type OrderRealtimeStatusPayload = OrderRealtimePayload & {
  previousOrderStatus?: string | null;
};

export type OrderRealtimeRoomPayload = {
  eventName: OrderRealtimeEventName;
  roomName: string;
  data: OrderRealtimePayload;
};
