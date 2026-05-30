import { randomUUID } from 'node:crypto';
import type { AuthRole } from '../../auth/types/auth-role.types';
import type { InternalEventName } from '../constants/internal-event-names.constant';
import type { InternalEventMetadata } from '../types/internal-event.types';

export type InternalEventActorContext = {
  eventName: InternalEventName;
  actorId?: string | null;
  actorRole?: AuthRole | null;
  requestId?: string | null;
  traceId?: string | null;
};

export const buildEventMetadata = (
  sourceModule: string,
  actorContext: InternalEventActorContext,
): InternalEventMetadata => {
  return {
    eventId: randomUUID(),
    eventName: actorContext.eventName,
    sourceModule,
    actorId: actorContext.actorId ?? null,
    actorRole: actorContext.actorRole ?? null,
    requestId: actorContext.requestId ?? null,
    traceId: actorContext.traceId ?? null,
    createdAt: new Date().toISOString(),
  };
};
