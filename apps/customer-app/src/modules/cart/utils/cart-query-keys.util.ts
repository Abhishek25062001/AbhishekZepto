export const cartQueryKeys = {
  all: ['customer-cart'] as const,
  byStore: (storeId: string) => ['customer-cart', storeId] as const,
};
