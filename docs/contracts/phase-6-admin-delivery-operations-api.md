# Phase 6 Admin Delivery Operations API Contract

**Module:** 15 — Admin Dashboard — Delivery Operations  
**Phase:** Phase 6 — Delivery Lifecycle  
**Auth surface:** Admin (Bearer JWT, requires admin role)  
**Base path:** `/api/v1/admin/deliveries`

---

## Sources

- `docs/contracts/phase-6-delivery-route-plan.md` (route plan, Module 15 rows)
- `docs/architecture/phase-6-delivery-ownership-rules.md` (admin permission rules)
- `docs/contracts/delivery-state-transition-matrix.md` (state values)
- `project-context/API_STANDARDS.md`

---

## 1. List All Deliveries

**Method:** `GET`  
**Path:** `/api/v1/admin/deliveries`  
**Permission required:** `delivery:monitor`

### Query Parameters

| Parameter | Type     | Required | Description |
|-----------|----------|----------|-------------|
| `status`  | string   | No       | Filter by delivery status (any valid `DeliveryStatus` value) |
| `agentId` | ObjectId | No       | Filter by assigned delivery agent ID |
| `storeId` | ObjectId | No       | Filter by store ID |
| `cityId`  | ObjectId | No       | Filter by city ID |
| `page`    | integer  | No       | Page number (default: 1, min: 1) |
| `limit`   | integer  | No       | Results per page (default: 20, min: 1, max: 100) |

### Response 200 OK

```json
{
  "success": true,
  "message": "Deliveries list fetched successfully",
  "data": {
    "items": [
      {
        "deliveryId": "string (ObjectId)",
        "orderId": "string (ObjectId)",
        "storeId": "string (ObjectId)",
        "cityId": "string (ObjectId)",
        "deliveryAgentId": "string (ObjectId) | null",
        "deliveryStatus": "pending_assignment | assigned | en_route_to_store | ...",
        "assignedAt": "ISO 8601 | null",
        "pickedUpAt": "ISO 8601 | null",
        "completedAt": "ISO 8601 | null",
        "cancelledAt": "ISO 8601 | null",
        "createdAt": "ISO 8601"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 150
    }
  }
}
```

### Error Responses

| Status | Code | Condition |
|--------|------|-----------|
| 401    | `UNAUTHORIZED` | Missing or invalid auth token |
| 403    | `FORBIDDEN` | Admin does not have `delivery:monitor` permission |

---

## 2. Get Delivery Detail

**Method:** `GET`  
**Path:** `/api/v1/admin/deliveries/:deliveryId`  
**Permission required:** `delivery:read`

### Path Parameters

| Parameter    | Type     | Required | Description |
|--------------|----------|----------|-------------|
| `deliveryId` | ObjectId | Yes      | The delivery assignment's MongoDB ObjectId |

### Response 200 OK

```json
{
  "success": true,
  "message": "Delivery detail fetched successfully",
  "data": {
    "deliveryId": "string",
    "orderId": "string",
    "customerId": "string",
    "storeId": "string",
    "cityId": "string",
    "deliveryAgentId": "string | null",
    "deliveryStatus": "string",
    "assignedAt": "ISO 8601 | null",
    "arrivedAtStoreAt": "ISO 8601 | null",
    "pickedUpAt": "ISO 8601 | null",
    "enRouteToCustomerAt": "ISO 8601 | null",
    "arrivedAtCustomerAt": "ISO 8601 | null",
    "completedAt": "ISO 8601 | null",
    "deliveredAt": "ISO 8601 | null",
    "failedAt": "ISO 8601 | null",
    "failureReason": "string | null",
    "cancelledAt": "ISO 8601 | null",
    "cancellationReason": "string | null",
    "timeline": [
      {
        "actorType": "system | delivery_agent | admin",
        "actorId": "string | null",
        "fromStatus": "string",
        "toStatus": "string",
        "reason": "string | null",
        "createdAt": "ISO 8601"
      }
    ],
    "agentSnapshot": {
      "name": "string",
      "phone": "string",
      "vehicleType": "bike | scooter | bicycle | foot",
      "vehicleNumber": "string | null",
      "profilePhotoUrl": "string | null"
    } ,
    "createdAt": "ISO 8601",
    "updatedAt": "ISO 8601"
  }
}
```

> `agentSnapshot` is `null` when no agent has been assigned.

### Error Responses

| Status | Code | Condition |
|--------|------|-----------|
| 401    | `UNAUTHORIZED` | Missing or invalid auth token |
| 403    | `FORBIDDEN` | Admin does not have `delivery:read` permission |
| 404    | `DELIVERY_ASSIGNMENT_NOT_FOUND` | No delivery found for `deliveryId` |

---

## 3. Admin Override Delivery State

**Method:** `POST`  
**Path:** `/api/v1/admin/deliveries/:deliveryId/override`  
**Permission required:** `delivery:update`

### Path Parameters

| Parameter    | Type     | Required | Description |
|--------------|----------|----------|-------------|
| `deliveryId` | ObjectId | Yes      | The delivery assignment's MongoDB ObjectId |

### Request Body

```json
{
  "targetStatus": "cancelled | failed",
  "reason": "string (min 5 characters)"
}
```

| Field          | Type   | Required | Constraints |
|----------------|--------|----------|-------------|
| `targetStatus` | string | Yes      | Must be `"cancelled"` or `"failed"` only |
| `reason`       | string | Yes      | Minimum 5 characters; recorded in audit timeline |

### Business Rules

- Admin may only override to `cancelled` or `failed`. Overriding to active/in-progress states is not permitted.
- If the delivery is already in a terminal state (`delivered`, `failed`, `cancelled`), the request returns `409 CONFLICT`.
- A timeline event is appended with `actorType: "admin"`, the admin's user ID, `fromStatus`, `toStatus`, and the provided `reason`.
- When `targetStatus` is `cancelled`, `cancelledAt` and `cancellationReason` are set.
- When `targetStatus` is `failed`, `failedAt` and `failureReason` are set.

### Response 200 OK

```json
{
  "success": true,
  "message": "Delivery overridden successfully",
  "data": {
    "deliveryId": "string",
    "deliveryStatus": "cancelled | failed",
    "cancelledAt": "ISO 8601 | null",
    "cancellationReason": "string | null",
    "failedAt": "ISO 8601 | null",
    "failureReason": "string | null"
  }
}
```

### Error Responses

| Status | Code | Condition |
|--------|------|-----------|
| 400    | `DELIVERY_INVALID_TRANSITION` | `targetStatus` is not `cancelled` or `failed` |
| 400    | `VALIDATION_ERROR` | `reason` missing or too short |
| 401    | `UNAUTHORIZED` | Missing or invalid auth token |
| 403    | `FORBIDDEN` | Admin does not have `delivery:update` permission |
| 404    | `DELIVERY_ASSIGNMENT_NOT_FOUND` | No delivery found for `deliveryId` |
| 409    | `DELIVERY_ALREADY_COMPLETED` | Delivery is already in a terminal state |

---

## Permission Summary

| Route | Required Permission |
|-------|---------------------|
| `GET /api/v1/admin/deliveries` | `delivery:monitor` |
| `GET /api/v1/admin/deliveries/:deliveryId` | `delivery:read` |
| `POST /api/v1/admin/deliveries/:deliveryId/override` | `delivery:update` |

All routes additionally require:
- Valid Bearer JWT token
- Admin role (`SUPER_ADMIN`, `SUPPORT_ADMIN`, or `OPERATIONS_ADMIN`)

---

## DB Fields

No new database fields are created by this module. All fields used (`deliveryStatus`, `cancelledAt`, `cancellationReason`, `failedAt`, `failureReason`, `timeline`) are already present in the `DeliveryAssignment` collection schema (implemented in Module 4).
