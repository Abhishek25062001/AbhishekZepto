import { formatProductPrice, shouldStrikeMrp } from '../utils/catalog-price.util';

export type ProductPriceDisplay = {
  finalLabel: string;
  mrpLabel: string | null;
  showStrikeMrp: boolean;
};

export const getProductPriceDisplay = (
  mrp: number | null | undefined,
  finalPrice: number | null | undefined,
): ProductPriceDisplay | null => {
  if (finalPrice == null && mrp == null) {
    return null;
  }

  const resolvedFinal = finalPrice ?? mrp ?? 0;
  const showStrikeMrp = shouldStrikeMrp(mrp, finalPrice);

  return {
    finalLabel: formatProductPrice(resolvedFinal),
    mrpLabel: mrp != null ? formatProductPrice(mrp) : null,
    showStrikeMrp,
  };
};
