# Real-Time Architecture Foundation

## Scope

Phase 7 Module 1 establishes the backend real-time foundation for live order, delivery, vendor, and admin operations. It introduces Socket.IO as the transport layer, defines namespace and room ownership, creates the shared event registry, and documents authentication and scaling boundaries.

This module does not implement mobile push notifications, in-app notification inboxes, frontend socket clients, or Redis multi-instance scaling beyond the disabled adapter placeholder.

## Socket Architecture

The transport strategy is Socket.IO over WebSocket with polling fallback. The HTTP API remains the source of truth for mutations; socket events broadcast state that was already committed by existing backend services.

Namespaces:

| Namespace | Surface | Primary owner |
|---|---|---|
| `/customer` | Customer app | Customer order and delivery tracking |
| `/delivery` | Delivery agent app | Assignment and active delivery updates |
| `/vendor` | Vendor panel | Store pickup and rider arrival visibility |
| `/admin` | Admin dashboard | Operational control tower and SLA monitoring |

## Connection Lifecycle

Clients connect to a namespace with a JWT access token in the Socket.IO handshake auth payload. The backend validates the token, resolves the authenticated user payload, attaches it to the socket, emits `connection.authenticated`, and joins the default scoped room for that namespace.

Invalid or missing tokens are rejected during the socket middleware phase and reported through `connection.error` where the socket lifecycle permits it.

## Room Strategy

| Room | Join condition | Intended audience |
|---|---|---|
| `customer:{customerId}` | Authenticated customer namespace connection | One customer |
| `delivery:{deliveryAgentId}` | Authenticated delivery-agent namespace connection | One rider |
| `vendor:{storeId}` | Authenticated vendor namespace connection with store scope | One store operations room |
| `order:{orderId}` | Customer requests order tracking | One order tracking stream |
| `assignment:{assignmentId}` | Delivery agent joins an active assignment | One delivery assignment stream |
| `city:{cityId}` | Admin connection with city scope | One city operations queue |
| `admin:operations` | Authenticated admin namespace connection | Admin operations broadcasts |

## Event Naming Convention

Event names use `<surface>.<domain_event>` format. Customer events start with `customer.`, delivery agent events start with `delivery.`, vendor panel events start with `vendor.`, admin events start with `admin.`, and connection lifecycle events start with `connection.`.

## Realtime Authentication

Realtime authentication reuses the existing JWT access-token contract. The socket handshake auth payload must include `token`. Authenticated sockets carry a normalized payload containing `userId`, `role`, `sessionId`, permissions, and vendor/store/city scope.

Room authorization follows the same scope boundaries as REST APIs: customer users may join only their own customer and order streams, delivery agents may join their own delivery and assignment rooms, vendor users may join scoped store rooms, and admin users may join operations and city rooms according to their admin scope.

## Horizontal Scaling Placeholder

Socket.IO Redis adapter support is reserved behind `REALTIME_REDIS_ENABLED=false`. Module 1 keeps the adapter disabled by default and does not require Redis for single-instance local development or tests.

Planned environment variables:

| Variable | Purpose |
|---|---|
| `SOCKET_CORS_ORIGIN` | Socket.IO CORS origin list |
| `SOCKET_PING_TIMEOUT` | Socket.IO ping timeout in milliseconds |
| `SOCKET_PING_INTERVAL` | Socket.IO ping interval in milliseconds |
| `REALTIME_REDIS_ENABLED` | Enables future Redis adapter bootstrap |
