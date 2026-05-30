import type { Request, Response } from 'express';
import { sendSuccessResponse } from '../../../utils/api-response';
import { asyncHandler } from '../../../utils/async-handler';
import {
  getActiveDeliveryLocations,
  getControlTowerSnapshot,
} from '../services/control-tower.service';
import type { ControlTowerQuery } from '../types/control-tower.types';

export const getControlTowerSnapshotController = asyncHandler(
  async (req: Request, res: Response) => {
    const snapshot = await getControlTowerSnapshot(req.query as ControlTowerQuery);

    return sendSuccessResponse({
      res,
      message: 'Control tower snapshot fetched successfully',
      data: snapshot,
    });
  },
);

export const getActiveDeliveryLocationsController = asyncHandler(
  async (req: Request, res: Response) => {
    const locations = await getActiveDeliveryLocations(req.query as ControlTowerQuery);

    return sendSuccessResponse({
      res,
      message: 'Active delivery locations fetched successfully',
      data: locations,
    });
  },
);
