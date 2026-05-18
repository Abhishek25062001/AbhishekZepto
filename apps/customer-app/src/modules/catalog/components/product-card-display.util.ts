import type { CustomerProduct } from '../types/customer-product.types';
import { shouldShowDiscount } from '../utils/catalog-price.util';

export type ProductCardBadgeState = {
  showDiscount: boolean;
  showOutOfStock: boolean;
};

export const getProductCardBadgeState = (product: CustomerProduct): ProductCardBadgeState => ({
  showDiscount: shouldShowDiscount(product.mrp, product.finalPrice),
  showOutOfStock: product.isOutOfStock === true,
});

export const getProductCardNavigationParams = (productId: string) => ({ productId });
