# Customer Me Permissions API

## Endpoint

`GET /api/v1/customer/me/permissions`

## Auth

- Requires `Authorization: Bearer <customer access token>`
- Must run behind `authenticate`

## Response Fields

- `customerId`
- `userId`
- `role`
- `permissions`
- `vendorId`
- `storeId`
- `cityId`
- `deliveryAgentId`

## Customer Rule

- Authenticated customer response must resolve to `role = customer`
- `customerId` must match the authenticated user identity for Customer App auth
