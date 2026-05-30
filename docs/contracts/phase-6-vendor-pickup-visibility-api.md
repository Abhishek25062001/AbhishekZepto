# API Contract — Phase 6 — Vendor Panel — Pickup Visibility

## Endpoint
`GET /api/v1/vendor/orders/{orderId}/delivery-status`

### Auth Requirement
- **Surface**: Vendor Panel
- **Token**: Bearer JWT (role: `store_user` or similar merchant actors)
- **Scope check**: Secure store context validation. The order's `storeId` must match the storeId in the authenticated vendor's context.

### Query Parameters
None.

---

### Responses

#### 200 OK — Active Tracking (Rider Assigned)
Returns active pickup-phase tracking details and safe rider details. Drop-phase fields are omitted.
```json
{
  "success": true,
  "message": "Vendor order delivery tracking fetched successfully",
  "data": {
    "deliveryId": "65f12a3b4c5d6e7f8a9b0c1d",
    "deliveryStatus": "arrived_at_store",
    "assignedAt": "2026-05-28T10:00:00.000Z",
    "arrivedAtStoreAt": "2026-05-28T10:05:00.000Z",
    "pickedUpAt": null,
    "riderProfile": {
      "name": "Ramesh Kumar",
      "phone": "+919876543210",
      "vehicleType": "bike",
      "vehicleNumber": "KA-01-EF-1234",
      "profilePhotoUrl": "https://assets.zepto.com/riders/ramesh.jpg"
    }
  }
}
```

#### 200 OK — Awaiting Rider Assignment (Unassigned)
If the order is prepared but no rider assignment is active yet.
```json
{
  "success": true,
  "message": "Vendor order delivery tracking fetched successfully",
  "data": null
}
```

#### 403 Forbidden — Store Scope Mismatch
If the store user attempts to access an order owned by a different store.
```json
{
  "success": false,
  "errorCode": "ORDER_ACCESS_FORBIDDEN",
  "message": "Order access forbidden"
}
```

#### 404 Not Found — Invalid Order ID
```json
{
  "success": false,
  "errorCode": "ORDER_NOT_FOUND",
  "message": "Order not found"
}
```
