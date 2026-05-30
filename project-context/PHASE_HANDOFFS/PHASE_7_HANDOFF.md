# Phase 7 Handoff

## Status

Started. Modules 1 through 13 and Module 15 are complete for implemented Phase 7 surfaces. Module 16 — Phase 7 Integration & Review is blocked by missing realtime reliability/admin health APIs.

## Source

Phase details need verification from:

```text
projectin micro/docfive/PhaesDetail6,7&8.pdf
```

## Current Repository Evidence

Modules 1 and 2 introduce the backend realtime foundation and socket server backend:

- Socket.IO dependency and backend server lifecycle bootstrap.
- Realtime module folder under `backend/api/src/modules/realtime`.
- Namespaces: `/customer`, `/delivery`, `/vendor`, `/admin`.
- Room strategy utilities for customer, delivery agent, vendor store, order, assignment, city, and admin operations rooms.
- JWT socket authentication middleware using existing auth/session/user records.
- Realtime event registry constants and payload sanitization utilities.
- Delivery lifecycle event emitter hooks for assignment, pickup, progress, completion, and SLA breach updates.
- Redis adapter placeholder disabled behind `REALTIME_REDIS_ENABLED=false`.
- Root Socket.IO namespace `/` for shared authenticated connections.
- Role-scoped namespace gateways:
  - `/customer`
  - `/delivery`
  - `/vendor`
  - `/admin`
- Socket connection lifecycle service for authenticated acknowledgement and disconnect logging.
- Socket room-name utilities for customer, delivery, vendor, admin, order, assignment, and city rooms.
- Stable socket error codes for auth, forbidden, room join denial, and uninitialized server cases.
- Socket backend contract documentation:
  - `docs/contracts/socket-server-backend.md`
- Documentation:
  - `docs/architecture/realtime-architecture-foundation.md`
  - `docs/contracts/realtime-events-registry.md`
  - `docs/contracts/realtime-authentication.md`
  - `docs/reviews/realtime-architecture-foundation-review.md`
  - `docs/reviews/socket-server-backend-review.md`

Module 3 introduces the internal event publisher foundation:

- Internal event constants, payload types, validator, metadata helper, and local EventEmitter bus.
- Delivery, order, and SLA publishers for committed lifecycle state changes.
- Delivery/order/SLA service integrations that publish internal events after durable updates.
- Realtime and notification subscribers registered once during backend startup.
- Registry-aware legacy side-effect guard to avoid duplicate runtime realtime/notification emissions for covered delivery events.
- Internal event module tests:
  - event bus
  - delivery publisher
  - realtime subscriber
  - notification subscriber
- Documentation:
  - `docs/architecture/internal-event-publisher.md`
  - `docs/contracts/internal-events-registry.md`
  - `docs/reviews/internal-event-publisher-review.md`

Module 4 introduces realtime order updates backend support:

- Order realtime constants, types, payload mapper, validator, room builder, emitter service, and subscriber module.
- Internal event subscriptions for order created, accepted, packed, ready for pickup, out for delivery, cancelled, and delivered events.
- Customer order status/lifecycle events broadcast to `customer:{customerId}` and `order:{orderId}`.
- Vendor order events broadcast to `vendor:{storeId}`.
- Admin order events broadcast to `city:{cityId}`.
- Customer and vendor order room joins require order ownership or store-scope authorization.
- Admin city room joins allow scoped city auto-join and arbitrary city joins for `super_admin` only.
- Documentation:
  - `docs/contracts/realtime-order-updates-events.md`
  - `docs/contracts/realtime-events-registry.md`
  - `docs/contracts/internal-events-registry.md`
  - `docs/reviews/realtime-order-updates-backend-review.md`

Module 5 introduces realtime delivery tracking backend support:

- Delivery tracking realtime constants, types, payload mapper, validator, room builder, emitter service, and subscriber module.
- Customer delivery location, progress, rider reached customer, delivered, and failed events broadcast to `order:{orderId}`.
- Admin delivery location, progress, and failed events broadcast to `city:{cityId}`.
- Delivery agent location sync acknowledgement and rejection events broadcast to `delivery:{deliveryAgentId}`.
- Internal event subscriptions for delivery location updated, out for delivery, reached customer, completed, and failed events.
- Delivery reached-customer internal publisher integration after durable delivery state transitions.
- Customer order room joins require order ownership validation before joining `order:{orderId}`.
- Admin delivery city room joins allow `operations_admin`, `support_admin`, and `super_admin` when city scope permits.
- Delivery location realtime emit frequency is controlled by `DELIVERY_LOCATION_EMIT_MIN_INTERVAL_SECONDS` without throttling DB writes.
- Documentation:
  - `docs/contracts/realtime-delivery-tracking-events.md`
  - `docs/contracts/realtime-events-registry.md`
  - `docs/contracts/internal-events-registry.md`
  - `docs/reviews/realtime-delivery-tracking-backend-review.md`

Module 6 introduces Customer App realtime order experience support:

- Customer App Socket.IO client dependency and socket environment configuration.
- Customer realtime module folder with socket service, store, hooks, components, types, and utilities.
- `/customer` namespace client connection using the existing customer access token.
- Order room join and leave helpers for active order detail and delivery tracking screens.
- Realtime order event normalization for accepted, packed, ready for pickup, out for delivery, delivered, cancelled, and failed status visibility.
- Delivery tracking event normalization with coordinate validation and stale location rejection.
- Reconnect handling with capped retries and active order room restore after reconnect.
- Auth socket failure handling that clears realtime state and the current auth session.
- UI integrations for realtime connection banner, order status toast, and live delivery tracker while preserving existing polling fallback.
- Documentation:
  - `docs/contracts/customer-realtime-order-events.md`
  - `docs/architecture/customer-realtime-order-experience.md`
  - `docs/reviews/customer-app-realtime-order-experience-review.md`

Module 7 introduces Delivery Agent App realtime operations support:

- Delivery Agent App Socket.IO client dependency and socket environment configuration.
- Delivery realtime module folder with socket service, store, hooks, components, types, and utilities.
- `/delivery` namespace client connection using the existing delivery access token.
- Assignment room join and leave helpers for active assignment surfaces.
- Realtime assignment event normalization for assignment created and assignment cancelled visibility.
- Pickup, active delivery, and location sync event normalization with stale event rejection.
- Reconnect handling with capped retries, token refresh attempt, and active assignment room restore after reconnect.
- Delivery status polling fallback while socket connectivity is unavailable.
- UI integrations for realtime connection banner, new assignment alert, assignment cancellation alert, pickup updates, active delivery updates, and location sync rejection feedback.
- Documentation:
  - `docs/contracts/delivery-agent-realtime-events.md`
  - `docs/architecture/delivery-agent-realtime-operations.md`
  - `docs/reviews/delivery-agent-app-realtime-operations-review.md`

Module 8 introduces Vendor Panel realtime store operations support:

- Vendor Panel Socket.IO client dependency and socket environment configuration.
- Vendor realtime module folder with socket service, store, hooks, components, types, and utilities.
- `/vendor` namespace client connection using the existing vendor access token.
- Order room join and leave helpers for active vendor order detail surfaces.
- Realtime order event normalization for new orders, order status updates, and order cancellations.
- Pickup event normalization for rider arrival at store and pickup completion visibility.
- Reconnect handling with capped retries, token refresh attempt, and active order room restore after reconnect.
- Vendor order and pickup polling fallback while socket connectivity is unavailable.
- UI integrations for realtime connection banner, new order alert, rider-arrived alert, pickup-completed alert, incoming order list updates, order detail updates, and pickup visibility.
- Documentation:
  - `docs/contracts/vendor-panel-realtime-events.md`
  - `docs/architecture/vendor-panel-realtime-store-operations.md`
  - `docs/reviews/vendor-panel-realtime-store-operations-review.md`

Module 9 introduces Admin Dashboard realtime control tower support:

- Admin Dashboard Socket.IO client dependency and socket environment configuration.
- Admin realtime control tower module folder with socket service, store, hooks,
  components, types, utilities, and page.
- `/admin` namespace client connection using the existing admin access token.
- City room join and leave helpers for active control tower city filtering.
- Realtime order, delivery, and SLA event normalization with stale event rejection.
- Reconnect handling with capped retries, token refresh attempt, and active city
  room restore after reconnect.
- HTTP fallback APIs:
  - `GET /api/v1/admin/control-tower/snapshot`
  - `GET /api/v1/admin/control-tower/delivery-locations`
- Admin dashboard route `/realtime-control-tower` gated by
  `realtime_control_tower:read`.
- Existing admin orders and delivery operations pages apply matching realtime
  events.
- Documentation:
  - `docs/contracts/admin-realtime-control-tower-events.md`
  - `docs/architecture/admin-realtime-control-tower.md`
  - `docs/reviews/admin-dashboard-realtime-control-tower-review.md`

Module 10 introduces the push notification backend:

- Push notification module folder under `backend/api/src/modules/push-notifications`.
- Device token model and repository for customer and delivery-agent app registrations.
- Push notification log model and repository with pending, sent, failed, and skipped status transitions.
- Firebase push provider adapter with disabled mode and normalized provider failure handling.
- Device-token services for customer and delivery-agent registration/revocation.
- Core push service that creates per-token logs, skips when disabled, sends when enabled, marks sent/failed, and deactivates invalid FCM tokens.
- Delivery push helper service for assignment created, out for delivery, delivered, and failed notifications.
- Internal event subscriber for delivery lifecycle push triggers, registered once through the internal event registry.
- Customer, delivery, and admin REST controllers/routes.
- Admin push notification log access gated by `push_notifications:read`.
- Audit events for token registration/revocation and push sent/failed outcomes.
- OpenAPI coverage and backend route registry updates.
- Documentation:
  - `docs/contracts/push-notification-api.md`
  - `docs/architecture/push-notification-backend.md`
  - `docs/reviews/push-notification-backend-review.md`

Module 11 introduces Mobile Push Notification Integration:

- Shared mobile push payload and permission types under `packages/shared/mobile-push`.
- Customer App and Delivery Agent App Firebase Messaging dependencies.
- Firebase Android config/build placeholder files for both apps.
- Customer and delivery push modules with types, API services, permission services,
  FCM wrappers, stores, hooks, device id utilities, payload handlers, and tests.
- Customer push registration uses:
  - `POST /api/v1/customer/me/device-token`
  - `DELETE /api/v1/customer/me/device-token/:deviceId`
- Delivery push registration uses:
  - `POST /api/v1/delivery/me/device-token`
  - `DELETE /api/v1/delivery/me/device-token/:deviceId`
- Foreground, background, notification-open, token refresh, logout revocation,
  app bootstrap, and settings permission visibility are wired.
- Documentation:
  - `docs/architecture/mobile-push-notification-integration.md`
  - `docs/contracts/mobile-push-notification-payloads.md`
  - `docs/reviews/mobile-push-notification-integration-review.md`

## Completed Modules & Status

| # | Module | Status |
|---|--------|--------|
| 1 | Real-Time Architecture Foundation | DONE |
| 2 | Socket Server Backend | DONE |
| 3 | Internal Event Publisher | DONE |
| 4 | Real-Time Order Updates Backend | DONE |
| 5 | Real-Time Delivery Tracking Backend | DONE |
| 6 | Customer App — Real-Time Order Experience | DONE |
| 7 | Delivery Agent App — Real-Time Operations | DONE |
| 8 | Vendor Panel — Real-Time Store Operations | DONE |
| 9 | Admin Dashboard — Real-Time Control Tower | DONE |
| 10 | Push Notification Backend | DONE |
| 11 | Mobile Push Notification Integration | DONE |
| 12 | In-App Notification Center | DONE |
| 13 | Notification UI Across Apps | DONE |
| 15 | Phase 7 Testing & Validation | COMPLETE_WITH_BLOCKERS |
| 16 | Phase 7 Integration & Review | BLOCKED |

## Module 16 Blocking Issues

- `GET /api/v1/customer/realtime/missed-events` is missing from backend source and OpenAPI.
- `POST /api/v1/customer/realtime/events/:eventId/ack` is missing from backend source and OpenAPI.
- `GET /api/v1/admin/realtime/health` is missing from backend source and OpenAPI.

## API Endpoints Added

Module 9 adds read-only REST fallback endpoints:

- `GET /api/v1/admin/control-tower/snapshot`
- `GET /api/v1/admin/control-tower/delivery-locations`

Module 10 adds push notification REST endpoints:

- `POST /api/v1/customer/me/device-token`
- `DELETE /api/v1/customer/me/device-token/:deviceId`
- `POST /api/v1/delivery/me/device-token`
- `DELETE /api/v1/delivery/me/device-token/:deviceId`
- `GET /api/v1/admin/push-notifications/logs`
- `GET /api/v1/admin/push-notifications/logs/:logId`

Module 11 adds no new backend REST endpoints. It consumes the Module 10 customer
and delivery device-token APIs from the mobile apps.

Phase 7 modules so far also register Socket.IO namespaces on the backend HTTP server:

- `/`
- `/customer`
- `/delivery`
- `/vendor`
- `/admin`

## DB Collections & Fields Added

- `device_tokens`
  - `userId`
  - `role`
  - `appSurface`
  - `deviceId`
  - `fcmToken`
  - `platform`
  - `appVersion`
  - `deviceName`
  - `isActive`
  - `lastUsedAt`
  - `revokedAt`
  - timestamps
- `push_notification_logs`
  - `userId`
  - `role`
  - `appSurface`
  - `notificationType`
  - `title`
  - `body`
  - `dataPayload`
  - `fcmToken`
  - `status`
  - `sentAt`
  - `failedAt`
  - `failureReason`
  - `providerMessageId`
  - timestamps

## Permissions Added

- `realtime_control_tower:read`
- `push_notifications:read`

Socket authentication reuses existing JWT, session, role, permission, and scope records.

## Audit Logs Added

- `push.device_token_registered`
- `push.device_token_revoked`
- `push.notification_sent`
- `push.notification_failed`

## Tests Run

- `npm run test:realtime -w backend/api` — PASS
- `npm run typecheck -w backend/api` — PASS
- `npm run lint -w backend/api` — PASS
- `npm run test:customer-orders -w backend/api` — PASS
- `npm run test:socket -w backend/api` — PASS
- `npm run test:internal-events -w backend/api` — PASS
- `npm run test:realtime-order -w backend/api` — PASS
- `npm run test:delivery-agents -w backend/api` — PASS
- `npm run test:realtime-delivery-tracking -w backend/api` — PASS
- `npm run typecheck -w apps/customer-app` — PASS
- `npm run lint -w apps/customer-app` — PASS
- `npm run test:realtime-order -w apps/customer-app` — PASS
- `npm run typecheck -w apps/delivery-agent-app` — PASS
- `npm run lint -w apps/delivery-agent-app` — PASS
- `npm run test:realtime-operations -w apps/delivery-agent-app` — PASS
- `npm run typecheck -w apps/vendor-panel` — PASS
- `npm run lint -w apps/vendor-panel` — PASS
- `npm run test -w apps/vendor-panel -- realtime-store-operations` — PASS
- `npm run typecheck -w apps/admin-dashboard` — PASS
- `npm run lint -w apps/admin-dashboard` — PASS
- `npm run test -w apps/admin-dashboard -- realtime-control-tower` — PASS
- `npm run test -w backend/api -- push-notifications` — PASS
- `npm run typecheck -w apps/customer-app` — PASS
- `npm run lint -w apps/customer-app` — PASS
- `npm run test -w apps/customer-app -- push-notifications` — PASS
- `npm run typecheck -w apps/delivery-agent-app` — PASS
- `npm run lint -w apps/delivery-agent-app` — PASS
- `npm run test -w apps/delivery-agent-app -- push-notifications` — PASS
- OpenAPI verification: PASS, includes:
  - `/admin/control-tower/snapshot`
  - `/admin/control-tower/delivery-locations`
  - `/customer/me/device-token`
  - `/customer/me/device-token/{deviceId}`
  - `/delivery/me/device-token`
  - `/delivery/me/device-token/{deviceId}`
  - `/admin/push-notifications/logs`
  - `/admin/push-notifications/logs/{logId}`

## Risks & Blockers

- Redis realtime adapter remains intentionally disabled behind `REALTIME_REDIS_ENABLED=false`.
- In-app notification center and additional realtime client surfaces are deferred to later Phase 7 modules.
- Live Firebase delivery smoke testing remains manual until real Firebase service account credentials are configured.
- Live mobile push delivery requires replacing placeholder `google-services.json`
  files with real Firebase project app configs.
- Internal events are process-local for this phase; external queues or event streams remain deferred.
- Live device/browser socket smoke testing remains manual.
- Admin control tower open SLA breaches are currently derived from
  `delivery_assignments.slaStatus` until a dedicated persisted breach model exists.

## Notes

Earlier phase dependencies are complete and verified through Phase 6. Phase 7 Module 12 is unblocked.
