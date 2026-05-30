# Phase 6 — Delivery Completion API Contract

## Scope

This document defines the API contract for the two terminal delivery completion state transitions introduced in Module 11 (Delivery Completion Backend):

1. `POST .../delivered` — agent confirms successful delivery to the customer.
2. `POST .../failed` — agent/admin reports a failed delivery attempt after pickup.

**Sources:**
- `docs/contracts/delivery-state-transition-matrix.md`
- `docs/contracts/phase-6-delivery-route-plan.md`

---

## Authentication Requirements

All endpoints in this contract require a valid delivery agent JWT.

```
Authorization: Bearer <accessToken>
```

- Role: `delivery_agent`
- The `deliveryAgentId` embedded in the token is extracted by the auth middleware and injected into `req.deliveryAgentId`.
- The agent MUST be the assigned agent for the delivery (`deliveryAgentId === assignment.deliveryAgentId`).

---

## Endpoint 1 — Delivered Confirmation

### `POST /api/v1/delivery/assignments/{assignmentId}/delivered`

Transitions a delivery assignment from `arrived_at_customer` to `delivered`. This signals that the goods have been successfully handed over to the customer.

#### Path Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `assignmentId` | string (24-char hex ObjectId) | ✅ | Unique identifier of the delivery assignment. |

#### Request Body

Optional verification metadata payload. All fields are placeholders and optional in Phase 6:

```json
{
  "verificationMethod": "otp",
  "verificationValue": "123456",
  "notes": "Left packages with recipient Shivam."
}
```

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `verificationMethod` | string (`"otp" \| "photo" \| "manual"`) | ❌ | Method used to verify handover. |
| `verificationValue` | string | ❌ | verification code or signature/photo hash. |
| `notes` | string | ❌ | Rider notes or observations. |

#### Pre-conditions

| Condition | Error if failed |
|-----------|----------------|
| Assignment exists | 404 `DELIVERY_ASSIGNMENT_NOT_FOUND` |
| Authenticated agent owns the assignment | 403 `DELIVERY_AGENT_NOT_ASSIGNED_TO_ORDER` |
| Current status is exactly `arrived_at_customer` | 409 `DELIVERY_INVALID_STATE_TRANSITION` |

#### Idempotency Rule

This endpoint is **idempotent**. A second call by the same assigned agent on a delivery that is already in `'delivered'` status MUST return `200 OK` successfully without throwing error or modifying timestamps.
If the delivery is in other terminal states (`failed` or `cancelled`), it MUST return `409 DELIVERY_ALREADY_COMPLETED`.

#### Success Response — `200 OK`

```json
{
  "success": true,
  "message": "Delivery completed successfully",
  "data": {
    "_id": "603d7b97e6824a1b8cfa3b25",
    "orderId": "603d7b97e6824a1b8cfa3b10",
    "customerId": "603d7b97e6824a1b8cfa3b11",
    "storeId": "603d7b97e6824a1b8cfa3b12",
    "cityId": "603d7b97e6824a1b8cfa3b13",
    "deliveryAgentId": "603d7b97e6824a1b8cfa3b14",
    "deliveryStatus": "delivered",
    "assignedAt": "2026-05-28T06:00:00.000Z",
    "arrivedAtStoreAt": "2026-05-28T06:10:00.000Z",
    "pickedUpAt": "2026-05-28T06:15:00.000Z",
    "enRouteToCustomerAt": "2026-05-28T06:20:00.000Z",
    "arrivedAtCustomerAt": "2026-05-28T06:28:00.000Z",
    "completedAt": "2026-05-28T06:33:00.000Z",
    "deliveredAt": "2026-05-28T06:33:00.000Z",
    "failedAt": null,
    "failureReason": null,
    "cancelledAt": null,
    "cancellationReason": null,
    "timeline": [
      {
        "actorType": "delivery_agent",
        "actorId": "603d7b97e6824a1b8cfa3b14",
        "fromStatus": "arrived_at_customer",
        "toStatus": "delivered",
        "reason": "Delivery completed; verification: otp",
        "createdAt": "2026-05-28T06:33:00.000Z"
      }
    ],
    "createdAt": "2026-05-28T05:55:00.000Z",
    "updatedAt": "2026-05-28T06:33:00.000Z"
  }
}
```

---

## Endpoint 2 — Report Failed Delivery

### `POST /api/v1/delivery/assignments/{assignmentId}/failed`

Transitions a delivery assignment from an active progress state (`picked_up`, `en_route_to_customer`, `arrived_at_customer`) to `failed`. This signals that the delivery could not be completed.

#### Path Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `assignmentId` | string (24-char hex ObjectId) | ✅ | Unique identifier of the delivery assignment. |

#### Request Body

Zod-validated body containing the reason for the delivery failure:

```json
{
  "failureReason": "Customer not available"
}
```

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `failureReason` | string | ✅ | Detail text explaining the failure. Must be a non-empty string. |

#### Pre-conditions

| Condition | Error if failed |
|-----------|----------------|
| Assignment exists | 404 `DELIVERY_ASSIGNMENT_NOT_FOUND` |
| Authenticated agent owns the assignment | 403 `DELIVERY_AGENT_NOT_ASSIGNED_TO_ORDER` |
| Current status is in `delivered`, `failed`, `cancelled` | 409 `DELIVERY_ALREADY_COMPLETED` |
| Current status is NOT in (`picked_up`, `en_route_to_customer`, `arrived_at_customer`) | 409 `DELIVERY_INVALID_STATE_TRANSITION` |

#### Success Response — `200 OK`

```json
{
  "success": true,
  "message": "Delivery failure registered successfully",
  "data": {
    "_id": "603d7b97e6824a1b8cfa3b25",
    "orderId": "603d7b97e6824a1b8cfa3b10",
    "customerId": "603d7b97e6824a1b8cfa3b11",
    "storeId": "603d7b97e6824a1b8cfa3b12",
    "cityId": "603d7b97e6824a1b8cfa3b13",
    "deliveryAgentId": "603d7b97e6824a1b8cfa3b14",
    "deliveryStatus": "failed",
    "assignedAt": "2026-05-28T06:00:00.000Z",
    "arrivedAtStoreAt": "2026-05-28T06:10:00.000Z",
    "pickedUpAt": "2026-05-28T06:15:00.000Z",
    "enRouteToCustomerAt": "2026-05-28T06:20:00.000Z",
    "arrivedAtCustomerAt": null,
    "completedAt": null,
    "deliveredAt": null,
    "failedAt": "2026-05-28T06:25:00.000Z",
    "failureReason": "Customer not available",
    "cancelledAt": null,
    "cancellationReason": null,
    "timeline": [
      {
        "actorType": "delivery_agent",
        "actorId": "603d7b97e6824a1b8cfa3b14",
        "fromStatus": "en_route_to_customer",
        "toStatus": "failed",
        "reason": "Delivery failed: Customer not available",
        "createdAt": "2026-05-28T06:25:00.000Z"
      }
    ],
    "createdAt": "2026-05-28T05:55:00.000Z",
    "updatedAt": "2026-05-28T06:25:00.000Z"
  }
}
```

---

## Idempotency Summary

- `delivered`: Idempotent for duplicate requests from the same agent on a delivered assignment. Returns `200 OK` with the existing document.
- `failed`: Non-idempotent. Duplicate attempts to mark an already failed assignment will be rejected with `409 DELIVERY_ALREADY_COMPLETED`.
