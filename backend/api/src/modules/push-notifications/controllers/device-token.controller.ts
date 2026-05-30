import type { Request, Response } from 'express';

import { sendCreatedResponse, sendSuccessResponse } from '../../../utils/api-response';
import { asyncHandler } from '../../../utils/async-handler';
import {
  registerCustomerDeviceToken,
  registerDeliveryDeviceToken,
  removeDeviceToken,
} from '../services/device-token.service';
import { mapDeviceTokenResponse } from '../utils/push-notification-response.mapper';

export const registerCustomerDeviceTokenController = asyncHandler(
  async (req: Request, res: Response) => {
    const token = await registerCustomerDeviceToken(req.user!.userId, req.body);

    return sendCreatedResponse({
      res,
      message: 'Customer device token registered successfully',
      data: mapDeviceTokenResponse(token),
    });
  },
);

export const registerDeliveryDeviceTokenController = asyncHandler(
  async (req: Request, res: Response) => {
    const token = await registerDeliveryDeviceToken(req.user!.userId, req.body);

    return sendCreatedResponse({
      res,
      message: 'Delivery device token registered successfully',
      data: mapDeviceTokenResponse(token),
    });
  },
);

export const removeDeviceTokenController = asyncHandler(
  async (req: Request, res: Response) => {
    const { deviceId } = req.params as { deviceId: string };
    const token = await removeDeviceToken(req.user!.userId, deviceId);

    return sendSuccessResponse({
      res,
      message: 'Device token removed successfully',
      data: token ? mapDeviceTokenResponse(token) : null,
    });
  },
);
