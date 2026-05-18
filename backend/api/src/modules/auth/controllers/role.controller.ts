import { Types } from 'mongoose';
import { sendCreatedResponse, sendPaginatedResponse, sendSuccessResponse } from '../../../utils/api-response';
import { asyncHandler } from '../../../utils/async-handler';
import type { DbStatus } from '../../../database/constants/db-status.constants';
import {
  createRole,
  deleteRole,
  getRoleById,
  listRoles,
  updateRole,
} from '../services/role.service';

export const requireStringParam = (value: string | string[] | undefined): string => {
  if (typeof value === 'string') {
    return value;
  }

  return '';
};

export const listRolesController = asyncHandler(async (req, res) => {
  const page = typeof req.query.page === 'number' ? req.query.page : Number(req.query.page ?? 1);
  const limit =
    typeof req.query.limit === 'number' ? req.query.limit : Number(req.query.limit ?? 20);
  const search = typeof req.query.search === 'string' ? req.query.search : undefined;
  const status =
    typeof req.query.status === 'string' ? (req.query.status as DbStatus) : undefined;

  const response = await listRoles({
    page,
    limit,
    search,
    status,
  });

  return sendPaginatedResponse({
    res,
    message: 'Roles fetched successfully',
    data: response.items,
    pagination: response.pagination,
    meta: {
      requestId: req.requestId,
      traceId: req.traceId,
    },
  });
});

export const createRoleController = asyncHandler(async (req, res) => {
  const response = await createRole({
    ...req.body,
    description: req.body.description ?? null,
  });

  return sendCreatedResponse({
    res,
    message: 'Role created successfully',
    data: response,
    meta: {
      requestId: req.requestId,
      traceId: req.traceId,
    },
  });
});

export const getRoleByIdController = asyncHandler(async (req, res) => {
  const response = await getRoleById(requireStringParam(req.params.roleId));

  return sendSuccessResponse({
    res,
    message: 'Role fetched successfully',
    data: response,
    meta: {
      requestId: req.requestId,
      traceId: req.traceId,
    },
  });
});

export const updateRoleController = asyncHandler(async (req, res) => {
  const response = await updateRole(requireStringParam(req.params.roleId), req.body);

  return sendSuccessResponse({
    res,
    message: 'Role updated successfully',
    data: response,
    meta: {
      requestId: req.requestId,
      traceId: req.traceId,
    },
  });
});

export const deleteRoleController = asyncHandler(async (req, res) => {
  const response = await deleteRole(requireStringParam(req.params.roleId));

  return sendSuccessResponse({
    res,
    message: 'Role deleted successfully',
    data: response,
    meta: {
      requestId: req.requestId,
      traceId: req.traceId,
    },
  });
});

export const toObjectIdOrNull = (value?: string | null): Types.ObjectId | null => {
  if (!value || !Types.ObjectId.isValid(value)) {
    return null;
  }

  return new Types.ObjectId(value);
};
