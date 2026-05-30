# Customer Realtime Order Experience

## Flow

```text
customer login/session restore
  -> connect to /customer socket namespace
  -> open order detail or delivery tracking screen
  -> emit customer.join_order_room with orderId
  -> receive customer order and delivery tracking events
  -> normalize payloads
  -> ignore malformed or stale events
  -> update Customer App realtime store
  -> render order status toast, connection banner, and live delivery tracker
```

## Reconnect Strategy

The Customer App uses `CUSTOMER_SOCKET_RECONNECT_ATTEMPTS` and `CUSTOMER_SOCKET_RECONNECT_DELAY_MS` from app environment config. Only one reconnect timer is active at a time. On reconnect success, stored active order rooms are joined again through `customer.join_order_room`.

## Polling Fallback

Existing order detail and delivery tracking API polling remains active. Realtime events update local UI immediately, but socket disconnects do not disable existing query hooks.

## Auth Failure

Unauthorized socket failures clear realtime state, disconnect the socket, and clear the current auth session through the existing auth store.

## Dependencies

- Phase 7 Module 2 `/customer` Socket.IO namespace.
- Phase 7 Module 4 realtime order update backend events.
- Phase 7 Module 5 realtime delivery tracking backend events.
- Existing Customer App order detail and delivery tracking screens.
