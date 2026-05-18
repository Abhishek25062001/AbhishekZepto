export const CUSTOMER_ACCESS_TOKEN = 'customer_access_token';
export const CUSTOMER_REFRESH_TOKEN = 'customer_refresh_token';
export const CUSTOMER_ID = 'customer_id';
export const CUSTOMER_CITY_ID = 'customer_city_id';
export const CUSTOMER_ROLE = 'customer_role';
export const CUSTOMER_PERMISSIONS = 'customer_permissions';
export const CUSTOMER_RECENTLY_VIEWED = 'customer_recently_viewed_products';

export const CUSTOMER_AUTH_STORAGE_KEYS = [
  CUSTOMER_ACCESS_TOKEN,
  CUSTOMER_REFRESH_TOKEN,
  CUSTOMER_ID,
  CUSTOMER_CITY_ID,
  CUSTOMER_ROLE,
  CUSTOMER_PERMISSIONS,
] as const;
