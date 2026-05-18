export type DeliverySessionSnapshot = {
  accessToken?: string | null;
  refreshToken?: string | null;
  deliveryAgentId?: string | null;
};

export const isRestorableDeliverySession = (
  session: DeliverySessionSnapshot | null,
): boolean => {
  return Boolean(
    session?.accessToken && session?.refreshToken && session?.deliveryAgentId,
  );
};

export const hasPartialDeliverySession = (
  session: DeliverySessionSnapshot | null,
): boolean => {
  return Boolean(session) && !isRestorableDeliverySession(session);
};
