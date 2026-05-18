const INVENTORY_ERROR_MESSAGES: Record<string, string> = {
  INVENTORY_STOCK_NOT_FOUND: 'Inventory stock record not found.',
  INVALID_INVENTORY_QUANTITY: 'Quantity is invalid.',
  INSUFFICIENT_AVAILABLE_STOCK: 'Insufficient available stock for this adjustment.',
  INVENTORY_SCOPE_DENIED: 'You do not have access to this inventory record.',
  INVENTORY_ADJUSTMENT_INVALID: 'Stock adjustment is invalid.',
};

const normalizeCode = (errorCode: string) =>
  errorCode.includes('.') ? (errorCode.split('.').pop() ?? errorCode) : errorCode;

export const mapInventoryErrorCodeToMessage = (errorCode: string | undefined, fallback: string) => {
  if (!errorCode) {
    return fallback;
  }
  return INVENTORY_ERROR_MESSAGES[normalizeCode(errorCode)] ?? fallback;
};

export const extractApiErrorCode = (error: unknown): string | undefined => {
  if (typeof error !== 'object' || error === null || !('response' in error)) {
    return undefined;
  }
  const response = (error as { response?: { data?: { error?: { code?: string } } } }).response;
  return response?.data?.error?.code;
};
