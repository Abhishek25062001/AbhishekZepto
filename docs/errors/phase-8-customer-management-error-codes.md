# Phase 8 Module 4 — Customer Management Error Codes

## Status

Implemented.

| Error code | HTTP status | Meaning |
| --- | --- | --- |
| `CUSTOMER_NOT_FOUND` | 404 | The requested customer identity does not exist, is deleted, or is not a customer role. |
| `CUSTOMER_SCOPE_DENIED` | 403 | The admin city scope does not allow access to the requested customer or city filter. |
| `VALIDATION_ERROR` | 400 | Request params, query, or body failed the Module 4 validators. |
| `FORBIDDEN` | 403 | Authenticated actor does not have the required customer-management permission. |
| `UNAUTHORIZED` | 401 | Request is missing a valid authenticated admin context. |

Customer status validation reuses the customer-management status enum and
rejects destructive `deleted` updates. Customer order filters reuse existing
order lifecycle statuses.
