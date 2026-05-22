# Phase 5 Store Acceptance API Contract

## Scope

This contract defines the Module 3 Store Acceptance Flow API surface for store
accept/reject actions. It is the foundation contract for the store acceptance
module and does not add picking, packing, inventory adjustment, cancellation
refund handling, SLA jobs, notifications, or vendor UI behavior.

## Endpoint Summary

| Method | Path | Actor | Purpose |
|--------|------|-------|---------|
| POST | `/api/v1/store/orders/{orderId}/accept` | Store/vendor | Accept a placed order |
| POST | `/api/v1/store/orders/{orderId}/reject` | Store/vendor | Reject a placed order with a reason |

## Accept Order

**Endpoint:** `POST /api/v1/store/orders/{orderId}/accept`

### Request

Path params:

- `orderId`: order identifier.

Body: none.

### Planned Response Shape

```json
{
  "orderId": "string",
  "orderNumber": "ORD-000001",
  "orderStatus": "accepted",
  "storeStatus": "accepted",
  "acceptedAt": "2026-05-19T00:00:00.000Z",
  "rejectedAt": null,
  "rejectionReason": null,
  "autoAcceptEnabled": false
}
```

## Reject Order

**Endpoint:** `POST /api/v1/store/orders/{orderId}/reject`

### Request

Path params:

- `orderId`: order identifier.

Body:

```json
{
  "reason": "Out of stock"
}
```

### Planned Response Shape

```json
{
  "orderId": "string",
  "orderNumber": "ORD-000001",
  "orderStatus": "cancelled",
  "storeStatus": "rejected",
  "acceptedAt": null,
  "rejectedAt": "2026-05-19T00:00:00.000Z",
  "rejectionReason": "Out of stock",
  "autoAcceptEnabled": false
}
```

## Permission And Ownership

- Store/vendor actor must be authenticated.
- Store/vendor actor must have access to the order's `storeId`.
- Store/vendor actor requires the order update permission documented in
  `docs/security/phase-5-permissions.md`.

## API Endpoints

This contract covers:

- `POST /api/v1/store/orders/{orderId}/accept`
- `POST /api/v1/store/orders/{orderId}/reject`

## DB Fields

Planned acceptance fields:

- `orderStatus`
- `storeStatus`
- `acceptedAt`
- `rejectedAt`
- `rejectionReason`
