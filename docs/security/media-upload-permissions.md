# Media Upload Permissions

Status: **IMPLEMENTED**

## Permission codes

| Permission | Use |
|------------|-----|
| `media:read` | GET list, detail, signed-url |
| `media:upload` | POST upload, bulk-upload |
| `media:update` | PATCH metadata |
| `media:delete` | DELETE soft-delete |

## Admin (`/api/v1/admin/media`)

All routes require admin role group + permission above.

## Vendor (`/api/v1/vendor/media`)

| Endpoint | Permission |
|----------|------------|
| POST `/upload` | `media:upload` |
| GET `/files`, GET `/files/:id` | `media:read` |
| DELETE `/files/:id` | `media:delete` |

Vendor scope enforced on list/detail/delete.

## Internal (`/api/v1/internal/media`)

| Endpoint | Auth |
|----------|------|
| POST `/attach-owner` | `authenticate()` |
| GET `/files/:mediaFileId` | `authenticate()` |

## Role seeds (planned)

- `operations_admin`, `super_admin` (`*:*`): full media permissions
- `vendor_owner`, `store_manager`, `store_staff`: vendor upload/read/delete per matrix
