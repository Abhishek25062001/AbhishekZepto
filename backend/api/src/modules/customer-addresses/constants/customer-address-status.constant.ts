export const CUSTOMER_ADDRESS_STATUS_VALUES = ['active', 'inactive'] as const;

export type CustomerAddressStatus = (typeof CUSTOMER_ADDRESS_STATUS_VALUES)[number];
