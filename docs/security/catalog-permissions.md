# Catalog Permissions

Status: **IMPLEMENTED** (backend seeds + Admin Dashboard UI gates).

## Admin Permissions

| Permission | Typical use |
|------------|-------------|
| `catalog:read` | List/detail categories, brands, products, variants, units |
| `catalog:create` | POST create endpoints |
| `catalog:update` | PATCH update endpoints |
| `catalog:delete` | DELETE soft-delete endpoints |
| `catalog:approve` | `PATCH .../products/:productId/approval-status` |
| `catalog:media_upload` | `POST .../catalog/media/upload` |

### Endpoint mapping (admin)

| Endpoint family | Permissions |
|-----------------|-------------|
| `GET` catalog resources | `catalog:read` |
| `POST` catalog resources | `catalog:create` |
| `PATCH` catalog resources | `catalog:update` |
| `DELETE` catalog resources | `catalog:delete` |
| Product approval | `catalog:approve` |
| Media upload | `media:upload` (canonical path `/api/v1/admin/media/upload`) |

## Admin Dashboard UI matrix

| UI action | Permission |
|-----------|------------|
| Catalog sidebar + list/detail | `catalog:read` |
| Create buttons / forms | `catalog:create` |
| Edit forms | `catalog:update` |
| Delete actions | `catalog:delete` |
| Product approve/reject | `catalog:approve` |
| Image upload fields | `media:upload` |

## Vendor Permissions

- `catalog:read` — vendor catalog read APIs only.

## Vendor Panel UI matrix

| UI action | Permission |
|-----------|------------|
| Store Catalog sidebar + product list/detail | `catalog:read` |
| Browse categories/brands filters | `catalog:read` |
| Create/edit/delete global products | **Not exposed** (read-only) |

## Customer Access Rule

- Customer catalog read APIs require **customer authentication** in Phase 3.
- Public anonymous catalog browse may be enabled later without changing permission codes.

## Customer App UI matrix

| UI action | Requirement |
|-----------|-------------|
| Open catalog stack from Home | Authenticated customer session (app session restore guard) |
| Browse categories, brands, products | Read-only; no mutation controls |
| Search and filters | Read-only query params only |
| Product detail Add to Cart | Placeholder only (disabled when unavailable/out of stock); no cart API |
| Catalog admin/vendor actions | **Not exposed** on customer app |

## Super Admin Rule

- `super_admin` role with `*:*` may perform all catalog actions.

## Role Seed Targets (planned)

- `operations_admin`: catalog read/create/update (and approve per seed matrix in implementation module).
- `super_admin`: `*:*`
- Vendor roles: `catalog:read` where store operations need catalog visibility.

## Phase 2 Note

Phase 2 admin RBAC mutations currently use `settings:manage` for some admin operations.
Catalog implementation should use dedicated `catalog:*` gates per this document.
Reconcile with source PDF during Category Management Backend if product owner requires otherwise.

## DB Fields

Permission storage (existing Phase 2):

- `roles.permissions`
- `user_identities.permissions`
