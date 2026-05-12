# CORS Checks

## Command

```bash
npm run check:cors
```

## Endpoint Used

- `GET /api/v1/public/health`

## Allowed Origins

- `http://localhost:5173`
- `http://localhost:5174`

The script also checks that `http://malicious.localhost` is rejected or not
echoed back.

## API Endpoints

- `GET /api/v1/public/health`

## DB Fields

No new database fields created in this task.
