# Push Notification API

## Scope

Phase 7 Module 10 adds backend push notification registration, dispatch logging, and admin log visibility. Device registration is exposed to customer and delivery-agent apps. Admin users can inspect delivery attempts through read-only log endpoints.

## Authentication

All endpoints require the standard authenticated JWT middleware for their surface.

| Surface | Auth actor |
|---|---|
| Customer device token routes | `customer` |
| Delivery device token routes | `delivery_agent` |
| Admin push log routes | Admin user with `push_notifications:read` |

## Device Token Request

```json
{
  "deviceId": "ios-device-123",
  "fcmToken": "firebase-token-value",
  "platform": "ios",
  "appVersion": "7.0.0",
  "deviceName": "Shivam iPhone"
}
```

Required fields:

- `deviceId`
- `fcmToken`
- `platform`: one of `android`, `ios`, `web`

Optional fields:

- `appVersion`
- `deviceName`

## Customer Endpoints

| Method | Path | Purpose |
|---|---|---|
| `POST` | `/api/v1/customer/me/device-token` | Register or refresh a customer app device token |
| `DELETE` | `/api/v1/customer/me/device-token/:deviceId` | Revoke a customer app device token |

The backend stores customer tokens with:

- `role=customer`
- `appSurface=customer_app`

## Delivery Agent Endpoints

| Method | Path | Purpose |
|---|---|---|
| `POST` | `/api/v1/delivery/me/device-token` | Register or refresh a delivery agent app device token |
| `DELETE` | `/api/v1/delivery/me/device-token/:deviceId` | Revoke a delivery agent app device token |

The backend stores delivery-agent tokens with:

- `role=delivery_agent`
- `appSurface=delivery_agent_app`

## Admin Endpoints

| Method | Path | Permission | Purpose |
|---|---|---|---|
| `GET` | `/api/v1/admin/push-notifications/logs` | `push_notifications:read` | List push notification logs |
| `GET` | `/api/v1/admin/push-notifications/logs/:logId` | `push_notifications:read` | Fetch one push notification log |

Supported log list query fields:

- `page`
- `limit`
- `userId`
- `status`: one of `pending`, `sent`, `failed`, `skipped`
- `notificationType`

## Response Rules

Device-token and push-log responses do not expose raw Firebase token values. Responses include a masked token value only.

Push payload data values are serialized as strings before provider dispatch. Internal fields and sensitive values are omitted from mapped payloads.

## Error Codes

Module-specific push notification error codes:

- `DEVICE_TOKEN_NOT_FOUND`
- `INVALID_FCM_TOKEN`
- `PUSH_PROVIDER_NOT_CONFIGURED`
- `PUSH_SEND_FAILED`
- `INVALID_PUSH_PLATFORM`

## OpenAPI Coverage

The OpenAPI document includes:

- `/customer/me/device-token`
- `/customer/me/device-token/{deviceId}`
- `/delivery/me/device-token`
- `/delivery/me/device-token/{deviceId}`
- `/admin/push-notifications/logs`
- `/admin/push-notifications/logs/{logId}`
