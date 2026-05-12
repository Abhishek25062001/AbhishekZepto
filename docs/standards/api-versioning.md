# API Versioning

## Base Format

Backend APIs use this route format:

```text
/api/v1/{surface}/{resource}
```

## Surface Groups

Current Backend Core route groups:

- `/api/v1/public`
- `/api/v1/customer`
- `/api/v1/delivery`
- `/api/v1/vendor`
- `/api/v1/admin`
- `/api/v1/internal`

## Public Backend Core Endpoints

```text
GET /api/v1/public/health
GET /api/v1/public/version
GET /api/v1/public/system-info
```

## Placeholder Surface Endpoints

```text
GET /api/v1/customer
GET /api/v1/delivery
GET /api/v1/vendor
GET /api/v1/admin
GET /api/v1/internal
```

Feature-specific routes must be added only by their owning future modules.
