import { Types } from 'mongoose';

import { DeliveryAssignmentModel } from '../../delivery/models/delivery-assignment.model';
import { DeliveryStatus } from '../../delivery/types/delivery-assignment.types';
import { AVAILABILITY_STATUS } from '../../delivery/constants/delivery-agent-status.constant';
import { DeliveryAgentModel } from '../../delivery/models/delivery-agent.model';
import { ORDER_SLA_STATUS } from '../../orders/constants/order-sla.constant';
import { ORDER_STATUS } from '../../orders/constants/order-status.constant';
import { OrderModel } from '../../orders/models/order.model';
import { StoreModel } from '../../stores/models/store.model';
import type {
  AdminControlEscalation,
  AdminControlLiveAgent,
  AdminControlLiveOrder,
  AdminControlLiveOverview,
  AdminControlLiveStore,
} from '../types/admin-control-live.types';

type LiveQuery = {
  cityId?: string;
  status?: string;
  slaRisk?: string;
  storeId?: string;
};

const ACTIVE_ORDER_STATUSES = [
  ORDER_STATUS.PLACED,
  ORDER_STATUS.ACCEPTED,
  ORDER_STATUS.PICKING,
  ORDER_STATUS.PACKING,
  ORDER_STATUS.READY_FOR_PICKUP,
  ORDER_STATUS.SHIPPED,
];

const toObjectId = (value: string): Types.ObjectId => new Types.ObjectId(value);

const getStoreIdsForCity = async (cityId?: string): Promise<Types.ObjectId[] | null> => {
  if (!cityId) {
    return null;
  }

  const stores = await StoreModel.find({ cityId: toObjectId(cityId), isDeleted: false })
    .select('_id')
    .lean();

  return stores.map((store) => store._id);
};

const buildOrderFilter = async (query: LiveQuery): Promise<Record<string, unknown>> => {
  const filter: Record<string, unknown> = {};

  if (query.status) {
    filter.orderStatus = query.status;
  } else {
    filter.orderStatus = { $in: ACTIVE_ORDER_STATUSES };
  }

  if (query.slaRisk) {
    filter.slaStatus = query.slaRisk;
  }

  if (query.storeId) {
    filter.storeId = toObjectId(query.storeId);
    return filter;
  }

  const cityStoreIds = await getStoreIdsForCity(query.cityId);
  if (cityStoreIds) {
    filter.storeId = { $in: cityStoreIds };
  }

  return filter;
};

export const getAdminControlLiveOverview = async (
  query: LiveQuery,
): Promise<AdminControlLiveOverview> => {
  const orderFilter = await buildOrderFilter(query);
  const agentFilter = query.cityId ? { cityId: toObjectId(query.cityId) } : {};
  const storeFilter = query.cityId ? { cityId: toObjectId(query.cityId) } : {};

  const [
    activeOrders,
    lateOrders,
    activeAgents,
    offlineAgents,
    forceClosedStores,
    slaBreaches,
  ] = await Promise.all([
    OrderModel.countDocuments(orderFilter),
    OrderModel.countDocuments({ ...orderFilter, slaStatus: ORDER_SLA_STATUS.BREACHED }),
    DeliveryAgentModel.countDocuments({
      ...agentFilter,
      availabilityStatus: AVAILABILITY_STATUS.ONLINE,
      isDeleted: false,
    }),
    DeliveryAgentModel.countDocuments({
      ...agentFilter,
      availabilityStatus: AVAILABILITY_STATUS.OFFLINE,
      isDeleted: false,
    }),
    StoreModel.countDocuments({
      ...storeFilter,
      storeOperationalStatus: 'force_closed',
      isDeleted: false,
    }),
    DeliveryAssignmentModel.countDocuments({
      ...(query.cityId ? { cityId: toObjectId(query.cityId) } : {}),
      slaStatus: ORDER_SLA_STATUS.BREACHED,
    }),
  ]);

  return {
    activeOrders,
    lateOrders,
    activeAgents,
    offlineAgents,
    forceClosedStores,
    slaBreaches,
  };
};

export const listAdminControlLiveOrders = async (
  query: LiveQuery,
): Promise<AdminControlLiveOrder[]> => {
  const records = await OrderModel.find(await buildOrderFilter(query))
    .sort({ updatedAt: -1 })
    .limit(50)
    .lean();

  return records.map((order) => ({
    orderId: order._id.toString(),
    orderNumber: order.orderNumber,
    storeId: order.storeId.toString(),
    customerId: order.customerId.toString(),
    orderStatus: order.orderStatus,
    slaStatus: order.slaStatus,
    slaBreachedStage: order.slaBreachedStage,
    updatedAt: order.updatedAt.toISOString(),
  }));
};

export const listAdminControlLiveAgents = async (
  query: LiveQuery,
): Promise<AdminControlLiveAgent[]> => {
  const agents = await DeliveryAgentModel.find({
    ...(query.cityId ? { cityId: toObjectId(query.cityId) } : {}),
    isDeleted: false,
  })
    .sort({ updatedAt: -1 })
    .limit(50)
    .lean();

  const assignmentCounts = await DeliveryAssignmentModel.aggregate<{
    _id: Types.ObjectId;
    count: number;
  }>([
    {
      $match: {
        deliveryAgentId: { $in: agents.map((agent) => agent._id) },
        deliveryStatus: {
          $in: [
            DeliveryStatus.ASSIGNED,
            DeliveryStatus.EN_ROUTE_TO_STORE,
            DeliveryStatus.ARRIVED_AT_STORE,
            DeliveryStatus.PICKED_UP,
            DeliveryStatus.EN_ROUTE_TO_CUSTOMER,
            DeliveryStatus.ARRIVED_AT_CUSTOMER,
          ],
        },
      },
    },
    { $group: { _id: '$deliveryAgentId', count: { $sum: 1 } } },
  ]).exec();

  const countByAgentId = new Map(
    assignmentCounts.map((entry) => [entry._id.toString(), entry.count]),
  );

  return agents.map((agent) => ({
    agentId: agent._id.toString(),
    cityId: agent.cityId?.toString() ?? null,
    location: null,
    availability: agent.availabilityStatus,
    batteryLevel: null,
    activeOrderCount: countByAgentId.get(agent._id.toString()) ?? 0,
    updatedAt: agent.updatedAt.toISOString(),
  }));
};

export const listAdminControlLiveStores = async (
  query: LiveQuery,
): Promise<AdminControlLiveStore[]> => {
  const stores = await StoreModel.find({
    ...(query.cityId ? { cityId: toObjectId(query.cityId) } : {}),
    isDeleted: false,
  })
    .sort({ updatedAt: -1 })
    .limit(50)
    .lean();

  const queueCounts = await OrderModel.aggregate<{
    _id: Types.ObjectId;
    count: number;
  }>([
    {
      $match: {
        storeId: { $in: stores.map((store) => store._id) },
        orderStatus: { $in: ACTIVE_ORDER_STATUSES },
      },
    },
    { $group: { _id: '$storeId', count: { $sum: 1 } } },
  ]).exec();

  const queueByStoreId = new Map(
    queueCounts.map((entry) => [entry._id.toString(), entry.count]),
  );

  return stores.map((store) => ({
    storeId: store._id.toString(),
    cityId: store.cityId.toString(),
    queueLoad: queueByStoreId.get(store._id.toString()) ?? 0,
    preparationDelay: null,
    acceptanceRate: null,
    forceCloseStatus: store.storeOperationalStatus ?? null,
    isOpen: store.isOpen,
    isAcceptingOrders: store.isAcceptingOrders,
    updatedAt: store.updatedAt.toISOString(),
  }));
};

export const listAdminControlEscalations = async (
  query: LiveQuery,
): Promise<AdminControlEscalation[]> => {
  const records = await DeliveryAssignmentModel.find({
    ...(query.cityId ? { cityId: toObjectId(query.cityId) } : {}),
    $or: [
      { escalationLevel: { $ne: null } },
      { slaStatus: ORDER_SLA_STATUS.BREACHED },
    ],
  })
    .sort({ escalatedAt: -1, updatedAt: -1 })
    .limit(50)
    .lean();

  return records.map((assignment) => ({
    escalationId: assignment._id.toString(),
    orderId: assignment.orderId.toString(),
    assignmentId: assignment._id.toString(),
    cityId: assignment.cityId.toString(),
    escalationLevel: assignment.escalationLevel ?? null,
    escalationReason: assignment.escalationReason ?? null,
    escalatedAt: assignment.escalatedAt?.toISOString() ?? null,
    slaBreachedStage: assignment.slaBreachedStage ?? null,
  }));
};
