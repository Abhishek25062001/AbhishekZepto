import type { OrderTimelineEvent } from '../types/order.types';
import { getOrderStatusLabel } from './order-status-label.util';

export const getCustomerTimelineEventLabel = (
  event: Pick<OrderTimelineEvent, 'toStatus'>,
): string => {
  if (!event.toStatus) {
    return 'Order update';
  }

  return getOrderStatusLabel(event.toStatus);
};

export const getCustomerTimelineEventReason = (
  event: Pick<OrderTimelineEvent, 'reason'>,
): string | null => {
  const reason = event.reason?.trim();
  return reason ? reason : null;
};
