# Admin Me Permissions API

## API Endpoint

`GET /api/v1/admin/me/permissions`

## Auth Rules

- Requires `Authorization: Bearer <accessToken>`
- Requires admin role family:
  `super_admin`, `support_admin`, or `operations_admin`

## Success Response

```json
{
  "success": true,
  "message": "Admin permissions fetched successfully",
  "data": {
    "userId": "ADMIN_USER_ID",
    "adminId": "ADMIN_USER_ID",
    "role": "super_admin",
    "permissions": ["*:*"],
    "vendorId": null,
    "storeId": null,
    "cityId": null
  },
  "meta": {}
}
```
