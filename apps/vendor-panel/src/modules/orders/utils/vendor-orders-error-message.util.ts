const ORDER_ERROR_MESSAGES: Record<string, string> = {
  ORDER_ACCESS_FORBIDDEN: 'You do not have access to this order.',
  ORDER_ACCEPTANCE_NOT_ALLOWED: 'This order cannot be accepted or rejected now.',
  ORDER_REJECTION_REASON_REQUIRED: 'Add a rejection reason before rejecting.',
  ORDER_NOT_FOUND: 'Order not found.',
};

const normalizeCode = (errorCode: string) =>
  errorCode.includes('.') ? (errorCode.split('.').pop() ?? errorCode) : errorCode;

export const mapVendorOrderErrorCodeToMessage = (
  errorCode: string | undefined,
  fallback: string,
) => {
  if (!errorCode) {
    return fallback;
  }
  return ORDER_ERROR_MESSAGES[normalizeCode(errorCode)] ?? fallback;
};

export const extractApiErrorCode = (error: unknown): string | undefined => {
  if (typeof error !== 'object' || error === null || !('response' in error)) {
    return undefined;
  }
  const response = (error as { response?: { data?: { error?: { code?: string } } } }).response;
  return response?.data?.error?.code;
};
