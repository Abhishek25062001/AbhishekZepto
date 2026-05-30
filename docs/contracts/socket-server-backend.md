# Socket Server Backend

## Scope

Phase 7 Module 2 provides the backend Socket.IO server surface for realtime connections. REST APIs remain the write surface; sockets authenticate clients, place them in scoped rooms, and receive room join requests for already-owned realtime streams.

## Server Bootstrap

- `server.ts` creates an HTTP server from the Express app.
- `initializeSocketServer(httpServer)` creates a singleton Socket.IO server.
- `getSocketConfig()` controls CORS origins, ping timeout, and ping interval from backend env vars.
- `configureSocketRedisAdapter()` is a placeholder for future multi-instance scaling. It does not enable Redis fanout in this module.
- Graceful shutdown closes the Socket.IO server before the HTTP server process exits.

## Authentication

Clients pass the JWT access token in one of these handshake locations:

- `handshake.auth.token`
- `handshake.headers.authorization` as `Bearer <token>`

The middleware validates the token, session, and user state, then attaches:

- `userId`
- `role`
- `permissions`
- `sessionId`
- `vendorId`
- `storeId`
- `cityId`

Authentication errors emit `connection.error` with a stable `code` before the socket is rejected.

## Namespaces

| Namespace | Allowed roles | Default rooms |
|---|---|---|
| `/` | Any authenticated role | None |
| `/customer` | `customer` | `customer:{customerId}` |
| `/delivery` | `delivery_agent` | `delivery:{deliveryAgentId}` |
| `/vendor` | `vendor_owner`, `store_manager`, `store_staff` with `storeId` | `vendor:{storeId}` |
| `/admin` | `support_admin`, `operations_admin`, `super_admin` | `admin:{adminId}`, `city:{cityId}` when present |

## Client Join Events

| Event | Namespace | Required payload | Joined room |
|---|---|---|---|
| `customer.join_order_room` | `/customer` | `{ "orderId": "..." }` | `order:{orderId}` |
| `delivery.join_assignment_room` | `/delivery` | `{ "assignmentId": "..." }` | `assignment:{assignmentId}` |
| `vendor.join_order_room` | `/vendor` | `{ "orderId": "..." }` | `order:{orderId}` |

Invalid join payloads emit `connection.error` with `ROOM_JOIN_DENIED`.

## Generic Events

| Event | Direction | Purpose |
|---|---|---|
| `connection.authenticated` | Server to client | Confirms authentication and namespace access |
| `connection.error` | Server to client | Reports authentication, authorization, or room join errors |
| `room.joined` | Server to client | Confirms a client room join |

## REST API Impact

This module adds no REST API endpoints, no controller actions, and no database fields.
