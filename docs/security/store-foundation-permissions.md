# Store Foundation Permissions

Status: **IMPLEMENTED** (routes mounted; `operations_admin` seeded with full CRUD)

| Permission | Usage |
|------------|--------|
| `locations:read` | City and service area list/detail |
| `locations:create` | City and service area create |
| `locations:update` | City and service area update |
| `locations:delete` | City and service area soft delete |
| `stores:read` | Store list/detail |
| `stores:create` | Store create |
| `stores:update` | Store update |
| `stores:delete` | Store soft delete |

`operations_admin` receives full location and store CRUD. `super_admin` uses `*:*`.

## Admin Dashboard UI matrix

| Screen / action | Permission |
|-----------------|------------|
| Cities, service areas, stores list/detail | `locations:read` / `stores:read` |
| Create city / service area | `locations:create` |
| Edit city / service area | `locations:update` |
| Delete city / service area | `locations:delete` |
| Create / edit / delete store | `stores:create` / `stores:update` / `stores:delete` |
