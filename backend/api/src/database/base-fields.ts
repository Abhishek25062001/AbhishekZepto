export const COMMON_DB_FIELDS = [
  '_id',
  'status',
  'isDeleted',
  'deletedAt',
  'createdAt',
  'updatedAt',
] as const;

export const COMMON_STATUS_VALUES = [
  'active',
  'inactive',
  'blocked',
  'pending',
  'archived',
  'deleted',
] as const;

export const STANDARD_ID_FIELD_EXAMPLES = [
  'customerId',
  'storeId',
  'vendorId',
  'orderId',
  'deliveryAgentId',
  'adminId',
] as const;

export type CommonDbField = (typeof COMMON_DB_FIELDS)[number];

export type CommonStatusValue = (typeof COMMON_STATUS_VALUES)[number];
