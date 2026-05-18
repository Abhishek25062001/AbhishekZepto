import { sendSuccessResponse } from '../../../utils/api-response';
import { asyncHandler } from '../../../utils/async-handler';
import {
  assignUserRole,
  syncUserPermissionsFromRole,
  updateUserPermissions,
} from '../services/user-permission.service';
import { requireStringParam, toObjectIdOrNull } from './role.controller';

export const updateUserPermissionsController = asyncHandler(async (req, res) => {
  const response = await updateUserPermissions({
    userId: requireStringParam(req.params.userId),
    permissions: req.body.permissions,
    updatedBy: toObjectIdOrNull(req.user?.userId ?? null),
  });

  return sendSuccessResponse({
    res,
    message: 'User permissions updated successfully',
    data: response,
    meta: {
      requestId: req.requestId,
      traceId: req.traceId,
    },
  });
});

export const assignUserRoleController = asyncHandler(async (req, res) => {
  const response = await assignUserRole({
    userId: requireStringParam(req.params.userId),
    role: req.body.role,
    updatedBy: toObjectIdOrNull(req.user?.userId ?? null),
  });

  return sendSuccessResponse({
    res,
    message: 'User role updated successfully',
    data: response,
    meta: {
      requestId: req.requestId,
      traceId: req.traceId,
    },
  });
});

export const syncUserRolePermissionsController = asyncHandler(async (req, res) => {
  const response = await syncUserPermissionsFromRole({
    userId: requireStringParam(req.params.userId),
    roleCode: req.body.roleCode,
    updatedBy: toObjectIdOrNull(req.user?.userId ?? null),
  });

  return sendSuccessResponse({
    res,
    message: 'User permissions synced from role successfully',
    data: response,
    meta: {
      requestId: req.requestId,
      traceId: req.traceId,
    },
  });
});
