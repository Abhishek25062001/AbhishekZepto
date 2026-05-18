const CATALOG_ERROR_MESSAGES: Record<string, string> = {
  PRODUCT_NOT_FOUND: 'This product could not be found.',
  PRODUCT_NOT_APPROVED: 'This product is not available right now.',
  PRODUCT_NOT_VISIBLE: 'This product is not available right now.',
  CATEGORY_NOT_FOUND: 'This category could not be found.',
  BRAND_NOT_FOUND: 'This brand could not be found.',
  VARIANT_NOT_FOUND: 'This variant could not be found.',
};

export const getCustomerCatalogErrorMessage = (code?: string): string => {
  if (!code) {
    return 'Something went wrong. Please try again.';
  }

  return CATALOG_ERROR_MESSAGES[code] ?? 'Something went wrong. Please try again.';
};

export const isProductUnavailableError = (code?: string): boolean => {
  return (
    code === 'PRODUCT_NOT_FOUND' ||
    code === 'PRODUCT_NOT_APPROVED' ||
    code === 'PRODUCT_NOT_VISIBLE'
  );
};
