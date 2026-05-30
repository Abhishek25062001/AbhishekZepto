# Phase 6 — Customer Delivery Tracking API Contract

## Scope

This document defines the API contract for the customer-facing delivery tracking endpoint introduced in Module 13 (Customer App — Delivery Tracking):

```
GET /api/v1/customer/orders/{orderId}/delivery
```

This endpoint allows the customer app to fetch the active delivery assignment details, completion/transit timestamps, and assigned rider profile snapshot for their own order.

---

## Authentication Requirements

This endpoint requires a secure customer session JWT:

```
Authorization: Bearer <accessToken>
```

- Role: `customer`
- The `customerId` in the JWT is validated by the auth middleware and compared against the order's owner ID to enforce strict ownership verification.

---

## Endpoint Specification

### `GET /api/v1/customer/orders/{orderId}/delivery`

#### Path Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `orderId` | string (24-char hex ObjectId) | ✅ | Unique identifier of the customer order. |

#### Pre-conditions

| Condition | Error if failed |
|-----------|----------------|
| Order exists | 404 `ORDER_NOT_FOUND` |
| Authenticated customer owns the order | 403 `FORBIDDEN` |

#### Success Response — `200 OK` (Rider Assigned / Transit)

If a delivery assignment exists for this order, returns the active status, transit timestamps, and rider profile details.

```json
{
  "success": true,
  "message": "Delivery tracking status fetched successfully",
  "data": {
    "deliveryId": "603d7b97e6824a1b8cfa3b25",
    "deliveryStatus": "picked_up",
    "assignedAt": "2026-05-28T06:00:00.000Z",
    "pickedUpAt": "2026-05-28T06:15:00.000Z",
    "enRouteToCustomerAt": "2026-05-28T06:20:00.000Z",
    "arrivedAtCustomerAt": null,
    "completedAt": null,
    "deliveredAt": null,
    "failedAt": null,
    "riderProfile": {
      "name": "Shivam Rider",
      "phone": "+919876543211",
      "vehicleType": "scooter",
      "vehicleNumber": "MH-12-CD-5678",
      "profilePhotoUrl": "https://assets.zepto-like.com/profiles/shivam_rider.jpg"
    }
  }
}
```

#### Success Response — `200 OK` (Awaiting Assignment / Prep)

If no delivery assignment has been created yet for the order, the API returns a successful `200 OK` response with `data: null`, indicating that the order is still being picked/packed or awaiting assignment by the dispatch engine.

```json
{
  "success": true,
  "message": "Delivery tracking status fetched successfully",
  "data": null
}
```

#### Error Response — `403 FORBIDDEN` (Ownership Breach)

```json
{
  "success": false,
  "errorCode": "FORBIDDEN",
  "message": "You do not have permission to access this order resource."
}
```

#### Error Response — `404 NOT FOUND` (Invalid Order)

```json
{
  "success": false,
  "errorCode": "ORDER_NOT_FOUND",
  "message": "Order not found."
}
```
