# Phase 4 Permissions

Status: **PLANNED** — seed matrix updates in Module 1+ if new codes added.

## Default Access Model (Phase 4 MVP)

Phase 4 customer routes use:

- Middleware: `authenticate`
- Role guard: `CUSTOMER`
- Ownership: service layer enforces `req.user.customerId === resource.customerId`

No separate permission codes required for MVP if Phase 2 customer role is sufficient.

## Optional Permission Codes (Module 1+ decision)

| Code | Action | Notes |
|------|--------|-------|
| `cart:read` | GET cart | Optional fine-grained |
| `cart:update` | Mutate cart | Optional |
| `orders:read` | List/view orders | Optional |
| `profile:read` | GET profile | Optional |
| `profile:update` | PATCH profile | Optional |

If not added, document **role-only** access for Phase 4.

## Webhook

| Route | Auth |
|-------|------|
| `POST /api/v1/webhooks/razorpay` | No JWT; `X-Razorpay-Signature` HMAC |

## Admin / Vendor

No Phase 4 customer-shopping permissions on admin/vendor panels.

## Endpoint Matrix

| Endpoint group | Auth | Scope |
|----------------|------|-------|
| `/customer/addresses/*` | CUSTOMER | Own addresses |
| `/customer/serviceability` | CUSTOMER | Own session |
| `/customer/home` | CUSTOMER | Own store context |
| `/customer/cart/*` | CUSTOMER | Own cart |
| `/customer/checkout/*` | CUSTOMER | Own session |
| `/customer/payments/*` | CUSTOMER | Own payment |
| `/customer/orders/*` | CUSTOMER | Own orders |
| `/customer/profile/*` | CUSTOMER | Own profile |

## Related

- Phase 2: `docs/security/catalog-permissions.md`
- Phase 3 inventory: `inventory:read` etc. (unchanged)
