# Phase 6 Store Arrival & Order Pickup API Contracts

## Authentication Requirements
Standard JWT authentication is enforced on all delivery agent endpoints.
* **Header:** `Authorization: Bearer <accessToken>`
* **Role required:** `delivery_agent`

---

## 1. POST `/api/v1/delivery/assignments/{assignmentId}/arrived-at-store`

Transitions the delivery status to `arrived_at_store`.

### Path Parameters
* `assignmentId` (string, required): 24-character hexadecimal MongoDB ObjectId representing the delivery assignment.

### Request Body
No body is required. Optional comments or reasons can be accepted.

### Success Response (200 OK)
Returns the complete updated delivery assignment.

```json
{
  "success": true,
  "message": "Arrived at store successfully registered",
  "data": {
    "deliveryId": "603d7b97e6824a1b8cfa3b25",
    "orderId": "603d7b97e6824a1b8cfa3b22",
    "customerId": "603d7b97e6824a1b8cfa3b20",
    "storeId": "603d7b97e6824a1b8cfa3b19",
    "cityId": "603d7b97e6824a1b8cfa3b18",
    "deliveryAgentId": "603d7b97e6824a1b8cfa3b21",
    "deliveryStatus": "arrived_at_store",
    "assignedAt": "2026-05-22T06:00:00.000Z",
    "arrivedAtStoreAt": "2026-05-22T06:10:00.000Z",
    "pickedUpAt": null,
    "completedAt": null,
    "cancelledAt": null,
    "cancellationReason": null,
    "timeline": [
      {
        "actorType": "system",
        "actorId": null,
        "fromStatus": "none",
        "toStatus": "pending_assignment",
        "reason": "Delivery assignment initialized",
        "createdAt": "2026-05-22T05:55:00.000Z"
      },
      {
        "actorType": "system",
        "actorId": null,
        "fromStatus": "pending_assignment",
        "toStatus": "assigned",
        "reason": "Auto-assigned by matching engine",
        "createdAt": "2026-05-22T06:00:00.000Z"
      },
      {
        "actorType": "delivery_agent",
        "actorId": "603d7b97e6824a1b8cfa3b21",
        "fromStatus": "assigned",
        "toStatus": "en_route_to_store",
        "reason": "Assignment acknowledged and en route started",
        "createdAt": "2026-05-22T06:02:00.000Z"
      },
      {
        "actorType": "delivery_agent",
        "actorId": "603d7b97e6824a1b8cfa3b21",
        "fromStatus": "en_route_to_store",
        "toStatus": "arrived_at_store",
        "reason": "Rider registered arrival at store",
        "createdAt": "2026-05-22T06:10:00.000Z"
      }
    ],
    "createdAt": "2026-05-22T05:55:00.000Z",
    "updatedAt": "2026-05-22T06:10:00.000Z"
  }
}
```

---

## 2. POST `/api/v1/delivery/assignments/{assignmentId}/picked-up`

Transitions the delivery status to `picked_up`.

### Path Parameters
* `assignmentId` (string, required): 24-character hexadecimal MongoDB ObjectId representing the delivery assignment.

### Request Body (Optional)
Accepts verification details as a metadata object placeholder (no real hardware validation enforced in Phase 6).

```json
{
  "verificationMethod": "otp",
  "verificationValue": "123456",
  "notes": "Package secured successfully"
}
```

### Success Response (200 OK)

```json
{
  "success": true,
  "message": "Order pickup successfully registered",
  "data": {
    "deliveryId": "603d7b97e6824a1b8cfa3b25",
    "orderId": "603d7b97e6824a1b8cfa3b22",
    "customerId": "603d7b97e6824a1b8cfa3b20",
    "storeId": "603d7b97e6824a1b8cfa3b19",
    "cityId": "603d7b97e6824a1b8cfa3b18",
    "deliveryAgentId": "603d7b97e6824a1b8cfa3b21",
    "deliveryStatus": "picked_up",
    "assignedAt": "2026-05-22T06:00:00.000Z",
    "arrivedAtStoreAt": "2026-05-22T06:10:00.000Z",
    "pickedUpAt": "2026-05-22T06:15:00.000Z",
    "completedAt": null,
    "cancelledAt": null,
    "cancellationReason": null,
    "timeline": [
      ...
      {
        "actorType": "delivery_agent",
        "actorId": "603d7b97e6824a1b8cfa3b21",
        "fromStatus": "arrived_at_store",
        "toStatus": "picked_up",
        "reason": "Order goods picked up; verification: otp",
        "createdAt": "2026-05-22T06:15:00.000Z"
      }
    ],
    "createdAt": "2026-05-22T05:55:00.000Z",
    "updatedAt": "2026-05-22T06:15:00.000Z"
  }
}
```

---

## 3. Error Responses

### 401 Unauthorized
Triggered when the Bearer token is missing, expired, or invalid.
```json
{
  "success": false,
  "message": "Access token is missing or invalid",
  "error": {
    "code": "UNAUTHORIZED"
  }
}
```

### 403 Forbidden (`DELIVERY_AGENT_NOT_ASSIGNED_TO_ORDER`)
Triggered when an authenticated delivery agent attempts to transition an assignment belonging to another agent.
```json
{
  "success": false,
  "message": "Authenticated agent is not the assigned agent for this delivery",
  "error": {
    "code": "DELIVERY_AGENT_NOT_ASSIGNED_TO_ORDER"
  }
}
```

### 404 Not Found (`DELIVERY_ASSIGNMENT_NOT_FOUND`)
Triggered when the provided `assignmentId` does not exist.
```json
{
  "success": false,
  "message": "Delivery assignment not found",
  "error": {
    "code": "DELIVERY_ASSIGNMENT_NOT_FOUND"
  }
}
```

### 409 Conflict (`DELIVERY_INVALID_STATE_TRANSITION` / `DELIVERY_ALREADY_COMPLETED`)
* **`DELIVERY_INVALID_STATE_TRANSITION`:** Triggered when the current state cannot transition to the target state (e.g., trying to trigger pickup when state is `assigned` or `en_route_to_store`).
```json
{
  "success": false,
  "message": "Requested delivery state change is not allowed",
  "error": {
    "code": "DELIVERY_INVALID_STATE_TRANSITION"
  }
}
```

* **`DELIVERY_ALREADY_COMPLETED`:** Triggered when trying to perform arrival or pickup on a terminal state assignment (`delivered`, `failed`, `cancelled`).
```json
{
  "success": false,
  "message": "Delivery has already reached a terminal state",
  "error": {
    "code": "DELIVERY_ALREADY_COMPLETED"
  }
}
```

### 422 Unprocessable Entity
Triggered when parameter formats fail validation checks (e.g., `assignmentId` is not a valid 24-character hexadecimal ObjectId).
```json
{
  "success": false,
  "message": "Request validation failed",
  "error": {
    "code": "VALIDATION_ERROR",
    "details": [
      {
        "field": "assignmentId",
        "message": "Invalid ObjectId format"
      }
    ]
  }
}
```
