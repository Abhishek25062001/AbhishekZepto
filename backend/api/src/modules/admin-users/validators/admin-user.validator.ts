import { z } from 'zod';

import { mongoObjectIdValidator } from '../../../validators/common.validators';
import { ADMIN_USER_MANAGED_ROLES, ADMIN_USER_STATUSES } from '../constants/admin-user.constants';
import { isPermissionCode } from '../../auth/utils/permission-code.util';

const permissionCodeValidator = z.string().trim().refine(isPermissionCode, 'Invalid permission code.');

const objectIdArrayValidator = z.array(mongoObjectIdValidator).default([]);

export const adminUserIdParamValidator = {
  params: z.object({
    adminUserId: mongoObjectIdValidator,
  }),
};

export const createAdminUserValidator = {
  body: z.object({
    name: z.string().trim().min(1).max(120).optional(),
    email: z.string().trim().email().max(255).optional().nullable(),
    phone: z.string().trim().min(6).max(20),
    role: z.enum(ADMIN_USER_MANAGED_ROLES as unknown as [string, ...string[]]),
    permissions: z.array(permissionCodeValidator).default([]),
    cityScope: objectIdArrayValidator,
    storeScope: objectIdArrayValidator,
    status: z.enum(ADMIN_USER_STATUSES as unknown as [string, ...string[]]).optional(),
  }),
};

export const updateAdminUserValidator = {
  body: z.object({
    name: z.string().trim().min(1).max(120).optional().nullable(),
    email: z.string().trim().email().max(255).optional().nullable(),
    phone: z.string().trim().min(6).max(20).optional(),
    cityScope: objectIdArrayValidator.optional(),
    storeScope: objectIdArrayValidator.optional(),
  }),
};

export const adminUserStatusValidator = {
  body: z.object({
    status: z.enum(ADMIN_USER_STATUSES as unknown as [string, ...string[]]),
    reason: z.string().trim().min(5).max(500),
  }),
};

export const adminUserRoleValidator = {
  body: z.object({
    role: z.enum(ADMIN_USER_MANAGED_ROLES as unknown as [string, ...string[]]),
    reason: z.string().trim().min(5).max(500),
  }),
};

export const adminUserPermissionsValidator = {
  body: z.object({
    permissions: z.array(permissionCodeValidator),
    reason: z.string().trim().min(5).max(500),
  }),
};

export const listAdminUsersQueryValidator = {
  query: z.object({
    role: z.enum(ADMIN_USER_MANAGED_ROLES as unknown as [string, ...string[]]).optional(),
    status: z.enum(ADMIN_USER_STATUSES as unknown as [string, ...string[]]).optional(),
    cityId: mongoObjectIdValidator.optional(),
    search: z.string().trim().min(1).max(120).optional(),
    page: z.coerce.number().int().min(1).default(1),
    limit: z.coerce.number().int().min(1).max(100).default(20),
  }),
};
