import { CUSTOMER_CATALOG_LOW_STOCK_THRESHOLD } from '../constants/customer-catalog.constants';

export type AvailabilityState = 'available' | 'out_of_stock' | 'unavailable';

export const getAvailabilityState = (
  isAvailable?: boolean | null,
  isOutOfStock?: boolean | null,
): AvailabilityState => {
  if (isAvailable === false) {
    return 'unavailable';
  }
  if (isOutOfStock === true) {
    return 'out_of_stock';
  }
  return 'available';
};

export const isLowStock = (availableQuantity?: number | null): boolean => {
  if (availableQuantity == null || availableQuantity <= 0) {
    return false;
  }
  return availableQuantity <= CUSTOMER_CATALOG_LOW_STOCK_THRESHOLD;
};

export const getLowStockLabel = (availableQuantity: number): string =>
  `Only ${availableQuantity} left`;
