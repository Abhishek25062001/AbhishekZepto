import { z } from 'zod';
import { AUTH_ROLES } from '../constants/auth-role.constants';
import { isPermissionCode } from '../utils/permission-code.util';
import { mongoObjectIdValidator } from '../../../validators/common.validators';

const permissionCodeValidator = z
  .string()
  .trim()
  .refine(isPermissionCode, 'Invalid permission code.');

export const userIdParamValidator = {
  params: z.object({
    userId: mongoObjectIdValidator,
  }),
};

export const updateUserPermissionsValidator = {
  body: z.object({
    permissions: z.array(permissionCodeValidator),
  }),
};

export const assignUserRoleValidator = {
  body: z.object({
    role: z.enum(AUTH_ROLES as [string, ...string[]]),
  }),
};

export const syncUserRolePermissionsValidator = {
  body: z.object({
    roleCode: z
      .string()
      .trim()
      .min(2, 'Role code must be at least 2 characters.')
      .max(80, 'Role code must be at most 80 characters.'),
  }),
};

