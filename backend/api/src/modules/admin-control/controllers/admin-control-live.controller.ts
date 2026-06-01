import type { Request, Response } from 'express';

import { sendSuccessResponse } from '../../../utils/api-response';
import { asyncHandler } from '../../../utils/async-handler';
import {
  getAdminControlLiveOverview,
  listAdminControlEscalations,
  listAdminControlLiveAgents,
  listAdminControlLiveOrders,
  listAdminControlLiveStores,
} from '../services/admin-control-live-overview.service';

export const getAdminControlLiveOverviewController = asyncHandler(
  async (req: Request, res: Response) => {
    const overview = await getAdminControlLiveOverview(req.query);

    return sendSuccessResponse({
      res,
      message: 'Admin control live overview fetched successfully',
      data: overview,
    });
  },
);

export const listAdminControlLiveOrdersController = asyncHandler(
  async (req: Request, res: Response) => {
    const orders = await listAdminControlLiveOrders(req.query);

    return sendSuccessResponse({
      res,
      message: 'Admin control live orders fetched successfully',
      data: orders,
    });
  },
);

export const listAdminControlLiveAgentsController = asyncHandler(
  async (req: Request, res: Response) => {
    const agents = await listAdminControlLiveAgents(req.query);

    return sendSuccessResponse({
      res,
      message: 'Admin control live agents fetched successfully',
      data: agents,
    });
  },
);

export const listAdminControlLiveStoresController = asyncHandler(
  async (req: Request, res: Response) => {
    const stores = await listAdminControlLiveStores(req.query);

    return sendSuccessResponse({
      res,
      message: 'Admin control live stores fetched successfully',
      data: stores,
    });
  },
);

export const listAdminControlEscalationsController = asyncHandler(
  async (req: Request, res: Response) => {
    const escalations = await listAdminControlEscalations(req.query);

    return sendSuccessResponse({
      res,
      message: 'Admin control escalations fetched successfully',
      data: escalations,
    });
  },
);
