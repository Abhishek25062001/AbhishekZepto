# Push Notification Backend

## Scope

Phase 7 Module 10 implements the backend foundation for Firebase push notifications. It registers app device tokens, sends event-driven notification payloads, records send attempts, and exposes read-only admin logs.

## Module Layout

Backend files live under:

```text
backend/api/src/modules/push-notifications
```

Key areas:

- `models`: device tokens and push notification logs
- `repositories`: database persistence and log status updates
- `services`: token registration, push dispatch, and delivery notification helpers
- `providers`: Firebase Admin SDK adapter
- `subscribers`: internal event subscriber for delivery lifecycle events
- `validators`: request body, params, and query validation
- `utils`: push payload and response mappers
- `routes` and `controllers`: REST registration and admin log surfaces

## Data Model

### Device Tokens

`DeviceToken` stores one active registration per user/device pair and tracks:

- user identity and role
- app surface
- device id and masked response handling
- Firebase token
- platform and app metadata
- active/revocation timestamps

Indexed fields:

- `userId`
- `role`
- `appSurface`
- `deviceId`
- `fcmToken`
- `isActive`

### Push Notification Logs

`PushNotificationLog` records each token-level push attempt with:

- recipient user, role, and app surface
- notification type, title, body, and mapped data payload
- Firebase token used for the attempt
- status: `pending`, `sent`, `failed`, or `skipped`
- provider message id or failure reason
- send/failure timestamps

Indexed fields:

- `userId`
- `notificationType`
- `status`
- `createdAt`

## Dispatch Flow

1. A domain event is published on the internal event bus.
2. `push-notification.subscriber.ts` receives supported delivery events.
3. `delivery-push-notification.service.ts` maps the event to the correct recipient surface and notification payload.
4. `push-notification.service.ts` fetches active tokens for the recipient.
5. A pending log is created per token.
6. If `PUSH_NOTIFICATIONS_ENABLED=false`, the log is marked `skipped`.
7. If enabled, the Firebase provider sends the notification.
8. Successful sends are marked `sent`; failures are marked `failed`.
9. Invalid Firebase token failures deactivate the stored token.

## Supported Events

| Internal event | Recipient | Push helper |
|---|---|---|
| `delivery.assignment_created` | Delivery agent | `sendAssignmentCreatedPush` |
| `delivery.out_for_delivery` | Customer | `sendOrderOutForDeliveryPush` |
| `delivery.completed` | Customer | `sendOrderDeliveredPush` |
| `delivery.failed` | Customer | `sendDeliveryFailedPush` |

## Firebase Configuration

Runtime configuration is read from backend env:

- `PUSH_NOTIFICATIONS_ENABLED`
- `FIREBASE_PROJECT_ID`
- `FIREBASE_CLIENT_EMAIL`
- `FIREBASE_PRIVATE_KEY`

When push notifications are disabled, dispatch stays non-destructive and logs are marked `skipped`.

## Audit Events

The module writes audit records for:

- `push.device_token_registered`
- `push.device_token_revoked`
- `push.notification_sent`
- `push.notification_failed`

## Admin Visibility

Admin routes expose push logs through `push_notifications:read`. Responses use response mappers that mask Firebase tokens and return only operational fields needed for review.
