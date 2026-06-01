# Phase 8 Module 4 — Customer Management Backend Verification

## Status

Implemented.

## Required Commands

| Command | Expected result |
| --- | --- |
| `npm run typecheck -w backend/api` | TypeScript passes. |
| `npm run lint -w backend/api` | ESLint passes. |
| `npm run test:customer-orders -w backend/api` | Existing customer order regression suite passes. |
| `node --test backend/api/dist/modules/customer-management/routes/customer-management.routes.test.js` | Customer management focused route/validator/error/audit tests pass after build. |

## OpenAPI Verification

Verify these paths are present in the built OpenAPI document:

- `/admin/customers`
- `/admin/customers/{customerId}`
- `/admin/customers/{customerId}/status`
- `/admin/customers/{customerId}/notes`
- `/admin/customers/{customerId}/orders`
- `/admin/customers/{customerId}/addresses`
- `/admin/customers/{customerId}/audit`

The customer list path must include `status`, `cityId`, `search`,
`createdFrom`, `createdTo`, `page`, and `limit` query filters. The status and
notes update paths must include request bodies.

## Review Checklist

- Customer management routes are mounted under `/api/v1/admin/customers`.
- All customer management routes are authenticated, admin-role gated, and
  permission-gated.
- Customer status writes exclude destructive `deleted` updates.
- Customer notes write only to `customer_admin_profiles`.
- Customer order and address endpoints remain read-only.
- City-scoped admin actors cannot inspect or mutate out-of-city customers.
- Status and notes writes create admin action audit records.
- Module 4 does not add frontend, refunds, support-ticket, export, analytics,
  delivery-agent, vendor/store, or customer-facing profile behavior.
