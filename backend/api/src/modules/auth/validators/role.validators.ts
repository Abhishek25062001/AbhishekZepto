import { z } from 'zod';
import { isPermissionCode } from '../utils/permission-code.util';
import {
  mongoObjectIdValidator,
  paginationValidator,
  searchQueryValidator,
  statusValidator,
} from '../../../validators/common.validators';

const roleCodeValidator = z
  .string()
  .trim()
  .min(2, 'Role code must be at least 2 characters.')
  .max(80, 'Role code must be at most 80 characters.');

const roleNameValidator = z
  .string()
  .trim()
  .min(2, 'Role name must be at least 2 characters.')
  .max(120, 'Role name must be at most 120 characters.');

const permissionCodeValidator = z
  .string()
  .trim()
  .refine(isPermissionCode, 'Invalid permission code.');

export const createRoleValidator = {
  body: z.object({
    code: roleCodeValidator,
    name: roleNameValidator,
    description: z.string().trim().nullable().optional(),
    permissions: z.array(permissionCodeValidator),
    isEditable: z.boolean().optional(),
  }),
};

export const updateRoleValidator = {
  body: z
    .object({
      name: roleNameValidator.optional(),
      description: z.string().trim().nullable().optional(),
      permissions: z.array(permissionCodeValidator).optional(),
      isEditable: z.boolean().optional(),
      status: statusValidator.optional(),
    })
    .refine((value) => Object.keys(value).length > 0, {
      message: 'At least one field must be provided.',
    }),
};

export const listRolesValidator = {
  query: paginationValidator.extend(searchQueryValidator.shape).extend({
    status: statusValidator.optional(),
  }),
};

export const roleIdParamValidator = {
  params: z.object({
    roleId: mongoObjectIdValidator,
  }),
};

