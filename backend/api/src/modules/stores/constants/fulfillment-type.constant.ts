export const FULFILLMENT_TYPE = {
  DELIVERY: 'delivery',
  PICKUP: 'pickup',
  DELIVERY_AND_PICKUP: 'delivery_and_pickup',
} as const;

export const FULFILLMENT_TYPE_VALUES = [
  FULFILLMENT_TYPE.DELIVERY,
  FULFILLMENT_TYPE.PICKUP,
  FULFILLMENT_TYPE.DELIVERY_AND_PICKUP,
] as const;

export type FulfillmentType = (typeof FULFILLMENT_TYPE_VALUES)[number];
