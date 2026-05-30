# Mobile Push Notification Integration

## Scope

Phase 7 Module 11 connects Customer App and Delivery Agent App push notification flows to the Phase 7 Module 10 backend device-token APIs and Firebase Cloud Messaging.

## Flow

```text
authenticated session restored
  -> request notification permission
  -> fetch or create stable app device id
  -> fetch FCM token
  -> register token with backend
  -> listen for token refresh
  -> receive foreground/background/opened push payload
  -> route to the matching app screen
```

## Customer App

Customer App registers device tokens with:

- `POST /api/v1/customer/me/device-token`
- `DELETE /api/v1/customer/me/device-token/:deviceId`

Registered payload fields:

- `deviceId`
- `fcmToken`
- `platform`
- `appVersion`
- `deviceName`

Customer push payload handling:

- `order_out_for_delivery` routes to `DeliveryTracking`.
- `order_delivered` routes to `OrderDetail`.
- `delivery_failed` routes to `OrderDetail` as the support/order-detail placeholder.

Foreground messages show an in-app alert and route when the user taps the action.
Background messages are stored locally so the most recent payload is available after app open.

## Delivery Agent App

Delivery Agent App registers device tokens with:

- `POST /api/v1/delivery/me/device-token`
- `DELETE /api/v1/delivery/me/device-token/:deviceId`

Registered payload fields:

- `deviceId`
- `fcmToken`
- `platform`
- `appVersion`
- `deviceName`

Delivery push payload handling:

- `assignment_created` routes to `ActiveDelivery`.
- Missing assignment ids fall back to `DeliveryHome`.

Foreground messages show a high-priority assignment alert and route when the user taps the action.
Background messages are stored locally so the most recent payload is available after app open.

## Permission Handling

Both apps normalize permission status to:

- `granted`
- `denied`
- `blocked`
- `unavailable`

Android 13+ uses `POST_NOTIFICATIONS`. Older Android versions are treated as granted for notification posting. iOS uses Firebase Messaging authorization status.

## Logout Handling

Before clearing auth state, each app attempts to revoke the currently stored device token:

- Customer: `DELETE /api/v1/customer/me/device-token/:deviceId`
- Delivery: `DELETE /api/v1/delivery/me/device-token/:deviceId`

Local push state is cleared after logout or force-local logout.
