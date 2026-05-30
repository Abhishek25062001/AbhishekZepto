# Admin Dashboard Real-Time Control Tower

Phase 7 Module 9 adds the admin dashboard control tower surface for realtime order,
delivery, and SLA operations.

## Scope

- Admin namespace socket connection from `apps/admin-dashboard`.
- Admin realtime event store for the latest order, delivery, and SLA events.
- `/realtime-control-tower` dashboard route gated by `realtime_control_tower:read`.
- City room join/leave behavior for delivery city filtering.
- HTTP fallback snapshot APIs while the socket is disconnected.
- Existing admin orders and delivery operations lists apply the latest matching realtime event.

## Frontend Flow

1. `DashboardLayout` starts the admin socket lifecycle and event listeners after the
   protected dashboard shell is mounted.
2. `useAdminRealtimeSocket` connects to `VITE_ADMIN_SOCKET_BASE_URL` with the current
   admin access token.
3. `useAdminRealtimeEvents` maps incoming socket payloads through
   `admin-realtime-event.mapper.ts` and stores valid non-stale events in
   `admin-realtime.store.ts`.
4. `RealtimeControlTowerPage` loads `GET /api/v1/admin/control-tower/snapshot`.
5. `useControlTowerSnapshot` polls every 10 seconds only while the socket is
   disconnected.
6. `useAdminCityRoom` registers the active city room in store and rejoins the room
   when the socket reconnects.

## Backend Fallback Flow

The backend exposes read-only control tower endpoints under
`/api/v1/admin/control-tower`:

- `GET /snapshot`
- `GET /delivery-locations`

Both endpoints are mounted under existing admin authentication and role middleware.
The snapshot is assembled from current orders and delivery assignments. Open SLA
breaches are derived from delivery assignments with breached SLA status because no
separate persisted `delivery_sla_breaches` repository exists in the current codebase.

## Resilience Rules

- Socket reconnect is capped by the configured reconnect attempt and delay values.
- Auth-related socket failures attempt an admin token refresh before clearing the
  session.
- Active city rooms are retained across disconnect/reconnect and are removed only
  when the selected city changes or the page unmounts.
- Event listeners are attached through cleanup-aware helpers to avoid duplicate
  listeners across rerenders.
- Stale events are ignored when their `updatedAt`, `breachedAt`, or `emittedAt`
  value is older than the last stored event of the same type.

## Files

- `apps/admin-dashboard/src/modules/realtime-control-tower`
- `backend/api/src/modules/control-tower`
- `backend/api/src/docs/openapi/control-tower.paths.ts`

