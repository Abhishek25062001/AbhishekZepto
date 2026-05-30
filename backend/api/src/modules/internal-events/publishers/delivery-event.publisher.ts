import { INTERNAL_EVENT_NAMES } from '../constants/internal-event-names.constant';
import { publishInternalEvent } from '../services/internal-event-bus.service';
import {
  mapAssignmentInternalEventPayload,
  mapCompletionInternalEventPayload,
  mapPickupInternalEventPayload,
  mapProgressInternalEventPayload,
} from '../utils/internal-event-payload.mapper';
import { buildEventMetadata } from '../utils/internal-event-metadata.util';

const DELIVERY_SOURCE_MODULE = 'delivery';

const publishDeliveryEvent = (
  eventName: typeof INTERNAL_EVENT_NAMES[keyof typeof INTERNAL_EVENT_NAMES],
  payload: Record<string, unknown>,
): void => {
  publishInternalEvent(
    eventName,
    payload,
    buildEventMetadata(DELIVERY_SOURCE_MODULE, { eventName }),
  );
};

export const publishAssignmentCreated = (assignment: unknown): void => {
  publishDeliveryEvent(
    INTERNAL_EVENT_NAMES.DELIVERY_ASSIGNMENT_CREATED,
    mapAssignmentInternalEventPayload(assignment),
  );
};

export const publishAssignmentAccepted = (assignment: unknown): void => {
  publishDeliveryEvent(
    INTERNAL_EVENT_NAMES.DELIVERY_ASSIGNMENT_ACCEPTED,
    mapAssignmentInternalEventPayload(assignment),
  );
};

export const publishPickupCompleted = (pickup: unknown): void => {
  publishDeliveryEvent(
    INTERNAL_EVENT_NAMES.DELIVERY_PICKUP_COMPLETED,
    mapPickupInternalEventPayload(pickup),
  );
};

export const publishOutForDelivery = (progress: unknown): void => {
  publishDeliveryEvent(
    INTERNAL_EVENT_NAMES.DELIVERY_OUT_FOR_DELIVERY,
    mapProgressInternalEventPayload(progress),
  );
};

export const publishDeliveryLocationUpdated = (progress: unknown): void => {
  publishDeliveryEvent(
    INTERNAL_EVENT_NAMES.DELIVERY_LOCATION_UPDATED,
    mapProgressInternalEventPayload(progress),
  );
};

export const publishDeliveryReachedCustomer = (progress: unknown): void => {
  publishDeliveryEvent(
    INTERNAL_EVENT_NAMES.DELIVERY_REACHED_CUSTOMER,
    mapProgressInternalEventPayload(progress),
  );
};

export const publishDeliveryCompleted = (completion: unknown): void => {
  publishDeliveryEvent(
    INTERNAL_EVENT_NAMES.DELIVERY_COMPLETED,
    mapCompletionInternalEventPayload(completion),
  );
};

export const publishDeliveryFailed = (progress: unknown): void => {
  publishDeliveryEvent(
    INTERNAL_EVENT_NAMES.DELIVERY_FAILED,
    mapProgressInternalEventPayload(progress),
  );
};
