import { Types } from 'mongoose';
import { ORDER_STATUS } from '../constants/order-status.constant';
import { OrderModel } from '../models/order.model';
import type { OrderRecord, OrderTimelineEvent } from '../types/order.types';

export const findOrderByIdForCustomer = async (
  orderId: string,
  customerId: string,
): Promise<(OrderRecord & { _id: Types.ObjectId }) | null> => {
  if (!Types.ObjectId.isValid(orderId) || !Types.ObjectId.isValid(customerId)) {
    return null;
  }

  return OrderModel.findOne({
    _id: new Types.ObjectId(orderId),
    customerId: new Types.ObjectId(customerId),
  }).lean();
};

export const findOrderByPaymentId = async (
  paymentId: string,
): Promise<(OrderRecord & { _id: Types.ObjectId }) | null> => {
  if (!Types.ObjectId.isValid(paymentId)) {
    return null;
  }

  return OrderModel.findOne({ paymentId: new Types.ObjectId(paymentId) }).lean();
};

export const findOrderByIdForStore = async (
  orderId: string,
  storeId: string,
): Promise<(OrderRecord & { _id: Types.ObjectId }) | null> => {
  if (!Types.ObjectId.isValid(orderId) || !Types.ObjectId.isValid(storeId)) {
    return null;
  }

  return OrderModel.findOne({
    _id: new Types.ObjectId(orderId),
    storeId: new Types.ObjectId(storeId),
  }).lean();
};

export const findOrderById = async (
  orderId: string,
): Promise<(OrderRecord & { _id: Types.ObjectId }) | null> => {
  if (!Types.ObjectId.isValid(orderId)) {
    return null;
  }

  return OrderModel.findOne({
    _id: new Types.ObjectId(orderId),
  }).lean();
};

export const createOrder = async (
  payload: Partial<OrderRecord>,
): Promise<OrderRecord & { _id: Types.ObjectId }> => {
  const created = await OrderModel.create(payload);
  return created.toObject() as OrderRecord & { _id: Types.ObjectId };
};

export const listOrdersByCustomer = async (
  customerId: string,
  options: { page: number; limit: number; status?: string },
): Promise<{ orders: (OrderRecord & { _id: Types.ObjectId })[]; total: number }> => {
  if (!Types.ObjectId.isValid(customerId)) {
    return { orders: [], total: 0 };
  }

  const filter: Record<string, unknown> = {
    customerId: new Types.ObjectId(customerId),
  };

  if (options.status) {
    filter.orderStatus = options.status;
  }

  const skip = (options.page - 1) * options.limit;

  const [orders, total] = await Promise.all([
    OrderModel.find(filter).sort({ placedAt: -1 }).skip(skip).limit(options.limit).lean(),
    OrderModel.countDocuments(filter),
  ]);

  return {
    orders: orders as (OrderRecord & { _id: Types.ObjectId })[],
    total,
  };
};

export const listOrdersByStore = async (
  storeId: string,
  options: {
    page: number;
    limit: number;
    status?: string;
    storeStatus?: string;
    paymentStatus?: string;
    slaStatus?: string;
    slaBreachedStage?: string;
  },
): Promise<{ orders: (OrderRecord & { _id: Types.ObjectId })[]; total: number }> => {
  if (!Types.ObjectId.isValid(storeId)) {
    return { orders: [], total: 0 };
  }

  const filter: Record<string, unknown> = {
    storeId: new Types.ObjectId(storeId),
  };

  if (options.status) {
    filter.orderStatus = options.status;
  }

  if (options.storeStatus) {
    filter.storeStatus = options.storeStatus;
  }

  if (options.paymentStatus) {
    filter.paymentStatus = options.paymentStatus;
  }

  if (options.slaStatus) {
    filter.slaStatus = options.slaStatus;
  }

  if (options.slaBreachedStage) {
    filter.slaBreachedStage = options.slaBreachedStage;
  }

  const skip = (options.page - 1) * options.limit;

  const [orders, total] = await Promise.all([
    OrderModel.find(filter).sort({ createdAt: -1 }).skip(skip).limit(options.limit).lean(),
    OrderModel.countDocuments(filter),
  ]);

  return {
    orders: orders as (OrderRecord & { _id: Types.ObjectId })[],
    total,
  };
};

const applyOrderListFilters = (
  filter: Record<string, unknown>,
  options: {
    status?: string;
    storeStatus?: string;
    paymentStatus?: string;
    slaStatus?: string;
    slaBreachedStage?: string;
    storeId?: string;
    customerId?: string;
    fromDate?: Date;
    toDate?: Date;
  },
) => {
  if (options.status) {
    filter.orderStatus = options.status;
  }

  if (options.storeStatus) {
    filter.storeStatus = options.storeStatus;
  }

  if (options.paymentStatus) {
    filter.paymentStatus = options.paymentStatus;
  }

  if (options.slaStatus) {
    filter.slaStatus = options.slaStatus;
  }

  if (options.slaBreachedStage) {
    filter.slaBreachedStage = options.slaBreachedStage;
  }

  if (options.storeId && Types.ObjectId.isValid(options.storeId)) {
    filter.storeId = new Types.ObjectId(options.storeId);
  }

  if (options.customerId && Types.ObjectId.isValid(options.customerId)) {
    filter.customerId = new Types.ObjectId(options.customerId);
  }

  if (options.fromDate || options.toDate) {
    filter.createdAt = {
      ...(options.fromDate ? { $gte: options.fromDate } : {}),
      ...(options.toDate ? { $lte: options.toDate } : {}),
    };
  }
};

const resolveAdminOrderSort = (sort?: string): Record<string, 1 | -1> => {
  switch (sort) {
    case 'createdAt_asc':
      return { createdAt: 1 };
    case 'status_asc':
      return { orderStatus: 1, createdAt: -1 };
    case 'status_desc':
      return { orderStatus: -1, createdAt: -1 };
    case 'sla_priority':
    case 'createdAt_desc':
    default:
      return { createdAt: -1 };
  }
};

export const listOrdersByAdmin = async (options: {
  page: number;
  limit: number;
  status?: string;
  storeStatus?: string;
  paymentStatus?: string;
  slaStatus?: string;
  slaBreachedStage?: string;
  storeId?: string;
  customerId?: string;
  fromDate?: Date;
  toDate?: Date;
  sort?: string;
}): Promise<{ orders: (OrderRecord & { _id: Types.ObjectId })[]; total: number }> => {
  const filter: Record<string, unknown> = {};
  applyOrderListFilters(filter, options);

  const skip = (options.page - 1) * options.limit;

  const [orders, total] = await Promise.all([
    OrderModel.find(filter)
      .sort(resolveAdminOrderSort(options.sort))
      .skip(skip)
      .limit(options.limit)
      .lean(),
    OrderModel.countDocuments(filter),
  ]);

  return {
    orders: orders as (OrderRecord & { _id: Types.ObjectId })[],
    total,
  };
};

export const updateOrderById = async (
  orderId: string,
  customerId: string,
  payload: Partial<OrderRecord>,
): Promise<(OrderRecord & { _id: Types.ObjectId }) | null> => {
  if (!Types.ObjectId.isValid(orderId) || !Types.ObjectId.isValid(customerId)) {
    return null;
  }

  return OrderModel.findOneAndUpdate(
    {
      _id: new Types.ObjectId(orderId),
      customerId: new Types.ObjectId(customerId),
    },
    { $set: payload },
    { new: true },
  ).lean();
};

export const transitionOrderByIdForCustomer = async (
  orderId: string,
  customerId: string,
  payload: Partial<OrderRecord>,
  timelineEvent: OrderTimelineEvent,
): Promise<(OrderRecord & { _id: Types.ObjectId }) | null> => {
  if (!Types.ObjectId.isValid(orderId) || !Types.ObjectId.isValid(customerId)) {
    return null;
  }

  return OrderModel.findOneAndUpdate(
    {
      _id: new Types.ObjectId(orderId),
      customerId: new Types.ObjectId(customerId),
    },
    {
      $push: { timeline: timelineEvent },
      $set: payload,
    },
    { new: true },
  ).lean();
};

export const updateOrderByIdForStore = async (
  orderId: string,
  storeId: string,
  payload: Partial<OrderRecord>,
): Promise<(OrderRecord & { _id: Types.ObjectId }) | null> => {
  if (!Types.ObjectId.isValid(orderId) || !Types.ObjectId.isValid(storeId)) {
    return null;
  }

  return OrderModel.findOneAndUpdate(
    {
      _id: new Types.ObjectId(orderId),
      storeId: new Types.ObjectId(storeId),
    },
    { $set: payload },
    { new: true },
  ).lean();
};

export const transitionOrderByIdForStore = async (
  orderId: string,
  storeId: string,
  payload: Partial<OrderRecord>,
  timelineEvent: OrderTimelineEvent | OrderTimelineEvent[],
): Promise<(OrderRecord & { _id: Types.ObjectId }) | null> => {
  if (!Types.ObjectId.isValid(orderId) || !Types.ObjectId.isValid(storeId)) {
    return null;
  }

  const timelineUpdate = Array.isArray(timelineEvent)
    ? { $each: timelineEvent }
    : timelineEvent;

  return OrderModel.findOneAndUpdate(
    {
      _id: new Types.ObjectId(orderId),
      storeId: new Types.ObjectId(storeId),
    },
    {
      $push: { timeline: timelineUpdate },
      $set: payload,
    },
    { new: true },
  ).lean();
};

export const transitionOrderById = async (
  orderId: string,
  payload: Partial<OrderRecord>,
  timelineEvent: OrderTimelineEvent,
): Promise<(OrderRecord & { _id: Types.ObjectId }) | null> => {
  if (!Types.ObjectId.isValid(orderId)) {
    return null;
  }

  return OrderModel.findOneAndUpdate(
    {
      _id: new Types.ObjectId(orderId),
    },
    {
      $push: { timeline: timelineEvent },
      $set: payload,
    },
    { new: true },
  ).lean();
};

export const updateOrderSlaById = async (
  orderId: string,
  payload: Pick<OrderRecord, 'slaBreachedStage' | 'slaStatus'>,
  timelineEvent?: OrderTimelineEvent,
): Promise<(OrderRecord & { _id: Types.ObjectId }) | null> => {
  if (!Types.ObjectId.isValid(orderId)) {
    return null;
  }

  const update = timelineEvent
    ? {
        $push: { timeline: timelineEvent },
        $set: payload,
      }
    : { $set: payload };

  return OrderModel.findOneAndUpdate(
    {
      _id: new Types.ObjectId(orderId),
    },
    update,
    { new: true },
  ).lean();
};

export const listOrdersForSlaEvaluation = async (
  options: { limit: number },
): Promise<(OrderRecord & { _id: Types.ObjectId })[]> =>
  OrderModel.find({
    orderStatus: {
      $nin: [ORDER_STATUS.CANCELLED, ORDER_STATUS.READY_FOR_PICKUP],
    },
  })
    .sort({ createdAt: 1 })
    .limit(options.limit)
    .lean();

export const countOrdersByCustomer = async (customerId: string): Promise<number> => {
  if (!Types.ObjectId.isValid(customerId)) {
    return 0;
  }

  return OrderModel.countDocuments({ customerId: new Types.ObjectId(customerId) });
};
