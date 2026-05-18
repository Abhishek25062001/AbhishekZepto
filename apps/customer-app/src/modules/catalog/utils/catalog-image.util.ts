import type { CustomerProduct } from '../types/customer-product.types';

export const getProductImage = (product: Pick<CustomerProduct, 'defaultImageUrl' | 'imageUrls'>): string | null => {
  if (product.defaultImageUrl) {
    return product.defaultImageUrl;
  }

  if (product.imageUrls.length > 0) {
    return product.imageUrls[0] ?? null;
  }

  return null;
};
