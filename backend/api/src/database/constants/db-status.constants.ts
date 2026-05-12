export const DB_STATUS = {
  ACTIVE: 'active',
  INACTIVE: 'inactive',
  BLOCKED: 'blocked',
  PENDING: 'pending',
  ARCHIVED: 'archived',
  DELETED: 'deleted',
} as const;

export type DbStatus = (typeof DB_STATUS)[keyof typeof DB_STATUS];
