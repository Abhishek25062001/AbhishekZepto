# Vendor Me Permissions API

## API Endpoint

`GET /api/v1/vendor/me/permissions`

## Auth Rules

- Requires `Authorization: Bearer <accessToken>`
- Requires vendor role family:
  `vendor_owner`, `store_manager`, or `store_staff`

## Success Response

```json
{
  "success": true,
  "message": "Vendor permissions fetched successfully",
  "data": {
    "userId": "VENDOR_USER_ID",
    "vendorUserId": "VENDOR_USER_ID",
    "role": "vendor_owner",
    "permissions": ["vendor:read_store"],
    "vendorId": "VENDOR_ID",
    "storeId": "STORE_ID",
    "cityId": "CITY_ID_OR_NULL"
  },
  "meta": {}
}
```
