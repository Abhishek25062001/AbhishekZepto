export type CustomerSessionSnapshot = {
  accessToken?: string | null;
  refreshToken?: string | null;
  customerId?: string | null;
};

export const isRestorableCustomerSession = (
  session: CustomerSessionSnapshot | null,
): boolean => {
  return Boolean(session?.accessToken && session?.refreshToken && session?.customerId);
};

export const hasPartialCustomerSession = (
  session: CustomerSessionSnapshot | null,
): boolean => {
  return Boolean(session) && !isRestorableCustomerSession(session);
};
