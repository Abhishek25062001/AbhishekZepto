# Phase 6 — Delivery Progress API Contract

## Scope

This document defines the API contract for the two delivery progress state transitions
introduced in Module 8 (Delivery Progress Backend):

1. `POST .../en-route-to-customer` — agent departs store toward the customer.
2. `POST .../arrived-at-customer` — agent reaches the customer's delivery address.

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
- The `deliveryAgentId` embedded in the token is extracted by the auth middleware and
  injected into `req.deliveryAgentId`.
- The agent MUST be the assigned agent for the delivery (`deliveryAgentId === assignment.deliveryAgentId`).

---

## Endpoint 1 — En-Route to Customer

### `POST /api/v1/delivery/assignments/{assignmentId}/en-route-to-customer`

Transitions a delivery assignment from `picked_up` to `en_route_to_customer`.
This signals that the agent has departed the store and is travelling to the
customer's delivery address.

#### Path Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `assignmentId` | string (24-char hex ObjectId) | ✅ | Unique identifier of the delivery assignment. |

#### Request Body

None. No body is expected for this transition.

#### Pre-conditions

| Condition | Error if failed |
|-----------|----------------|
| Assignment exists | 404 `DELIVERY_ASSIGNMENT_NOT_FOUND` |
| Authenticated agent owns the assignment | 403 `DELIVERY_AGENT_NOT_ASSIGNED_TO_ORDER` |
| Current status is NOT terminal (`delivered`, `failed`, `cancelled`) | 409 `DELIVERY_ALREADY_COMPLETED` |
| Current status is exactly `picked_up` | 409 `DELIVERY_INVALID_STATE_TRANSITION` |

#### Success Response — `200 OK`

```json
{
  "success": true,
  "message": "En-route to customer registered successfully",
  "data": {
    "_id": "603d7b97e6824a1b8cfa3b25",
    "orderId": "603d7b97e6824a1b8cfa3b10",
    "customerId": "603d7b97e6824a1b8cfa3b11",
    "storeId": "603d7b97e6824a1b8cfa3b12",
    "cityId": "603d7b97e6824a1b8cfa3b13",
    "deliveryAgentId": "603d7b97e6824a1b8cfa3b14",
    "deliveryStatus": "en_route_to_customer",
    "assignedAt": "2026-05-28T06:00:00.000Z",
    "arrivedAtStoreAt": "2026-05-28T06:10:00.000Z",
    "pickedUpAt": "2026-05-28T06:15:00.000Z",
    "enRouteToCustomerAt": "2026-05-28T06:20:00.000Z",
    "arrivedAtCustomerAt": null,
    "completedAt": null,
    "cancelledAt": null,
    "cancellationReason": null,
    "timeline": [
      {
        "actorType": "delivery_agent",
        "actorId": "603d7b97e6824a1b8cfa3b14",
        "fromStatus": "picked_up",
        "toStatus": "en_route_to_customer",
        "reason": "Agent started en-route to customer",
        "createdAt": "2026-05-28T06:20:00.000Z"
      }
    ],
    "createdAt": "2026-05-28T05:55:00.000Z",
    "updatedAt": "2026-05-28T06:20:00.000Z"
  }
}
```

#### Error Responses

| HTTP | Error Code | Condition |
|------|-----------|-----------|
| 401 | `UNAUTHORIZED` | Missing or invalid JWT |
| 403 | `DELIVERY_AGENT_NOT_ASSIGNED_TO_ORDER` | Token agent ≠ assignment agent |
| 404 | `DELIVERY_ASSIGNMENT_NOT_FOUND` | No assignment found for `assignmentId` |
| 409 | `DELIVERY_ALREADY_COMPLETED` | Assignment is in a terminal state |
| 409 | `DELIVERY_INVALID_STATE_TRANSITION` | Assignment is not in `picked_up` state |
| 422 | `VALIDATION_ERROR` | `assignmentId` is not a valid 24-char hex ObjectId |

---

## Endpoint 2 — Arrived at Customer

### `POST /api/v1/delivery/assignments/{assignmentId}/arrived-at-customer`

Transitions a delivery assignment from `en_route_to_customer` to `arrived_at_customer`.
This signals that the agent has physically arrived at the customer's delivery address
and is ready to hand over the order.

#### Path Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `assignmentId` | string (24-char hex ObjectId) | ✅ | Unique identifier of the delivery assignment. |

#### Request Body

None. No body is expected for this transition.

#### Pre-conditions

| Condition | Error if failed |
|-----------|----------------|
| Assignment exists | 404 `DELIVERY_ASSIGNMENT_NOT_FOUND` |
| Authenticated agent owns the assignment | 403 `DELIVERY_AGENT_NOT_ASSIGNED_TO_ORDER` |
| Current status is NOT terminal (`delivered`, `failed`, `cancelled`) | 409 `DELIVERY_ALREADY_COMPLETED` |
| Current status is exactly `en_route_to_customer` | 409 `DELIVERY_INVALID_STATE_TRANSITION` |

#### Success Response — `200 OK`

```json
{
  "success": true,
  "message": "Arrived at customer registered successfully",
  "data": {
    "_id": "603d7b97e6824a1b8cfa3b25",
    "orderId": "603d7b97e6824a1b8cfa3b10",
    "customerId": "603d7b97e6824a1b8cfa3b11",
    "storeId": "603d7b97e6824a1b8cfa3b12",
    "cityId": "603d7b97e6824a1b8cfa3b13",
    "deliveryAgentId": "603d7b97e6824a1b8cfa3b14",
    "deliveryStatus": "arrived_at_customer",
    "assignedAt": "2026-05-28T06:00:00.000Z",
    "arrivedAtStoreAt": "2026-05-28T06:10:00.000Z",
    "pickedUpAt": "2026-05-28T06:15:00.000Z",
    "enRouteToCustomerAt": "2026-05-28T06:20:00.000Z",
    "arrivedAtCustomerAt": "2026-05-28T06:28:00.000Z",
    "completedAt": null,
    "cancelledAt": null,
    "cancellationReason": null,
    "timeline": [
      {
        "actorType": "delivery_agent",
        "actorId": "603d7b97e6824a1b8cfa3b14",
        "fromStatus": "en_route_to_customer",
        "toStatus": "arrived_at_customer",
        "reason": "Agent arrived at customer delivery address",
        "createdAt": "2026-05-28T06:28:00.000Z"
      }
    ],
    "createdAt": "2026-05-28T05:55:00.000Z",
    "updatedAt": "2026-05-28T06:28:00.000Z"
  }
}
```

#### Error Responses

| HTTP | Error Code | Condition |
|------|-----------|-----------|
| 401 | `UNAUTHORIZED` | Missing or invalid JWT |
| 403 | `DELIVERY_AGENT_NOT_ASSIGNED_TO_ORDER` | Token agent ≠ assignment agent |
| 404 | `DELIVERY_ASSIGNMENT_NOT_FOUND` | No assignment found for `assignmentId` |
| 409 | `DELIVERY_ALREADY_COMPLETED` | Assignment is in a terminal state |
| 409 | `DELIVERY_INVALID_STATE_TRANSITION` | Assignment is not in `en_route_to_customer` state |
| 422 | `VALIDATION_ERROR` | `assignmentId` is not a valid 24-char hex ObjectId |

---

## State Machine — Module 8 Coverage

```
picked_up
  └── POST .../en-route-to-customer → en_route_to_customer
                                          └── POST .../arrived-at-customer → arrived_at_customer
                                                                                └── (Module 11: delivered / failed)
```

## New Timestamp Fields

| Field | Set when | Type |
|-------|----------|------|
| `enRouteToCustomerAt` | Transition to `en_route_to_customer` succeeds | ISO 8601 datetime string |
| `arrivedAtCustomerAt` | Transition to `arrived_at_customer` succeeds | ISO 8601 datetime string |

## Idempotency

Neither endpoint is idempotent. A second call after the state has already advanced
MUST return `409 DELIVERY_INVALID_STATE_TRANSITION`.

## Deferred / Out of Scope

| Item | Deferred to |
|------|-------------|
| GPS coordinates on each transition | Phase 7+ |
| Customer ETA calculation | Phase 7+ |
| Real-time agent location broadcast | Phase 7+ |
| Customer-facing tracking endpoint | Module 10 / 13 |
| `delivered` / `failed` transitions | Module 11 |

## API Endpoints

No endpoints are implemented in this document. All entries are contract only.

## DB Fields

No database fields are created in this document. Field definitions are documented only.
