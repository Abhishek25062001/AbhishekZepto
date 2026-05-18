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
