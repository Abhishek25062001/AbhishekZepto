# Inventory Foundation Permissions

Status: **IMPLEMENTED** (routes mounted; `operations_admin` and vendor roles seeded)

Resource: `inventory`

| Permission | Usage |
|------------|--------|
| `inventory:read` | List/get stocks and movements |
| `inventory:create` | Create stock records |
| `inventory:update` | Update stock settings; vendor stock adjust |
| `inventory:delete` | Soft delete stock |
| `inventory:adjust` | Admin stock adjust endpoint |
| `inventory:bulk_update` | Bulk upload and bulk thresholds |

## Admin Dashboard UI matrix

| Screen / action | Permission |
|-----------------|------------|
| Stock list/detail, movements list/detail | `inventory:read` |
| Create / edit / delete stock | `inventory:create` / `inventory:update` / `inventory:delete` |
| Adjust stock modal | `inventory:adjust` |
| Bulk upload / thresholds modals | `inventory:bulk_update` |

## Vendor endpoint mapping

| Endpoint | Permission |
|----------|------------|
| `GET` vendor stocks / movements | `inventory:read` |
| `POST` stock adjust | `inventory:update` |

## Vendor Panel UI matrix

| Screen / action | Permission |
|-----------------|------------|
| Inventory sidebar + stock list/detail | `inventory:read` |
| Movement list | `inventory:read` |
| Adjust stock page + form submit | `inventory:update` |
| Create/edit/delete stock, bulk upload, locks | **Not exposed** |

## Role seeds (planned)

- `operations_admin`: all `inventory:*` actions above
- `vendor_owner`, `store_manager`: `inventory:read`, `inventory:update`
- `store_staff`: `inventory:read` only
- `super_admin`: `*:*`
