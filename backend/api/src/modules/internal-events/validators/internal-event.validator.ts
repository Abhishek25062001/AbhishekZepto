import {
  INTERNAL_EVENT_NAME_VALUES,
  type InternalEventName,
} from '../constants/internal-event-names.constant';
import type {
  InternalEventMetadata,
  InternalEventPayload,
} from '../types/internal-event.types';

export const isInternalEventName = (eventName: string): eventName is InternalEventName => {
  return INTERNAL_EVENT_NAME_VALUES.includes(eventName as InternalEventName);
};

export const validateInternalEventInput = ({
  eventName,
  payload,
  metadata,
}: {
  eventName: string;
  payload: InternalEventPayload;
  metadata: InternalEventMetadata;
}): void => {
  if (!isInternalEventName(eventName)) {
    throw new Error(`Unsupported internal event name: ${eventName}`);
  }

  if (
    !payload ||
    typeof payload !== 'object' ||
    Array.isArray(payload) ||
    Object.keys(payload).length === 0
  ) {
    throw new Error('Internal event payload must be a non-empty object');
  }

  if (!metadata.sourceModule.trim()) {
    throw new Error('Internal event metadata sourceModule is required');
  }
};
