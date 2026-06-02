import type { Request, Response } from 'express';

import { sendSuccessResponse } from '../../../utils/api-response';
import { asyncHandler } from '../../../utils/async-handler';
import {
  getOperationalAnalyticsDelivery,
  getOperationalAnalyticsOrders,
  getOperationalAnalyticsOverview,
  getOperationalAnalyticsStores,
  getOperationalAnalyticsSupport,
} from '../services/operational-analytics.service';
import type { OperationalAnalyticsQuery } from '../types/operational-analytics.types';

const getQuery = (req: Request): OperationalAnalyticsQuery =>
  req.query as unknown as OperationalAnalyticsQuery;

export const getOperationalAnalyticsOverviewController = asyncHandler(
  async (req: Request, res: Response) => {
    const result = await getOperationalAnalyticsOverview(getQuery(req));

    return sendSuccessResponse({
      res,
      message: 'Operational analytics overview fetched successfully',
      data: result,
    });
  },
);

export const getOperationalAnalyticsOrdersController = asyncHandler(
  async (req: Request, res: Response) => {
    const result = await getOperationalAnalyticsOrders(getQuery(req));

    return sendSuccessResponse({
      res,
      message: 'Order analytics fetched successfully',
      data: result,
    });
  },
);

export const getOperationalAnalyticsDeliveryController = asyncHandler(
  async (req: Request, res: Response) => {
    const result = await getOperationalAnalyticsDelivery(getQuery(req));

    return sendSuccessResponse({
      res,
      message: 'Delivery analytics fetched successfully',
      data: result,
    });
  },
);

export const getOperationalAnalyticsStoresController = asyncHandler(
  async (req: Request, res: Response) => {
    const result = await getOperationalAnalyticsStores(getQuery(req));

    return sendSuccessResponse({
      res,
      message: 'Store analytics fetched successfully',
      data: result,
    });
  },
);

export const getOperationalAnalyticsSupportController = asyncHandler(
  async (req: Request, res: Response) => {
    const result = await getOperationalAnalyticsSupport(getQuery(req));

    return sendSuccessResponse({
      res,
      message: 'Support analytics fetched successfully',
      data: result,
    });
  },
);
