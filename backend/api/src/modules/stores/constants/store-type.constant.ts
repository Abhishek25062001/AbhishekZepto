export const STORE_TYPE = {
  GROCERY: 'grocery',
  PHARMACY: 'pharmacy',
  RESTAURANT: 'restaurant',
  GENERAL: 'general',
  DARK_STORE: 'dark_store',
} as const;

export const STORE_TYPE_VALUES = [
  STORE_TYPE.GROCERY,
  STORE_TYPE.PHARMACY,
  STORE_TYPE.RESTAURANT,
  STORE_TYPE.GENERAL,
  STORE_TYPE.DARK_STORE,
] as const;

export type StoreType = (typeof STORE_TYPE_VALUES)[number];
