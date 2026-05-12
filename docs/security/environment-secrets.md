# Environment Secrets

## Allowed Committed Files

- `.env.example`
- `.env.development.example`
- `.env.staging.example`
- `.env.production.example`

## Forbidden Committed Files

- `.env`
- `.env.local`
- `.env.production`
- `.env.staging`

## Secret Leak Check

Run:

```bash
npm run check:secrets
```

The check fails when secret-like values are found outside allowed example
environment files.

## API Endpoints

No new API endpoints created in this task.

## DB Fields

No new database fields created in this task.
