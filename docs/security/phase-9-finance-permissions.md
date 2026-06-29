# Phase 9 Finance Permissions

Status: planning document only. **No seed or constant file changes in Module 1.**

## Customer Finance Access Rule

Customer can access only own payment and refund records where `customerId`
matches authenticated customer identity.

## Delivery Agent Finance Access Rule

Delivery agent can access only own `delivery_earnings` where `deliveryAgentId`
matches authenticated agent identity.

## Webhook Permission Rule

Webhook endpoints do not use user authentication. Provider signature verification
is mandatory before processing.

## Admin Finance Permission Codes (planned)

| Code | Purpose |
|------|---------|
| `finance:payments:read` | Read payment records |
| `finance:refunds:read` | Read refund records |
| `finance:refunds:approve` | Approve refunds |
| `finance:refunds:reject` | Reject refunds |
| `finance:refunds:process` | Process approved refunds |
| `finance:settlements:read` | Read vendor settlements |
| `finance:settlements:generate` | Generate settlement batches |
| `finance:settlements:approve` | Approve settlements |
| `finance:settlements:mark_paid` | Mark settlement paid placeholder |
| `finance:delivery_earnings:read` | Read delivery earnings |
| `finance:delivery_earnings:approve` | Approve earnings |
| `finance:delivery_earnings:adjust` | Adjust earnings |
| `finance:reports:read` | Finance report summaries |

## Role Mapping (planned)

| Role | Finance access |
|------|----------------|
| `SUPER_ADMIN` | All finance permissions |
| `finance_admin` | Full finance operations except system config |
| `OPS_ADMIN` | Read payment/refund/earning/settlement summaries |
| `support_admin` | Read payment/refund status only |

Align with Phase 8 admin role hierarchy where applicable.

## Endpoint Permission Gates

| Route family | Gate |
|--------------|------|
| `/api/v1/admin/finance/*` | Admin auth + finance permission codes |
| `/api/v1/customer/payments/*` | Customer auth + own resource scope |
| `/api/v1/customer/refunds/*` | Customer auth + own resource scope |
| `/api/v1/delivery/earnings/*` | Delivery auth + own resource scope |
| Webhook routes | Signature only |

## Planned Runtime Updates (Module 2+)

Document only — do not implement in Module 1:

- `backend/api/src/modules/auth/constants/auth-permission.constants.ts`
- Seed role matrix (`seed-role-permission-matrix` or equivalent)

Scope fields for enforcement:

- `payment_records.customerId`
- `refund_records.customerId`
- `delivery_earnings.deliveryAgentId`

## Related Documents

- `docs/security/phase-8-admin-control-permissions.md`
- `docs/contracts/phase-9-finance-api-surface.md`
