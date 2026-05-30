# Customer App Realtime Order Experience Review

## Scope

Phase 7 Module 6 implements Customer App consumption of existing realtime order and delivery tracking events. It does not add REST endpoints, DB fields, backend persistence, or new realtime event families.

## Tickets Completed

- Ticket 6.1 - Module scaffold and realtime types.
- Ticket 6.2 - Customer socket dependency and environment config.
- Ticket 6.3 - Customer realtime socket service.
- Ticket 6.4 - Realtime order store.
- Ticket 6.5 - Customer realtime socket hook.
- Ticket 6.6 - Realtime order room hook.
- Ticket 6.7 - Order event listener hook and mapper.
- Ticket 6.8 - Delivery tracking event listener and location utility.
- Ticket 6.9 - Realtime connection banner.
- Ticket 6.10 - Realtime order status toast.
- Ticket 6.11 - Realtime delivery tracker component.
- Ticket 6.12 - App bootstrap integration.
- Ticket 6.13 - Order detail realtime integration.
- Ticket 6.14 - Delivery tracking screen realtime integration.
- Ticket 6.15 - Reconnect and room restore handling.
- Ticket 6.16 - Stale event and auth expiration handling.
- Ticket 6.17 - Customer realtime contracts and architecture docs.
- Ticket 6.18 - Store and location utility tests.
- Ticket 6.19 - Realtime event hook tests.
- Ticket 6.20 - Realtime UI component tests.
- Ticket 6.21 - Customer realtime order flow integration test.
- Ticket 6.22 - Customer reconnect integration test.
- Ticket 6.23 - Module validation and review doc.

## Implementation Review

- Customer sockets connect to the existing `/customer` namespace using the current access token.
- Order detail and delivery tracking screens join the active order room and leave it during cleanup.
- Order realtime events are normalized into customer-safe statuses before updating the Customer App store.
- Delivery tracking events validate coordinates and reject stale location updates before updating the store.
- Existing polling hooks remain active, so realtime disconnects do not remove fallback data.
- Reconnect logic caps retry attempts, preserves active order rooms, and rejoins them after reconnect.
- Auth-related socket failures clear realtime state and the current auth session.
- UI feedback is limited to the ticketed banner, status toast, and live tracker.

## API And Data Review

- REST endpoints added: none.
- OpenAPI paths added for realtime/socket REST routes: none.
- DB fields added: none.
- Socket events consumed by the app are documented in `docs/contracts/customer-realtime-order-events.md`.

## Verification

- `npm run typecheck -w backend/api` - PASS
- `npm run lint -w backend/api` - PASS
- `npm run test:customer-orders -w backend/api` - PASS
- `npm run typecheck -w apps/customer-app` - PASS
- `npm run lint -w apps/customer-app` - PASS
- `npm run test:realtime-order -w apps/customer-app` - PASS
- OpenAPI realtime REST path verification - PASS, no paths added.

## Residual Risks

- Live device rendering and physical socket connection smoke tests remain manual because this module was validated through static checks and Node-friendly tests.
- Realtime delivery map visualization still depends on the existing delivery tracking screen and API fallback data.

## Result

Module 6 is complete and ready for the next Phase 7 module.
