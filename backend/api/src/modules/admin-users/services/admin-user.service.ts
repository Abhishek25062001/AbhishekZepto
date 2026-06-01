import { Types } from 'mongoose';

import { AppError } from '../../../errors/AppError';
import { ERROR_CODES } from '../../../errors/error-codes';
import { HTTP_STATUS } from '../../../utils/http-status';
import { ADMIN_ACTION_TYPE } from '../../admin-control/constants/admin-action-types';
import { AdminActionAuditModel } from '../../admin-control/models/admin-action-audit.model';
import { writeAdminActionAudit } from '../../admin-control/services/admin-audit-log.service';
import { normalizePermissionCodes } from '../../auth/services/permission.service';
import { ADMIN_USER_STATUS } from '../constants/admin-user.constants';
import {
  createAdminUserIdentity,
  findAdminUserById,
  findAdminUserByPhone,
  listAdminUsers,
  updateAdminUserIdentity,
} from '../repositories/admin-user.repository';
import type {
  CreateAdminUserInput,
  ListAdminUsersInput,
  PaginatedAdminUsers,
  UpdateAdminUserInput,
} from '../types/admin-user.types';
import { mapAdminUserSummary } from './admin-user.mapper';

type AuditContext = {
  actorAdminId: string | null;
  reason?: string | null;
  ipAddress?: string | null;
  deviceInfo?: string | null;
};

const snapshot = (record: unknown): Record<string, unknown> => {
  if (!record || typeof record !== 'object') {
    return {};
  }

  if ('toObject' in record && typeof record.toObject === 'function') {
    return record.toObject() as Record<string, unknown>;
  }

  return record as Record<string, unknown>;
};

const writeAdminUserAudit = async ({
  audit,
  actionType,
  entityId,
  beforeState,
  afterState,
  fallbackReason,
}: {
  audit: AuditContext;
  actionType: typeof ADMIN_ACTION_TYPE[keyof typeof ADMIN_ACTION_TYPE];
  entityId: string;
  beforeState: Record<string, unknown>;
  afterState: Record<string, unknown>;
  fallbackReason: string;
}): Promise<void> => {
  if (!audit.actorAdminId) {
    return;
  }

  await writeAdminActionAudit({
    adminId: audit.actorAdminId,
    actionType,
    entityType: 'admin_user',
    entityId,
    beforeState,
    afterState,
    reason: audit.reason ?? fallbackReason,
    ipAddress: audit.ipAddress ?? null,
    deviceInfo: audit.deviceInfo ?? null,
  });
};

const getAdminUserOrThrow = async (adminUserId: string) => {
  const user = await findAdminUserById(adminUserId);

  if (!user) {
    throw new AppError({
      message: 'Admin user not found',
      statusCode: HTTP_STATUS.NOT_FOUND,
      errorCode: ERROR_CODES.ADMIN_USER_NOT_FOUND,
    });
  }

  return user;
};

export const createAdminUser = async (
  input: CreateAdminUserInput,
  audit: AuditContext = { actorAdminId: input.createdBy ?? null },
) => {
  const existing = await findAdminUserByPhone(input.phone, input.role);
  if (existing) {
    throw new AppError({
      message: 'Admin user already exists',
      statusCode: HTTP_STATUS.CONFLICT,
      errorCode: ERROR_CODES.ADMIN_USER_ALREADY_EXISTS,
    });
  }

  const created = await createAdminUserIdentity({
    ...input,
    permissions: normalizePermissionCodes(input.permissions ?? []),
    status: input.status ?? ADMIN_USER_STATUS.ACTIVE,
  });
  await writeAdminUserAudit({
    audit,
    actionType: ADMIN_ACTION_TYPE.ADMIN_USER_CREATED,
    entityId: created._id.toString(),
    beforeState: {},
    afterState: snapshot(created),
    fallbackReason: 'Admin user created',
  });

  return mapAdminUserSummary(created);
};

export const listAdminUserSummaries = async (
  input: ListAdminUsersInput,
): Promise<PaginatedAdminUsers> => {
  const result = await listAdminUsers(input);

  return {
    items: result.items.map(mapAdminUserSummary),
    page: input.page,
    limit: input.limit,
    total: result.total,
  };
};

export const getAdminUser = async (adminUserId: string) => {
  const user = await getAdminUserOrThrow(adminUserId);
  return mapAdminUserSummary(user);
};

export const updateAdminUser = async ({
  adminUserId,
  input,
  audit,
}: {
  adminUserId: string;
  input: UpdateAdminUserInput;
  audit?: AuditContext;
}) => {
  const before = await getAdminUserOrThrow(adminUserId);
  const updated = await updateAdminUserIdentity({ adminUserId, input });

  if (!updated) {
    throw new AppError({
      message: 'Admin user not found',
      statusCode: HTTP_STATUS.NOT_FOUND,
      errorCode: ERROR_CODES.ADMIN_USER_NOT_FOUND,
    });
  }
  await writeAdminUserAudit({
    audit: audit ?? { actorAdminId: input.updatedBy ?? null },
    actionType: ADMIN_ACTION_TYPE.ADMIN_USER_UPDATED,
    entityId: adminUserId,
    beforeState: snapshot(before),
    afterState: snapshot(updated),
    fallbackReason: 'Admin user updated',
  });

  return mapAdminUserSummary(updated);
};

export const updateAdminUserStatus = async ({
  adminUserId,
  status,
  updatedBy,
  reason,
  audit,
}: {
  adminUserId: string;
  status: string;
  updatedBy?: string | null;
  reason?: string | null;
  audit?: AuditContext;
}) => {
  if (updatedBy === adminUserId && status !== ADMIN_USER_STATUS.ACTIVE) {
    throw new AppError({
      message: 'Admin users cannot disable or restrict their own account',
      statusCode: HTTP_STATUS.FORBIDDEN,
      errorCode: ERROR_CODES.ADMIN_USER_SELF_DISABLE_DENIED,
    });
  }

  const before = await getAdminUserOrThrow(adminUserId);
  const updated = await updateAdminUserIdentity({
    adminUserId,
    input: { updatedBy },
  });

  if (!updated) {
    throw new AppError({
      message: 'Admin user not found',
      statusCode: HTTP_STATUS.NOT_FOUND,
      errorCode: ERROR_CODES.ADMIN_USER_NOT_FOUND,
    });
  }

  updated.accountStatus = status as typeof updated.accountStatus;
  updated.updatedBy = updatedBy && Types.ObjectId.isValid(updatedBy)
    ? new Types.ObjectId(updatedBy)
    : updated.updatedBy;
  await updated.save();
  await writeAdminUserAudit({
    audit: audit ?? { actorAdminId: updatedBy ?? null, reason },
    actionType: ADMIN_ACTION_TYPE.ADMIN_USER_STATUS_CHANGED,
    entityId: adminUserId,
    beforeState: snapshot(before),
    afterState: snapshot(updated),
    fallbackReason: reason ?? 'Admin user status changed',
  });

  return mapAdminUserSummary(updated);
};

export const updateAdminUserRole = async ({
  adminUserId,
  role,
  updatedBy,
  reason,
  audit,
}: {
  adminUserId: string;
  role: CreateAdminUserInput['role'];
  updatedBy?: string | null;
  reason?: string | null;
  audit?: AuditContext;
}) => {
  if (updatedBy === adminUserId) {
    throw new AppError({
      message: 'Admin users cannot change their own role',
      statusCode: HTTP_STATUS.FORBIDDEN,
      errorCode: ERROR_CODES.ADMIN_USER_SELF_ROLE_CHANGE_DENIED,
    });
  }

  const user = await getAdminUserOrThrow(adminUserId);
  const beforeState = snapshot(user);
  user.role = role;
  user.updatedBy = updatedBy && Types.ObjectId.isValid(updatedBy)
    ? new Types.ObjectId(updatedBy)
    : user.updatedBy;
  await user.save();
  await writeAdminUserAudit({
    audit: audit ?? { actorAdminId: updatedBy ?? null, reason },
    actionType: ADMIN_ACTION_TYPE.ADMIN_USER_ROLE_CHANGED,
    entityId: adminUserId,
    beforeState,
    afterState: snapshot(user),
    fallbackReason: reason ?? 'Admin user role changed',
  });

  return mapAdminUserSummary(user);
};

export const updateAdminUserPermissions = async ({
  adminUserId,
  permissions,
  updatedBy,
  reason,
  audit,
}: {
  adminUserId: string;
  permissions: string[];
  updatedBy?: string | null;
  reason?: string | null;
  audit?: AuditContext;
}) => {
  if (updatedBy === adminUserId) {
    throw new AppError({
      message: 'Admin users cannot change their own permissions',
      statusCode: HTTP_STATUS.FORBIDDEN,
      errorCode: ERROR_CODES.ADMIN_USER_SELF_PERMISSION_CHANGE_DENIED,
    });
  }

  const user = await getAdminUserOrThrow(adminUserId);
  const beforeState = snapshot(user);
  user.permissions = normalizePermissionCodes(permissions);
  user.updatedBy = updatedBy && Types.ObjectId.isValid(updatedBy)
    ? new Types.ObjectId(updatedBy)
    : user.updatedBy;
  await user.save();
  await writeAdminUserAudit({
    audit: audit ?? { actorAdminId: updatedBy ?? null, reason },
    actionType: ADMIN_ACTION_TYPE.ADMIN_USER_PERMISSIONS_CHANGED,
    entityId: adminUserId,
    beforeState,
    afterState: snapshot(user),
    fallbackReason: reason ?? 'Admin user permissions changed',
  });

  return mapAdminUserSummary(user);
};

export const listAdminUserAudit = async (adminUserId: string) => {
  await getAdminUserOrThrow(adminUserId);
  return AdminActionAuditModel.find({
    entityType: 'admin_user',
    entityId: new Types.ObjectId(adminUserId),
  })
    .sort({ createdAt: -1 })
    .limit(100)
    .lean()
    .exec();
};
