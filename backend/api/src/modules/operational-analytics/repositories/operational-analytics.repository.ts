import { Types } from 'mongoose';
import type { PipelineStage } from 'mongoose';

import { DeliveryAssignmentModel } from '../../delivery/models/delivery-assignment.model';
import { OrderModel } from '../../orders/models/order.model';
import { StoreModel } from '../../stores/models/store.model';
import { SupportTicketModel } from '../../support-operations/models/support-ticket.model';
import type {
  CountBreakdown,
  OperationalAnalyticsQuery,
  OperationalAnalyticsRepositorySummary,
} from '../types/operational-analytics.types';

type AnalyticsMatch = Record<string, unknown>;
type AggregateRow = {
  _id: string | null;
  count: number;
};

const toObjectId = (value?: string): Types.ObjectId | undefined => {
  if (!value) {
    return undefined;
  }

  return new Types.ObjectId(value);
};

export const buildAnalyticsDateMatch = (
  field: string,
  query: Pick<OperationalAnalyticsQuery, 'fromDate' | 'toDate'>,
): AnalyticsMatch => {
  const dateMatch: Record<string, Date> = {};

  if (query.fromDate) {
    dateMatch.$gte = query.fromDate;
  }

  if (query.toDate) {
    dateMatch.$lte = query.toDate;
  }

  if (Object.keys(dateMatch).length === 0) {
    return {};
  }

  return {
    [field]: dateMatch,
  };
};

export const buildBreakdown = (rows: AggregateRow[]): CountBreakdown =>
  rows.reduce<CountBreakdown>((breakdown, row) => {
    if (row._id) {
      breakdown[row._id] = row.count;
    }

    return breakdown;
  }, {});

const aggregateBreakdown = async (
  model: typeof OrderModel | typeof DeliveryAssignmentModel | typeof StoreModel | typeof SupportTicketModel,
  match: AnalyticsMatch,
  groupField: string,
): Promise<OperationalAnalyticsRepositorySummary> => {
  const pipeline: PipelineStage[] = [
    { $match: match },
    {
      $group: {
        _id: `$${groupField}`,
        count: { $sum: 1 },
      },
    },
  ];

  const rows = await model.aggregate<AggregateRow>(pipeline);

  return {
    total: rows.reduce((sum, row) => sum + row.count, 0),
    breakdown: buildBreakdown(rows),
  };
};

export const summarizeOrders = async (
  query: OperationalAnalyticsQuery,
): Promise<OperationalAnalyticsRepositorySummary> => {
  const match: AnalyticsMatch = {
    ...buildAnalyticsDateMatch('placedAt', query),
  };
  const storeId = toObjectId(query.storeId);

  if (storeId) {
    match.storeId = storeId;
  }

  return aggregateBreakdown(OrderModel, match, 'orderStatus');
};

export const summarizeDeliveryAssignments = async (
  query: OperationalAnalyticsQuery,
): Promise<OperationalAnalyticsRepositorySummary> => {
  const match: AnalyticsMatch = {
    ...buildAnalyticsDateMatch('createdAt', query),
  };
  const storeId = toObjectId(query.storeId);
  const cityId = toObjectId(query.cityId);

  if (storeId) {
    match.storeId = storeId;
  }

  if (cityId) {
    match.cityId = cityId;
  }

  return aggregateBreakdown(DeliveryAssignmentModel, match, 'deliveryStatus');
};

export const summarizeStores = async (
  query: OperationalAnalyticsQuery,
): Promise<OperationalAnalyticsRepositorySummary> => {
  const match: AnalyticsMatch = {
    isDeleted: false,
    ...buildAnalyticsDateMatch('createdAt', query),
  };
  const storeId = toObjectId(query.storeId);
  const vendorId = toObjectId(query.vendorId);
  const cityId = toObjectId(query.cityId);

  if (storeId) {
    match._id = storeId;
  }

  if (vendorId) {
    match.vendorId = vendorId;
  }

  if (cityId) {
    match.cityId = cityId;
  }

  return aggregateBreakdown(StoreModel, match, 'status');
};

export const summarizeSupportTickets = async (
  query: OperationalAnalyticsQuery,
): Promise<{
  status: OperationalAnalyticsRepositorySummary;
  priority: OperationalAnalyticsRepositorySummary;
  category: OperationalAnalyticsRepositorySummary;
}> => {
  const match: AnalyticsMatch = {
    isDeleted: false,
    ...buildAnalyticsDateMatch('createdAt', query),
  };

  const [status, priority, category] = await Promise.all([
    aggregateBreakdown(SupportTicketModel, match, 'status'),
    aggregateBreakdown(SupportTicketModel, match, 'priority'),
    aggregateBreakdown(SupportTicketModel, match, 'category'),
  ]);

  return {
    status,
    priority,
    category,
  };
};
