# Delivery Me Permissions API

## Endpoint

`GET /api/v1/delivery/me/permissions`

## Auth

- Requires `Authorization: Bearer <delivery access token>`
- Must run behind `authenticate`

## Response Fields

- `deliveryAgentId`
- `userId`
- `role`
- `permissions`
- `vendorId`
- `storeId`
- `cityId`
- `customerId`

## Delivery Agent Rule

- Authenticated delivery response must resolve to `role = delivery_agent`
- `deliveryAgentId` must match the authenticated user identity for Delivery
  Agent App auth
