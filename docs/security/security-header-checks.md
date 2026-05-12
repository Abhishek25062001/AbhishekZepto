# Security Header Checks

## Command

```bash
npm run check:security-headers
```

## Endpoint Used

- `GET /api/v1/public/health`

The script checks that the backend response contains:

- `x-dns-prefetch-control`
- `x-frame-options`
- `x-content-type-options`
- `referrer-policy`

The script also checks that the backend does not expose:

- `x-powered-by`

## API Endpoints

- `GET /api/v1/public/health`

## DB Fields

No new database fields created in this task.
