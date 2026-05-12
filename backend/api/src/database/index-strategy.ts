export const DATABASE_INDEX_STRATEGY = {
  globalRecordState: {
    isDeleted: 1,
    status: 1,
  },
  tenantScopedRecord: {
    vendorId: 1,
    storeId: 1,
    isDeleted: 1,
  },
  customerOrderList: {
    customerId: 1,
    createdAt: -1,
  },
  inventoryLookup: {
    storeId: 1,
    productId: 1,
    variantId: 1,
  },
} as const;
