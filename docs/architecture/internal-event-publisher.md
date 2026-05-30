# Internal Event Publisher

## Scope

Phase 7 Module 3 introduces a local in-process internal event publisher for realtime and notification fanout. It does not create public REST endpoints, database collections, or queue infrastructure.

## Architecture

Domain services publish committed state changes through module-specific publishers:

```text
domain service -> publisher -> internal event bus -> realtime/notification subscribers
```

The event bus uses Node.js `EventEmitter` for this phase. Publishers sanitize payloads before publication and attach metadata with event identity, source module, optional actor context, optional request/trace identifiers, and creation time.

## Publishers

- `delivery-event.publisher.ts` publishes delivery assignment, pickup, progress, completion, failure, and location events.
- `order-event.publisher.ts` publishes order creation, acceptance, packing, cancellation, and delivery events.
- `sla-event.publisher.ts` publishes delivery SLA breach events.

## Subscribers

- `realtime-event.subscriber.ts` bridges delivery events into the existing realtime emitter service.
- `notification-event.subscriber.ts` bridges delivery events into the existing delivery notification placeholder service.
- `internal-event-registry.service.ts` registers subscribers once per process during backend startup.

Covered delivery realtime and notification side effects are routed through subscribers when the registry is active. Existing direct side-effect calls remain available for isolated service tests and unregistered contexts without duplicating runtime subscriber emissions.

## Migration Path

The current bus is intentionally local and process-bound. A later phase can replace the EventEmitter backing with a queue or event stream while preserving publisher method names, event names, payload contracts, and subscriber responsibilities.
