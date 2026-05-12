# Frontend Secure Config

## Frontend Config Rule

Frontend apps can store public API URLs but must not store backend secrets.

Allowed frontend-safe values:

- Customer App: `API_BASE_URL`, `APP_ENV`
- Delivery Agent App: `API_BASE_URL`, `APP_ENV`
- Vendor Panel: `VITE_API_BASE_URL`, `VITE_APP_ENV`
- Admin Dashboard: `VITE_API_BASE_URL`, `VITE_APP_ENV`

Forbidden frontend values:

- JWT secrets
- Razorpay secret key
- Firebase private key
- MongoDB URI
- Redis URL
- Admin seed password
- SMS provider secret

## Check Command

```bash
npm run check:frontend-secrets
```

The check scans:

- `/apps/customer-app/src`
- `/apps/delivery-agent-app/src`
- `/apps/vendor-panel/src`
- `/apps/admin-dashboard/src`

## API Endpoints

No new API endpoints created in this task.

## DB Fields

No new database fields created in this task.
