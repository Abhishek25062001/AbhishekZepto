# Realtime Architecture

## Current State

Socket.IO or another real-time system is not implemented yet.

The backend is Redis-ready but Redis is not implemented yet.

## Intended Uses

Real-time updates are expected for:

- customer order status updates
- customer delivery tracking
- delivery-agent assignment notifications
- delivery-agent active delivery updates
- vendor incoming order updates
- vendor picking/packing/ready-for-pickup updates
- admin order and delivery operations dashboards
- operational presence where required

## Authority Rule

Real-time events must reflect backend-confirmed state. Clients must not emit final business state directly to other clients.

Correct flow:

```text
client action -> authenticated API or socket command -> backend validation -> service state change -> DB write -> audit/event record -> realtime notification
```

## Redis Role

Redis may later support:

- Socket.IO adapter for multi-process fanout
- delivery-agent presence
- admin/operator presence
- inventory locks
- rate limiting
- session/token revocation
- lightweight queues
- cache invalidation events

Do not introduce Redis until a ticket explicitly requires it.

## Event Naming

Future event names should be explicit and domain-based, using lowercase namespaced strings.

Examples:

```text
order.status.updated
delivery.assignment.created
delivery.location.updated
vendor.order.ready_for_pickup
admin.operation.alert
```

Exact event contracts must be documented in `docs/contracts` or module docs before implementation.

## Room/Channel Strategy

Needs verification when real-time module begins.

Expected room categories:

- customer-specific rooms
- order-specific rooms
- delivery-agent-specific rooms
- store-specific rooms
- vendor-specific rooms
- admin operations rooms

Room joins must require authentication and scope validation.

## Reliability Expectations

Real-time updates are not a replacement for durable state. Clients must be able to recover by refetching API state.

Critical events should be backed by persisted state and, where needed, queued/background processing.
