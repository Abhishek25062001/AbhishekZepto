# Phase 5 Order Timeline Service

## Scope

This document defines the planned order timeline service behavior for Backend
Order State Management. It does not create a service file, model, repository,
controller, route, validator, test, or database write.

**Sources:**

- `projectin micro/docone/AllPhase&Modules.pdf` (Backend Order State Management)
- `projectin micro/docfour/PhaesDetail4&5.pdf` (order lifecycle logger and timeline micro-tasks)

## Planned Responsibility

The future timeline service appends and reads lifecycle/timeline events for
order status changes and operational audit visibility.

## Planned Method Shapes

Planned only:

```text
appendTimelineEvent(orderId, event, actorContext, metadata)
getOrderTimeline(orderId, actorContext, visibilityMode)
```

Implementation may choose exact names and parameters.

## Append Behavior

1. Receive transition result or domain event.
2. Validate required actor context.
3. Add event name, from/to status, actor metadata, reason/notes, and timestamp.
4. Preserve customer-safe visibility boundaries.
5. Return timeline append result to caller.

## Read Behavior

| Visibility mode | Intended actor | Includes |
|-----------------|----------------|----------|
| `customer` | Customer | Customer-safe status history and public notes |
| `store` | Store/vendor | Assigned-store operational events |
| `admin` | Admin | Full operational timeline, cancellation metadata, SLA markers |

## Event Source Mapping

Timeline event names are defined in:

- `docs/architecture/phase-5-audit-logging.md`

Schema planning is defined in:

- `docs/database/phase-5-order-lifecycle-schema.md`

## Deferred Implementation

Runtime timeline persistence and filtering belong to later implementation after
the repository/bootstrap gate is cleared.

## API Endpoints

No API endpoints are implemented in this document.

## DB Fields

No database fields are created in this document.
