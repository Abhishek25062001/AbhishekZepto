import type { AdminSlaRealtimeEvent } from '../types/control-tower-realtime.types';

export const applyAdminRealtimeSlaEventToList = (
  breaches: AdminSlaRealtimeEvent[],
  event: AdminSlaRealtimeEvent | null,
): AdminSlaRealtimeEvent[] => {
  if (!event) {
    return breaches;
  }

  const withoutExistingBreach = breaches.filter(
    (breach) => breach.breachId !== event.breachId,
  );
  return [event, ...withoutExistingBreach];
};
