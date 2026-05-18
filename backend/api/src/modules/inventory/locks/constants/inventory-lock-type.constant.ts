export const INVENTORY_LOCK_TYPE = {
  CART: 'cart',
  CHECKOUT: 'checkout',
  ORDER: 'order',
  MANUAL: 'manual',
  SYSTEM: 'system',
} as const;

export const INVENTORY_LOCK_TYPE_VALUES = [
  INVENTORY_LOCK_TYPE.CART,
  INVENTORY_LOCK_TYPE.CHECKOUT,
  INVENTORY_LOCK_TYPE.ORDER,
  INVENTORY_LOCK_TYPE.MANUAL,
  INVENTORY_LOCK_TYPE.SYSTEM,
] as const;

export type InventoryLockType = (typeof INVENTORY_LOCK_TYPE_VALUES)[number];
