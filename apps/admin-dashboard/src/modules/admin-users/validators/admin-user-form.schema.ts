import { z } from 'zod';

import { ADMIN_USER_ROLE_OPTIONS, ADMIN_USER_STATUS_OPTIONS } from '../constants/admin-users.constants';

const roleValues = ADMIN_USER_ROLE_OPTIONS.map(option => option.value) as [string, ...string[]];
const statusValues = ADMIN_USER_STATUS_OPTIONS.map(option => option.value) as [string, ...string[]];

export const csvListSchema = z.string().transform(value =>
  value
    .split(',')
    .map(item => item.trim())
    .filter(Boolean),
);

export const createAdminUserFormSchema = z.object({
  name: z.string().trim().min(1).max(120),
  email: z.string().trim().email().max(255).or(z.literal('')).optional(),
  phone: z.string().trim().min(6).max(20),
  role: z.enum(roleValues),
  permissions: csvListSchema,
  cityScope: csvListSchema,
  storeScope: csvListSchema,
  status: z.enum(statusValues).optional(),
});

export type CreateAdminUserFormValues = z.input<typeof createAdminUserFormSchema>;

export const updateAdminUserFormSchema = z.object({
  name: z.string().trim().min(1).max(120).or(z.literal('')).optional(),
  email: z.string().trim().email().max(255).or(z.literal('')).optional(),
  phone: z.string().trim().min(6).max(20).or(z.literal('')).optional(),
  cityScope: csvListSchema,
  storeScope: csvListSchema,
});

export type UpdateAdminUserFormValues = z.input<typeof updateAdminUserFormSchema>;

export const adminUserStatusFormSchema = z.object({
  status: z.enum(statusValues),
  reason: z.string().trim().min(5).max(500),
});

export type AdminUserStatusFormValues = z.input<typeof adminUserStatusFormSchema>;

export const adminUserRoleFormSchema = z.object({
  role: z.enum(roleValues),
  reason: z.string().trim().min(5).max(500),
});

export type AdminUserRoleFormValues = z.input<typeof adminUserRoleFormSchema>;

export const adminUserPermissionsFormSchema = z.object({
  permissions: csvListSchema,
  reason: z.string().trim().min(5).max(500),
});

export type AdminUserPermissionsFormValues = z.input<typeof adminUserPermissionsFormSchema>;
