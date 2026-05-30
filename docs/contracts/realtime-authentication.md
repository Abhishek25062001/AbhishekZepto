# Realtime Authentication Contract

## Handshake

Socket clients authenticate with the existing JWT access token in the Socket.IO handshake:

```json
{
  "auth": {
    "token": "<access-token>"
  }
}
```

The backend also accepts `Authorization: Bearer <access-token>` from socket handshake headers.

## Validation

The socket authentication middleware verifies:

- the access token signature and token type
- the session exists and has not been revoked
- the session has not expired
- the user identity exists
- the user account is active
- effective permissions and vendor/store/city scope

On success, the socket receives a normalized user payload containing `userId`, `role`, `socketRole`, `sessionId`, permissions, and scope IDs.

## Namespace Role Rules

| Namespace | Allowed socket role |
|---|---|
| `/customer` | `customer` |
| `/delivery` | `delivery_agent` |
| `/vendor` | `vendor` with `storeId` scope |
| `/admin` | `admin` |

## Room Authorization

Default room joins are derived from authenticated scope. Customer sockets join `customer:{customerId}`, delivery sockets join `delivery:{deliveryAgentId}`, vendor sockets join `vendor:{storeId}`, and admin sockets join `admin:operations` plus `city:{cityId}` when a city scope exists.

Customer order room joins require an `orderId` payload through `customer.track_order`. Delivery assignment room joins require an `assignmentId` payload through `delivery.join_assignment`.

## Reconnect Strategy

Clients reconnect through Socket.IO's standard reconnect flow and must present a still-valid access token on each new connection.
