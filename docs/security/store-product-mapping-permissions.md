# Store Product Mapping Permissions

Status: **IMPLEMENTED** (routes mounted; `operations_admin` and vendor roles seeded)

| Permission | Usage |
|------------|--------|
| `store_products:read` | List/detail store product mappings (admin + vendor) |
| `store_products:create` | Create single mapping |
| `store_products:update` | Update mapping; vendor availability/price |
| `store_products:delete` | Soft delete mapping |
| `store_products:bulk_update` | Bulk map, bulk price, bulk visibility |

## Admin endpoint mapping

| Endpoint | Permission |
|----------|------------|
| `GET` store products | `store_products:read` |
| `POST` store products | `store_products:create` |
| `PATCH` store products | `store_products:update` |
| `DELETE` store products | `store_products:delete` |
| `POST` bulk-map, `PATCH` bulk-price, `PATCH` bulk-visibility | `store_products:bulk_update` |

## Admin Dashboard UI matrix

| Screen / action | Permission |
|-----------------|------------|
| Store products list/detail | `store_products:read` |
| Map / edit store product | `store_products:create` / `store_products:update` |
| Delete mapping | `store_products:delete` |
| Bulk map / price / visibility modals | `store_products:bulk_update` |

## Vendor endpoint mapping

| Endpoint | Permission |
|----------|------------|
| `GET` vendor store products | `store_products:read` |
| `PATCH` availability / price | `store_products:update` |

## Vendor Panel UI matrix

| Screen / action | Permission |
|-----------------|------------|
| Store Products sidebar + list/detail | `store_products:read` |
| Price page + price form submit | `store_products:update` |
| Availability page + availability form submit | `store_products:update` |
| Map/create/delete/bulk store products | **Not exposed** |
| Price form when `isPriceLocked` | Disabled (no submit) |

## Role seeds (planned)

- `operations_admin`: full `store_products:*` CRUD + bulk
- `vendor_owner`, `store_manager`, `store_staff`: `store_products:read`, `store_products:update`
- `super_admin`: `*:*`
