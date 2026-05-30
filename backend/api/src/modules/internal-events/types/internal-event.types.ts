import type { AuthRole } from '../../auth/types/auth-role.types';
import type { InternalEventName } from '../constants/internal-event-names.constant';

export type InternalEventPayload = Record<string, unknown>;

export type InternalEventMetadata = {
  eventId: string;
  eventName: InternalEventName;
  sourceModule: string;
  actorId: string | null;
  actorRole: AuthRole | null;
  requestId: string | null;
  traceId: string | null;
  createdAt: string;
};

export type PublishInternalEventInput = {
  eventName: InternalEventName;
  payload: InternalEventPayload;
  metadata: InternalEventMetadata;
};

export type InternalEventEnvelope<
  TPayload extends InternalEventPayload = InternalEventPayload,
> = {
  eventName: InternalEventName;
  payload: TPayload;
  metadata: InternalEventMetadata;
};

export type InternalEventHandler<
  TPayload extends InternalEventPayload = InternalEventPayload,
> = (event: InternalEventEnvelope<TPayload>) => void | Promise<void>;
