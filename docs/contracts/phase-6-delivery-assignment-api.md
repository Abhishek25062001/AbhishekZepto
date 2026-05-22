# Phase 6 Module 4 — Delivery Assignment API & Integration Contract

## Scope

This document details the exact HTTP request/response payloads, service hook contracts, and notification structures for the Module 4 Delivery Assignment Backend.

**Sources:**
- `docs/contracts/phase-6-delivery-route-plan.md` (planned route families)
- `docs/errors/phase-6-delivery-error-codes.md` (planned delivery errors)

---

## Admin Surface Endpoints

These endpoints require authentication and authorization checks verifying the request actor belongs to admin groups (e.g. Super Admin, Operations Admin).

### 1. Trigger Manual Dispatch Matching Pass
Allows operations admins to manually re-trigger the matching engine dispatch pass on a stuck or pending delivery assignment.

- **Method:** `POST`
- **Path:** `/api/v1/admin/deliveries/:deliveryId/dispatch`
- **Headers:**
  - `Authorization: Bearer <token>`
- **Response (200 OK - Rider Found & Assigned):**
  ```json
  {
    "success": true,
    "message": "Dispatch execution completed",
    "data": {
      "deliveryId": "664b58e7c10b42f6ad29a431",
      "status": "assigned",
      "assignedAgentId": "664b58e7c10b42f6ad29a439"
    }
  }
  ```
- **Response (200 OK - No Online Rider Available):**
  ```json
  {
    "success": true,
    "message": "Dispatch execution completed",
    "data": {
      "deliveryId": "664b58e7c10b42f6ad29a431",
      "status": "pending_assignment",
      "assignedAgentId": null
    }
  }
  ```
- **Error Responses:**
  - `DELIVERY_ASSIGNMENT_NOT_FOUND` (404 Not Found): The specified `deliveryId` does not exist or is deleted.
  - `DELIVERY_ALREADY_COMPLETED` (409 Conflict): The delivery assignment is already in a terminal state (`delivered`, `failed`, `cancelled`).

---

### 2. List Pending Assignments Queue
Allows operations admins to inspect active unassigned orders awaiting riders.

- **Method:** `GET`
- **Path:** `/api/v1/admin/deliveries/pending`
- **Headers:**
  - `Authorization: Bearer <token>`
- **Query Parameters:**
  - `cityId` (string, optional): Filter by city ID
  - `page` (number, optional, default: 1)
  - `limit` (number, optional, default: 20)
- **Response (200 OK):**
  ```json
  {
    "success": true,
    "message": "Pending deliveries fetched successfully",
    "data": {
      "deliveries": [
        {
          "deliveryId": "664b58e7c10b42f6ad29a431",
          "orderId": "664b58e7c10b42f6ad29a420",
          "customerId": "664b58e7c10b42f6ad29a410",
          "storeId": "664b58e7c10b42f6ad29a405",
          "cityId": "664b58e7c10b42f6ad29a401",
          "deliveryStatus": "pending_assignment",
          "createdAt": "2026-05-22T00:00:00.000Z"
        }
      ],
      "total": 1,
      "page": 1,
      "limit": 20
    }
  }
  ```

---

## Service Hook Contract

When store picking/packing resolves to complete, `order.service.ts` triggers order transition. After success, it invokes:

```typescript
export interface InitializeDeliveryInput {
  orderId: string;
}
```

This method replicates customer, store, and city IDs into the active delivery collection, starts the matching query, and transitions states.

---

## Mock Agent Notification Placeholder

When an assignment locks, the system publishes a mock notification payload in the `order_notification_placeholders` collection to notify the rider.

### Database Snapshot Shape:
- `recipient`:
  - `recipientType`: `'agent'`
  - `recipientId`: `[deliveryAgentId]`
- `event`: `'assigned'`
- `title`: `'New Delivery Assignment'`
- `body`: `'Order #ORD-12345 is ready for your pickup. Tap to accept.'`
- `status`: `'queued_placeholder'`
- `metadata`:
  - `deliveryId`: `[deliveryId]`
  - `orderId`: `[orderId]`
  - `storeId`: `[storeId]`
