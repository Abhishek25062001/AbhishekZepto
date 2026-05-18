export const ADMIN_ACCESS_TOKEN = 'admin.accessToken';
export const ADMIN_REFRESH_TOKEN = 'admin.refreshToken';
export const ADMIN_ID = 'admin.adminId';
export const ADMIN_ROLE = 'admin.role';
export const ADMIN_PERMISSIONS = 'admin.permissions';

export const ADMIN_SESSION_STORAGE_KEYS = [
  ADMIN_ACCESS_TOKEN,
  ADMIN_REFRESH_TOKEN,
  ADMIN_ID,
  ADMIN_ROLE,
  ADMIN_PERMISSIONS,
] as const;
