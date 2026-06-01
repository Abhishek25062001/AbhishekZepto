# Phase 8 Module 4 — Customer Management API

## Status

Implemented.

## Endpoints

- `GET /api/v1/admin/customers`
- `GET /api/v1/admin/customers/:customerId`
- `PATCH /api/v1/admin/customers/:customerId/status`
- `PATCH /api/v1/admin/customers/:customerId/notes`
- `GET /api/v1/admin/customers/:customerId/orders`
- `GET /api/v1/admin/customers/:customerId/addresses`
- `GET /api/v1/admin/customers/:customerId/audit`

## List Filters

`GET /api/v1/admin/customers` supports only the Module 4 customer inspection
filters:

| Query | Type | Notes |
| --- | --- | --- |
| `status` | auth account status | Filters customer identity `accountStatus`. |
| `cityId` | ObjectId | Filters customer identity city scope. |
| `search` | string, 1-120 chars | Case-insensitive match against name, phone, or email. Regex metacharacters are treated as literal text. |
| `createdFrom` | ISO datetime | Inclusive lower bound on customer identity creation time. |
| `createdTo` | ISO datetime | Inclusive upper bound on customer identity creation time. |
| `page` | integer | Defaults to `1`. |
| `limit` | integer | Defaults to `20`, maximum `100`. |

## Boundaries

Orders and addresses are read-only inspection endpoints in Module 4. Refunds,
support-ticket actions, customer-facing profile changes, and address mutations
remain outside this module.

## Status And Notes Writes

`PATCH /api/v1/admin/customers/:customerId/status` accepts reversible
operational account statuses only: `active`, `inactive`, `blocked`,
`suspended`, and `pending_approval`. The endpoint requires `reason` so every
admin status change can be audited by a later audit reader.

`PATCH /api/v1/admin/customers/:customerId/notes` accepts `adminNotes` as a
nullable string up to 2000 characters. Notes are stored in the admin-only
`customer_admin_profiles` overlay and do not update customer-facing profile
data.

## Read-Only Order And Address Inspection

`GET /api/v1/admin/customers/:customerId/orders` returns customer-scoped order
summaries through the existing admin order mapper. It supports `status`,
`fromDate`, `toDate`, `page`, and `limit`; `status` must be an existing order
lifecycle status.

`GET /api/v1/admin/customers/:customerId/addresses` returns active customer
address records for inspection only. Module 4 intentionally defines no admin
create, update, default-selection, or delete routes for customer addresses.

## Error Contract

Module 4 registers `CUSTOMER_NOT_FOUND` for missing/non-customer identities and
`CUSTOMER_SCOPE_DENIED` for city-scoped admin access mismatches. Validator
failures use the shared `VALIDATION_ERROR` response shape.

## Audit Events

Customer status updates write `CUSTOMER_STATUS_CHANGED` admin action audit
records. Customer admin note updates write `CUSTOMER_NOTE_UPDATED` records.
`GET /api/v1/admin/customers/:customerId/audit` returns the latest customer
audit records for that customer entity.
