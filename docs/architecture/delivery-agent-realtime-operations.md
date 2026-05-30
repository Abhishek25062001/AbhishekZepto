# Delivery Agent Realtime Operations

## Flow

```text
delivery agent login/session restore
  -> connect to /delivery socket namespace
  -> dashboard loads current assignment
  -> emit delivery.join_assignment_room with assignmentId
  -> receive assignment, pickup, delivery status, and location sync events
  -> normalize payloads
  -> ignore malformed or stale events
  -> update Delivery Agent App realtime store and delivery store
  -> render connection banner, assignment alerts, pickup updates, and active delivery updates
```

## Reconnect Strategy

The Delivery Agent App uses `DELIVERY_SOCKET_RECONNECT_ATTEMPTS` and `DELIVERY_SOCKET_RECONNECT_DELAY_MS` from app environment config. Socket connection state is stored in the realtime operations store. On reconnect success, active assignment rooms are restored with `delivery.join_assignment_room`.

## Polling Fallback

Realtime events update active screens immediately. Existing delivery status polling remains available as a fallback when the socket is disconnected, and is reduced while the socket is connected.

## Auth Refresh

Unauthorized socket failures use the existing delivery token refresh path. If refresh succeeds, the socket reconnects with the refreshed session. If refresh fails, realtime state is cleared, the socket disconnects, and the current auth session is cleared.

## Dependencies

- Phase 7 Module 2 `/delivery` Socket.IO namespace.
- Phase 7 Module 3 internal event publisher.
- Phase 7 delivery assignment and delivery tracking backend events.
- Existing Delivery Agent App dashboard, pickup, and active delivery screens.

