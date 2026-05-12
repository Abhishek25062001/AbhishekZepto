# Database Error Handling

## Purpose

Database Foundation maps common MongoDB and Mongoose errors into the standard API
error envelope.

## Duplicate Key Errors

MongoDB duplicate key error code `11000` returns:

```text
409 CONFLICT
```

The API error code is:

```text
CONFLICT
```

## Validation Errors

Mongoose validation errors return:

```text
422 VALIDATION_ERROR
```

Only safe field-level details may be returned.

## Invalid ObjectId Errors

Mongoose cast errors for invalid identifiers return:

```text
400 BAD_REQUEST
```

## Response Shape

Mapped database errors must use the standard error envelope:

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
