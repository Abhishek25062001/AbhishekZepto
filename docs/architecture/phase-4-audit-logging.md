# Phase 4 Audit Logging

Status: **PLANNED** — wire in Module 1+ mutation handlers.

Uses existing `audit_logs` collection per Phase 1/2 conventions.

## Events

| Event | Trigger | Actor |
|-------|---------|-------|
| `customer.address.created` | POST address | customer |
| `customer.address.updated` | PATCH address | customer |
| `customer.address.deleted` | DELETE address | customer |
| `cart.item_added` | POST cart item | customer |
| `cart.item_updated` | PATCH quantity | customer |
| `cart.cleared` | DELETE cart | customer |
| `checkout.initiated` | POST checkout/initiate | customer |
| `checkout.cancelled` | POST checkout/cancel | customer |
| `checkout.expired` | TTL job | system |
| `payment.order_created` | create Razorpay order | customer |
| `payment.verified` | verify success | customer |
| `payment.failed` | verify/webhook fail | customer/system |
| `order.placed` | order created | customer |

## Metadata Guidelines

- Include: `resourceType`, `resourceId`, `storeId`, `checkoutSessionId` where relevant
- Exclude: full address text, payment signatures, card data

## Admin / Vendor

Phase 4 does not add admin order audit events (Phase 5).

## Related

- `project-context/SECURITY_STANDARDS.md`
- Phase 2 auth audit patterns
