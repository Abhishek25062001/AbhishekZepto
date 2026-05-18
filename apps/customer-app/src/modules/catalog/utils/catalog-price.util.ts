export const formatProductPrice = (amount: number): string => {
  return `₹${amount.toFixed(2)}`;
};

export const calculateDiscountPercentage = (mrp: number, finalPrice: number): number => {
  if (mrp <= 0 || finalPrice >= mrp) {
    return 0;
  }

  return Math.round(((mrp - finalPrice) / mrp) * 100);
};

export const shouldShowDiscount = (
  mrp: number | null | undefined,
  finalPrice: number | null | undefined,
): boolean => {
  if (mrp == null || finalPrice == null) {
    return false;
  }

  return finalPrice < mrp;
};

export const shouldStrikeMrp = shouldShowDiscount;
