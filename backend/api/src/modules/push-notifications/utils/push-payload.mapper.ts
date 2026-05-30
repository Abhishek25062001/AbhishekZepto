const SENSITIVE_KEYS = new Set([
  '__v',
  'accessToken',
  'authToken',
  'fcmToken',
  'otp',
  'otpCode',
  'password',
  'paymentSecret',
  'refreshToken',
  'token',
]);

const toStringValue = (value: unknown): string => {
  if (value === null || value === undefined) {
    return '';
  }

  if (value instanceof Date) {
    return value.toISOString();
  }

  if (typeof value === 'object') {
    return JSON.stringify(value);
  }

  return String(value);
};

export const sanitizePushDataPayload = (
  payload: Record<string, unknown>,
): Record<string, string> =>
  Object.entries(payload).reduce<Record<string, string>>((acc, [key, value]) => {
    if (SENSITIVE_KEYS.has(key)) {
      return acc;
    }

    acc[key] = toStringValue(value);
    return acc;
  }, {});

export const mapDeliveryAssignmentPushPayload = (
  payload: Record<string, unknown>,
): Record<string, string> =>
  sanitizePushDataPayload({
    assignmentId: payload.assignmentId ?? payload.deliveryId ?? payload._id,
    orderId: payload.orderId,
    type: 'assignment_created',
  });

export const mapOrderDeliveryPushPayload = (
  type:
    | 'order_out_for_delivery'
    | 'order_delivered'
    | 'delivery_failed',
  payload: Record<string, unknown>,
): Record<string, string> =>
  sanitizePushDataPayload({
    assignmentId: payload.assignmentId ?? payload.deliveryId,
    orderId: payload.orderId,
    type,
  });
