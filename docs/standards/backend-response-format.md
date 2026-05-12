# Backend Response Format

## Success Response

```json
{
  "success": true,
  "message": "Operation completed successfully",
  "data": {},
  "meta": {}
}
```

## Error Response

```json
{
  "success": false,
  "message": "Error message",
  "error": {
    "code": "ERROR_CODE",
    "details": {}
  },
  "meta": {}
}
```

## Pagination Response

```json
{
  "success": true,
  "message": "Records fetched successfully",
  "data": [],
  "meta": {
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 100,
      "totalPages": 5,
      "hasNextPage": true,
      "hasPreviousPage": false
    }
  }
}
```

All Backend Core and future feature APIs should use these shapes unless a module
explicitly documents a different response contract.
