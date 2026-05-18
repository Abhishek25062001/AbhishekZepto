import { INVENTORY_LOCK_TYPE, type InventoryLockType } from '../constants/inventory-lock-type.constant';

const LOCK_EXPIRY_MINUTES: Record<InventoryLockType, number> = {
  [INVENTORY_LOCK_TYPE.CART]: 10,
  [INVENTORY_LOCK_TYPE.CHECKOUT]: 15,
  [INVENTORY_LOCK_TYPE.ORDER]: 30,
  [INVENTORY_LOCK_TYPE.MANUAL]: 30,
  [INVENTORY_LOCK_TYPE.SYSTEM]: 30,
};

export const calculateLockExpiry = (lockType: InventoryLockType, fromDate = new Date()): Date => {
  const minutes = LOCK_EXPIRY_MINUTES[lockType];
  return new Date(fromDate.getTime() + minutes * 60 * 1000);
};
