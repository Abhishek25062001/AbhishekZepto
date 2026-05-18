export const CATALOG_SORT_OPTIONS = [
  'relevance',
  'newest',
  'price_low_to_high',
  'price_high_to_low',
  'featured',
  'name_asc',
  'name_desc',
  'updated_desc',
  'createdAt',
  'name',
  'updatedAt',
] as const;

export type CatalogSortOption = (typeof CATALOG_SORT_OPTIONS)[number];

export const ADMIN_CATALOG_SORT_OPTIONS = [
  'relevance',
  'newest',
  'featured',
  'name_asc',
  'name_desc',
  'updated_desc',
  'createdAt',
  'name',
  'updatedAt',
] as const;

export const CUSTOMER_CATALOG_SORT_OPTIONS = [
  'relevance',
  'newest',
  'price_low_to_high',
  'price_high_to_low',
  'featured',
] as const;
