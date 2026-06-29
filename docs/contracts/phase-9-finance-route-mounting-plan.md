# Phase 9 Finance Route Mounting Plan

Status: **PLANNED** mounts only. Do not create route files in Module 1.

## Customer Routes

**Mount file:** `backend/api/src/routes/v1/customer.routes.ts`

| Mount prefix | Submodule | Status |
|--------------|-----------|--------|
| `/api/v1/customer/payments` | payment customer routes | partial IMPLEMENTED (Phase 4) |
| `/api/v1/customer/refunds` | refund customer routes | PLANNED |

### Existing Phase 4 payment mounts (IMPLEMENTED)

- `POST /api/v1/customer/payments/create-order`
- `POST /api/v1/customer/payments/verify`

## Delivery Routes

**Mount file:** `backend/api/src/routes/v1/delivery.routes.ts`

| Mount prefix | Status |
|--------------|--------|
| `/api/v1/delivery/earnings` | PLANNED |

## Admin Routes

**Mount file:** `backend/api/src/routes/v1/admin.routes.ts`

| Mount prefix | Status |
|--------------|--------|
| `/api/v1/admin/finance` | PLANNED |

Sub-routers (planned):

- `finance/payments`
- `finance/refunds`
- `finance/vendor-settlements`
- `finance/delivery-earnings`

## Public Webhook Routes

**Mount file:** `backend/api/src/routes/v1/public.routes.ts` or dedicated webhook router

| Path | Status |
|------|--------|
| `/api/v1/public/webhooks/payments/razorpay` | PLANNED |
| `/api/v1/webhooks/razorpay` | IMPLEMENTED (Phase 4 baseline) |

## Middleware Chain (planned)

| Surface | Middleware |
|---------|------------|
| Customer finance | `authenticate` + customer role + own-resource scope |
| Delivery earnings | `authenticate` + delivery role + own-resource scope |
| Admin finance | `authenticate` + admin role + finance permission codes |
| Webhook | Razorpay signature middleware only |

## Mount Rule

Do not mount finance sub-routers until owning module implements controllers and
validators. Update `backend-route-registry.md` status when mounting.

## Full Endpoint List

See `docs/contracts/phase-9-finance-api-surface.md`.

## Related Documents

- `docs/contracts/phase-4-route-mounting-plan.md`
- `docs/contracts/backend-route-registry.md`
