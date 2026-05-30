# Vendor Panel Realtime Store Operations

## Flow

```text
vendor login/session restore
  -> connect to /vendor socket namespace
  -> authenticated vendor shell registers event listeners
  -> order detail page emits vendor.join_order_room with orderId
  -> receive order and pickup events
  -> normalize payloads
  -> ignore malformed or stale events
  -> update Vendor Panel realtime store
  -> render live connection banner, new order alert, pickup alerts, and updated order/pickup UI
```

## Reconnect Strategy

The Vendor Panel uses `VITE_VENDOR_SOCKET_RECONNECT_ATTEMPTS` and `VITE_VENDOR_SOCKET_RECONNECT_DELAY_MS` from app environment config. Socket connection state is stored in the realtime store. On reconnect success, active order rooms are restored with `vendor.join_order_room`.

## Polling Fallback

Vendor order list and pickup visibility queries continue polling while the socket is disconnected. Polling is reduced or stopped while the socket is connected so realtime events can update visible state immediately.

## Auth Failure

Unauthorized socket failures attempt the existing vendor token refresh path. If refresh fails, the realtime store is cleared, the socket disconnects, and the vendor auth session is cleared.

## Dependencies

- Phase 7 `/vendor` Socket.IO namespace.
- Phase 7 realtime order update backend events.
- Phase 7 realtime delivery tracking backend pickup events.
- Existing Vendor Panel order list, order detail, and pickup visibility surfaces.

