import { EventEmitter } from 'node:events';
import type { InternalEventName } from '../constants/internal-event-names.constant';
import type {
  InternalEventHandler,
  InternalEventMetadata,
  InternalEventPayload,
} from '../types/internal-event.types';
import { validateInternalEventInput } from '../validators/internal-event.validator';

const internalEventBus = new EventEmitter();
internalEventBus.setMaxListeners(50);

export const publishInternalEvent = (
  eventName: InternalEventName,
  payload: InternalEventPayload,
  metadata: InternalEventMetadata,
): void => {
  validateInternalEventInput({ eventName, payload, metadata });

  internalEventBus.emit(eventName, {
    eventName,
    payload,
    metadata,
  });
};

export const subscribeToInternalEvent = (
  eventName: InternalEventName,
  handler: InternalEventHandler,
): void => {
  internalEventBus.on(eventName, handler);
};

export const unsubscribeFromInternalEvent = (
  eventName: InternalEventName,
  handler: InternalEventHandler,
): void => {
  internalEventBus.off(eventName, handler);
};

export const clearInternalEventSubscribersForTests = (): void => {
  internalEventBus.removeAllListeners();
};
