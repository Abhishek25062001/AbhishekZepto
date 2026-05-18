export const CATALOG_STATUS = {
  ACTIVE: 'active',
  INACTIVE: 'inactive',
  ARCHIVED: 'archived',
} as const;

export type CatalogStatus = (typeof CATALOG_STATUS)[keyof typeof CATALOG_STATUS];

export const CATALOG_STATUS_VALUES: CatalogStatus[] = [
  CATALOG_STATUS.ACTIVE,
  CATALOG_STATUS.INACTIVE,
  CATALOG_STATUS.ARCHIVED,
];

export const CATALOG_STATUS_LABELS: Record<CatalogStatus, string> = {
  active: 'Active',
  inactive: 'Inactive',
  archived: 'Archived',
};
