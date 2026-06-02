# Phase 8 Support Operations Permissions

Status: **COMPLETE** — Module 12 backend.

| Permission | Use |
|------------|-----|
| `support:read` | List/detail tickets, notes, and audit |
| `support:create` | Create support tickets |
| `support:update` | Update status, priority, and notes |
| `support:assign` | Assign or unassign tickets |

Support permissions must not grant refund execution, order mutation, delivery
mutation, customer mutation, analytics, exports, or settings authority.

Routes may also allow the existing platform-wide administrative permission
fallback where the backend already supports it, but support-specific
permissions are the contract for this module.
