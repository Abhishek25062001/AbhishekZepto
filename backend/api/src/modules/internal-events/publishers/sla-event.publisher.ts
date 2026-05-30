import { INTERNAL_EVENT_NAMES } from '../constants/internal-event-names.constant';
import { publishInternalEvent } from '../services/internal-event-bus.service';
import { buildEventMetadata } from '../utils/internal-event-metadata.util';
import { mapSlaInternalEventPayload } from '../utils/internal-event-payload.mapper';

const SLA_SOURCE_MODULE = 'delivery-sla';

export const publishSlaBreachCreated = (breach: unknown): void => {
  const eventName = INTERNAL_EVENT_NAMES.DELIVERY_SLA_BREACH_CREATED;

  publishInternalEvent(
    eventName,
    mapSlaInternalEventPayload(breach),
    buildEventMetadata(SLA_SOURCE_MODULE, { eventName }),
  );
};
