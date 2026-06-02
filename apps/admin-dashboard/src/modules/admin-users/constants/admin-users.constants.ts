import type { AdminUserRole, AdminUserStatus } from '../types/admin-users.types';

export const ADMIN_USER_ROLE_OPTIONS: Array<{ label: string; value: AdminUserRole }> = [
  { label: 'Super Admin', value: 'super_admin' },
  { label: 'Operations Admin', value: 'operations_admin' },
  { label: 'Support Admin', value: 'support_admin' },
  { label: 'Catalog Admin', value: 'catalog_admin' },
  { label: 'Finance Admin', value: 'finance_admin' },
  { label: 'City Admin', value: 'city_admin' },
  { label: 'Store Admin', value: 'store_admin' },
];

export const ADMIN_USER_STATUS_OPTIONS: Array<{ label: string; value: AdminUserStatus }> = [
  { label: 'Active', value: 'active' },
  { label: 'Inactive', value: 'inactive' },
  { label: 'Blocked', value: 'blocked' },
  { label: 'Suspended', value: 'suspended' },
  { label: 'Deleted', value: 'deleted' },
];

