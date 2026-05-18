# Catalog Audit Logging

Status: **PLANNED** — audit writes implemented in catalog backend service modules.

Uses existing `audit_logs` collection. See `docs/security/audit-log-fields.md`.

## Audit Events

| Event type | Trigger |
|------------|---------|
| `catalog.category_created` | Category POST success |
| `catalog.category_updated` | Category PATCH success |
| `catalog.category_deleted` | Category soft delete |
| `catalog.brand_created` | Brand POST success |
| `catalog.brand_updated` | Brand PATCH success |
| `catalog.brand_deleted` | Brand soft delete |
| `catalog.product_created` | Product POST success |
| `catalog.product_updated` | Product PATCH success |
| `catalog.product_deleted` | Product soft delete |
| `catalog.product_approval_status_changed` | Approval PATCH |
| `catalog.variant_created` | Variant POST success |
| `catalog.variant_updated` | Variant PATCH success |
| `catalog.variant_deleted` | Variant soft delete |
| `catalog.media_uploaded` | Media upload success |
| `catalog.media_deleted` | Media delete success |

## Metadata Must Include

- `entityType`
- `entityId`
- `changedFields` (updates)
- `actorId`
- `actorRole`
- `actorSurface`
- `requestId`
- `traceId`

## Metadata Must Not Include

- Raw image binary
- `accessToken` / `refreshToken`
- `authorization` header value
- Internal secrets

## API Endpoints

All **admin catalog write** endpoints (see `docs/contracts/catalog-admin-api-contract.md`).

## DB Fields

- `audit_logs.eventType`
- `audit_logs.actorId`
- `audit_logs.actorRole`
- `audit_logs.actorSurface`
- `audit_logs.entityType`
- `audit_logs.entityId`
- `audit_logs.metadata`
