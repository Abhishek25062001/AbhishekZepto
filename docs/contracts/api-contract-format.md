# API Contract Format

## API Contract Goal

Every backend endpoint must follow one predictable request, response, error, pagination, and auth format so all frontend surfaces can integrate with the backend consistently.

## Base API URL

Local backend base URL:

```text
http://localhost:5000
```

API version base path:

```text
/api/v1
```

API route format:

```text
/api/v1/{surface}/{resource}
```

Route surfaces:

- `public`
- `customer`
- `delivery`
- `vendor`
- `admin`
- `internal`

## Success Response Format

```json
{
  "success": true,
  "message": "Request successful",
  "data": {},
  "meta": {}
}
```

## Error Response Format

```json
{
  "success": false,
  "message": "Error message",
  "error": {
    "code": "ERROR_CODE",
    "details": {}
  }
}
```

## Pagination Response Format

```json
{
  "success": true,
  "message": "Data fetched successfully",
  "data": [],
  "meta": {
    "page": 1,
    "limit": 20,
    "total": 100,
    "hasNextPage": true
  }
}
```

## Authentication Header Format

```text
Authorization: Bearer <accessToken>
```

## Request Body Format

JSON is the default request body format.

```text
Content-Type: application/json
```

## File Upload Format

Multipart upload support is a placeholder for later file upload modules.

```text
Content-Type: multipart/form-data
```

## Date Format

All backend dates must return ISO string format.

```text
2026-05-05T10:30:00.000Z
```

## ID Format

All MongoDB ObjectId fields must be returned as strings.

## HTTP Status Code Usage

| Status | Meaning |
| --- | --- |
| `200` | Successful read/update |
| `201` | Resource created |
| `202` | Request accepted for processing |
| `400` | Bad request |
| `401` | Authentication required or token invalid |
| `403` | Permission denied |
| `404` | Resource not found |
| `409` | Conflict or duplicate resource |
| `422` | Validation failed |
| `429` | Rate limit exceeded |
| `500` | Internal server error |
