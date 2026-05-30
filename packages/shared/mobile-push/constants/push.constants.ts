export const MOBILE_PUSH_PAYLOAD_TYPE = {
  ASSIGNMENT_CREATED: 'assignment_created',
  DELIVERY_FAILED: 'delivery_failed',
  ORDER_DELIVERED: 'order_delivered',
  ORDER_OUT_FOR_DELIVERY: 'order_out_for_delivery',
} as const;

export const MOBILE_PUSH_PERMISSION_STATUS = {
  BLOCKED: 'blocked',
  DENIED: 'denied',
  GRANTED: 'granted',
  UNAVAILABLE: 'unavailable',
} as const;

export const MOBILE_PUSH_PLATFORM = {
  ANDROID: 'android',
  IOS: 'ios',
  WEB: 'web',
} as const;
