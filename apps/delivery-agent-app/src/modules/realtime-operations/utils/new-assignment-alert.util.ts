import {
  DELIVERY_REALTIME_EVENTS,
  type DeliveryAssignmentRealtimeEvent,
} from '../types/delivery-realtime.types';

export type NewAssignmentAlertViewModel = {
  assignmentLabel: string;
  orderId: string;
  pickupEtaLabel: string;
  navigationTarget: 'DeliveryHome';
};

const formatPickupEta = (pickupEta: string | null | undefined): string =>
  pickupEta ? new Date(pickupEta).toLocaleTimeString() : 'Awaiting ETA';

export const getNewAssignmentAlertViewModel = (
  event: DeliveryAssignmentRealtimeEvent | null,
): NewAssignmentAlertViewModel | null => {
  if (!event || event.eventName !== DELIVERY_REALTIME_EVENTS.ASSIGNMENT_CREATED) {
    return null;
  }

  return {
    assignmentLabel: event.assignmentCode ?? event.assignmentId.slice(-8).toUpperCase(),
    orderId: event.orderId,
    pickupEtaLabel: formatPickupEta(event.pickupEta),
    navigationTarget: 'DeliveryHome',
  };
};

