# Audit Log Fields

Audit logs are stored in the `audit_logs` collection.

## DB Fields

- `eventType`
- `actorId`
- `actorRole`
- `actorSurface`
- `entityType`
- `entityId`
- `vendorId`
- `storeId`
- `cityId`
- `requestId`
- `traceId`
- `ipAddress`
- `userAgent`
- `metadata`
- `status`
- `createdAt`
- `updatedAt`

## Indexes

- `eventType + createdAt`
- `actorId + createdAt`
- `entityType + entityId`
- `vendorId + storeId + createdAt`

## API Endpoints

No new API endpoints created in this task.

## Phase 3 Catalog Audit Events

Planned catalog event types are documented in `docs/security/catalog-audit-logging.md`
(e.g. `catalog.category_created`, `catalog.product_approval_status_changed`).
