const CATALOG_ERROR_MESSAGES: Record<string, string> = {
  PRODUCT_NOT_FOUND: 'Product not found.',
  PRODUCT_NOT_APPROVED: 'Product is not approved for vendor catalog.',
  PRODUCT_NOT_VISIBLE: 'Product is not visible.',
  VARIANT_NOT_FOUND: 'Variant not found.',
};

const STORE_PRODUCT_ERROR_MESSAGES: Record<string, string> = {
  STORE_PRODUCT_NOT_FOUND: 'Store product not found.',
  STORE_PRODUCT_PRICE_LOCKED: 'Price is locked and cannot be updated.',
  STORE_PRODUCT_SCOPE_DENIED: 'You do not have access to this store product.',
  STORE_PRODUCT_PRICE_INVALID: 'Price or discount values are invalid.',
  STORE_PRODUCT_FINAL_PRICE_INVALID: 'Final price is out of allowed range.',
};

const normalizeCode = (errorCode: string) =>
  errorCode.includes('.') ? (errorCode.split('.').pop() ?? errorCode) : errorCode;

export const mapCatalogErrorCodeToMessage = (errorCode: string | undefined, fallback: string) => {
  if (!errorCode) {
    return fallback;
  }
  return CATALOG_ERROR_MESSAGES[normalizeCode(errorCode)] ?? fallback;
};

export const mapStoreProductErrorCodeToMessage = (errorCode: string | undefined, fallback: string) => {
  if (!errorCode) {
    return fallback;
  }
  return STORE_PRODUCT_ERROR_MESSAGES[normalizeCode(errorCode)] ?? fallback;
};

export const extractApiErrorCode = (error: unknown): string | undefined => {
  if (typeof error !== 'object' || error === null || !('response' in error)) {
    return undefined;
  }
  const response = (error as { response?: { data?: { error?: { code?: string } } } }).response;
  return response?.data?.error?.code;
};
