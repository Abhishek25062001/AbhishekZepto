import { Types } from 'mongoose';
import { DeliveryAssignmentModel } from '../../delivery/models/delivery-assignment.model';
import { DELIVERY_SLA_STATUS } from '../../delivery/constants/delivery-sla.constant';
import { OrderModel } from '../../orders/models/order.model';
import { ORDER_SLA_STATUS } from '../../orders/constants/order-sla.constant';
import { ORDER_STATUS } from '../../orders/constants/order-status.constant';
import type {
  ControlTowerDeliveryLocation,
  ControlTowerOrder,
  ControlTowerQuery,
  ControlTowerSlaBreach,
  ControlTowerSnapshot,
} from '../types/control-tower.types';

const ACTIVE_ORDER_STATUSES = [
  ORDER_STATUS.PLACED,
  ORDER_STATUS.ACCEPTED,
  ORDER_STATUS.PICKING,
  ORDER_STATUS.PACKING,
  ORDER_STATUS.READY_FOR_PICKUP,
  ORDER_STATUS.SHIPPED,
];

const ACTIVE_DELIVERY_STATUSES = [
  'pending_assignment',
  'assigned',
  'en_route_to_store',
  'arrived_at_store',
  'picked_up',
  'en_route_to_customer',
  'arrived_at_customer',
];

const OUT_FOR_DELIVERY_STATUSES = [
  'en_route_to_customer',
  'arrived_at_customer',
];

const toObjectId = (value: string | undefined): Types.ObjectId | null =>
  value && Types.ObjectId.isValid(value) ? new Types.ObjectId(value) : null;

const buildDeliveryFilter = (query: ControlTowerQuery): Record<string, unknown> => {
  const filter: Record<string, unknown> = {};
  const cityId = toObjectId(query.cityId);
  if (cityId) {
    filter.cityId = cityId;
  }
  return filter;
};

type OrderLike = {
  _id: Types.ObjectId;
  orderNumber: string;
  customerId: Types.ObjectId;
  storeId: Types.ObjectId;
  orderStatus: ControlTowerOrder['orderStatus'];
  storeStatus: ControlTowerOrder['storeStatus'];
  pickerStatus: string | null;
  packingStatus: string | null;
  paymentStatus: ControlTowerOrder['paymentStatus'];
  grandTotal: number;
  currency: string;
  placedAt: Date;
  createdAt: Date;
  acceptedAt: Date | null;
  items: unknown[];
  slaStatus: string | null;
  slaBreachedStage: string | null;
  updatedAt: Date;
};

const toControlTowerOrder = (record: OrderLike): ControlTowerOrder => {
  return {
    orderId: record._id.toString(),
    orderNumber: record.orderNumber,
    customerId: record.customerId.toString(),
    storeId: record.storeId.toString(),
    cityId: null,
    orderStatus: record.orderStatus,
    storeStatus: record.storeStatus,
    pickerStatus: record.pickerStatus,
    packingStatus: record.packingStatus,
    paymentStatus: record.paymentStatus,
    grandTotal: record.grandTotal,
    currency: record.currency,
    placedAt: record.placedAt.toISOString(),
    createdAt: record.createdAt.toISOString(),
    acceptedAt: record.acceptedAt?.toISOString() ?? null,
    itemCount: record.items.length,
    slaStatus: record.slaStatus,
    slaBreachedStage: record.slaBreachedStage,
    updatedAt: record.updatedAt.toISOString(),
  };
};

type DeliveryLike = {
  _id: Types.ObjectId;
  orderId: Types.ObjectId;
  cityId: Types.ObjectId;
  deliveryAgentId: Types.ObjectId | null;
  deliveryStatus: ControlTowerDeliveryLocation['deliveryStatus'];
  currentLatitude?: number | null;
  currentLongitude?: number | null;
  heading?: number | null;
  speed?: number | null;
  lastLocationUpdatedAt?: Date | null;
  updatedAt: Date;
  slaBreachedStage?: string | null;
  slaBreachedAt?: Date | null;
};

const toControlTowerDeliveryLocation = (
  delivery: DeliveryLike,
): ControlTowerDeliveryLocation => ({
  deliveryId: delivery._id.toString(),
  orderId: delivery.orderId.toString(),
  cityId: delivery.cityId.toString(),
  deliveryAgentId: delivery.deliveryAgentId?.toString() ?? null,
  deliveryStatus: delivery.deliveryStatus,
  latitude: delivery.currentLatitude ?? null,
  longitude: delivery.currentLongitude ?? null,
  heading: delivery.heading ?? null,
  speed: delivery.speed ?? null,
  updatedAt:
    delivery.lastLocationUpdatedAt?.toISOString() ??
    delivery.updatedAt.toISOString(),
});

const toControlTowerSlaBreach = (delivery: DeliveryLike): ControlTowerSlaBreach => {
  const breachedAt = delivery.slaBreachedAt ?? delivery.updatedAt;
  const breachId = `${delivery._id.toString()}:${delivery.slaBreachedStage ?? 'delivery'}`;

  return {
    eventName: 'admin.delivery_sla_breach_created',
    breachId,
    orderId: delivery.orderId.toString(),
    assignmentId: delivery._id.toString(),
    deliveryId: delivery._id.toString(),
    cityId: delivery.cityId.toString(),
    breachType: delivery.slaBreachedStage ?? 'delivery_sla',
    escalationLevel: null,
    breachedAt: breachedAt.toISOString(),
    emittedAt: null,
    eventId: null,
  };
};

export const getControlTowerSnapshot = async (
  query: ControlTowerQuery,
): Promise<ControlTowerSnapshot> => {
  const deliveryFilter = buildDeliveryFilter(query);
  const activeDeliveryFilter = {
    ...deliveryFilter,
    deliveryStatus: { $in: ACTIVE_DELIVERY_STATUSES },
  };
  const outForDeliveryFilter = {
    ...deliveryFilter,
    deliveryStatus: { $in: OUT_FOR_DELIVERY_STATUSES },
  };
  const breachedDeliveryFilter = {
    ...deliveryFilter,
    slaStatus: DELIVERY_SLA_STATUS.BREACHED,
  };

  const [
    activeOrdersCount,
    assignedRidersCount,
    outForDeliveryCount,
    delayedOrdersCount,
    openSlaBreachesCount,
    activeOrders,
    activeDeliveries,
    openSlaBreaches,
  ] = await Promise.all([
    OrderModel.countDocuments({ orderStatus: { $in: ACTIVE_ORDER_STATUSES } }),
    DeliveryAssignmentModel.distinct('deliveryAgentId', {
      ...activeDeliveryFilter,
      deliveryAgentId: { $ne: null },
    }),
    DeliveryAssignmentModel.countDocuments(outForDeliveryFilter),
    OrderModel.countDocuments({ slaStatus: ORDER_SLA_STATUS.BREACHED }),
    DeliveryAssignmentModel.countDocuments(breachedDeliveryFilter),
    OrderModel.find({ orderStatus: { $in: ACTIVE_ORDER_STATUSES } })
      .sort({ updatedAt: -1 })
      .limit(25)
      .lean(),
    DeliveryAssignmentModel.find(activeDeliveryFilter)
      .sort({ updatedAt: -1 })
      .limit(25)
      .lean(),
    DeliveryAssignmentModel.find(breachedDeliveryFilter)
      .sort({ slaBreachedAt: -1, updatedAt: -1 })
      .limit(25)
      .lean(),
  ]);

  return {
    activeOrdersCount,
    assignedRidersCount: assignedRidersCount.filter(Boolean).length,
    outForDeliveryCount,
    delayedOrdersCount,
    openSlaBreachesCount,
    activeOrders: activeOrders.map((order) => toControlTowerOrder(order)),
    activeDeliveries: activeDeliveries.map((delivery) =>
      toControlTowerDeliveryLocation(delivery as DeliveryLike),
    ),
    openSlaBreaches: openSlaBreaches.map((delivery) =>
      toControlTowerSlaBreach(delivery as DeliveryLike),
    ),
  };
};

export const getActiveDeliveryLocations = async (
  query: ControlTowerQuery,
): Promise<ControlTowerDeliveryLocation[]> => {
  const activeDeliveries = await DeliveryAssignmentModel.find({
    ...buildDeliveryFilter(query),
    deliveryStatus: { $in: ACTIVE_DELIVERY_STATUSES },
  })
    .sort({ updatedAt: -1 })
    .limit(100)
    .lean();

  return activeDeliveries.map((delivery) =>
    toControlTowerDeliveryLocation(delivery as DeliveryLike),
  );
};
