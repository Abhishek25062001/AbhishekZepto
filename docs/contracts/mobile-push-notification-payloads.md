# Mobile Push Notification Payloads

## Backend APIs Used

| App | Method | Path |
|---|---|---|
| Customer App | `POST` | `/api/v1/customer/me/device-token` |
| Customer App | `DELETE` | `/api/v1/customer/me/device-token/:deviceId` |
| Delivery Agent App | `POST` | `/api/v1/delivery/me/device-token` |
| Delivery Agent App | `DELETE` | `/api/v1/delivery/me/device-token/:deviceId` |

## Device Token Fields

Mobile apps send:

- `deviceId`
- `fcmToken`
- `platform`
- `appVersion`
- `deviceName`

Backend stores/updates:

- `device_tokens.userId`
- `device_tokens.role`
- `device_tokens.appSurface`
- `device_tokens.deviceId`
- `device_tokens.fcmToken`
- `device_tokens.platform`
- `device_tokens.isActive`
- `device_tokens.lastUsedAt`

## Payload Types

### assignment_created

Recipient: Delivery Agent App

Required keys:

- `type=assignment_created`
- `assignmentId`
- `orderId`

Route:

- `ActiveDelivery` with `assignmentId`

### order_out_for_delivery

Recipient: Customer App

Required keys:

- `type=order_out_for_delivery`
- `orderId`

Optional keys:

- `assignmentId`
- `screen`

Route:

- `DeliveryTracking` with `orderId`

### order_delivered

Recipient: Customer App

Required keys:

- `type=order_delivered`
- `orderId`

Optional keys:

- `screen`

Route:

- `OrderDetail` with `orderId`

### delivery_failed

Recipient: Customer App

Required keys:

- `type=delivery_failed`
- `orderId`

Optional keys:

- `assignmentId`
- `screen`

Route:

- `OrderDetail` with `orderId`

## Payload Rules

- Payload values are strings when sent through FCM.
- Malformed or incomplete payloads must not crash the app.
- Delivery assignment payloads without `assignmentId` fall back to the delivery dashboard.
