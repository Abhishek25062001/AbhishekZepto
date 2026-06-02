import type { AdminUserStatus } from '../types/admin-users.types';

export const formatAdminUserLabel = (value: string): string =>
  value.replace(/_/g, ' ').replace(/\b\w/g, character => character.toUpperCase());

export const getAdminUserStatusVariant = (
  status: AdminUserStatus,
): 'success' | 'warning' | 'error' | 'info' | 'neutral' => {
  if (status === 'active') {
    return 'success';
  }

  if (status === 'inactive') {
    return 'neutral';
  }

  if (status === 'blocked' || status === 'suspended' || status === 'deleted') {
    return 'error';
  }

  return 'info';
};

export const formatAdminUserDate = (value?: string | null): string => {
  if (!value) {
    return '—';
  }

  return new Date(value).toLocaleString();
};

