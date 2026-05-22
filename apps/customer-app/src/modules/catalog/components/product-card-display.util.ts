import type { CustomerProduct } from '../types/customer-product.types';
import { shouldShowDiscount } from '../utils/catalog-price.util';

export type ProductCardBadgeState = {
  showDiscount: boolean;
  showOutOfStock: boolean;
  showUnavailable: boolean;
  isDimmed: boolean;
};

export const getProductCardBadgeState = (product: CustomerProduct): ProductCardBadgeState => {
  const showOutOfStock = product.isOutOfStock === true;
  const showUnavailable = product.isAvailable === false;
  const isDimmed = showOutOfStock || showUnavailable;

  return {
    showDiscount: !isDimmed && shouldShowDiscount(product.mrp, product.finalPrice),
    showOutOfStock,
    showUnavailable,
    isDimmed,
  };
};

export const getProductCardNavigationParams = (productId: string) => ({ productId });
