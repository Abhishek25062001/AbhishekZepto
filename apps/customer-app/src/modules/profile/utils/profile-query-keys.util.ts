export const profileQueryKeys = {
  all: ['customer-profile'] as const,
  detail: () => [...profileQueryKeys.all, 'detail'] as const,
};
