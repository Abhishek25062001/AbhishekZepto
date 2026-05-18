const ERROR_MESSAGES: Record<string, string> = {
  STORE_PRODUCT_NOT_FOUND: 'Store product mapping not found.',
  STORE_PRODUCT_ALREADY_MAPPED: 'This variant is already mapped to the store.',
  STORE_PRODUCT_SKU_ALREADY_EXISTS: 'Store SKU already exists for this store.',
  INVALID_STORE_PRODUCT_STORE: 'Invalid or inactive store selected.',
  INVALID_STORE_PRODUCT_PRODUCT: 'Invalid or unapproved product selected.',
  INVALID_STORE_PRODUCT_VARIANT: 'Invalid variant selected.',
  STORE_PRODUCT_VARIANT_MISMATCH: 'Variant does not belong to the selected product.',
  STORE_PRODUCT_PRICE_INVALID: 'Price or discount values are invalid.',
  STORE_PRODUCT_FINAL_PRICE_INVALID: 'Final price is out of allowed range.',
  STORE_PRODUCT_PRICE_LOCKED: 'Price is locked and cannot be updated.',
  STORE_PRODUCT_BULK_VALIDATION_FAILED: 'Bulk store product validation failed.',
  INVENTORY_STOCK_NOT_FOUND: 'Inventory stock record not found.',
  INVENTORY_STOCK_ALREADY_EXISTS: 'Stock already exists for this store product.',
  INVALID_INVENTORY_STORE_PRODUCT: 'Store product mapping is missing or inactive.',
  INVENTORY_ADJUSTMENT_INVALID: 'Stock adjustment is invalid.',
  INVENTORY_INSUFFICIENT_STOCK: 'Insufficient stock for this adjustment.',
  INVENTORY_BULK_VALIDATION_FAILED: 'Bulk inventory validation failed.',
  INVENTORY_LOCK_NOT_FOUND: 'Inventory lock not found.',
  INVENTORY_LOCK_EXPIRE_FAILED: 'Failed to expire due locks.',
};

export const mapInventoryErrorCodeToMessage = (errorCode: string | undefined, fallback: string) => {
  if (!errorCode) {
    return fallback;
  }
  const normalized = errorCode.includes('.') ? errorCode.split('.').pop() ?? errorCode : errorCode;
  return ERROR_MESSAGES[normalized] ?? fallback;
};

export const extractApiErrorCode = (error: unknown): string | undefined => {
  if (typeof error !== 'object' || error === null || !('response' in error)) {
    return undefined;
  }
  const response = (error as { response?: { data?: { error?: { code?: string } } } }).response;
  return response?.data?.error?.code;
};

export const DELETE_CONFIRMATION = {
  storeProduct: 'Delete this store product mapping?',
  inventoryStock: 'Delete this inventory stock record?',
} as const;
