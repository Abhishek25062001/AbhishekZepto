import { sendCreatedResponse, sendSuccessResponse } from '../../../../utils/api-response';
import { asyncHandler } from '../../../../utils/async-handler';
import {
  confirmInventoryLock,
  createInventoryLock,
  releaseInventoryLock,
} from '../services/inventory-lock.service';

const requireActorUserId = (userId?: string): string => userId ?? 'system';
const requireStringParam = (value: string | string[] | undefined): string =>
  typeof value === 'string' ? value : '';

export const createInventoryLockController = asyncHandler(async (req, res) => {
  const created = await createInventoryLock(req.body, requireActorUserId(req.user?.userId));

  return sendCreatedResponse({
    res,
    message: 'Inventory lock created successfully',
    data: created,
  });
});

export const releaseInventoryLockController = asyncHandler(async (req, res) => {
  const released = await releaseInventoryLock(
    {
      lockToken: requireStringParam(req.params.lockToken),
      releaseReason: req.body.releaseReason,
      metadata: req.body.metadata,
    },
    requireActorUserId(req.user?.userId),
  );

  return sendSuccessResponse({
    res,
    message: 'Inventory lock released successfully',
    data: released,
  });
});

export const confirmInventoryLockController = asyncHandler(async (req, res) => {
  const confirmed = await confirmInventoryLock(
    {
      lockToken: requireStringParam(req.params.lockToken),
      confirmationReason: req.body.confirmationReason,
      orderId: req.body.orderId,
      metadata: req.body.metadata,
    },
    requireActorUserId(req.user?.userId),
  );

  return sendSuccessResponse({
    res,
    message: 'Inventory lock confirmed successfully',
    data: confirmed,
  });
});
